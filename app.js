//app.js zz

let login = require('./utils/login.js');
App({
  onLaunch: function (options) {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || [];
    // logs.unshift(Date.now());
    // wx.setStorageSync('logs', logs);    
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb.success == "function" && cb.success(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb.success == "function" && cb.success(that.globalData.userInfo)
        },
        fail: function(res) {
          console.log('get ui fail:', res);
          typeof cb.fail == "function" && cb.fail(res)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }    
})  
