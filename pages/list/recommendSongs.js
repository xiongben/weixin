// pages/list/recommendSongs.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start:0,
    limit:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      let id = options.id;
      this.setData({
        type:id
      })
      let data = {
        'recentlyList': '最近播放',
        'recommendSong':'推荐歌曲',
        'newSong':'新歌发布'
      };
      wx.setNavigationBarTitle({
        title: data[id]
      });
      this.getSongList(this.data.type);
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
    let that = this;
    this.setData({
      shareIcon: false,
    })
    return {
      title: '打榜歌曲',
      path: '/pages/audioPlayer/audioPlay?id=' + this.data.shareSongId,
      success: function (res) {
        console.log("分享成功");
        util.sharefn(that.data.shareSongId);
      },
      fail: function (res) {
        wx.showToast({
          title: '打榜失败',
        });
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
     this.getSongList(this.data.type,'more');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getSongList: function (type,more) {
    if (!!more) {
      this.setData({
        start: this.data.start + 10,
      })
    }
    let urlArr={
      'recentlyList': 'pro_song_info/get_play_song_list',
      'recommendSong':'pro_song_info/recommend_song_list',
      'newSong':'pro_song_info/new_start_song_list'
    };
    let url ='/program/'+urlArr[type];
    this.setData({
       url:url
    });
    util.request(url, {
      withToken: true,
      method: 'GET',
      data: {
        start: this.data.start,
        limit: this.data.limit,
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
            }
            let moreMusicianList = this.data.musicianList.concat(res.data.list);
            this.setData({
              musicianList: moreMusicianList,
            });
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
  shareSong: function (e) {
    let id = e.currentTarget.dataset.songid;
    this.setData({
      shareSongId: id,
      shareIcon: true,
    });

  },
  hideShareBack: function () {
    this.setData({
      shareIcon: !this.data.shareIcon,
    })
  },
  toAudioPlay: function (e) {
    let index = e.currentTarget.dataset.index;
    let playlist = this.data.musicianList;
    playlist = JSON.stringify(playlist);
    let listsrc = JSON.stringify(this.data.url);
    wx.setStorageSync('playlist', playlist);
    wx.setStorageSync('listsrc', listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index,
    })

  },
})