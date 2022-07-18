// pages/detail-songs/index.js
import {rankingStore,audioStore} from '../../store/index'
import {getSongMenuDeatil} from '../../service/api_music'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",
    ranking:"",
    songsInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.reqRankingOrMenu(options)
  },

  reqRankingOrMenu:function(options){
    const type = options.type
    this.setData({type})

    if(type == 'menu'){
      const id = options.id
      getSongMenuDeatil(id).then(res=>{
        // 整理数据 与排行榜格式一致
        res.cat = res.playlist.name
        res.data = res.playlist.tracks
        for(let i of res.data){
          i.artists = i.ar
          i.album = i.al
        }

        this.setData({songsInfo:res})
      })
    }
    else if(type == 'rank'){
      // 获取排行榜来源参数
      const ranking = options.ranking
      this.setData({ranking})
      // 获取数据
      rankingStore.onState(ranking,this.getRankingDataHandler)
    }
  },

  /**
   * 详情歌曲项点击事件
   * @param {object} event 
   */
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    audioStore.setState("playListIndex",index)
    audioStore.setState("playListSongs",this.data.songsInfo.data)
  },

  onUnload(){
    if(this.data.ranking){
      // 取消监听
      rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
    }
  },

  /**
   * Store监听状态回调函数
   * @param {object} res 
   */
  getRankingDataHandler:function(res){
    this.setData({songsInfo:res})
  },
})