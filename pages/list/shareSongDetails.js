// pages/list/shareSongDetails.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: 0,
    limit: 8,
    sheetId: "",
    showheader: true,
    loveSongIf: false,
    manageSheet: false,
    showDelet: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      // let userInfo = wx.getStorageSync('userInfo');
      // userInfo = JSON.parse(userInfo);
      // console.log(userInfo);
      let uid = options.id;
      let token = options.token;
      this.setData({
        uid: uid,
        token:token
      });
      this.getSheetInfo();
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多',
    });
    this.getSheetInfo("more");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getSheetInfo: function (more) {
    if (!!more) {
      this.setData({
        start: this.data.start + 5,
      })
    }
    util.request('/program/pro_song_info/get_like_song_list', {
      withToken: false,
      method: 'GET',
      data: {
        id: this.data.sheetId,
        start: this.data.start,
        limit: this.data.limit,
        uid:this.data.uid,
        token:this.data.token
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
            } else {
              let moreMusicianList = this.data.musicianList.concat(res.data.songList);
              this.setData({
                musicianList: moreMusicianList,
              });
            }
          } else {
            this.setData({
              musicianList: res.data.songList,
            });
          }
          let imglist = this.data.musicianList;
          for (let j = 0; j < imglist.length; j++) {
            imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
          }
          this.setData({
            musicianList: imglist,
          });
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  playSong:function(e){
    let index = e.currentTarget.dataset.index;
    let id = this.data.musicianList[index].id;
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=' + id,
    })
  }
});

