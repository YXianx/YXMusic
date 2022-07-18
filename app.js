// app.js
import {getLoginCode,codeToToken,checkToken,checkSession} from './service/api_login'

App({
  // 加载事件
  onLaunch:async function(){
    // 1、获取手机信息
    const system = wx.getSystemInfo({
      success:(res)=>{
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
        this.globalData.statusBarHeight = res.statusBarHeight
        // 设备宽高比
        this.globalData.deviceRadio = this.globalData.screenHeight/this.globalData.screenWidth
      }
    })

    // 2、让用户默认进行登录
    this.handleLogin()
  },
  /**
   * 全局设备信息存储(设备宽度及高度)
   *  */ 
  globalData:{
    screenWidth:0,
    screenHeight:0,
    statusBarHeight:0,
    deviceRadio:0
  },

  /**
   * 同步登录操作集合封装成异步函数(async),这样onLauch时才不会影响性能一直等待同步函数执行
   */
  handleLogin:async function(){
    const token = wx.getStorageSync('TOKEN_KEY')
    const checkResult = await checkToken()
    const isSessionExpire = await checkSession()
    // 本地没token或token过期、token错误时及session过期时进行登录
    if(!token || checkResult.errorCode || !isSessionExpire){
      this.loginAction()
    }
  },

  /**
   * 用户登录
   */
  loginAction:async function(){
    // 1、获取code 1000ms没拿到就超时
    const code = await getLoginCode()
    // 2、将code发送给服务器换取token
    const result = await codeToToken(code)
    const token = result.token
    // 3、保存token到本地缓存storage
    wx.setStorageSync('TOKEN_KEY', token)
  }
})
