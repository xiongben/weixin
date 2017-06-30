// pages/musician/musicianWeekList.js
var util = require('../../utils/util.js');
var backTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareIcon: false,
    shareSongId: "",
    rankInfo: [],
    currentTab: 0,
    limit: 5,
    start: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    });
    util.setStorageUserInfo(function () {
    this.getRankingInfo('week');
    this.getRankingInfo('month');
    this.getMusicianList();
    }.bind(this));
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
      title: '打榜歌曲',
      path: '/pages/musician/musicianWeekList',
      success: function (res) {
        console.log("分享成功");
      },
      
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: "加载更多"
    });
    this.getMusicianList("more");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getRankingInfo('week');
    this.getRankingInfo('month');
    this.setData({
      limit: 5,
      start: 0,
    })
    this.getMusicianList();
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  getRankingInfo: function (param) {
    let type = param;
    util.request('/program/pro_list/singer_list', {
      withToken: true,
      method: 'GET',
      data: {
        type: type,
        start: 0,
        limit: 3
      },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        res = res.data;
        if (res.ret == 0) {
          if (param == "week") {
            this.setData({
              weekrankInfo: res.data.list
            });
            let imglist = this.data.weekrankInfo;
            for (let j = 0; j < imglist.length; j++) {
              imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
            }
            this.setData({
              weekrankInfo: imglist,
            })
          } else if (param == "month") {
            this.setData({
              monthrankInfo: res.data.list
            });
            let imglist = this.data.monthrankInfo;
            for (let j = 0; j < imglist.length; j++) {
              imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
            }
            this.setData({
              monthrankInfo: imglist,
            })
          }
         
          
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  getMusicianList: function (more) {
    if (!!more) {
      this.setData({
        start: this.data.start + 5,
      })
    }
    util.request('/program/pro_list/singer_index', {
      withToken: true,
      method: 'GET',
      data: {
        start: this.data.start,
        limit: this.data.limit
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        // console.log(res);
        if (res.ret == 0) {
          if (!!more) {
            if (res.data == "") {
              wx.showToast({
                title: '没有更多了',
                icon: 'success',
                duration: 2000
              })
            }
            let moreMusicianList = this.data.musicianList.concat(res.data);
            this.setData({
              musicianList: moreMusicianList,
            });
          } else {
            this.setData({
              musicianList: res.data,
            });
          }
          let imglist = this.data.musicianList;
          for (let j = 0; j < imglist.length; j++) {
            imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
          }
          this.setData({
            musicianList: imglist,
          })

        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  jumpToList: function (e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/musician/musicianRankingList?id='+type
    })
  },
  ToMusicianDetail: function (e) {
    let singerId = e.currentTarget.dataset.singerid;
    wx.navigateTo({
      url: '/pages/musician/musicianDetail?singerid=' + singerId,
    });
  },
  rulePage: function () {
    wx.navigateTo({ url: '/pages/index/rulePage?type=musicianType' });
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