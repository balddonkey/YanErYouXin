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
    postcard: {
      poster: null,
      recevierPhone: null,
      id: null,
      audio: null,
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
        fetcher.uploadVideo(res.tempFilePath, {
          postcardId: t.data.postcard.id
        }, (res) => {
          if (res.code == 0) {
            t.data.postcard.video = res.content.path;
            t.setData({
              postcard: t.data.postcard
            });
          }
          wx.hideLoading();
        });
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

  didRecordAudio: function (fp) {
    let t = this;
    t.setData({
      create: true
    });
    wx.showLoading({
      title: '音频上传中',
      mask: true
    })
    fetcher.uploadAudio({
      filePath: fp,
      postcardId: t.data.postcard.id,
      cb: function (res) {
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

  tapVoice: function () {
    let t = this;
    mh.playVoice({
      url: t.data.postcard.audio,
      cb: function (res) {
        console.log(res);
      }
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}

Object.assign(CreateInitial, recorder.functions);
Object.assign(CreateInitial.data, recorder.data);

Object.assign(CreateInitial, TopTip.functions);
Object.assign(CreateInitial.data, TopTip.data);

Page(CreateInitial);