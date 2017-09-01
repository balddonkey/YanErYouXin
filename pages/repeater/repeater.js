// repeater.js

let ActionSheet = require('../../components/MWActionSheet/MWActionSheet.js');
let TopTip = require('../../components/TopTip/TopTip.js');

let Postcard = require('../../models/Postcard.js');
let login = require('../../utils/login.js');
let fetcher = require('../../utils/Fetcher.js');
let util = require('../../utils/util.js');

var app = getApp();

let RepeaterInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    msg: null,
    video: null,
    audio: null
  },

  onTap: function (e) {
    this.showMWActionSheet({
      title: '123',
      itemList: [{
        title: '1'
      }, {
        title: '2'
      }, {
        title: '3'
      }, {
        title: '4'
      }]
    })
  },

  route: function (p) {
    if (!p.isuse) {
      wx.redirectTo({
        url: '../collect/collect?postcard=' + JSON.stringify(p),
      });
    } else {
      wx.redirectTo({
        url: '../create/create?id=' + p.id,
      });
    }
  },

  dispose: function (res) {
    let t = this;
    fetcher.getPostcard({
      postcardId: t.data.id,
      cb: function (res) {
        if (res.success) {
          let postcard = res.content;
          postcard = Postcard.postcardFromMeta(postcard);
          t.setData({
            postcard: postcard
          });
          t.route(postcard);
        } else {
          // 明信片未创建
          if (res.code == 10008) {
            let postcard = {
              id: t.data.id
            };
            wx.redirectTo({
              url: '../create/create?id=' + t.data.id,
            });
          } else if (res.code == 10007) {
            wx.redirectTo({
              url: '../sms/sms?id=' + t.data.id,
            });
          } else {
            this.showToptip({
              title: res.msg,
              type: 'Warning'
            });
          }
        }
      }
    });
  },

  route: function(options) {
    let t = this;
    if (util.isUndef(options) || util.isUndef(options.id)) {
      wx.redirectTo({
        url: '../my/my',
      });
    } else if (options && !options.id) {
      this.showToptip({
        title: '错误的明信片ID',
        type: 'Warning'
      });
      return;
    }
    t.setData({
      id: options.id
    });
  },

  onLogin: function (options) {
    let t = this;
    login.login({
      userdata: t.data.poster,
      success: function (res) {
        console.log('login succ;')
        t.route(options);
      },
      fail: function (res) {
        this.showToptip({
          title: '登录失败: ' + res.msg,
          type: 'Warning'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this;
    app.getUserInfo({
      success: (res) => {
        console.log('repeater page, user info:', res);
        t.setData({
          poster: res
        });
        t.onLogin(options);
      },
      fail: (res) => {
        this.showToptip({
          type: 'Warning',
          title: '登录失败: ' + res.errMsg
        })
      }
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

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

Object.assign(RepeaterInitial, ActionSheet.functions);
Object.assign(RepeaterInitial.data, ActionSheet.data);

Object.assign(RepeaterInitial, TopTip.functions);
Object.assign(RepeaterInitial.data, TopTip.data);

Page(RepeaterInitial);