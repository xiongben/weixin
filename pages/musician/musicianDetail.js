// pages/musician/musicianDetail.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    songlist:[],
    songId:'',
    limit:10,
    start:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  getMusicianInfo:function(){
    util.request('/program/pro_list/singer_index_view', {
      withToken: false,
      method: 'GET',
      data: {
        singerId:'3',
        start:0,
        limit:10
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          this.setData({
            songerInfo:res.data.singer,
            songList:res.data.list,
            
          })
         
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
})