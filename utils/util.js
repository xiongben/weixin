var config = require('config.js');
var Q=require('../templates/q.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function setStorageUserInfo(){
  Q.when(getUserInfo()).then(function(res){
    // let userInfo = config.storageKeys.userInfo;
    res=JSON.stringify(res);
    wx.setStorageSync('userInfo', res);
    
  })
}

function request(url, params) {
  if (params.withToken) {
    let userInfo=wx.getStorageSync('userInfo');
    userInfo=JSON.parse(userInfo);
    params.data = params.data || {};
    if (userInfo.id !="" && userInfo.token !="") {
      params.data.uid = userInfo.id;
      params.data.token = userInfo.token;
    }
  }
  if (params && params.data) {
    for (var i in params.data) {
      if (params.data[i] == null) {
        delete params.data[i];
      }
    }
  }
  return wx.request({
    header: {
      'Accept': 'application/json, text/plain',
      'content-type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    url: String(url).indexOf('//') > -1 ? url : ((config.debug ? config.tapi : config.api) + url),
    method: params && params.method ? params.method : 'GET',
    data: params && params.data,
    success: params && params.success,
    fail: params && params.fail,
    complete: params && params.complete
  });
}

function trim(oldValue) {
  return String(oldValue).replace(/\s/g, '');
}

function showError(title, params) {
  wx.showToast({
    title: title,
    mask: params && params.mask ? params.mask : true,
    image: '/static/images/fail.png',
    duration: params && params.duration ? params.duration : 2000
  })
}

function showSuccess(title, params) {
  wx.showToast({
    title: title,
    mask: params && params.mask ? params.mask : true,
    image: '/static/images/success.png',
    duration: params && params.duration ? params.duration : 2000
  })
}

function showLoading(title, params) {
  wx.showLoading({
    title: title || '请稍后...',
    mask: params && params.mask ? params.mask : true,
    success: params && params.success,
    fail: params && params.fail,
    complete: params && params.complete
  });
}

function hideLoading() {
  wx.hideLoading();
}

function md5(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }

  function F(x, y, z) { return (x & y) | ((~x) & z); }
  function G(x, y, z) { return (x & z) | (y & (~z)); }
  function H(x, y, z) { return (x ^ y ^ z); }
  function I(x, y, z) { return (y ^ (x | (~z))); }

  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  function WordToHex(lValue) {
    var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  };

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  };

  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }

  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  return temp.toLowerCase();
}

function showLogin(callbackurl) {
  wx.navigateTo({
    url: '/pages/user/login?callbackurl=' + callbackurl
  });
}

function redirectWithUserAuth(callbackurl, open, clearUserAuth) {
  if (clearUserAuth) {
    wx.removeStorageSync(config.storageKeys.userInfo);
  }
  var userInfo = getUserInfo();
  if (userInfo.uid && userInfo.token && !clearUserAuth) {
    if (open) {
      wx.navigateTo({
        url: callbackurl
      });
    }
    else {
      wx.redirectTo({
        url: callbackurl
      });
    }
  }
  else {
    callbackurl = encodeURIComponent(callbackurl);
    if (open) {
      wx.navigateTo({
        url: '/pages/user/login?callbackurl=' + callbackurl
      });
    }
    else {
      wx.redirectTo({
        url: '/pages/user/login?callbackurl=' + callbackurl
      });
    }
  }
}

function chooseCity(callbackurl) {
  wx.navigateTo({
    url: '/pages/common/chooseCity?callbackurl=' + callbackurl
  });
}

// function getUserInfo() {
//   return wx.getStorageSync(config.storageKeys.userInfo);
// }



