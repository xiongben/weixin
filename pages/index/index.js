//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  //事件处理函数

  onLoad: function () {
    // console.log('onLoad')
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    this.getRecommendInfo("recommendSong");
  },
  recommendSheet:function(){
    let id="1";
    wx.navigateTo({ url: '/pages/list/songDetails?id=' + id });
  },
  searchMusic:function(){
    let id = "1";
    wx.navigateTo({ url: '/pages/index/selectPage?id=' + id });
  },
  getRecommendInfo:function(type){
    let typeArr={
      recommendSong:"recommend_song_list",
      newSong:"new_start_song_list",
      recommendList:"recommend_song_list"
    };
    let url ='/program/pro_song/'+typeArr[type];
    util.request(url, {
      withToken: false,
      method: 'GET',
      data: {
        start: 0,
        limit: 5,
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          
          
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },

})
