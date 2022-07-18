// 固定接口地址
const BASE_URL = "http://43.138.177.191:3000"
const LOGIN_BASE_URL = "http://123.207.32.32:3000"
const TOKEN_KEY = wx.getStorageSync('TOKEN_KEY')

// 封装请求类 利用Promise实现网络请求的返回
class YXRequest{
  constructor(baseURL,baseHeader={}){
    this.BASE_URL = baseURL
    this.BASE_HEADER = baseHeader
  }

  /**
   * request封装 isAuth->是否需要授权获取Token
   * @param {string} url 
   * @param {string} method 
   * @param {object} params 
   * @param {boolean} isAuth 
   * @param {object} header 
   */
  request(url,method,params,isAuth=false,header={}){
    // 合并token和自定义的header
    const finalHeader = isAuth ? {...this.BASE_HEADER,...header}:header

    return new Promise((resolve,reject)=>{
      wx.request({
        header:finalHeader,
        url:this.BASE_URL + url,
        method,
        data:params,
        success:function(res){
          resolve(res.data)
        },
        fail:function(err){
          reject(err)
        }
      })
    })
  }
  // 进一步封装get、post类
  get(url,params,isAuth=false,header){
    return this.request(url,'GET',params,isAuth,header)
  }
  post(url,data,isAuth=false,header){
    return this.request(url,'POST',data,isAuth,header)
  }
}

// 歌曲请求
const yxRequest = new YXRequest(BASE_URL)
// 登录请求
const yxLoginRequest = new YXRequest(LOGIN_BASE_URL,{token:TOKEN_KEY})

// 导出类对象
export default yxRequest
export{
  yxLoginRequest
}