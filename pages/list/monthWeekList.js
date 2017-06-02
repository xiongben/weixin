// pages/list/monthWeekList.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    titleName:'',
    start:0,
    limit:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeInfo();
    
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
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  rulePage:function(){
    wx.navigateTo({ url: '/pages/index/rulePage' });
  },
  getTypeInfo:function(){
    util.request('/program/pro_category/get_all', {
      withToken: false,
      method: 'GET',
      data: {
        type:3
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          let data=res.data.list;
          this.setData({
            titleName:data
          });
          let id = this.data.titleName[0].id;
          this.getListInfo(id);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  getListInfo:function(id){
    util.request('/program/pro_list/song_info_list', {
      withToken: false,
      method: 'GET',
      data: {
        categoryId:id,
        start:this.data.start,
        limit:this.data.limit,
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          let data=res.data.list;
          this.setData({
            listInfoOne:data,
          })
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
})