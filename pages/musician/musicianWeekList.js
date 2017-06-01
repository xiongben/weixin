// pages/musician/musicianWeekList.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankInfo:[],
    currentTab: 0,
    limit:3,
    start:0,
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
  // swichNav: function (e) {
  //   var that = this;
  //   if (this.data.currentTab === e.target.dataset.current) {
  //     return false;
  //   } else {
  //     that.setData({
  //       currentTab: e.target.dataset.current
  //     })
  //   }
  // },
  // rulePage: function () {
  //   wx.navigateTo({ url: '/pages/index/rulePage' });
  // },
  getRankingInfo: function (param) {
    let type=param;
    util.request('/program/pro_list/singer_list', {
      withToken: false,
      method: 'GET',
      data: {
        type:type,
        start: this.data.start,
        limit: this.data.limit
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          if(param=="week"){
            this.setData({
              weekrankInfo: res.data.list
            })
          }else if(param == "month"){
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
})