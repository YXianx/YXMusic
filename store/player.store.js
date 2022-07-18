import {HYEventStore} from 'hy-event-store'
import {getSongDetail,getSongLrc} from '../service/api_player'
import {parseLyric} from '../utils/parse-lyric'

// const audioContext = wx.createInnerAudioContext()
// 使用后台播放API 这样前后台都可以播放共享状态 
// 与createInnerAudioContext类似但是需要配置app.json(requiredBackgroundModes) 并且需要设置播放器的title(player.store.js)

// BUG 进度条改变不会播放
const audioContext = wx.getBackgroundAudioManager()

const audioStore = new HYEventStore({
  state:{
    isFirstPlay:true,
    isStoping:false,

    id:0,
    currentSong:{},
    lyricInfos:[],
    durationTime:0,

    currentTime:0,
    curLyricText:"",
    curentLyricIndex:0,

    playModeIndex:0,  // 0:循环播放 1:单曲循环 2:随机播放
    isPlaying:false,
    playListSongs:[], // 播放列表
    playListIndex:0 // 当前歌曲索引
  },
  actions:{
    // payload参数为对象类型 解构{id}提取对象中的id
    playMusicWithSongIdAction(ctx,{id,isRefresh=false}){
      // 判断重复进入同首歌曲时,可根据使用场景设置同首歌的情况下要不要刷新重新加载
      if(id === ctx.id && !isRefresh){
        // 直接播放上次歌曲位置，暂停也直接播放
        this.dispatch("changeMusicPlayStatusAction",true)
        return
      } 

      ctx.id = id

      // 0、修改播放状态 & 重置
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.lyricInfos = []
      ctx.durationTime = 0
      ctx.currentTime = 0
      ctx.curLyricText = ""
      ctx.curentLyricIndex = 0

      // 1、请求歌曲详情
      getSongDetail(id).then(res=>{
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 2、请求歌词信息
      getSongLrc(id).then(res=>{
        const lyricStr = res.lrc.lyric;
        const lyrics = parseLyric(lyricStr)
        ctx.lyricInfos = lyrics
      })
      // 3、播放歌曲
      audioContext.stop()
      audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id // 后台播放，歌曲title默认先给id

      // 监听audioContext事件 因为都是用audioContext这个对象，只有第一次播放时启动监听就可以，每次播放都启动一次监听太浪费资源
      if(ctx.isFirstPlay){
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirstPlay = false
      }
    },
    // audio监听事件
    setupAudioContextListenerAction:function(ctx,payload){
      /**
       * 监听音乐资源是否准备就绪
       * BUG:IOS端 音乐资源准备完毕(拖动进度)，onCanplay回调函数经常不回调
       */
      audioContext.onCanplay(()=>{
        audioContext.play()
      })
      /**
       * 1、监听时间改变
       */
      audioContext.onTimeUpdate(()=>{
        // 1、获取当前时间
        let currentTime = parseInt(audioContext.currentTime)*1000
        // 2、根据当前时间修改currentTime
        ctx.currentTime = currentTime
        // 3、根据当前时间查找播放的歌词 待优化:遍历次数太多
        for (let i = 0; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if(currentTime<lyricInfo.time){
            const curIndex = i-1
            const curLyricInfo = ctx.lyricInfos[curIndex]
            if(!curLyricInfo)return // 纯音乐无歌词则不更新歌词显示
  
            ctx.curLyricText = curLyricInfo.text
            ctx.curentLyricIndex = curIndex
            break;
          }
          // 最后一句歌词
          else{
            if(i == ctx.lyricInfos.length-1 && currentTime>lyricInfo.time){
              ctx.curLyricText = lyricInfo.text
              ctx.curentLyricIndex = i
              break;
            }
          }
        }
      })
      /**
       * 2、监听歌曲播放完毕（自然停止）
       */
      audioContext.onEnded(()=>{
        this.dispatch("changeNewMusicAction")
      })

      // onPlay & onPause & onStop(微信侧边栏关闭音乐)的作用是在系统的播放栏目停止或播放歌曲时，播放器小程序的播放按钮样式能随之改变
      audioContext.onPlay(()=>{
        ctx.isPlaying = true
      })
      audioContext.onPause(()=>{
        ctx.isPlaying = false
      })
      audioContext.onStop(()=>{
        ctx.isStoping = true
        ctx.isPlaying = false
      })
    },
    // 播放状态设置
    changeMusicPlayStatusAction(ctx,isPlaying = true){
      ctx.isPlaying = isPlaying
      // 当在微信侧边栏关闭音乐时，需要从新加载音乐资源及设置title才能进入小程序再次播放，否则再次进入播放不起作用
      if(ctx.isStoping){
        audioContext.src=`https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        ctx.isStoping = false
      }

      if(ctx.isPlaying)
        audioContext.play()
      else
        audioContext.pause()
    },
    /**
     * 新歌曲设置
     * @param {object} ctx 
     * @param {string} mode 
     */
    changeNewMusicAction(ctx,mode="next"){
      let index = ctx.playListIndex
      // 根据播放模式设置新歌曲
      switch(ctx.playModeIndex){
        // 顺序播放
        case 0: 
          if(mode === "prev"){
            index = index-1
            if(index < 0) index = ctx.playListSongs.length-1
          }
          else if(mode === "next"){
            index = index+1
            if(index === ctx.playListSongs.length) index=0
          }
        break;
        // 单曲循环
        case 1:
          index = index
        break;
        // 随机播放
        case 2:
          let rNum = Math.round(Math.random()*(ctx.playListSongs.length-1-0)+0)
          index = rNum
      }
      
      ctx.playListIndex = index
      this.dispatch("playMusicWithSongIdAction",{id:ctx.playListSongs[index].id,isRefresh:true})
    }
  }
})
export {
  audioContext,
  audioStore
}