// components/song-menu-area/index.js

// 实例化app对象 获取app.js中公共数据
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:"默认标题"
    },
    songMenu:{
      type:Array,
      value:[]
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenWidth:app.globalData.screenWidth
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMenuClick:function(event){
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/detail-songs/index?type=${'menu'}&id=${item.id}`,
      })
    }
  }
})
