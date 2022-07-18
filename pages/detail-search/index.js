// pages/detail-search/index.js
import {getSearchHot,getSearchSuggest,getSearchResult} from '../../service/api_search'
import {debounce} from '../../utils/debounce'
import {stringToNodes} from '../../utils/stringToNodes'

const _debounce = debounce(getSearchSuggest,400)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords:[],
    suggestSongs:[],
    searchValue:"",
    resultSongs:[],
    suggestSongsNodes:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },

  /**
   * 获取页面所有数据
   */
  getPageData:function(){
    getSearchHot().then(res=>{
      this.setData({hotKeywords:res.result.hots})
    })
  },

  /**
   * 输入框输入事件
   * @param {object} event 
   */
  handleSearchChange:function(event){
    const keyword = event.detail
    this.setData({searchValue:keyword})
    // 无搜索内容时清空建议和结果
    if(!keyword.length){
      this.setData({suggestSongs:[]})
      this.setData({resultSongs:[]})
      return
    }
    // Promise防抖 优化请求
    _debounce(keyword).then(res=>{
      // 解决当searchValue为空时由于防抖函数闭包的问题，上次的内容还会进行搜索请求显示
      if(!this.data.searchValue.length)return

      // 1、获取搜索建议
      const suggestSongs = res.result.allMatch
      this.setData({suggestSongs})
      // 当没有搜索结果时不往下执行
      if(!suggestSongs)return

      // 2、建议项一个个转成node节点
      const suggestKeyword = suggestSongs.map(item=>item.keyword)
      const suggestSongsNodes = []
      for(let keyItem of suggestKeyword){
        const nodes = stringToNodes(keyword,keyItem)
        suggestSongsNodes.push(nodes)
      }
      this.setData({suggestSongsNodes})
    })
  },

  /**
   * 搜索建议项点击 & 热门tag标签点击事件 
   * @param {object} event 
   */
  handleKeywordItemClick:function(event){
    // 获取点击的关键字
    const keyword = event.currentTarget.dataset.keyword

    // 设置到searchValue中
    this.setData({searchValue:keyword})

    // 发送网络请求
    getSearchResult(keyword).then(res=>{
      this.setData({resultSongs:res.result.songs})
    })
  },

  /**
   * 输入框点击Enter事件(回车 or 确认)
   * @param {object} event 
   */
  handleSearchAction:function(event){
    const searchValue =  this.data.searchValue
    getSearchResult(searchValue).then(res=>{
      this.setData({resultSongs:res.result.songs})
    })
  },
})