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
    collect: 1,
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
    if (p.isuse) {
      wx.redirectTo({
        url: '../collect/collect?postcard=' + JSON.stringify(p),
      });
    } else {
      wx.redirectTo({
        url: '../create/create?id=' + p.id,
      });
    }
  },

  dispose: function () {
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
            if (t.data.createType == 0) {
              wx.redirectTo({
                url: '../create/create?id=' + t.data.id + '&createType=' + t.data.createType,
              });
            } else {
              wx.redirectTo({
                url: '../mapcreate/mapcreate?id=' + t.data.id + '&createType=' + t.data.createType,
              });
            }
          } else if (res.code == 10007) {
            wx.redirectTo({
              url: '../sms/sms?id=' + t.data.id,
            });
          } else {
            t.showToptip({
              title: res.msg,
              type: 'Warning'
            });
          }
        }
      }
    });
  },

  checkParams: function (options) {
    let t = this;
    if (util.isUndef(options) || util.isUndef(options.scene)) {
      wx.redirectTo({
        url: '../my/my',
      });
      return;
    } 
    let scene = decodeURIComponent(options.scene || '');
    let params = scene.split('$');
    
     if ( params.length < 2 ) {
      this.showToptip({
        title: '错误的明信片ID',
        type: 'Warning'
      });
    } else {
      let createType = params[0];
      let id = params[1];
        t.setData({
          id: id,
          createType: createType
        });
        t.dispose();
    }
  },

  onLogin: function (options) {
    let t = this;
    login.login({
      userdata: t.data.poster,
      success: function (res) {
        t.checkParams(options);
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
    console.log('repeater:', options);
    let t = this;
    app.getUserInfo({
      success: (res) => {
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
    wx.showNavigationBarLoading();
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

Object.assign(RepeaterInitial, ActionSheet.functions);
Object.assign(RepeaterInitial.data, ActionSheet.data);

Object.assign(RepeaterInitial, TopTip.functions);
Object.assign(RepeaterInitial.data, TopTip.data);

Page(RepeaterInitial);