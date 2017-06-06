// pages/index/selectResult.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputKeyword:"",
    currentTab: 0,
    start: [0, 0, 0],
    limit: 4,
    resultArr: [[], [], []],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      
      this.setData({
        keyword: options.id,
        inputKeyword: options.id
      });
      let index = this.data.currentTab;
      let keyword = this.data.keyword;
      this.getSearchResult(keyword, index);
    }
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
      title: "加载更多中..."
    });
    let index = this.data.currentTab;
    let keyword = this.data.keyword;
    this.getSearchResult(keyword, index, "more");
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
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      });
      let index = e.target.dataset.current;
      let keyword = that.data.keyword;
      that.getSearchResult(keyword, index);

    }
  },
  getSearchResult: function (keyword, index, more) {
    let typeArr = ["song_info_list", "singer_list", "song_list"];
    let url = "/program/search/" + typeArr[index];
    let start;
    if (!!more) {
      let newStart = this.data.start;
      start = this.data.start[index] + 4;
      newStart[index] = start;
      this.setData({
        start: newStart,
      });
    } else {
      start = this.data.start[index];
    }
    util.request(url, {
      withToken: false,
      method: 'GET',
      data: {
        start: start,
        limit: this.data.limit,
        keyword: keyword
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        if (res.ret == 0) {
          let data = res.data;
          if (data == "") {
            wx.showToast({
              title: '此栏没有更多哦',
              icon: 'success',
              duration: 2000
            });
          }
          let searchArr = this.data.resultArr;
          if (!!more) {
            searchArr[index] = searchArr[index].concat(data);
          } else {
            searchArr[index] = data;
          }
          this.setData({
            resultArr: searchArr,
          });
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  formSubmit:function(e){
    console.log(e.detail.value);
    let keyword = e.detail.value.keyword;
    if (keyword != "") {
      this.setData({
        keyword:keyword
      });
      let index = this.data.currentTab;
      this.getSearchResult(keyword, index);
    } else {
      wx.showToast({
        title: '关键词不能为空',
        icon: 'warn',
        duration: 2000
      })
    }
  },
})