// recorder.js

let util = require('../../utils/util.js');

let config ={

  /**
   * 模块数据
   */
  data: {
    recorder_data: {
      text: null,
      timerId: null,
      timer: 0,
      timerStr: null,
      onComplete: false,
      recorder_button_style: {
        left: -32,
        bottom: 100,
        cancel: false,
        cancelTrigger: 250
      },
      recorder_button_animation: {},
      recorder_start_touch: null
    }
  },

  // 代理方法
  delegate: {
    didRecordAudio: function(fp) {
      // 需要使用此组件的page实现
    },
    didCancelRecord: function() {
      
    }
  },

  /**
   * 模块方法
   */
  functions: {
    recorder_init: function() {
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'liner',
      })

      this.animation = animation;
      let systemInfo = wx.getSystemInfoSync();

      let d = this.data.recorder_data;
      d.windowHeight = systemInfo.windowHeight;
      d.windowWidth = systemInfo.windowWidth;
      this.setData({
        recorder_data: d
      });
      console.log('window:', d.windowHeight, d.windowWidth);
    },
    onClose: function() {
      this.recordClose && this.recordClose();
    },
    recordStart: function() {
      let t = this;
      let d = t.data.recorder_data;
      d.complete = false;
      t.setData({
        recorder_data: d
      });
      wx.startRecord({
        success: function(res) {
          t.onRecordDone(res);
        },
        fail: function(res) {
          t.showToptip({
            title: '录音失败',
            type: 'Warning'
          });
          t.recordCancel();
          t.didCancelRecord && t.didCancelRecord();
          d.timer = 0;
          d.timerStr = null;
        }
      })
    },
    onRecordDone: function (res) {
      let t = this;
      let d = t.data.recorder_data;
      d.complete && t.didRecordAudio(res.tempFilePath, d.timer);
      d.timer = 0;
      d.timerStr = null;
      t.onClose();
    },
    recordStop: function() {
      let t = this;
      let d = t.data.recorder_data;
      d.complete = true;
      t.setData({
        recorder_data: d
      });
      wx.stopRecord();
    },
    recordCancel: function() {
      let t = this;
      let d = t.data.recorder_data;
      d.complete = false;
      t.setData({
        recorder_data: d
      });
      wx.stopRecord();
    },
    // 计时器开始
    startTimer: function () {
      let t = this;
      let data = t.data.recorder_data;
      data.timer = 0;
      data.timerStr = null;
      t.stopTimer();
      data.timerId = setInterval(() => {
        let d = t.data.recorder_data;
        d.text = 'zzz';
        d.timer += util.recordTimeInterval;
        d.timerStr = d.timer.toFixed(1);
        t.setData({
          recorder_data: d
        });
      }, util.recordTimeInterval * 1000);
      t.setData({
        recorder_data: data
      });
    },
    // 计时器关闭
    stopTimer: function() {
      let t = this;
      let data = t.data.recorder_data;
      if (!!data.timerId) {
        clearInterval(data.timerId);
        data.timerId = null;
        t.setData({
          recorder_data: data
        })
      }
    },
    recorder_button_animator: function(ani) {

      let t = this;
      let data = t.data.recorder_data;
      data.recorder_button_animation = ani(data);
      t.setData({
        recorder_data: data
      })
    },
    recorder_tap: function () {
      
    },
    // 录音按钮按下回调
    recorder_tap_start: function (obj) {
      let t = this;
      t.recorder_button_animator(() => {
        t.animation.scale(1.2).step({duration: 0.25 * 1000})
        return t.animation.export();
      });
      let data = t.data.recorder_data;
      let touch = obj.changedTouches[0];
      data.recorder_start_touch = obj.changedTouches[0];
      t.setData({
        recorder_data: data
      });
      t.startTimer();
      t.recordStart();
    },
    // 录音按钮移动回调
    recorder_tap_move: function (obj) {
      let t = this;
      let touch = obj.changedTouches[0];
      let data = t.data.recorder_data;
      let yChange = data.recorder_start_touch.clientY - touch.clientY;
      let xChange = data.recorder_start_touch.clientX - touch.clientX;
      // yChange = yChange > 30 ? yChange : 0;
      let bottom = data.recorder_button_style.bottom + yChange;
      // bottom = Math.max(bottom, data.recorder_button_style.bottom);
      let left = (data.windowWidth / 2) - xChange;
      console.log('x change:', xChange, ' left:', left);
      t.recorder_button_animator((d) => {
        d.recorder_button_style.cancel = yChange > d.recorder_button_style.cancelTrigger ? true : false;
        t.animation.bottom(bottom).left(left).step({duration: 0});
        return t.animation.export();
      });
    },
    // 录音按钮结束点击回调
    recorder_tap_end: function (obj) {
      let t = this;
      let data = t.data.recorder_data;

      t.stopTimer();
      if (data.recorder_button_style.cancel) {
        t.recordCancel();
      } else {
        t.recordStop();
      }

      // Reset Recorder Button
      let left = (data.windowWidth / 2);
      t.recorder_button_animator((d) => {
        d.recorder_button_style.cancel = false;
        t.animation.bottom(d.recorder_button_style.bottom).left(left).scale(1).step({ duration: 0.25 * 1000 })
        return t.animation.export();
      });
    },
    // 录音按钮取消点击回调
    recorder_tap_cancel: function (obj) {
      let t = this;
      t.recorder_button_animator((d) => {
        d.recorder_button_style.cancel = false;
        t.animation.bottom(data.recorder_button_style.bottom).scale(1).step({ duration: 0.25 * 1000})
        return t.animation.export();
      });
      t.stopTimer();
      t.recordCancel();
    }
  }
}

module.exports = config;