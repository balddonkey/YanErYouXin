// recorder.js
let config ={

  /**
   * 模块数据
   */
  data: {
    recorder_data: {
      text: null,
      timerId: null,
      timer: 0,
      recorder_button_style: {
        bottom: 100,
        cancel: false,
        cancelTrigger: 100
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

      this.animation = animation
    },
    startTimer: function () {
      let t = this;
      let data = t.data.recorder_data;
      data.timer = 0;
      t.stopTimer();
      data.timerId = setInterval(() => {
        let d = t.data.recorder_data;
        d.text = 'zzz';
        d.timer ++;
        t.setData({
          recorder_data: d
        });
      }, 1 * 1000);
      t.setData({
        recorder_data: data
      });
    },
    onRecord: function(start) {
      if (start) {
        let t = this;
        wx.startRecord({
          success: function(res) {
            let tempFilePath = res.tempFilePath;
            t.didRecordAudio(tempFilePath);
          },
          fail: function(res) {
            console.log('record failed:', res);
          }, 
          complete: function(res) {
            console.log('record complete');
          }
        })
      } else {
        wx.stopRecord();
      }
    },
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
      // console.log('start', obj);
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
      t.onRecord(true);
    },
    // 录音按钮移动回调
    recorder_tap_move: function (obj) {
      // console.log('move', obj);
      let t = this;
      let touch = obj.changedTouches[0];
      let data = t.data.recorder_data;
      let yChange = data.recorder_start_touch.clientY - touch.clientY;
      yChange = yChange > 30 ? yChange : 0;
      let bottom = data.recorder_button_style.bottom + yChange;
      bottom = Math.max(bottom, data.recorder_button_style.bottom);
      t.recorder_button_animator((d) => {
        d.recorder_button_style.cancel = yChange > d.recorder_button_style.cancelTrigger ? true : false;
        t.animation.bottom(bottom).step({duration: 0});
        return t.animation.export();
      });
    },
    // 录音按钮结束点击回调
    recorder_tap_end: function (obj) {
      // console.log('end', obj);
      let t = this;
      t.recorder_button_animator((d) => {
        d.recorder_button_style.cancel = false;
        t.animation.bottom(d.recorder_button_style.bottom).scale(1).step({ duration: 0.25 * 1000 })
        return t.animation.export();
      });
      t.stopTimer();
      t.onRecord(false);
    },
    // 录音按钮取消点击回调
    recorder_tap_cancel: function (obj) {
      // console.log('cancel', obj);
      let t = this;
      t.recorder_button_animator((d) => {
        d.recorder_button_style.cancel = false;
        t.animation.bottom(data.recorder_button_style.bottom).scale(1).step({ duration: 0.25 * 1000})
        return t.animation.export();
      });
      t.stopTimer();
      t.onRecord(false);
    }
  }
}

module.exports = config;