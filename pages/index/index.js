//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    resultArr: {},
  },
  //事件处理函数

  onLoad: function () {
    wx.showLoading({
      title: '正在加载',
    });
    this.getBannerImg();
    this.getRecommendInfo("newSong");
    this.getRecommendInfo("recommendSong");
    this.getRecommendInfo("recommendList");
    // let userInfo=util.getUserInfo();
    // console.log(userInfo);
    // util.test();
    util.setStorageUserInfo();
    
  },
  onShow: function () {
    util.getBackMusic(this);
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    let that = this;
    this.setData({
      shareIcon: false,
    })
    return {
      title: '打榜歌曲',
      path: '/pages/audioPlayer/audioPlay?id=' + this.data.shareSongId,
      success: function (res) {
        console.log("分享成功");
        util.sharefn(that.data.shareSongId);
      },
      fail: function (res) {
        wx.showToast({
          title: '打榜失败',
        });
      }
    }
  },
  searchMusic: function () {
    let id = "1";
    wx.navigateTo({ url: '/pages/index/selectPage?id=' + id });
  },
  getRecommendInfo: function (type) {
    let typeArr = {
      recommendSong: "pro_song_info/recommend_song_list",
      newSong: "pro_song_info/new_start_song_list",
      recommendList: "pro_song/recommend_song_list"
    };
    let url = '/program/' + typeArr[type];
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
        // console.log(res);
        if (res.ret == 0) {
          let resArr = this.data.resultArr;
          resArr[type] = res.data.list;
          this.setData({
            resultArr: resArr,
            hideLoding: true
          })
          // console.log(this.data.resultArr);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this),
      fail: function (res) {
        util.showError(res);
      }
    })
  },
  moreInfo: function (e) {
    let type = e.currentTarget.dataset.type;
    console.log(type);
    let typeArr = {
      recommendSong: '/pages/list/recommendSongs?id=recommendSong',
      newSong: '/pages/list/recommendSongs?id=newSong',
      recommendSheet: '/pages/list/recommendSheet?id=recommendSheet'
    };
    wx.navigateTo({
      url: typeArr[type],
    });
  },
  toRecommendSheet: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/list/songDetails?id=' + id,
    });
  },
  toNewSong: function (e) {
    let index = e.currentTarget.dataset.index;
    let songlist = this.data.resultArr.newSong;
    songlist = JSON.stringify(songlist);
    let listsrc = JSON.stringify('/program/pro_song_info/new_start_song_list');
    wx.setStorageSync('playlist', songlist);
    wx.setStorageSync('listsrc', listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index,
    })
   
  },
  toRecommendSong: function (e) {
    let index = e.currentTarget.dataset.index;
    let songinfo = this.data.resultArr.recommendSong;
    songinfo = JSON.stringify(songinfo);
    let listsrc = JSON.stringify('/program/pro_song_info/recommend_song_list');
    wx.setStorageSync('playlist', songinfo);
    wx.setStorageSync('listsrc', listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index,
    })
  },
  getBannerImg: function () {
    util.request('/program/pro_banner/get_banner_list', {
      withToken: false,
      method: 'GET',
      data: {
        type: 1,
        start: this.data.start,
        limit: this.data.limit,
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          this.setData({
            imgUrls: res.data,
          });
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  shareSong: function (e) {
    let id = e.currentTarget.dataset.songid;
    this.setData({
      shareSongId: id,
      shareIcon: true,
    });

  },
  hideShareBack: function () {
    this.setData({
      shareIcon: !this.data.shareIcon,
    })
  },
  audioPlay:function(){
    if (this.data.status == 1){
      wx.pauseBackgroundAudio();
    } else if (this.data.status == 2){
      wx.playBackgroundAudio({
        dataUrl: this.data.src,
        
      })
    }
    
    // page.setData({
    //   haveBackMusic: false,
    // });
  },
})
