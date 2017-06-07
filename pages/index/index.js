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
    duration: 1000,
    resultArr:{},
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
    this.getRecommendInfo("newSong");
    this.getRecommendInfo("recommendSong");
    this.getRecommendInfo("recommendList");
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
      recommendSong:"pro_song_info/recommend_song_list",
      newSong:"pro_song_info/new_start_song_list",
      recommendList:"pro_song/recommend_song_list"
    };
    let url ='/program/'+typeArr[type];
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
          let resArr=this.data.resultArr;
          resArr[type]=res.data;
          this.setData({
            resultArr:resArr,
          })
          console.log(this.data.resultArr);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },

})
