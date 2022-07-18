// pages/home-video/index.js
// 导入video相关请求
import {getTopMV} from '../../service/api_video'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs:[],
    hasMore:true
  },

  // 封装MV网络请求函数
  getTopMVData:async function(offset){
    // 判断是否还有MV数据可以请求
    if(!this.data.hasMore) return

    // 显示加载效果动画(标题栏处)
    wx.showNavigationBarLoading()

    const res = await getTopMV(offset)
    let tempData = this.data.topMVs
    // offset=0时要么第一次进入程序 要么上拉刷新  offset!=0时为上拉加载
    if(offset === 0){
      tempData = res.data
    }
    else{
      tempData = tempData.concat(res.data)
    }
    // 更新MV列表/保存hasMore标识
    this.setData({
      topMVs:tempData,
      hasMore:res.hasMore
    })

    // 关闭加载效果动画
    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面加载时请求MV TOP榜
    this.getTopMVData(0)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉刷新时显示最新MV数据，覆盖之前的数据
    this.getTopMVData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.data.topMVs.length 从上次列表的最后一条开始继续获取(0 10 20 30..)
    this.getTopMVData(this.data.topMVs.length)
  },

  // 封装时间处理函数
  handleVideoItemClick:function(event){
    // 获取歌曲id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转到详情页
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})