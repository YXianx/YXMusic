import yxRequest from './index'

/**
 * 请求热门搜索
 */
export function getSearchHot(){
  return yxRequest.get("/search/hot")
}

/**
 * 请求搜索建议
 */
export function getSearchSuggest(keywords){
  return yxRequest.get("/search/suggest",{keywords,type:"mobile"})
}

/**
 * 请求搜索内容返回数据
 * @param {string} keyword 
 */
export function getSearchResult(keywords){
  return yxRequest.get("/search",{keywords})
}