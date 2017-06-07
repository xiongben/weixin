// pages/mine/myPage.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  loadData: function () {
    util.request('/program/pro_user/get_user_info', {
      withToken: true,
      method: 'GET',
      data: {

      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
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
    let data = {
      'recentlyList': '最近播放',
      'favoriteList': '我喜欢',
      'shareList': '我的分享'
    };
    let id = data[type];
    wx.navigateTo({ url: '/pages/list/recommendSongs?id=' + id });
  },
  creatSheet: function () {
    let id = "1";
    wx.navigateTo({ url: '/pages/index/createSheetName?id=' + id });
  },
})