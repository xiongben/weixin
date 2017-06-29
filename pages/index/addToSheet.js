// pages/index/addToSheet.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:0,
    limit:5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.getSheetList();
      let songid=options.songid;
      this.setData({
        songid:songid,
      })
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
    this.getSheetList();
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
    return {
      title: '嘿吼音乐',
      path: '/pages/index/index',
      success: function (data) {

      },
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多',
    });
    this.getSheetList("more");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  getSheetList:function(more){
    if (!!more) {
      this.setData({
        start: this.data.start + 5,
      })
    }
    util.request('/program/pro_song/get_my_song_list', {
      withToken: true,
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
            if (res.data.list == "") {
              wx.showToast({
                title: '没有更多了',
                icon: 'success',
                duration: 2000
              })
            } else {
              let moreMusicianList = this.data.musicianList.concat(res.data.list);
              this.setData({
                musicianList: moreMusicianList,
              });
            }
          } else {
            this.setData({
              musicianList: res.data.list,
            });

          }
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  creatSheet:function(){
    wx.navigateTo({
      url: '/pages/index/createSheetName?type=addToSheet',
    })
  },
  addToSheet:function(e){
    let sheetId = e.currentTarget.dataset.sheetid;
    util.request('/program/pro_song/add_song_info_collect', {
      withToken: true,
      method: 'POST',
      data: {
        songInfoId: this.data.songid,
        songId: sheetId,
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          wx.showToast({
            title: '歌曲添加成功',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta:1
            })
          }, 2000);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  addToLove:function(){
    util.request('/program/pro_song_info/add_song_like', {
      withToken: true,
      method: 'POST',
      data: {
        id: this.data.songid,
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          wx.showToast({
            title: '歌曲添加成功',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
})