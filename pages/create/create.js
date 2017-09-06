// create.js

let recorder = require('../../components/recorder/recorder.js');
let TopTip = require('../../components/TopTip/TopTip.js');
let fetcher = require('../../utils/Fetcher.js');

let util = require('../../utils/util.js');
let mh = require('../../utils/MediaHelper.js');

let phonePattern = /^1[\d]{10,10}$/;
var app = getApp();

let CreateInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    invalidId: true,
    create: true,
    errMsg: '',
    debug: false,
    playbackId: null,
    percent: 0,
    postcard: {
      poster: null,
      recevierPhone: null,
      id: null,
      audio: null,
      audioDuration: 0,
      audioDurationStr: null,
      video: null,
      location: null
    }
  },

  // 粘贴
  onPaste: function () {
    let t = this;
    wx.getClipboardData({
      success: function (res) {
        let objc = {
          detail: {
            value: res.data
          }
        };
        t.onInputPhoneNum(objc);
      }
    });
  },

  // 录制视频
  onVideoRecord: function () {
    let t = this;
    wx.chooseVideo({
      maxDuration: 15,
      success: function (res) {
        wx.showLoading({
          title: '视频上传中',
          mask: true
        });
        fetcher.uploadVideo({
          filePath: res.tempFilePath, 
          data: {
            postcardId: t.data.postcard.id
          }, 
          cb:(res) => {
            if (res.code == 0) {
              t.data.postcard.video = res.content.path;
              t.setData({
                postcard: t.data.postcard
              });
            }
            wx.hideLoading();
          }
        }
        );
      },
      fail: function (res) {

      },
      complete: function (res) {
      }
    })
  },

  // 录制音频
  onAudioRecord: function () {
    let t = this;
    t.setData({
      create: false
    });
  },

  didRecordAudio: function (fp, duration) {
    duration = parseFloat(duration.toFixed(2));
    console.log('fp and duration:', fp, duration);
    let t = this;
    let postcard = t.data.postcard;
    postcard.audioDuration = duration;
    postcard.audioDurationStr = duration.toFixed(0);
    t.setData({
      create: true,
      postcard: postcard
    });
    console.log('duration:', postcard);
    wx.showLoading({
      title: '音频上传中',
      mask: true
    });
    fetcher.uploadAudio({
      data: {
        postcardId: t.data.postcard.id,
        duration: postcard.audioDurationStr
      },
      filePath: fp,
      cb: function (res) {
        console.log('upload audio done:', res);
        if (res.success) {
          t.data.postcard.audio = res.content.path;
          t.setData({
            errMsg: JSON.stringify(res) || '屁都没有',
            postcard: t.data.postcard
          });
        } else {
          console.log('upload audio failed:', res.msg);
        }
        wx.hideLoading();
      }
    })
  },

  // Recorder delegate method
  recordClose: function() {
    let t = this;
    t.setData({
      create: true
    });
  },

  tapVoice: function () {
    let t = this;

    mh.playVoice({
      url: t.data.postcard.audio,
      willStart: function() {
        t.playback();
      },
      cb: function (res) {
        console.log(res);
      }
    });
  },

  playback: function () {
    let t = this;
    if (t.data.playbackId) {
      t.playbackStop();
      // return;
    }
    console.log('t.p:', t.data.postcard);
    let duration = t.data.postcard.audioDuration;
    let time = 0;
    t.data.playbackId = setInterval(() => {
      time += util.recordTimeInterval;
      t.data.percent = time / duration;
      console.log('ttt:', time, 'percent:', t.data.percent);
      t.setData({
        percent: t.data.percent
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

  // 选择位置信息
  chooseLocation: function () {
    let t = this;
    wx.chooseLocation({
      success: function (res) {
        let postcard = t.data.postcard;
        postcard.address = res.name;
        postcard.longitude = res.longitude;
        postcard.latitude = res.latitude;
        t.setData({
          postcard: t.data.postcard
        });
      },
    })
  },

  // 预览
  onPreview: function () {

    let phone = this.data.postcard.recevierPhone || '';
    if (phone.search(phonePattern) < 0) {
      this.showToptip({
        title: '无效的手机号码',
        type: 'Warning'
      });
      return;
    }
    let params = JSON.stringify(this.data.postcard);
    wx.navigateTo({
      url: '../preview/preview?postcard=' + params,
    });
  },

  onInputPhoneNum: function (objc) {
    let t = this;
    let value = objc.detail.value;
    let postcard = t.data.postcard;
    postcard.recevierPhone = value;
    t.setData({
      postcard: postcard
    });
    let ss = value.search(phonePattern);
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
    this.recorder_init();
    let t = this;
    if (!options.id) {
      t.showToptip({
        title: '错误的明信片ID',
        timeout: 20,
        type: 'Warning'
      });
      return;
    }
    t.data.postcard.id = options.id;
    t.setData({
      invalidId: false,
      postcard: t.data.postcard
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('ready');
    // let t = this;
    // setTimeout(() => {
    //   t.setData({
    //     create: false
    //   });
    // }, 2 * 1000);
    let t = this;
    let postcard = t.data.postcard;
    app.getUserInfo((res) => {
      console.log('create page, user info:', res);
      postcard.poster = res;
      t.setData({
        postcard: postcard
      });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
}

Object.assign(CreateInitial, recorder.functions);
Object.assign(CreateInitial.data, recorder.data);

Object.assign(CreateInitial, TopTip.functions);
Object.assign(CreateInitial.data, TopTip.data);

Page(CreateInitial);