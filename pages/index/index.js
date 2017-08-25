//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    isRecording: false,
    voicePath: null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  chooseImage: function() {
    wx.chooseImage({
      success: function(res) {
        
      },
    })
  },
  chooseVideo: function() {
    wx.chooseVideo({
      
    })
  },
  pressRecord: function() {
    let t = this;
    if (this.data.isRecording) {
      wx.stopRecord();
    } else {
      wx.startRecord({
        success: function(res) {
          console.log('ss: ', res);
          // t.setData({
          //   voicePath: res.tempFilePath
          // })
        },
        complete: function (objc) {
          console.log('record cpt: ', objc);
          t.setData({
            voicePath: objc.tempFilePath,
            isRecording: false
          });
        }
      })
      t.setData({
        isRecording: true
      });
    }
    console.log('r: ', this.data.isRecording);
  },
  pressPlay: function() {
    wx.playVoice({
      filePath: this.data.voicePath,
    })
  },
  getLocation: function() {
    wx.chooseLocation({
      success: function(res) {
        console.log('ll: ', res);
      },
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
