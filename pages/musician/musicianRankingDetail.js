// pages/musician/musicianRankingDetail.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    songlist: [],
    limit: 5,
    start: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      console.log(options);
      this.setData({
        singerId: options.singerid,
      });
    }
    wx.showLoading();
    this.getMusicianInfo();
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
      title: '加载更多',
    });
    this.getMusicianInfo("more");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getMusicianInfo: function (more) {
    if (!!more) {
      this.setData({
        start: this.data.start + 5,
      })
    }

    util.request('/program/pro_list/singer_list_view', {
      withToken: false,
      method: 'GET',
      data: {
        singerId: this.data.singerId,
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
            if (res.data.list == "") {
              wx.showToast({
                title: '没有更多了',
                icon: 'success',
                duration: 2000
              })
            }
            let moreSongList = this.data.songList.concat(res.data.list);
            this.setData({
              songList: moreSongList,
            })
          } else {
            this.setData({
              songerInfo: res.data.singer,
              songList: res.data.list,
            })
          }

        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
})