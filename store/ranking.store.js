import {HYEventStore} from 'hy-event-store'
import {getRanking,getAnyRanking} from '../service/api_music'

const rankingMap = {0:"newRanking",7:"originRanking",96:"upRanking"}
const categoryMap = {0:"新歌榜",7:"原创榜",96:"飙升榜"}
const bgColorMap = {0:"rgb(65, 175, 192)",7:"rgb(208, 90, 108)",96:"rgb(87, 144, 218)"}
const playCountMap = {0:2488888888,7:530000000,96:4740000000}

const rankingStore = new HYEventStore({
  state:{
    hotRanking:{}, // 热门歌曲榜
    newRanking:{},  // 新歌榜->全部
    originRanking:{}, // 原创榜->华语
    upRanking:{} // 飙升榜->欧美
  },
  actions:{ 
    getRankingDataAction(ctx,payload){
      // 热门歌曲保存状态
      getRanking().then(res=>{
        // 热门歌曲数据格式和榜单数据格式统一(使用不同的接口不同所以需要处理数据)
        res.cat = "热歌榜"
        res.data = res.result
        for(let i of res.data){
          i.artists = i.song.artists
          i.album = i.song.album
        }
        // 保存状态
        rankingStore.setState("hotRanking",res)
      })
      // 新歌、原创、飙升榜歌曲保存状态 [全部:0 华语:7 欧美:96]
      var category = [0,7,96]
      for (let i = 0; i < category.length; i++) {
        let type = category[i]
        getAnyRanking(type).then(res=>{
          // Map优化switch多分支选择
          let rankingName = rankingMap[category[i]]
          let setNewRanking = res
          setNewRanking.cat = categoryMap[category[i]]
          setNewRanking.bgColor = bgColorMap[category[i]]
          setNewRanking.playCount = playCountMap[category[i]]
          ctx[rankingName] = setNewRanking
        })
      }
    },
  }
})

export{
  rankingStore,
  rankingMap
}