// xincell.js

let mh = require('../../utils/MediaHelper.js');
let XinCellConfig = {
  data: {
    xincell_data: {
      host: 'https://www.streamind.com'
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
    editPostcard: function(postcard){}
  },

  functions: {
    // 
    onEdit: function (e) {
      console.log(e);
      this.editPostcard && this.editPostcard(e.target.dataset.postcard);
    },

    tapVoice: function (e) {
      console.log('tap voice', e);
      let t = this;
      let data = t.data.xincell_data;
      let audio = e.currentTarget.dataset.audio;
      let url = audio;
      console.log('uu:', url);
      mh.playVoice({
        url: url,
        cb: function(res) {
          console.log('play:', res);
        }
      });
    }
  }
};

module.exports = XinCellConfig;