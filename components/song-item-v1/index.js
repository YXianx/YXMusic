// components/song-item-v1/index.js
import {audioStore} from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData:{}
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick:function(event){
      // this.properties.item.id也可直接获取无需写wxml的data-id
      const id = event.currentTarget.dataset.id
      // 页面跳转
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`,
      })
      // 歌曲数据请求和其他操作
      audioStore.dispatch("playMusicWithSongIdAction",{id})
    }
  }
})
