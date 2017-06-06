// pages/index/selectPage.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotSearch();
    this.getHistory();
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
  getHotSearch:function(){
    util.request('/program/search/hot_word_list', {
      withToken: false,
      method: 'GET',
      data: {
        start:0,
        limit:10
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          let data=res.data;
          this.setData({
            hotSearchList:data,
          })
          
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  searchMusic:function(){
    console.log(this.data.searchText);
  },
  cleanSearch:function(){

  },
  formSubmit: function (e) {
    console.log( e.detail.value);
    let keyword = e.detail.value.keyword;
    if(keyword != ""){
      this.jumpPage(keyword);
    }else{
      wx.showToast({
        title: '关键词不能为空',
        icon: 'warn',
        duration: 2000
      })
    }
   
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  getHistory:function(){
    util.request('/program/search/record_list', {
      withToken: false,
      method: 'GET',
      data: {
        start: 0,
        limit: 10
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          let data = res.data;
          this.setData({
            historyList: data,
          })

        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  jumpPage:function(id){
    wx.navigateTo({
      url: '/pages/index/selectResult?id='+id,
    })
  },
  hotSearchkeyword:function(e){
    let keyword = e.currentTarget.dataset.keyword;
    this.jumpPage(keyword);
  },
})