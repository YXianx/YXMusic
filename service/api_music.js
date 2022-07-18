import yxRequest from './index'

/**
 * 请求首页Banner轮播图
 */
export function getBanners(){
  return yxRequest.get("/banner",{type:2})
}

/**
 * 请求新歌速递榜
 * @param {number} idx 
 */ 
export function getRanking(limit=100){
  return yxRequest.get("/personalized/newsong",{limit})
}

/**
 * 请求歌单列表
 * @param {string} cat 
 * @param {number} limit 
 * @param {number} offset 
 */
export function getSongMenu(cat="全部",limit=6,offset=0){
  return yxRequest.get("/top/playlist",{cat,limit,offset})
}

/**
 * 请求各种音乐榜单
 * @param {*} type 
 */
export function getAnyRanking(type){
  return yxRequest.get("/top/song",{type})
}

/**
 * 请求歌单详情内容
 * @param {*} id 
 */
export function getSongMenuDeatil(id){
  return yxRequest.get("/playlist/detail",{id})
}