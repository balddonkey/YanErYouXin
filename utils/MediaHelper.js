
let temps = {};

function playVoice(data) {
  // 添加开始播放回调
  console.log('warning:', '添加开始播放回调');
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
          willStart: data.willStart,
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
  console.log('will start play');
  data.willStart && data.willStart();
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

