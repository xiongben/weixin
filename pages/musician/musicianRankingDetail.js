// pages/musician/musicianRankingDetail.js
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareIcon: false,
    shareSongId: "",
    songlist: [],
    limit: 5,
    start: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    });
    if (options) {
      console.log(options);
      this.setData({
        singerId: options.singerid,
      });
    }
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
  onShareAppMessage: function (res) {
    if (res.from === 'button'){
      return {
        title: '打榜歌曲',
        path: '/pages/list/monthWeekList?id=' + res.target.dataset.songid,
        success: function (data) {
          util.sharefn(res.target.dataset.songid);
          console.log("分享成功");
        },
        fail: function (data) {
          wx.showToast({
            title: '打榜失败',
          });
        }
      }
    }else{
      return {
        title: '嘿吼音乐',
        path: '/pages/musician/musicianRankingDetail?singerid=' + this.data.singerId,
        success: function (data) {

        },
      }
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多',
    });
    this.getMusicianInfo("more");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getMusicianInfo: function (more) {
    if (!!more) {
      this.setData({
        start: this.data.start + 5,
      })
    }

    util.request('/program/pro_list/singer_list_view', {
      withToken: false,
      method: 'GET',
      data: {
        singerId: this.data.singerId,
        start: this.data.start,
        limit: this.data.limit
      },
      success: function (res) {
        wx.hideLoading();
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
            }
            let moreSongList = this.data.songList.concat(res.data.list);
            this.setData({
              songList: moreSongList,
            })
          } else {
            this.setData({
              songerInfo: res.data.singer,
              songList: res.data.list,
            })
          }
          let imglist = this.data.songList;
          let imgBanner = this.data.songerInfo;
          for (let j = 0; j < imglist.length; j++) {
            imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
          }
          imgBanner.cover = util.calcCenterImg(imgBanner.cover,2, 2);
          this.setData({
            songList: imglist,
            songerInfo: imgBanner
          })
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  
  playSingle: function (e) {
    let index = e.currentTarget.dataset.index;
    // let songinfo = this.data.songList;
    // songinfo = JSON.stringify(songinfo);
    let listsrc = JSON.stringify('/program/pro_list/singer_index_view');
    // wx.setStorageSync('playlist', songinfo);
    // wx.setStorageSync('listsrc', listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index + '&url=' + listsrc + '&singerId=' + this.data.singerId,
    })
  },
})