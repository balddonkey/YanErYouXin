
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

        checkThirdSessionKey({
          data: {
            '3rd_session': third_sessionKey
          },
          sessionKey: third_sessionKey,
          userdata: cb.userdata,
          success: cb.success,
          fail: cb.fail
        });
      },
      fail: function(res) {
        doLogin({
          userdata: cb.userdata,
          success: cb.success,
          fail: cb.fail
        });
      }
    })
  } else {
    doLogin({
      userdata: cb.userdata,
      success: cb.success,
      fail: cb.fail
    });
  }
}

function doLogin(data) {
  let userdata = data.userdata;
  wx.login({
    success: function(res) {
      console.log('wx.login:', res);
      // return;
      requestThirdSessionKey({
        data: {
          code: res.code,
          nick: userdata.nickName,
          avatarUrl: userdata.avatarUrl 
        },
        success: data.success,
        fail: data.fail
      })
    },
    fail: data.fail
  })
}

function checkThirdSessionKey(data) {
  console.log('checkThirdSessionKey:', data);
  fetcher.checkSession({
    data: data.data,
    cb: function(res) {
      console.log('checkThirdSessionKey result:', res);
      if (res.success) {
        console.log('未过期', data.sessionKey);
        fetcher.setThirdSession(data.sessionKey);
        data.success && data.success(data.sessionKey);
      } else {

        doLogin({
          userdata: data.userdata,
          success: data.success,
          fail: data.fail
        });
      }
    }
  })
}

function requestThirdSessionKey(data) {
  console.log('rtsk:', data);
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