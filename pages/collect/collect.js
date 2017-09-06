// collect.js

let xincell = require('../../components/xincell/xincell.js');
let TopTip = require('../../components/TopTip/TopTip.js');

let util = require('../../utils/util.js');
let fetcher = require('../../utils/Fetcher.js');

let Postcard = require('../../models/Postcard.js');

let app = getApp();

let CollectInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    cellType: 1,
    collect: 1,
    postcard: {
      // id: 0,
      // poster: {
      //   nickName: '日狗少年史三彪',
      //   avatarUrl: 'https://wx.qlogo.cn/mmopen/yicNtvz6vYypl5ZChssLr5WXzrLm9QfzKJaFVLpDcxvxyZlWWQ2PdiceAcffbjELOghyb0A1t2Bx2n5sOV4HicejEfpEGAtWPxI/0'
      // },
      // time: util.formatTime(new Date()),
      // location: {
      //   name: "高高的骨灰旁边"
      // }
    }
  },

  onCollect: function(e) {
    let postcard = this.data.postcard;
    let t = this;
    fetcher.favor({
      data: {
        postcardId: postcard.postcardId
      },
      cb: function(res) {
        console.log('collec:', res);
        if (res.success) {
          t.showToptip({
            timeout: 3,
            title: '收藏成功'
          });
        } else {
          t.showToptip({
            timeout: 3,
            title: '收藏失败:' + res.msg,
            type: 'Warning'
          });
        }
      }
    })
  },

  playAudio: function (idx, duration) {
    console.log('ppppp');
    this.playback();
  },

  playback: function () {
    let t = this;
    if (t.data.playbackId) {
      t.playbackStop();
      // return;
    }
    // mh.playVoice({
    //   url: t.data.postcard.audio,
    //   cb: function (res) {
    //     console.log(res);
    //   }
    // });
    console.log('t.p:', t.data.postcard);
    let postcard = t.data.postcard;
    let duration = t.data.postcard.audioDuration;
    let time = 0;
    t.data.playbackId = setInterval(() => {
      time += util.recordTimeInterval;
      postcard.percent = time / duration;
      console.log('ttt:', time, 'percent:', postcard.percent);
      t.setData({
        postcard: postcard
      });
      if (time >= duration) {
        t.playbackStop();
      }
    }, util.recordTimeInterval * 1000);
    t.setData({
      playbackId: t.data.playbackId
    });
  },

  playbackStop: function () {
    let t = this;
    let postcard = t.data.postcard;
    // wx.stopVoice();
    if (t.data.playbackId) {
      clearInterval(t.data.playbackId);
      t.data.playbackId = null;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let postcard = JSON.parse(options.postcard);
    if (!postcard) {
      console.log('错误的明信片信息');
      return;
    }
    console.log('collect pp:', options.postcard);
    this.setData({
      postcard: Postcard.postcardFromMeta(postcard)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let t = this;
    let nickName = app.globalData.userInfo.nickName;
    let config = {
      title: nickName ? nickName + ' 转发的明信片' : null,
      path: '/pages/repeater/repeater?id=' + t.data.postcard.postcardId
    };
    console.log('app data:',app.globalData, '\nconfig:', config);
    return config;
  }
};


// 注入模板JS回调
Object.assign(CollectInitial, xincell.functions);
// 注入模板data
Object.assign(CollectInitial.data, xincell.data);



// 注入模板JS回调
Object.assign(CollectInitial, TopTip.functions);
// 注入模板data
Object.assign(CollectInitial.data, TopTip.data);

Page(CollectInitial);