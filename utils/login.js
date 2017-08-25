
let util = require('./util.js');

function localSession() {
  let sessionKey = wx.getStorageSync('third_sessionKey');
  return sessionKey;
}

function login(cb) {
  let third_sessionKey = localSession();
  if (util.isDef(third_sessionKey) && typeof third_sessionKey === 'string' && third_sessionKey.length > 0) {
    console.log('def', typeof third_sessionKey, third_sessionKey.length);
    wx.checkSession({
      success: function(res) {
        // 登录态未过期
        cb.success && cb.success(third_sessionKey);
      },
      fail: function(res) {
        doLogin({
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
    console.log('undef');
    doLogin({
      success: function (res) {
        cb.success && cb.success(res);
      },
      fail: function (res) {
        cb.fail && cb.fail(res);
      }
    });
  }
}

function doLogin(cb) {
  wx.login({
    success: function(res) {
      console.log('login succ:', res);
      requestThirdSessionKey({
        success: function(res) {
          cb.success && cb.success(res);
        },
        fail: function(res) {
          cb.fail && cb.fail(res);
        }
      })
    },
    fail: function(res) {
      console.log('login fail:', res);
      cb.fail && cb.fail(res);
    }
  })
}

function requestThirdSessionKey(cb) {
  cb.success && cb.success('');
}

module.exports = {
  login: login
};