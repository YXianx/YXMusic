// pages/music-player/index.js
import {NavBarHeight} from '../../constants/device-const'
import {audioStore,audioContext} from '../../store/index'

const playModeNames = ["order","repeat","random"]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 歌曲相关
    id:0,
    currentSong:{},
    lyricInfos:[],
    durationTime:0,

    currentTime:0,
    curLyricText:"",
    curentLyricIndex:0,

    isPlaying:false,
    playingName:"pause",

    playModeIndex:0,  // 0:循环播放 1:单曲循环 2:随机播放
    playModeName:"order",

    // 页面相关
    currentPage:0,
    contentHeight:0,
    deviceRadio:false,
    sliderVal:0,
    isSliderChanging:false,
    lyricScrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取歌曲id
    const id = options.id
    this.setData({id})

    // 请求页面数据
    this.setupPlayerStoreListener()

    // 动态计算content内容区域高度
    const globalData = getApp().globalData
    const contentHeight = globalData.screenHeight - globalData.statusBarHeight - NavBarHeight
    this.setData({contentHeight})
    
    // 计算手机宽高比 >=2的机型才显示歌词 
    const deviceRadio = globalData.deviceRadio>=2
    this.setData({deviceRadio})
  },
  onReady:function(){

  },



  // ========================================= audio监听 =======================================
  /**
   * 播放器事件监听
   */
  // setupAudioContextListener:function(){
  //   // 监听当歌曲资源是否可以播放
  //   audioContext.onCanplay(()=>{
  //     audioContext.play()
  //   })
  //   // 监听时间改变
  //   audioContext.onTimeUpdate(()=>{
  //     // 1、获取当前时间
  //     let currentTime = parseInt(audioContext.currentTime)*1000
  //     // 2、根据当前时间修改currentTime/sliderVal 当拖动进度条时不更新当前播放时间
  //     if(!this.data.isSliderChanging){
  //       this.setData({currentTime})
  //       let sliderVal = (this.data.currentTime / this.data.durationTime)*100
  //       this.setData({sliderVal})
  //     }

  //     // 3、根据当前时间查找播放的歌词 待优化:遍历次数太多
  //     for (let i = 0; i < this.data.lyricInfos.length; i++) {
  //       const lyricInfo = this.data.lyricInfos[i]
  //       if(currentTime<lyricInfo.time){
  //         const curIndex = i-1
  //         const curLyricInfo = this.data.lyricInfos[curIndex]
  //         if(!curLyricInfo)return // 纯音乐无歌词则不更新歌词显示

  //         this.setData({
  //           curLyricText:curLyricInfo.text,
  //           curentLyricIndex:curIndex,
  //           lyricScrollTop:curIndex*50
  //         })
  //         break;
  //       }
  //       // 最后一句歌词
  //       else{
  //         if(i == this.data.lyricInfos.length-1 && currentTime>lyricInfo.time){
  //           this.setData({curLyricText:lyricInfo.text,curentLyricIndex:i})
  //           break;
  //         }
  //       }
  //     }
  //   })
  // },

  // ========================================= 事件监听 =======================================
  /**
   * swiper滑动页改变事件
   * @param {object} event 
   */
  handleSwiperChange:function(event){
    const currentPage = event.detail.current
    this.setData({currentPage})
  },

  /**
   * 播放 or 停止按钮点击事件
   */
  handlePauseClick:function(){
    audioStore.dispatch('changeMusicPlayStatusAction',!this.data.isPlaying)
  },
  /**
   * 上一曲点击事件
   */
  handlePrevBtnClick:function(){
    audioStore.dispatch("changeNewMusicAction","prev")
  },
  /**
   * 下一曲点击事件
   */
  handleNextBtnClick:function(){
    audioStore.dispatch("changeNewMusicAction","next")
  },

  /**
   * 进度条点击事件
   * @param {object} event 
   */
  handleSliderChange:function(event){
    // 获取slider变化值
    const value = event.detail.value
    // 计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100
    // BUG 播放指定为之前暂停，目前不知道为什么暂停后就不再继续播放
    // audioContext.pause()
    audioContext.seek(currentTime/1000) // seek单位为秒 准备就绪时onCanplay触发播放
    // 记录最新的sliderVal
    this.setData({sliderVal:value})

    // SliderChanging事件结束后会触发SliderChange所以在此重置isSliderChanging状态
    this.setData({isSliderChanging:false})
  },

  /**
   * 进度条拖拽事件
   * @param {object} event 
   */
  handleSliderChanging:function(event){
    // 拖动时更新当前时间显示
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    // isSliderChanging:true 当拖动时进度条不随着音乐进度更新，解决拖动进度来回跳的问题
    this.setData({isSliderChanging:true,currentTime})
  },

  /**
   * 播放页返回按钮点击事件
   */
  handleBackBtnClick:function(){
    wx.navigateBack()
  },

  /**
   * 播放模式按钮点击事件
   */
  handleModeBtnClick:function(){
    // 获取当前模式
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex > 2)playModeIndex = 0

    // 更新模式状态
    audioStore.setState('playModeIndex',playModeIndex)
  },


  /**
   * 监听audio状态
   */
  setupPlayerStoreListener:function(){
    audioStore.onStates(["currentSong","lyricInfos","durationTime"],(res)=>{
      if(res.currentSong)this.setData({currentSong:res.currentSong})
      if(res.lyricInfos)this.setData({lyricInfos:res.lyricInfos})
      if(res.durationTime)this.setData({durationTime:res.durationTime})
    })

    // 监听当前时间、歌词、歌词下标，播放时更新这三个值，再此onState会触发监听到值的改变，相当于这边也在随着播放的音乐实时监听更新
    audioStore.onStates(["currentTime","curLyricText","curentLyricIndex"],({currentTime,curLyricText,curentLyricIndex})=>{
      // 当拖动进度条时不更新当前播放进度条
      if(currentTime && !this.data.isSliderChanging){
        let sliderVal = (this.data.currentTime / this.data.durationTime)*100
        this.setData({currentTime,sliderVal})
      }
      if(curentLyricIndex){
        this.setData({curentLyricIndex,lyricScrollTop:curentLyricIndex*50})
      }
      if(curLyricText)this.setData({curLyricText})
    })

    // 监听播放模式变化 改变播放页的播放模式和图标
    audioStore.onState("playModeIndex",(playModeIndex)=>{
      this.setData({playModeIndex:playModeIndex,playModeName:playModeNames[playModeIndex]})
    })

    // 监听播放状态
    audioStore.onState("isPlaying",(isPlaying)=>{
      // 判断值是否为空，在setData的时候再使用三元运算符判断true false
      if(isPlaying!==undefined){
        this.setData({isPlaying,playingName:isPlaying?"pause":"resume"})
      }
    })
  },
})