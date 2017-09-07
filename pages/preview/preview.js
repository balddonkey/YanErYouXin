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
    let postcard = this.data.postcard;
    let params = {
      postcardId: postcard.id,
      receiverPhone: postcard.recevierPhone,
      address: postcard.address,
      longitudeLatitude: postcard.longitude && postcard.latitude ? postcard.longitude + ',' + postcard.latitude : null
    };
    fetcher.create(params, (res) => {
      if (res.success) {
        wx.reLaunch({
          url: '../my/my?type=0',
        });
      } else {
        console.log('创建失败:', res.msg);
        this.showToptip({
          title: '创建失败: ' + res.msg,
          type: 'Warning'
        });
      }
    })
  },

  // 返回编辑
  onReturnToEdit: function() {
    console.log('onReturnToEdit');
    wx.navigateBack();
  },

  playAudio: function(idx, duration) {
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
    wx.setNavigationBarTitle({
      title: '预览'
    });
    console.log('on preview:', options);
    let postcard = JSON.parse(options.postcard);
    postcard.createTime = util.formatTime(new Date());
    postcard.createTimeStr = postcard.createTime;
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