// xincell.js

let mh = require('../../utils/MediaHelper.js');

// cellType: 0: 显示接受者, 1: 发送者
// collect: 0: 不在收藏页, 1: 在收藏页

let systemInfo = wx.getSystemInfoSync();

let XinCellConfig = {
  data: {
    xincell_data: {
      collect: 0,
      windowWidth: systemInfo.windowWidth,
      windowHeight: systemInfo.windowHeight,
      showReceiveStatus: true,
      host: 'https://www.streamind.com',
      percent: 0
    }

    // data sample
    // sample: {
    //   id: 1,
    //   poster: {
    //     nickName: '日狗少年史二彪',
    //     avatarUrl: urlString
    //   },
    //   time: util.formatTime(new Date()),
    //   location: {
    //     name: "高高的骨灰旁边"
    //   }
    // }
  },

  delegate: {
    // 点击明信片右上角省略号按钮
    editPostcard: function(postcard, idx){},

    playAudio: function(idx, time) {},

    onShowLocation: function (postcard, idx) {}
  },

  functions: {
    // 
    onEdit: function (e) {
      let postcard = e.target.dataset.postcard;
      let index = e.target.dataset.index;
      this.editPostcard && this.editPostcard(e.target.dataset.postcard, index);
    },

    showLocation: function(e) {
      let postcard = e.target.dataset.postcard;
      let index = e.target.dataset.index;
      this.onShowLocation && this.onShowLocation(e.target.dataset.postcard, index);
    },

    tapVoice: function (e) {
      let t = this;
      let data = t.data.xincell_data;
      let postcard = e.currentTarget.dataset.postcard;
      let audio = postcard.resource.path;
      let index = e.currentTarget.dataset.index;
      let url = audio;
      mh.playVoice({
        url: url,
        willStart: function() {
          typeof t.playAudio == 'function' && t.playAudio(index, postcard.resource.duration);
        },
        cb: function(res) {
          console.log('play:', res);
        }
      });
    }
  }
};

module.exports = XinCellConfig;