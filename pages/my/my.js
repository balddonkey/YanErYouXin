// my.js

// 明信片模板
let xincell = require('../../components/xincell/xincell.js');
let TopNav = require('../../components/TopNavigator/TopNavigator.js');
let TopTip = require('../../components/TopTip/TopTip.js');
let login = require('../../utils/login.js');

let util = require('../../utils/util.js');
let fetcher = require('../../utils/Fetcher.js');

let Postcard = require('../../models/Postcard.js');

let app = getApp();

let MyInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    cellType: 0,
    postdatas: [],
    playAudio: {
      index: -1,
      id: null
    },
    nav_datasource: {
      selectIndex: 0,
      items: [{
        title: '寄件箱',
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
    }
  },

  // TopNavigator delegate method
  didSelectItem: function (index) {
    let t = this;
    switch (index) {
      case 0:
        break;
      case 1:
        wx.scanCode({
          success: function (res) {
            console.log('scan result:', res);
            let result;
            try {
              result = JSON.parse(res.result);
            } catch (e) {
              t.showToptip({
                title: '无效的二维码',
                type: 'Warning'
              });
              return;
            }
            if (util.isUndef(result.id)) {
              t.showToptip({
                title: '无效的二维码',
                type: 'Warning'
              });
              return;
            }
            wx.navigateTo({
              url: '../repeater/repeater?id=' + result.id,
            });
          }
        });
        break;
      case 2:
        wx.redirectTo({
          url: '../MyCollect/mycollect',
        });
        break;
    }
  },

  // Xincell delegate method 
  editPostcard: function (p, idx) {
    let t = this;
    wx.showActionSheet({
      itemList: ['撤回这条明信'],
      success: function (res) {
        console.log(res.tapIndex);
        switch (res.tapIndex) {
          case 0:
            fetcher.revocationPostcard({
              data: p.postcardId,
              cb: function (res) {
                if (res.success) {
                  wx.showToast({
                    title: '已撤回',
                  });
                  let postcards = t.data.postdatas;
                  postcards[idx].status = 0;
                  t.setData({
                    postdatas: postcards
                  });
                } else {
                  t.showToptip({
                    title: '撤回失败: ' + res.msg,
                    type: 'Warning'
                  });
                }
              }
            });
            break;
          default:
            break;
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  // 更新Postcard
  playAudio: function (idx, time) {
    console.log('SEC', idx, time);
    let t = this;
    t.data.playAudio.id && clearInterval(t.data.playAudio.id);
    let postcards = t.data.postdatas;
    postcards[idx].percent = 0;
    let playId = setInterval(() => {
      postcards[idx].percent += (util.recordTimeInterval  / time);
      console.log('per:', postcards[idx].percent);
      t.setData({
        postdatas: postcards
      });
      if (postcards[idx].percent >= 1) {
        t.data.playAudio.id && clearInterval(t.data.playAudio.id);
      }
    }, util.recordTimeInterval * 1000);
    t.setData({
      postdatas: postcards,
      playAudio: {
        id: playId,
        index: idx
      }
    });
  },

  onReload: function() {

    let t = this;
    fetcher.getSendList({
      cb: function (res) {
        console.log('gsl:', res);
        if (res.success) {
          if (res.content && res.content.length) {
            res.content.map((e) => {
              return Postcard.postcardFromMeta(e);
            })
          }
          t.setData({
            postdatas: res.content
          });
        } else {
          console.log('获取已发送列表失败，待处理')
        }
        setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: 84,
          });
        }, 0.25 * 1000);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发件箱'
    });

    this.onReload();
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
    console.log('start refresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }

};

// 注入模板JS回调
Object.assign(MyInitial, xincell.functions);
// 注入模板data
Object.assign(MyInitial.data, xincell.data);


// 注入模板JS回调
Object.assign(MyInitial, TopNav.functions);
// 注入模板data
Object.assign(MyInitial.data, TopNav.data);


Object.assign(MyInitial, TopTip.functions);
Object.assign(MyInitial.data, TopTip.data);

Page(MyInitial);


