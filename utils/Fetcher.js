
let ReqErr = {
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

let Host = 'https://www.streamind.com/postCard/';
let Method = 'POST';

let preprocessor = (res, additional) => {
  if (additional) {
    additional(res);
  }
  console.log('zzz:', res);
  let code = res.statusCode;
  let reqErr = ReqErr[code];
  if (reqErr) {
    res.data = {
      code: code,
      msg: reqErr.msg
    };
  }
  let json = JSON.parse(res.data);
  if (additional) {
    additional(json);
  }
  return JSON.parse(res.data);
}

let Fit = (res, additional) => {
  res = preprocessor(res, additional);
  console.log('res:', typeof res);
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
  if (additional) {
    additional(res);
  }
  return ret;
};

let Api = {
  // 上传视频
  uploadVideo: function (filePath, data, cb) {
    let url = Host + 'uploadResource/';
    let formData = { type: 2 };
    Object.assign(formData, data);
    wx.uploadFile({
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
  uploadAudio: function (filePath, data, cb, additional) {
    let url = Host + 'uploadResource/';
    let formData = { type: 3 };
    Object.assign(formData, data);
    wx.uploadFile({
      url: url,
      type: 'mp3',
      filePath: filePath,
      name: 'file',
      formData: formData,
      success: function (res) {
        cb(Fit(res, additional));
      },
      fail: function (res) {
        cb(Fit(res, additional));
      }
    });
  },
  // 创建明信片
  create: function (data, cb) {
    let url = Host + 'editPostcardInfo';
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      success: function (res) {
        cb(Fit(res));
      },
      fail: function (res) {
        cb(Fit(res));
      }
    });
  },

  // 获取明信片
  getPostcard: function (data, cb) {
    let url = Host + 'getPostcard';
    wx.request({
      url: url,
      data: {
        postcardId: data
      },
      success: function (res) {
        cb(Fit(res));
      },
      fail: function (res) {
        cb(Fit(res));
      }
    });
  },

  // 获取私密明信片(加密明信片，需传验证码)
  getPrivacyPostcard: function (data, cb) {
    let url = Host + 'getPostcardByVerifiCode';
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      success: function (res) {
        cb(Fit(res));
      },
      fail: function (res) {
        cb(Fit(res));
      }
    });
  },

  // 撤销明信片
  revocationPostcard: function (data, cb) {
    let url = Host + 'revocation';
    wx.request({
      url: url,
      data: {
        postcardId: data
      },
      method: 'POST',
      success: function (res) {
        cb(Fit(res));
      },
      fail: function (res) {
        cb(Fit(res));
      }
    });
  }
}

module.exports = Api;