// pages/list/recommendSheet.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: 0,
    limit: 6,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListInfo();
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
    this.getListInfo("more");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getListInfo: function (more) {
    if (!!more) {
      this.setData({
        start: this.data.start + 6,
      })
    }
    util.request('/program/pro_song/recommend_song_list', {
      withToken: false,
      method: 'GET',
      data: {
        start: this.data.start,
        limit: this.data.limit
      },
      success: function (res) {
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
            } else {
              let moreMusicianList = this.data.musicianList.concat(res.data);
              this.setData({
                sheetList: moreMusicianList,
              });
            }
          } else {
            this.setData({
              sheetList: res.data,
            });

          }
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  toSheetDetail:function(e){
    let sheetid = e.currentTarget.dataset.sheetid;
    wx.navigateTo({
      url: '/pages/list/songDetails?id=' + sheetid,
    });
  },
})