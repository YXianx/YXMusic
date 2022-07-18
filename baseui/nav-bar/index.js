// baseui/nav-bar/index.js
import {NavBarHeight} from '../../constants/device-const'

Component({
  /**
   * 组件的属性列表
   */
  // 使用多个插槽需要添加multipleSlots属性
  options:{
    multipleSlots:true
  },

  properties: {
    title:{
      type:String,
      value:"默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:getApp().globalData.statusBarHeight,
    NavBarHeight:0
  },

  lifetimes:{
    ready:function(){
      this.setData({NavBarHeight})
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 返回按钮点击事件
     */
    handleLeftClick:function(){
      this.triggerEvent('click')
    }
  }
})
