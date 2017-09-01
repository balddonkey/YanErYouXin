// xincell.js

let mh = require('../../utils/MediaHelper.js');
let XinCellConfig = {
  data: {
    xincell_data: {
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
    editPostcard: function(postcard){},

    playAudio: function(idx, time) {}
  },

  functions: {
    // 
    onEdit: function (e) {
      let postcard = e.target.dataset.postcard;
      let index = e.target.dataset.index;
      this.editPostcard && this.editPostcard(e.target.dataset.postcard, index);
    },

    tapVoice: function (e) {
      let t = this;
      let data = t.data.xincell_data;
      let postcard = e.currentTarget.dataset.postcard;
      let audio = postcard.audio;
      let index = e.currentTarget.dataset.index;
      let url = audio;
      mh.playVoice({
        url: url,
        cb: function(res) {
          console.log('play:', res);
          typeof t.playAudio == 'function' && t.playAudio(index, 40);
        }
      });
    }
  }
};

module.exports = XinCellConfig;