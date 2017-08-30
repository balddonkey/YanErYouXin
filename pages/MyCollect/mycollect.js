// MyCollect.js

// 明信片模板
let xincell = require('../../components/xincell/xincell.js');
let TopNav = require('../../components/TopNavigator/TopNavigator.js');

let util = require('../../utils/util.js');
let fetcher = require('../../utils/Fetcher.js');

let Postcard = require('../../models/Postcard.js');

let MyCollectInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    postdatas: [],
    nav_datasource: {
      selectIndex: 2,
      items: [{
        title: '发件箱',
        icon: '../../assets/mail_normal.png',
        selectedIcon: '../../assets/mail_select.png'
      }, {
        title: '扫一扫',
        icon: '../../assets/scan_normal.png',
        selectedIcon: '../../assets/scan_select.png'
      }, {
        title: '收藏',
        icon: '../../assets/collect_normal.png',
        selectedIcon: '../../assets/collect_select.png'
      }]
    },
    // 滚动动画
    nav_scroll_animation: null
  },

  didSelectItem: function (index) {
    console.log('did select index:', index);
    switch (index) {
      case 0:
        wx.redirectTo({
          url: '../my/my',
        });
        break;
      case 1:
        wx.navigateTo({
          url: '../create/create',
        });
        return;
        wx.scanCode({
          success: function (res) {
            console.log('scan result:', res);
            wx.navigateTo({
              url: '../repeater/repeater?params=' + JSON.stringify(res),
            })
          }
        });

        // wx.navigateTo({
        //   url: '../create/create',
        // });
        break;
      case 2:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options);
    wx.setNavigationBarTitle({
      title: '收藏',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let t = this;
    fetcher.getFavorList({
      cb: function (res) {
        console.log('gsl:', res);
        res.content.map((e) => {
          return Postcard.postcardFromMeta(e);
        })
        if (res.success) {
          t.setData({
            postdatas: res.content
          });
        } else {
          console.log('获取已发送列表失败，待处理')
        }
      }
    });

    wx.pageScrollTo({
      scrollTop: 84,
    });
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
    console.log('start refresh');
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

// 注入模板JS回调
Object.assign(MyCollectInitial, xincell.functions);
// 注入模板data
Object.assign(MyCollectInitial.data, xincell.data);


// 注入模板JS回调
Object.assign(MyCollectInitial, TopNav.functions);
// 注入模板data
Object.assign(MyCollectInitial.data, TopNav.data);

Page(MyCollectInitial);


