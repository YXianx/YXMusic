/**
 * 获取页面容器矩形信息(Width or Height ...)
 * @param {string} selector 
 */
export default function(selector){
  return new Promise((resolve,reject)=>{
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()  //获取矩形区域中的信息
    // query.exec(resolve) 也可简写直接返回
    query.exec(res=>{
      resolve(res)
    })
  })
}