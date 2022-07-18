// pages/home-profile/index.js
import {getUserInfo} from '../../service/api_login'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  handleGetUser:async function(){
    const userInfo = await getUserInfo()
    console.log(userInfo);
  }
})