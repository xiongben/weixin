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
    loveSongIf:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      console.log(options);
      let sheetid=options.id;
      if (sheetid == "favoriteList"){
        this.setData({
          type: "favoriteList"
        });
        this.getSheetInfo(this.data.sheetId,this.data.type);
      }else{
        this.setData({
          sheetId: sheetid,
          type: "common"
        });
        this.getSheetInfo(this.data.sheetId,this.data.type);
      }
     
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
    this.getSheetInfo(this.data.sheetId,this.data.type,"more");

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  getSheetInfo:function(id,type,more){
    let urlArr={
      favoriteList:'pro_song_info/get_like_song_list',
      common:'pro_song_info/get_info_song_list',
    }
    let url = '/program/'+urlArr[type];
    this.setData({
      url:url
    });
    if (!!more) {
      this.setData({
        start: this.data.start + 5,
      })
    }
    util.request(this.data.url, {
      withToken: true,
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
  playSong:function(e){
    let index = e.currentTarget.dataset.index;
    let songinfo = this.data.musicianList;
    songinfo = JSON.stringify(songinfo);
    let listsrc = JSON.stringify(this.data.url + '?id=' + this.data.sheetId);
    wx.setStorageSync('playlist', songinfo);
    wx.setStorageSync('listsrc', listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index,
    })
  },
  playAll:function(){
    let songinfo = this.data.musicianList;
    songinfo = JSON.stringify(songinfo);
    let listsrc = JSON.stringify(this.data.url + '?id=' + this.data.sheetId);
    wx.setStorageSync('playlist', songinfo);
    wx.setStorageSync('listsrc', listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=0',
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
  loveSong: function (e) {
    // let id = this.data.item.id;
    this.setData({
      loveSongIf: !this.data.loveSongIf
    });
    let url;
    if (this.data.loveSongIf) {
      url = '/program/pro_song_info/delete_song_like';
    } else {
      url = '/program/pro_song_info/add_song_like';
    }
    util.request(url, {
      withToken: true,
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          console.log("loveSongChange");
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })

  },
})