//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var backTime;
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
    util.setStorageUserInfo();
    
  },
  onShow: function () {
    clearInterval(backTime);
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        let page=this;
        if(res && res.status == 1){
          backTime=setInterval(function(){
            util.lookBackMusicStatus(page);
          },5000) ;
          
        }
      }.bind(this)
    })
  },
  onPullDownRefresh: function () {
    console.log("reflesh");
    this.getBannerImg();
    this.getRecommendInfo("newSong");
    this.getRecommendInfo("recommendSong");
    this.getRecommendInfo("recommendList");
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res){
    let that = this;
    if (res.from === 'button'){
      return {
        title: '打榜歌曲',
        path: '/pages/audioPlayer/audioPlay?id=' + res.target.dataset.songid,
        success: function (data) {
          console.log(res.target.dataset.songid);
          util.sharefn(res.target.dataset.songid);
        },
        fail: function (data) {
          wx.showToast({
            title: '打榜失败',
          });
        }
      }
    }else{
      return {
        title: '嘿吼音乐',
        path: '/pages/index/index',
      }
    }
    
  },
  searchMusic: function () {
    let id = "1";
    wx.navigateTo({ url: '/pages/index/selectPage?id=' + id });
    // util.sharefn(68);
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
        wx.stopPullDownRefresh();
        res = res.data;
        // console.log(res);
        if (res.ret == 0) {
          for (let j = 0; j < res.data.list.length; j++) {
            res.data.list[j].cover = util.calcCenterImg(res.data.list[j].cover, 1, 1);
          }
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
    // console.log(type);
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
    // let songlist = this.data.resultArr.newSong;
    // songlist = JSON.stringify(songlist);
    let listsrc = JSON.stringify('/program/pro_song_info/new_start_song_list');
    // wx.setStorageSync('playlist', songlist);
    // wx.setStorageSync('listsrc', listsrc);
    // console.log(listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index + '&url=' + listsrc,
    })
   
  },
  toRecommendSong: function (e) {
    let index = e.currentTarget.dataset.index;
    let songinfo = this.data.resultArr.recommendSong;
    songinfo = JSON.stringify(songinfo);
    let listsrc = JSON.stringify('/program/pro_song_info/recommend_song_list');
    // wx.setStorageSync('playlist', songinfo);
    // wx.setStorageSync('listsrc', listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index + '&url=' + listsrc,
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
  audioPlay: function () {
    if (this.data.status == 1) {
      wx.pauseBackgroundAudio();
      this.setData({
        status: 0,
      });
      
    } else if (this.data.status == 0) {
      this.setData({
        status: 1,
      });
      wx.playBackgroundAudio({
        dataUrl: this.data.src,
        success: function (res) {
          
        }
      })
    }

  },
  bannnerUrl:function(e){
    let url = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: url,
    });
  }
   
})
