import yxRequest from './index.js'

/**
 * 请求歌曲详情
 * @param {number} ids 
 */
export function getSongDetail(ids){
  return yxRequest.get("/song/detail",{ids})
}

/**
 * 请求歌曲歌词
 * @param {number} id 
 */
export function getSongLrc(id){
  return yxRequest.get("/lyric",{id})
}