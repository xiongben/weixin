// pages/mine/myPage.js
var util = require('../../utils/util.js');
var backTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: 0,
    limit: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
    this.getSheetList('mycreat');
    this.getSheetList('mycollect');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData();
    this.getSheetList('mycreat');
    this.getSheetList('mycollect');
    clearInterval(backTime);
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        let page = this;
        if (res && res.status == 1) {
          backTime = setInterval(function () {
            util.lookBackMusicStatus(page);
          }, 5000);

        }
      }.bind(this)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '嘿吼音乐',
      path: '/pages/index/index',
      success: function (data) {

      },
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadData();
    this.getSheetList('mycreat');
    this.getSheetList('mycollect');
  },
  loadData: function () {
    util.request('/program/pro_user/get_user_info', {
      withToken: true,
      method: 'GET',
      success: function (res) {
        wx.stopPullDownRefresh();
        res = res.data;
        // console.log(res);
        if (res.ret == 0) {
          if (res.data.MySongCount == 0){
            this.setData({
              showAdd: true
            });
          }else{
            this.setData({
              showAdd: false
            });
          }
          this.setData({
            userInfo: res.data
          })
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  recentlyList: function (e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({ url: '/pages/list/recommendSongs?id=' + type });
  },
  favoriteList:function(e){
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({ url: '/pages/list/songDetails?type=' + type });
  },
  creatSheet: function () {
    let id = "1";
    wx.navigateTo({ url: '/pages/index/createSheetName?id=' + id });
  },
  showSheetList: function (e) {
    let type = e.currentTarget.dataset.type;
    // console.log(type);
    wx.navigateTo({
      url: '/pages/mine/myCreatSheet?type='+type,
    })
    
  },
  getSheetList: function (type) {
    let urlArr = {
      mycreat: "pro_song/get_my_song_list",
      mycollect: "pro_song/get_collect_song_list"
    };
    let url = '/program/' + urlArr[type];
    util.request(url, {
      withToken: true,
      method: 'GET',
      data: {
        start: this.data.start,
        limit: this.data.limit
      },
      success: function (res) {
        res = res.data;
        // console.log(res);
        if (res.ret == 0) {
          if(type == "mycreat"){
            this.setData({
              mycreatList: res.data.list,
            });
            let imglist = this.data.mycreatList;
            for (let j = 0; j < imglist.length; j++) {
              imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
            }
            this.setData({
              mycreatList: imglist,
            });
          }else if(type == "mycollect"){
            this.setData({
              mycollectList: res.data.list,
            });
            let imglist = this.data.mycollectList;
            for (let j = 0; j < imglist.length; j++) {
              imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
            }
            this.setData({
              mycollectList: imglist,
            })
          }
         
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  toSheetDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/list/songDetails?id=' + id +'&type=mycreat',
    })
  },
  audioPlay: function () {
    if (this.data.status == 1) {
      wx.pauseBackgroundAudio();
      this.setData({
        status: 0,
      });
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          // console.log(res);
        }
      });
    } else if (this.data.status == 0) {
      this.setData({
        status: 1,
      });
      wx.playBackgroundAudio({
        dataUrl: this.data.src,
        success: function (res) {
          wx.getBackgroundAudioPlayerState({
            success: function (res) {
              // console.log(res);
            }
          });
        }
      })
    }

  },
})