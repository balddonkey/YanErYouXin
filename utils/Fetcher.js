
let ReqErr = {
  400: {
    msg: '请求失败，可能是服务器发生了错误'
  },
  404: {
    msg: 'Not Found'
  },
  405: {
    msg: 'Method Not Allowed'
  },
  msg: function (code) {
    let msg = this[code] || '未知错误';
    return msg;
  }
}

let RepErr = {
  10004: {
    msg: '明信片id错误'
  },
  10005: {
    msg: '明信片被撤回'
  },
  10006: {
    msg: '没有权限查看该明信片'
  },
  10007: {
    msg: '需要通过验证码查看明信片'
  },
  10008: {
    msg: '该明信片未创建'
  },
  40001: {
    msg: '参数格式错误'
  },
  40003: {
    msg: '非法操作'
  },
  50001: {
    msg: '文件类型不合法'
  },
  50002: {
    msg: '文件大小超过限制'
  },
  msg: function (code) {
    let msg = this[code] || '未知错误';
    return msg;
  }
}

let Config = {
  Host: 'https://www.streamind.com/postCard/',
  Public: 'https://www.streamind.com/public/',
  ThirdSession: null
}

let preprocessor = (res) => {
  let code = res.statusCode;
  let reqErr = ReqErr[code];
  if (reqErr) {
    res.data = {
      code: code,
      msg: reqErr.msg
    };
  }
  if (typeof res.data === 'string') {
    try {
      res.data = JSON.parse(res.data);
    } catch (e) {
      console.log('Is Not JSON');
    }
  }
  // let json = JSON.parse(res.data);

  return res.data;
}

let Fit = (res) => {
  res = preprocessor(res);
  let ret = {
    success: res.code == 0,
    content: res.obj,
    code: res.code,
    msg: res.msg,
    error: res.code == 0 ? null
      : {
        errcode: res.code,
        message: res.msg
      }
  };
  return ret;
};

let Api = {
  thirdSession: null,
  setThirdSession: function(key) {
    Config.ThirdSession = key;
  },
  // 上传视频
  uploadVideo: function (filePath, data, cb) {
    let url = Config.Host + 'uploadResource/';
    let formData = { type: 2 };
    Object.assign(formData, data);
    wx.uploadFile({
      header: {
        '3rd_session': Config.ThirdSession
      },
      url: url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      success: function (res) {
        cb(Fit(res));
      },
      fail: function (res) {
        cb(Fit(res));
      }
    });
  },

  // 上传音频
  uploadAudio: function (data) {
    let url = Config.Host + 'uploadResource/';
    let formData = { type: 3, postcardId: data.postcardId };
    wx.uploadFile({
      header: {
        '3rd_session': Config.ThirdSession
      },
      url: url,
      filePath: data.filePath,
      name: 'file',
      formData: formData,
      success: function (res) {
        data.cb && data.cb(Fit(res));
      },
      fail: function (res) {
        data.cb && data.cb(Fit(res));
      }
    });
  },
  // 创建明信片
  create: function (data, cb) {
    let url = Config.Host + 'editPostcardInfo';
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      success: function (res) {
        cb(Fit(res));
      },
      fail: function (res) {
        cb(Fit(res));
      }
    });
  },

  // 获取明信片
  getPostcard: function (data) {
    let url = Config.Host + 'getPostcard';
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      data: {
        postcardId: data.postcardId
      },
      success: function (res) {
        data.cb && data.cb(Fit(res));
      },
      fail: function (res) {
        data.cb && data.cb(Fit(res));
      }
    });
  },

  // 获取私密明信片(加密明信片，需传验证码)
  getPrivacyPostcard: function (data, cb) {
    let url = Config.Host + 'getPostcardByVerifiCode';
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      success: function (res) {
        cb(Fit(res));
      },
      fail: function (res) {
        cb(Fit(res));
      }
    });
  },

  // 撤销明信片
  revocationPostcard: function (data) {
    let url = Config.Host + 'revocation';
    wx.request({
      url: url,
      data: {
        postcardId: data.data
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      success: function (res) {
        data.cb && data.cb(Fit(res));
      },
      fail: function (res) {
        data.cb && data.cb(Fit(res));
      }
    });
  },

  // 获取我发送的
  getSendList: function(data) {
    let url = Config.Host + 'getSendList';
    wx.request({
      url: url,
      data: data.data,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      success: function(res) {
        data.cb(Fit(res));
      },
      fail: function(res) {
        data.cb(Fit(res));
      }
    })
  },

  // 获取我收藏的
  getFavorList: function (data) {
    let url = Config.Host + 'getFavorList';
    wx.request({
      url: url,
      data: data.data,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      success: function (res) {
        data.cb(Fit(res));
      },
      fail: function (res) {
        data.cb(Fit(res));
      }
    })
  },

  // 登录
  doLogin: function (data) {
    let url = Config.Public + 'login';
    console.log('dl:', data);
    wx.request({
      url: url,
      data: data.data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        data.cb(Fit(res));
      },
      fail: function (res) {
        data.cb(Fit(res));
      }
    })
  },

  // 发送短信
  sendSms: function (data) {
    let url = Config.Host + 'sendSms';
    wx.request({
      url: url,
      data: data.data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      success: function (res) {
        data.cb(Fit(res));
      },
      fail: function (res) {
        data.cb(Fit(res));
      }
    })
  }
}

module.exports = Api;