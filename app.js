//app.js
var util = require('utils/util.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    //util.setStorageUserInfo();
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: (errMsg) => {
          console.log(JSON.stringify(errMsg));
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              console.log(JSON.stringify(res));
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
            },
            fail: (res) => {
              console.log('getUserInfo error：' + JSON.stringify(res));
            }
          })
        },
        complete: () => {
          console.log('complete');
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    playSongInfo: null,
  }
})