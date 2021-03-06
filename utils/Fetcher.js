
let SparkMD5 = require('./spark-md5.js');

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

let SECRET = 'mingxin!@#$QWER1234';
function sign(data) {
  let signature = '';
  if (data && data !== 'undefined') {
    let allKeys = Object.keys(data);
    allKeys.sort();
    for (let idx in allKeys) {
      let key = allKeys[idx];
      signature += key + data[key];
    }
  }
  signature += SECRET;
  let zz = {
    zz: signature
  };
  signature = SparkMD5.hash(signature);
  return signature;
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
  setThirdSession: function (key) {
    Config.ThirdSession = key;
  },
  // 上传视频
  uploadVideo: function (data) {
    let url = Config.Host + 'uploadResource/';
    let formData = { type: 2 };
    Object.assign(formData, data.data);
    let signature = sign(formData);
    formData.signature = signature;
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

  // 上传音频
  uploadAudio: function (data) {
    let url = Config.Host + 'uploadResource/';
    let formData = { type: 3 };
    Object.assign(formData, data.data);
    let signature = sign(formData);
    formData.signature = signature;
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
    let params = data || {};
    // 签名
    let signature = sign(params);
    params.signature = signature;
    console.log('create params:', params);
    wx.request({
      url: url,
      data: params,
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

  getPreset: function(data) {
    let url = Config.Host + 'getPresetInfo';
    let params = data.data;
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      data: params,
      success: function(res) {
        data.cb && data.cb(Fit(res));
      },
      fail: function(res) {
        data.cb && data.cb(Fit(res));
      }
    })
  },

  // 获取明信片
  getPostcard: function (data) {
    console.log('get postcard:', data);
    let url = Config.Host + 'signForPostcard';
    let params = {
      postcardId: data.postcardId
    };
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        '3rd_session': Config.ThirdSession
      },
      data: params,
      success: function (res) {
        data.cb && data.cb(Fit(res));
      },
      fail: function (res) {
        data.cb && data.cb(Fit(res));
      }
    });
  },

  // 获取私密明信片(加密明信片，需传验证码)
  // postcardId, phone, verificationCode
  getPrivacyPostcard: function (data, cb) {
    let url = Config.Host + 'signForPostcardByVerifiCode';
    let params = data.data || {};
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      data: params,
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

  // 撤销明信片
  revocationPostcard: function (data) {
    let url = Config.Host + 'revocation';
    let params = {
      postcardId: data.data
    };
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      data: params,
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
  getSendList: function (data) {
    let url = Config.Host + 'getSendList';
    let params = data.data || {};
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      data: params,
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

  // 获取我收藏的
  getFavorList: function (data) {
    let url = Config.Host + 'getFavorList';
    let params = data.data || {};
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      data: params,
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
    let params = data.data || {};
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      data: params,
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
    let params = data.data || {};
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      data: params,
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
    })
  },

  // 收藏
  favor: function (data) {
    let url = Config.Host + 'favor';
    let params = data.data || {};
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      data: params,
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
    })
  },

  // 取消收藏
  cancelFavor: function (data) {
    let url = Config.Host + 'favor';
    let params = data.data || {};
    params.cancel = '1';
    // 签名
    let signature = sign(params);
    params.signature = signature;
    wx.request({
      url: url,
      data: params,
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
    })
  },

  checkSession: function (data) {
    let url = Config.Public + 'checkSession';
    let header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    let params = {};
    // 签名
    let signature = sign(params);
    params.signature = signature;
    Object.assign(header, data.data);
    wx.request({
      url: url,
      data: params,
      method: 'POST',
      header: header,
      success: function (res) {
        data.cb && data.cb(Fit(res));
      },
      fail: function (res) {
        data.cb && data.cb(Fit(res));
      }
    })
  }
}

module.exports = Api;