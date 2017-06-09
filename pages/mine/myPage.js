// pages/mine/myPage.js
var util = require('../../utils/util.js');
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
    util.getUserInfo();
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
    // this.loadData();
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
  // loadData: function () {
  //   util.request('/program/pro_user/get_user_info', {
  //     withToken: true,
  //     method: 'GET',
  //     data: {

  //     },
  //     success: function (res) {
  //       res = res.data;
  //       console.log(res);
  //       if (res.ret == 0) {
  //         this.setData({
  //           userInfo: res.data
  //         })
  //       }
  //       else {
  //         util.showError(res.msg);
  //       }
  //     }.bind(this)
  //   })
  // },
  recentlyList: function (e) {
    let type = e.currentTarget.dataset.type;
    // let data = {
    //   'recentlyList': '最近播放',
    //   'favoriteList': '我喜欢',
    //   'shareList': '我的分享'
    // };
    // let id = data[type];
    wx.navigateTo({ url: '/pages/list/recommendSongs?id=' + type });
  },
  creatSheet: function () {
    let id = "1";
    wx.navigateTo({ url: '/pages/index/createSheetName?id=' + id });
  },
  showSheetList: function (e) {
    let type = e.currentTarget.dataset.type;
    console.log(type);
    wx.navigateTo({
      url: '/pages/mine/myCreatSheet',
    })
    
  },
  getSheetList: function (type) {
    let urlArr = {
      mycreat: "pro_song/get_my_song_list",
      mycollect: "pro_song/get_collect_song_list"
    };
    let url = '/program/' + urlArr[type];
    util.request(url, {
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
          if(type == "mycreat"){
            this.setData({
              mycreatList: res.data.list,
            });
          }else if(type == "mycollect"){
            this.setData({
              mycollectList: res.data.list,
            });
          }
         
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
})