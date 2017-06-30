// pages/musician/musicianDetail.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songlist:[],
    limit:5,
    start:0,
    urlArr:{
      singerDetail: '/program/pro_singer/view',
      musicianDetail: '/program/pro_list/singer_index_view'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    });
    util.setStorageUserInfo(function () {
    if(options){
      if(options.type){
        this.setData({
          type:'singerDetail',
          singerId: options.singerid
        });
        wx.setNavigationBarTitle({
          title: "歌手详情"
        });
      }else{
        this.setData({
          singerId: options.singerid,
          type: 'musicianDetail',
        });
      }
    }
    this.getMusicianInfo(this.data.type);
    }.bind(this));
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
    let that = this;
    if (res.from === 'button'){
      return {
        title: '打榜歌曲',
        path: '/pages/audioPlayer/audioPlay?id=' + res.target.dataset.songid,
        success: function (data) {
          console.log("分享成功");
          util.sharefn(res.target.dataset.songid);
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
        path: '/pages/musician/musicianDetail?singerid=' + this.data.singerId,
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
     this.getMusicianInfo(this.data.type,"more");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     this.setData({
       limit: 5,
       start: 0,
     });
     this.getMusicianInfo(this.data.type);
  },
  getMusicianInfo:function(type,more){
    if(!!more){
       this.setData({
         start:this.data.start+5,
       })
    }
    
    let url = this.data.urlArr[type];
    util.request(url, {
      withToken: true,
      method: 'GET',
      data: {
        singerId:this.data.singerId,
        start:this.data.start,
        limit:this.data.limit
      },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          if(!!more){
            if (res.data.list == ""){
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
          }else{
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
          imgBanner.cover = util.calcCenterImg(imgBanner.cover, 2, 2);
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
  playAll:function(){
    if (this.data.songList && this.data.songList.length != 0){
      let listsrc = JSON.stringify(this.data.urlArr[this.data.type]);
      wx.navigateTo({
        url: '/pages/audioPlayer/audioPlay?id=all&index=0' + '&url=' + listsrc + '&singerId=' + this.data.singerId,
      })
     }else{
      wx.showToast({
        title: '没有歌曲可以播放',
        icon: 'success',
        duration: 2000
      })
     }
  },
  
  playSingle:function(e){
    let index = e.currentTarget.dataset.index;
    // let songinfo = this.data.songList;
    // songinfo = JSON.stringify(songinfo);
    let listsrc = JSON.stringify(this.data.urlArr[this.data.type]);
    // wx.setStorageSync('playlist', songinfo);
    // wx.setStorageSync('listsrc', listsrc);
    console.log(listsrc);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index + '&url=' + listsrc + '&singerId=' + this.data.singerId,
    })
  },
})