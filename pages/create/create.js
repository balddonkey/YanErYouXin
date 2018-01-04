// create.js

let recorder = require('../../components/recorder/recorder.js');
let TopTip = require('../../components/TopTip/TopTip.js');
let fetcher = require('../../utils/Fetcher.js');

let util = require('../../utils/util.js');
let mh = require('../../utils/MediaHelper.js');

let phonePattern = /^1[\d]{10,10}$/;
var app = getApp();

let systemInfo = wx.getSystemInfoSync();
let previewHeight = (systemInfo.windowWidth - 40) * 1080 / 1920;
let bottomHeight = systemInfo.windowHeight - previewHeight - 44 - 44 - 44 - 60;
console.log('bottom height:', bottomHeight);

let CreateInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    bottomHeight: bottomHeight,
    previewHeight: previewHeight,
    enableSelect: false,
    invalidId: true,
    create: true,
    errMsg: '',
    debug: false,
    playbackId: null,
    percent: 0,
    postcard: {
      poster: null,
      receiverPhone: '',
      id: null,
      audio: null,
      audioDuration: 0,
      audioDurationStr: null,
      video: null,
      location: null,
      resource: {
        duration: null,
        path: null,
        type: 0
      }
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

  onClearPhoneNum: function () {
    let t = this;
    let objc = {
      detail: {
        value: ''
      }
    };
    t.onInputPhoneNum(objc);
  },

  // 录制视频
  onVideoRecord: function () {
    let t = this;
    if (!t.data.enableSelect) {
      return;
    }
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
          cb: (res) => {
            if (res.success) {
              t.data.postcard.resource.type = 2;
              t.data.postcard.resource.path = res.content.path;
              t.setData({
                postcard: t.data.postcard
              });
              t.onPreview();
            } else {
              t.showToptip({
                title: res.msg,
                type: 'Warning'
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
    if (!t.data.enableSelect) {
      return;
    }
    let recorder_data = t.data.recorder_data;
    recorder_data.timerStr = null;
    t.setData({
      create: false,
      recorder_data: recorder_data
    });
  },

  didRecordAudio: function (fp, duration) {
    let audioDuration = parseFloat(duration.toFixed(2));
    console.log('did record audio:', audioDuration);
    let t = this;
    let postcard = t.data.postcard;
    postcard.audioDuration = audioDuration;
    postcard.audioDurationStr = audioDuration.toFixed(0);
    t.setData({
      create: true,
      postcard: postcard
    });
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
        if (res.success) {
          t.data.postcard.resource.duration = audioDuration;
          t.data.postcard.resource.durationStr = audioDuration.toFixed(0);
          t.data.postcard.resource.path = res.content.path;
          t.data.postcard.resource.type = 3;
          t.setData({
            errMsg: JSON.stringify(res) || '',
            postcard: t.data.postcard
          });
          t.onPreview();
        } else {
          console.log('upload audio failed:', res.msg);
        }
        wx.hideLoading();
      }
    })
  },

  // Recorder delegate method
  recordClose: function () {
    let t = this;
    t.setData({
      create: true
    });
  },

  tapVoice: function () {
    let t = this;

    mh.playVoice({
      url: t.data.postcard.resource.path,
      willStart: function () {
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
    let postcard = t.data.postcard;
    postcard.playing = true;
    let duration = t.data.postcard.audioDuration;
    let time = 0;
    t.data.playbackId = setInterval(() => {
      time += util.recordTimeInterval;
      t.data.percent = time / duration;
      postcard.playing = false;
      if (time >= duration) {
        t.playbackStop();
      }
      t.setData({
        percent: t.data.percent,
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

  // 选择位置信息
  chooseLocation: function () {
    let t = this;
    wx.chooseLocation({
      success: function (res) {
        console.log('choose location:', res);
        let postcard = t.data.postcard;
        postcard.address = res.name;
        postcard.longitude = res.longitude;
        postcard.latitude = res.latitude;
        t.setData({
          postcard: t.data.postcard
        });
      },
      fail: function (res) {
        console.log('choose location fail:', res);
      }
    })
  },

  // 预览
  onPreview: function () {
    let t = this;
    let phone = this.data.postcard.receiverPhone || '';
    if (phone.search(phonePattern) < 0) {
      this.showToptip({
        title: '无效的手机号码',
        type: 'Warning'
      });
      return;
    }
    console.log('create:', t.data.postcard);
    let params = JSON.stringify(this.data.postcard);
    console.log('preview params:', params);
    wx.navigateTo({
      url: '../preview/preview?postcard=' + params + '&createType=' + t.data.postcard.cardType,
    });
  },

  onInputPhoneNum: function (objc) {
    let t = this;
    let value = objc.detail.value;
    let postcard = t.data.postcard;
    postcard.receiverPhone = value;
    t.setData({
      postcard: postcard
    });
    let ss = value.search(phonePattern);
    if (ss >= 0) {
      t.setData({
        enableSelect: true
      });
    } else {
      t.setData({
        enableSelect: false
      });
      if (value.length > 11) {
        t.showToptip({
          title: '无效的手机号码',
          type: 'Warning'
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '新的明信'
    });
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
    let postcard = t.data.postcard;
    postcard.id = options.id;
    postcard.cardType = options.createType;
    t.setData({
      invalidId: false,
      postcard: postcard
    });
    fetcher.getPreset({
      data: {
        postcardId: options.id,
        type: options.type
      },
      cb: function (res) {
        console.log('preset:', res);
        if (res.success) {
          let content = res.content;
          t.data.postcard.coverPicture = content.coverPicture;
          t.data.postcard.scenicSpot = content.scenicSpot;
          t.setData({
            postcard: t.data.postcard
          });
        } else {
          t.showToptip({
            title: '获取明信片预设信息失败',
            type: 'Warning'
          });
        }
      }
    });
    wx.showLoading({
      title: '定位中',
    });
    wx.getLocation({
      success: function(res) {
        t.data.postcard.latitude = res.latitude;
        t.data.postcard.longitude = res.longitude;
        t.data.postcard.longitudeLatitude = res.longitude + ',' + res.latitude;
        t.setData({
          postcard: t.data.postcard
        });
      },
      fail: function(res) {
        t.showToptip({
          title: '定位失败',
          type: 'Warning'
        });
      },
      complete: function(res) {
        wx.hideLoading();
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let t = this;
    let postcard = t.data.postcard;
    wx.authorize({
      scope: 'scope.record',
    });
    app.getUserInfo((res) => {
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