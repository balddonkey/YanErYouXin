// sms.js

let TopTip = require('../../components/TopTip/TopTip.js');

let fetcher = require('../../utils/Fetcher.js');

// 手机号码正则匹配规则
let phonePattern = /^1[\d]{10,10}$/;

let SmsInitial = {

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 发送验证短信
  onSendSms: function () {

  },

  // 输入手机号码回调
  onPhoneInput: function (objc) {
    let t = this;
    let value = objc.detail.value;
    console.log('vv:', value);
    let ss = value.search(phonePattern);
    console.log('ss:', ss);
    if (value.length >= 11 && ss < 0) {
      t.showToptip({
        title: '无效的手机号码',
        type: 'Warning'
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
};

Object.assign(SmsInitial, TopTip.functions);
Object.assign(SmsInitial.data, TopTip.data);

Page(SmsInitial);