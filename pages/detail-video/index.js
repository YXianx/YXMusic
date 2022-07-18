import {getMVDetail,getRelatedVideo,getMVURL} from '../../service/api_video'

// pages/detail-video/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo:{},
    mvDetail:{},
    relatedVideos:{},
    danmuList:[
      {
        text:"贤先生的YXMusic",
        color:"#fff",
        time:1
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取传入id   options -> 跳转路径时携带的参数
    const id = options.id

    // 获取页面数据
    this.getPageData(id)
  },

  getPageData:function(id){
    // 获取MV播放地址
    getMVURL(id).then(res=>{
      this.setData({mvURLInfo:res.data})
    })
    // 获取MV详情信息
    getMVDetail(id).then(res=>{
      this.setData({mvDetail:res.data})
    })
    // 获取与该MV相关的其他MV
    getRelatedVideo(id).then(res=>{
      this.setData({relatedVideos:res.data})
    })
  },

  handleRelatedItemClick:function(event){

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})