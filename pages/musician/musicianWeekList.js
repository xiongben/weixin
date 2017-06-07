// pages/musician/musicianWeekList.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.getRankingInfo('week');
    this.getRankingInfo('month');
    this.getMusicianList();
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

  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  getRankingInfo: function (param) {
    let type = param;
    util.request('/program/pro_list/singer_list', {
      withToken: false,
      method: 'GET',
      data: {
        type: type,
        start: 0,
        limit: 3
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        if (res.ret == 0) {
          if (param == "week") {
            this.setData({
              weekrankInfo: res.data.list
            })
          } else if (param == "month") {
            this.setData({
              monthrankInfo: res.data.list
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
      withToken: false,
      method: 'GET',
      data: {
        start: this.data.start,
        limit: this.data.limit
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          if (!!more) {
            wx.hideLoading();
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
})