function getUserInfo() {
  var dtd = Q.defer();
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log(res.code);
        request('/program/pro_user/get_open_id', {
          method: 'POST',
          data: {
            code: res.code,
          },
          success: function (res) {
            res = res.data;
            console.log(res);
            let openid=res.data.openid;
            if (res.ret == 0) {
              wx.getUserInfo({
                success: function (res) {
                  request('/program/pro_user/login', {
                    method: 'POST',
                    data: {
                      encryptedData: res.encryptedData,
                      iv:res.iv,
                      openid:openid
                    },
                    success: function (res,userinfofn) {
                      res = res.data;
                      console.log(res);
                      if (res.ret == 0) {
                        let userInfo={
                          id:res.data.id,
                          token:res.data.token
                        }
                        dtd.resolve(userInfo);
                      }
                      else {
                        util.showError(res.msg);
                      }
                    }.bind(this),
                    fail: function () {
                      util.showError(res.msg);
                    }
                  })
                }
              })
            }
          }.bind(this),
        })
      }
    }
  });
  return dtd.promise;
}

function getUserDetailInfo() {
  return wx.getStorageSync(config.storageKeys.userDetailInfo);
}

function getPositionCity() {
  return wx.getStorageSync(config.storageKeys.cityInfo) || '全国';
}

/**
 * 在对象中查找值
 * @param {value} value 需要查找的值
 * @param {object} obj 对象
 * @param {field} field 查找对象属性的值
 * @param {boolean} strict 是否开启严格模式
 * @param {boolean} all 是否查找全部，为false查找一个结果就返回
 * @returns {Array}
 */
function objectSearch(value, obj, field, strict, all) {
  var tmp, arr = [];
  if (Object.prototype.toString.call(obj) === '[object Object]') return null;
  for (var i in obj) {
    tmp = (field ? obj[i][field] && (strict ? obj[i][field] === value : obj[i][field] == value) :
      (strict ? obj[i] === value : obj[i] == value)) ? obj[i] : null;
    if (!all && tmp) return tmp;
    arr.push(tmp);
  }
  return arr;
};

function getParam(n, t) {
  var i = new RegExp('(?:^|\\?|#|&)' + n + '=([^&#]*)(?:$|&|#)', 'i'),
    o = i.exec(t || location.href);
  return o ? decodeURIComponent(o[1]) : '';
};

//微信支付
function WXPay(totalPrice, orderID, transferId) {
  this.totalPrice = totalPrice;
  this.orderID = orderID;
  this.transferId = transferId || false;
}
WXPay.prototype.done = function (callback) {
  var totalPrice = this.totalPrice,
    orderID = this.orderID,
    transferId = this.transferId,
    data = {
      money: totalPrice,
      isApplet: 1
    },
    url = '/app2/pay/';
  if (transferId) {
    url += 'pay_for_guarantee_html';
    data.transferId = transferId;
  }
  else {
    url += 'pay_for_order_html';
    data.orderId = orderID;
  }
  function generateWXPayOrder(openId) {
    data.openId = openId;
    request(url, {
      withToken: true,
      data: data,
      method: 'POST',
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          var payInfo = res.data.payInfo;
          wx.requestPayment({
            'timeStamp': payInfo.timeStamp,
            'nonceStr': payInfo.nonceStr,
            'package': payInfo.package,
            'signType': payInfo.signType,
            'paySign': payInfo.sign,
            'success': function (res) {
              if (typeof callback == 'function') {
                callback({
                  flag: 'success',
                  res: res
                });
              }
            },
            'fail': function (res) {
              if (typeof callback == 'function') {
                callback({
                  flag: 'fail',
                  res: res
                });
              }
            },
            'complete': function (res) {
              if (config.debug) {
                console.log('weixin pay complete：' + res);
              }
            }
          })
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this),
      fail: function () {
        util.showError('提交订单失败，请稍后重试');
      }
    })
  };
  wx.login({
    success: function (res) {
      if (res.code) {
        request('/app2/user/get_applet_openid', {
          method: 'POST',
          data: {
            code: res.code,
            isPay: 1
          },
          success: function (res) {
            res = res.data;
            if (res.ret == 0) {
              generateWXPayOrder(res.data.openid);
            }
            else {
              util.showError(res.errmsg);
            }
          }.bind(this),
          fail: function () {
            util.showError('提交订单失败，请稍后重试');
          }
        })
      } else {
        util.showError('获取用户登录态失败！' + res.errMsg)
      }
    }.bind(this)
  });
};

Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
};

