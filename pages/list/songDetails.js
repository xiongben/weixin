// pages/list/songDetails.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:0,
    limit:8,
    sheetId:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      console.log(options);
      let sheetid=options.id;
      this.setData({
        sheetId:sheetid
      })
    }
    this.getSheetInfo(this.data.sheetId);
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
    this.getSheetInfo(this.data.sheetId,"more");

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  getSheetInfo:function(id,more){
    if (!!more) {
      this.setData({
        start: this.data.start + 5,
      })
    }
    util.request('/program/pro_song_info/get_info_song_list', {
      withToken: false,
      method: 'GET',
      data: {
        id: this.data.sheetId,
        start: this.data.start,
        limit: this.data.limit
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          if (!!more) {
            wx.hideLoading();
            if (res.data) {
              wx.showToast({
                title: '没有更多了',
                icon: 'success',
                duration: 2000
              })
            }else{
            let moreMusicianList = this.data.musicianList.concat(res.data.songList);
            this.setData({
              musicianList: moreMusicianList,
            });
            }
          } else {
            this.setData({
              musicianList: res.data.songList,
              sheetInfo:res.data
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