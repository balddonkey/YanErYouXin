// preview.js

let fetcher = require('../../utils/Fetcher.js');
let xincell = require('../../components/xincell/xincell.js');
let TopTip = require('../../components/TopTip/TopTip.js');

let util = require('../../utils/util.js');
let mh = require('../../utils/MediaHelper.js');

let PreviewInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    cellType: 0,
    showReceiveStatus: false,
    playbackId: null,
    percent: 0
  },

  // 发送
  onSend: function () {
    let t = this;
    let postcard = this.data.postcard;
    console.log('create:', postcard);
    let params = {
      postcardId: postcard.id,
      address: postcard.address,
      longitudeLatitude: postcard.longitude && postcard.latitude ? postcard.longitude + ',' + postcard.latitude : null
    };
    postcard.receiverPhone && (params.receiverPhone = postcard.receiverPhone);
    fetcher.create(params, (res) => {
      console.log('create type is 0?', postcard.cardType == 0);
      if (res.success) {
        if (postcard.cardType == 0) {
          wx.reLaunch({
            url: '../my/my',
          });
        } else {
          wx.reLaunch({
            url: '../MyCollect/mycollect',
          });
        }
      } else {
        this.showToptip({
          title: '创建失败: ' + res.msg,
          type: 'Warning'
        });
      }
    })
  },
  
  onShowLocation: function (p, idx) {
    wx.openLocation({
      latitude: p.latitude,
      longitude: p.longitude,
    })
  },


  // 返回编辑
  onReturnToEdit: function() {
    wx.navigateBack();
  },

  playAudio: function(idx, duration) {
    this.playback();
  },

  playback: function () {
    let t = this;
    if (t.data.playbackId) {
      t.playbackStop();
      // return;
    }
    let postcard = t.data.postcard;
    postcard.playing = true;
    console.log('start:', postcard);
    let duration = t.data.postcard.resource.duration;
    let time = 0;
    t.data.playbackId = setInterval(() => {
      time += util.recordTimeInterval;
      postcard.percent = time / duration;
      if (time >= duration) {
        t.playbackStop();
        postcard.playing = false;
      }
      t.setData({
        postcard: postcard
      });
    }, util.recordTimeInterval * 1000);
    t.setData({
      playbackId: t.data.playbackId,
      postcard: postcard
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
    wx.setNavigationBarTitle({
      title: options.createType == 0 ? '预览' : '收藏'
    });
    console.log('on preview:', options);
    let postcard = JSON.parse(options.postcard);
    postcard.createTime = util.formatTime(new Date());
    postcard.createTimeStr = postcard.createTime;
    postcard.cardType = options.createType;
    console.log('preview data:', postcard);
    this.setData({
      postcard: postcard
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
}

Object.assign(PreviewInitial, xincell.functions);
Object.assign(PreviewInitial.data, xincell.data);

Object.assign(PreviewInitial, TopTip.functions);
Object.assign(PreviewInitial.data, TopTip.data);

Page(PreviewInitial);