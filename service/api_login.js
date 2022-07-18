import {yxLoginRequest} from './index'

/**
 * 获取登录Code
 * @param {number} timeout 
 */
export function getLoginCode(timeout=1000){
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout,
      success:(res)=>{
        resolve(res.code)
      },
      fail:(err)=>{
        console.log(err);
        reject(err)
      }
    })
  })
}

/**
 * code发送给服务器换取Token
 * @param {string} code 
 */
export function codeToToken(code){
  return yxLoginRequest.post("/login",{code})
}

/**
 * 检查TOKEN是否过期
 * @param {string} token 
 */
export function checkToken(){
  return yxLoginRequest.post("/auth",{},true)
}

/**
 * 检查session是否过期
 */
export function checkSession(){
  return new Promise((resolve)=>{
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail:()=>{
        resolve(false)
      }
    })
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(){
  return new Promise((resolve,reject)=>{
    wx.getUserProfile({
      desc: 'desc',
      success:(res)=>{
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}