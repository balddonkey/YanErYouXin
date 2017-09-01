
let util = require('./util.js');
let fetcher = require('./Fetcher.js');
function localSession() {
  let sessionKey = wx.getStorageSync('third_sessionKey');
  return sessionKey;
}

function login(cb) {
  let third_sessionKey = localSession();
  if (util.isDef(third_sessionKey) && typeof third_sessionKey === 'string' && third_sessionKey.length > 0) {
    wx.checkSession({
      success: function(res) {
        // 登录态未过期
        console.log('未过期', third_sessionKey);
        fetcher.setThirdSession(third_sessionKey);
        cb.success && cb.success(third_sessionKey);
      },
      fail: function(res) {
        doLogin({
          userdata: cb.userdata,
          success: function(res) {
            cb.success && cb.success(res);
          },
          fail: function(res) {
            cb.fail && cb.fail(res);
          }
        });
      }
    })
  } else {
    doLogin({
      userdata: cb.userdata,
      success: function (res) {
        cb.success && cb.success(res);
      },
      fail: function (res) {
        cb.fail && cb.fail(res);
      }
    });
  }
}

function doLogin(data) {
  let userdata = data.userdata;
  wx.login({
    success: function(res) {
      console.log('wx.login:', res);
      requestThirdSessionKey({
        data: {
          code: res.code,
          nick: userdata.nickName,
          avatarUrl: userdata.avatarUrl 
        },
        success: function(res) {
          data.success && data.success(res);
        },
        fail: function(res) {
          data.fail && data.fail(res);
        }
      })
    },
    fail: function(res) {
      data.fail && data.fail(res);
    }
  })
}

function requestThirdSessionKey(data) {
  fetcher.doLogin({
    data: data.data,
    cb: function(res) {
      let sessionId = res.content.sessionId;
      console.log('sid:', res);
      fetcher.setThirdSession(sessionId);
      wx.setStorageSync('third_sessionKey', sessionId);
      res.success ? data.success && data.success(sessionId) : data.fail && data.fail(res);
    }
  })
}

module.exports = {
  login: login
};