String.prototype.printf = function () {
  var i = 0,
    str = this,
    args = Array.prototype.slice.call(arguments);

  if (args[0] instanceof Array) {
    args = args[0];
  }

  return str.replace(/%s/g, function (m) {
    return args[i] === undefined ? m : (i++ , args[i - 1]);
  });
};

//格式化时间，将秒数转为0:00格式
var formate = n => {
  var minute = Math.floor(n / 60);
  var seconds = Math.ceil(n % 60);
  seconds = seconds.toString();
  seconds = seconds[1] ? seconds : '0' + seconds;
  return minute + ':' + seconds;
}
//将时间字符串转为秒数
var timeToSeconds = time => {
  var arr = time.split(':');
  return parseInt(arr[0]) * 60 + parseFloat(arr[1])
}

function sharefn(id){
     request('/program/pro_list/add_share_score', {
        withToken: true,
        method: 'POST',
        data: {
          songInfoId: id
        },
        success: function (res) {
          if (res.ret == 0) {
            console.log("分享成功");
          }
          else {
            wx.showToast(res.msg);
          }
        }
      })
}

function getBackMusic(page){
  if (backTime){
    clearInterval(backTime);
  }
  let backTime = setInterval(function () {
    lookBackMusicStatus(page);
  }, 5000);
  // lookBackMusicStatus(page);
}

function lookBackMusicStatus(page){
  wx.getBackgroundAudioPlayerState({
    success: function (res) {
      // console.log("后台有音乐哦");
      var status = res.status;
      var dataUrl = res.dataUrl;
      var duration = res.duration;
      var downloadPercent = res.downloadPercent;
      // console.log(res);
      let playSongInfo = wx.getStorageSync('playSongInfo');
      playSongInfo = JSON.parse(playSongInfo);
      // let playSongInfo = getApp().globalData.playSongInfo;
      page.setData({
        src: dataUrl,
        name: playSongInfo.name,
        singer: playSongInfo.singer,
        cover: playSongInfo.cover
      });
      if (status == 2) {
        page.setData({
          status: status,
          haveBackMusic: false,
        });
      } else {
        page.setData({
          status: status,
          haveBackMusic: true,
        });
      }
    }
  })
}
//图片裁剪
function calcCenterImg(s, rw, rh, v) {
  var width = wx.getSystemInfoSync().windowWidth;
  if (width > 540) { // 最大宽度
    width = 540;
  }
  var rem = width / 3.75; // iPhone6比例  
  if (String(s).indexOf('imageView2') > -1) {
    return s;
  }
  var w = 3.75;
  if (rw === '100%') {
    rw = w;
  }
  if (rh === '100%') {
    rh = w;
  }

  rw = ~~(rw * rem);
  rh = ~~(rh * rem);

  s += '?imageView2/' + (v || 1);

  if (rw) {
    s += '/w/%s'.printf(rw);
  }
  if (rh) {
    s += '/h/%s'.printf(rh);
  }
  return s;
};
module.exports = {
  request: request,
  trim: trim,
  showError: showError,
  showSuccess: showSuccess,
  showLoading: showLoading,
  hideLoading: hideLoading,
  md5: md5,
  showLogin: showLogin,
  getUserInfo: getUserInfo,
  getUserDetailInfo: getUserDetailInfo,
  chooseCity: chooseCity,
  getPositionCity: getPositionCity,
  redirectWithUserAuth: redirectWithUserAuth,
  objectSearch: objectSearch,
  formatTime: formatTime,
  getParam: getParam,
  WXPay: WXPay,
  formate: formate,
  timeToSeconds: timeToSeconds,
  setStorageUserInfo: setStorageUserInfo,
  sharefn: sharefn,
  getBackMusic: getBackMusic,
  calcCenterImg: calcCenterImg
}
