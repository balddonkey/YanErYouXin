// MyCollect.js

// 明信片模板
let xincell = require('../../components/xincell/xincell.js');
let TopNav = require('../../components/TopNavigator/TopNavigator.js');
let TopTip = require('../../components/TopTip/TopTip.js');

let util = require('../../utils/util.js');
let fetcher = require('../../utils/Fetcher.js');

let Postcard = require('../../models/Postcard.js');

let MyCollectInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    cellType: 1,
    postdatas: [],
    playAudio: {
      index: -1,
      id: null
    },
    nav_datasource: {
      selectIndex: 2,
      items: [{
        title: '寄件箱',
        icon: '../../assets/mail_normal.png',
        selectedIcon: '../../assets/mail_select.png'
      }, {
        title: '扫一扫',
        icon: '../../assets/scan_normal.png',
        selectedIcon: '../../assets/scan_select.png'
      }, {
        title: '收藏夹',
        icon: '../../assets/collect_normal.png',
        selectedIcon: '../../assets/collect_select.png'
      }]
    }
  },

  didSelectItem: function (index) {
    let t = this;
    switch (index) {
      case 0:
        wx.redirectTo({
          url: '../my/my',
        });
        break;
      case 1:
        t.onScanQRCode();
        break;
      case 2:
        break;
    }
  },

  onScanQRCode: function () {
    let t = this;
    wx.scanCode({
      success: function (res) {
        console.log('scan result:', res);
        // res.scanType != 'WX_CODE' ||   Android有bug，扫描小程序码返回QR_CODE
        if (util.isUndef(res.path)) {
          t.showToptip({
            title: '无效的二维码',
            type: 'Warning'
          });
          return;
        }
        wx.navigateTo({
          url: '/' + res.path,
        });
      },
      fail: function (res) {
        t.showToptip({
          title: '识别失败',
          type: 'Warning'
        });
      }
    });
  },

  // 更新Postcard
  playAudio: function (idx, time) {
    let t = this;
    t.data.playAudio.id && clearInterval(t.data.playAudio.id);
    let postcards = t.data.postdatas;
    postcards[idx].percent = 0;
    postcards[idx].playing = true;
    let playId = setInterval(() => {
      postcards[idx].percent += (util.recordTimeInterval / time);
      if (postcards[idx].percent >= 1) {
        t.data.playAudio.id && clearInterval(t.data.playAudio.id);
        postcards[idx].playing = false;
      }
      t.setData({
        postdatas: postcards
      });
    }, util.recordTimeInterval * 1000);
    t.setData({
      postdatas: postcards,
      playAudio: {
        id: playId,
        index: idx
      }
    });
  },

  // Xincell delegate method  
  onShowLocation: function (p, idx) {
    wx.openLocation({
      latitude: p.latitude,
      longitude: p.longitude,
    })
  },

  editPostcard: function (p, idx) {
    let t = this;
    wx.showActionSheet({
      itemList: ['取消收藏这条明信'],
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            fetcher.cancelFavor({
              data: {
                postcardId: p.postcardId
              },
              cb: function(res) {
                if (res.success) {
                  wx.showToast({
                    title: '已取消收藏',
                  });
                  let postcards = t.data.postdatas;
                  postcards.splice(idx, 1);
                  t.setData({
                    postdatas: postcards
                  });
                } else {
                  t.showToptip({
                    title: '取消收藏失败: ' + res.msg,
                    type: 'Warning'
                  });
                }
              }
            })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '收藏夹',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let t = this;
    fetcher.getFavorList({
      cb: function (res) {
        if (res.success) {
          if (res.content && res.content.length) {
            res.content.map((e) => {
              return Postcard.postcardFromMeta(e);
            });
          }
          t.setData({
            postdatas: res.content
          });
          setTimeout(() => {
            wx.pageScrollTo({
              scrollTop: 84,
            });
          }, 0.25 * 1000);
        } else {
          console.log('获取我的收藏列表失败，待处理')
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


// 注入模板JS回调
Object.assign(MyCollectInitial, TopTip.functions);
// 注入模板data
Object.assign(MyCollectInitial.data, TopTip.data);


Page(MyCollectInitial);


