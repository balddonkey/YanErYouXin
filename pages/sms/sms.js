// sms.js

let TopTip = require('../../components/TopTip/TopTip.js');

let fetcher = require('../../utils/Fetcher.js');

// 手机号码正则匹配规则
let phonePattern = /^1[\d]{10,10}$/;

let SendInterval = 60;

let SmsInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    phone: null,
    vfcData: {
      // phone: vfcCode   手机号码为key，验证码为value
    },
    counting: false,
    ticktock: SendInterval,
    vfcCode: null   // 验证码
  },

  // 发送验证短信
  onSendSms: function () {
    let t = this;
    if (t.data.counting) {
      return;
    }
    let ss = t.data.phone.search(phonePattern);
    if (ss >= 0) {
      fetcher.sendSms({
        data: {
          postcardId: t.data.id,
          phone: t.data.phone
        },
        cb: function (res) {
          console.log('send sms:', res);
          if (res.success) {
            let ticktock = SendInterval;
            t.setData({
              counting: true,
              ticktock: SendInterval
            });
            let countId = setInterval(() => {
              ticktock -= 1;
              t.setData({
                ticktock: ticktock
              });
              if (ticktock <= 0) {
                clearInterval(countId);
                t.setData({
                  counting: false
                });
              }
            }, 1 * 1000);
          } else {
            t.showToptip({
              title: '发送失败: ' + res.msg,
              type: 'Warning'
            })
          }
        }
      })
    } else {
      t.showToptip({
        title: '无效的手机号码',
        type: 'Warning'
      });
    }
  },

  // 输入手机号码回调
  onPhoneInput: function (objc) {
    let t = this;
    let value = objc.detail.value;
    let ss = value.search(phonePattern);
    t.setData({
      phone: value
    });
    if (value.length >= 11 && ss < 0) {
      t.showToptip({
        title: '无效的手机号码',
        type: 'Warning'
      });
    }
  },

  onVfcInput: function (objc) {

    let t = this;
    let value = objc.detail.value;
    t.setData({
      vfcCode: value
    });
    if (value.length > 6) {
      t.showToptip({
        title: '验证码为6位数字',
        type: 'Warning'
      });
      return;
    }
  },

  onNext: function () {
    let t = this;
    console.log('ss:', t.data);
    let phone = t.data.phone;
    // search result
    let ss = phone.search(phonePattern);
    if (ss >= 0) {

    } else {
      t.showToptip({
        title: '无效的手机号码',
        type: 'Warning'
      });
    }
    fetcher.getPrivacyPostcard({
      data: {
        postcardId: t.data.id,
        phone: t.data.phone,
        verificationCode: t.data.vfcCode
      },
      cb: function (res) {
        console.log('gpp:', res);
        if (res.success) {

          wx.redirectTo({
            url: '../collect/collect?postcard=' + JSON.stringify(res.content),
          });
        } else {
          t.showToptip({
            title: res.msg,
            type: 'Warning'
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('sms:', options);
    wx.setNavigationBarTitle({
      title: '验证'
    });
    this.setData({
      id: options.id
    });
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

  }
};

Object.assign(SmsInitial, TopTip.functions);
Object.assign(SmsInitial.data, TopTip.data);

Page(SmsInitial);