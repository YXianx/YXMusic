// pages/home-music/index.js
import {getBanners,getSongMenu} from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import {rankingStore,rankingMap,audioStore} from '../../store/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // banner图片
    banners:[],
    swiperHeight:60,
    // 推荐音乐
    recommendSongs:[],

    // 歌单
    hotSongMenus:[],
    recommendMenus:[],

    // 榜单 保持顺序一致用对象 无需一致用数组
    rankings:{},

    // 当前歌曲
    currentSong:{},
    isPlaying:false,
    animationState:"paused",
    playingName:"play"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    // 请求页面数据
    this.getPageData();
    // 发起共享数据请求
    rankingStore.dispatch("getRankingDataAction")
    // 从store获取共享数据
    rankingStore.onState("hotRanking",res=>{
      if(Object.keys(res).length===0)return
      // 深拷贝 -> 解决对res裁剪时store的状态也会随之改变(因为内存地址相同)
      const tempResult = JSON.parse(JSON.stringify(res))
      const recommendSongs = tempResult.result.splice(0,6);

      this.setData({recommendSongs})
    })
    rankingStore.onState("newRanking",this.getRankingHandle(0))
    rankingStore.onState("originRanking",this.getRankingHandle(7))
    rankingStore.onState("upRanking",this.getRankingHandle(96))

    this.setupMusicSongAction()
  },

  /**
   * 封装->获取页面所有请求数据
   */
  getPageData:async function(){
    // 请求banner图片
    await this.getBannerData()  // 使用async await是因为如果不这样的话由于请求是异步请求，在发送请求的时候前台wxml wx:for="banners"是空的,当变为同步等待时，问题解决。
    // 请求全部热门歌单列表
    getSongMenu().then(res=>{
      this.setData({hotSongMenus:res.playlists})
    })
    // 请求欧美推荐歌单列表
    getSongMenu("欧美").then(res=>{
      this.setData({recommendMenus:res.playlists})
    })
  },

  /**
   * 请求banner轮播图
   */
  getBannerData:async function(){
    const res = await getBanners()
    this.setData({
      banners:res.banners
    })
  },

  /**
   * 搜索框点击事件
   */
  handleSearchClick:function(){
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  /**
   * 图片加载完成事件
   * @param {object} event 
   */
  handleSwiperImageLoaded:function(event){
    // 轮播图尺寸适配不同机型完整显示 -> 问题：swiper的高度默认是固定的150px在不同尺寸机型上会导致内容显示不正确或不全  思路：image会根据图片大小自适应，获取image的高度再设置给swiper的高度即可。
    // ***未做防抖节流
    queryRect('.swiper-img').then(res=>{
      this.setData({swiperHeight:res[0].height})
    })
  },

  /**
   * 榜单数据回调函数 (注：在回调函数中返回回调函数体，这样就可以在回调函数自带参数的基础上增添自己需要的参数)
   * @param {array} res 
   */
  getRankingHandle:function(idx){
    return (res)=>{
      // 判断res是否为undefined
      if(Object.keys(res).length===0)return

      const name = res.cat
      const bgColor = res.bgColor
      const playCount = res.playCount
      // 深拷贝 -> 解决store状态因为splice而改变
      const tempResult = JSON.parse(JSON.stringify(res))
      const songList = tempResult.data.splice(0,3)
      const rankingObj = {name,bgColor,playCount,songList}
      // 浅拷贝先前rankings内容 再添加或覆盖新榜单
      const originRankings = {...this.data.rankings,[idx]:rankingObj}

      this.setData({rankings:originRankings})
    }
  },

  /**
   * 歌曲推荐更多按钮点击事件
   */
  handleMoreClick:function(){
    this.navigateToDetailSongPage("rank","hotRanking")
  },
  /**
   * 巅峰榜点击事件
   */
  handleRankingClick:function(event){
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongPage("rank",rankingName)
  },

  /**
   * 推荐歌曲点击事件
   * @param {object} event 
   */
  handleSongItemClick:function(event){
    // 保存当前歌曲下标及歌单到store
    const index = event.currentTarget.dataset.index
    audioStore.setState("playListIndex",index) 
    audioStore.setState("playListSongs",this.data.recommendSongs) 
  },

  /**
   * 播放栏播放按钮点击事件
   */
  handleBarPlayClick:function(){
    audioStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
  },
  /**
   * 播放栏点击事件
   */
  handleBarClick:function(){
    const id = this.data.currentSong.id
    wx.navigateTo({
      url: `/pages/music-player/index?id=${id}`,
    })
  },

  /**
   * 歌曲详情页跳转
   */
  navigateToDetailSongPage:function(type,rankingName){
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=${type}`,
    })
  },

  /**
   * 监听歌曲变化
   */
  setupMusicSongAction(){
    // 监听当前播放歌曲
    audioStore.onState("currentSong",(currentSong)=>{
      this.setData({currentSong})
    })

    // 监听歌曲状态
    audioStore.onState("isPlaying",(isPlaying)=>{
      this.setData({
        isPlaying,
        playingName:isPlaying?"pause":"play",
        animationState:isPlaying?"running":"paused"
      })
    })
  }
})