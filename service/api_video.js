// 二次封装 video相关网络请求

// 导入网络请求类
import yxRequest from './index'

// 获取MV TOP榜 offset->页数 limit->返回数目
export function getTopMV(offset,limit=10){
  return yxRequest.get('/top/mv',{offset,limit})
}

/**
 * 请求MV播放地址
 * @param {number} id 
 */
export function getMVURL(id){
  return yxRequest.get('/mv/url',{id})
}

/**
 * 请求MV的详情
 * @param {number} id 
 */
export function getMVDetail(mvid){
  return yxRequest.get('/mv/detail',{mvid})
}

/**
 * 请求与MV相关视频
 * @param {number} id 
 */
export function getRelatedVideo(id){
  return yxRequest.get('/related/allvideo',{id})
}