
let temps = {};

function playVoice(data) {
  if (temps[data.url]) {
    playLocalVoice({
      filePath: temps[data.url],
      cb: data.cb
    })
  } else {
    wx.downloadFile({
      url: data.url,
      success: function(res) {
        playLocalVoice({
          filePath: res.tempFilePath,
          cb: data.cb
        });
      },
      fail: function(res) {
        data.cb && data.cb(res);
      }
    })
  }
}

function playLocalVoice(data) {
  wx.playVoice({
    filePath: data.filePath,
    complete: function (res) {
      data.cb && data.cb(res);
    }
  });
}

module.exports = {
  playVoice: playVoice
};

