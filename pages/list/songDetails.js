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
    showheader:true,
    loveSongIf:false,
    manageSheet:false,
    showDelet:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      console.log(options);
      let sheetType=options.type;
      if (sheetType == "favoriteList"){
        this.setData({
          type: "favoriteList",
          manageSheet: true,
          showheader:false,
        });
        wx.setNavigationBarTitle({
          title: "我喜欢"
        });
        this.getSheetInfo(this.data.sheetId,this.data.type);
      }else if(sheetType == "mycreat"){
        this.setData({
          type: "mycreat",
          sheetId:options.id,
          manageSheet:true,
        });
        this.getSheetInfo(this.data.sheetId, this.data.type);
      }
      else{
        this.setData({
          sheetId: options.id,
          type: "common",
          manageSheet: false,
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
    this.getSheetInfo(this.data.sheetId, this.data.type);
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this
      if (this.data.type == 'favoriteList') {
        let userInfo = wx.getStorageSync('userInfo');
        userInfo = JSON.parse(userInfo);
        return {
          title: '我喜欢的歌曲',
          path: '/pages/list/shareSongDetails?id=' + userInfo.id + '&token=' + userInfo.token,
          success: function (data) {
            console.log("分享成功");
          },
          fail: function (data) {

          }
        }
      } else {
        return {
          title: '打榜歌曲',
          path: '/pages/list/songDetails?id=' + res.target.dataset.songid,
          success: function (data) {
            console.log("分享成功");
            this.shareSheetFn(this.data.sheetId);
            
          },
          fail: function (data) {

          }
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
      mycreat:'pro_song_info/get_info_song_list'
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
          wx.stopPullDownRefresh();
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
              sheetInfo:res.data,
              singerId:res.data.id,
              loveSongIf: res.data.isCollect ? true : false,
            });
            
          }
          let imglist = this.data.musicianList;
          let imgBanner = this.data.sheetInfo;

          for (let j = 0; j < imglist.length; j++) {
            imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
          }
          imgBanner.cover = util.calcCenterImg(imgBanner.cover, 1, 1);
          this.setData({
            musicianList: imglist,
            sheetInfo: imgBanner
          })
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  playSong:function(e){
    let index = e.currentTarget.dataset.index;
    let listsrc = JSON.stringify(this.data.url);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=all&index=' + index + '&sheetId=' + this.data.singerId+'&url=' + listsrc,
    })
  },
  playAll:function(){
    // console.log(this.data.musicianList);
    if (this.data.musicianList && this.data.musicianList.length != 0){
      let listsrc = JSON.stringify(this.data.url);
      wx.navigateTo({
        url: '/pages/audioPlayer/audioPlay?id=all&index=0' + '&url=' + listsrc + '&sheetId=' + this.data.singerId,
      })
    }else{
      wx.showToast({
        title: '没有歌曲可以播放',
        icon: 'success',
        duration: 2000
      })
    }
    
  },
  loveSong: function (e) {
    if (this.data.type == "favoriteList"){
      return false;
    }
    this.setData({
      loveSongIf: !this.data.loveSongIf
    });
    console.log(this.data.loveSongIf);
    let url;
    if (!this.data.loveSongIf) {
      url = '/program/pro_song/delete_song_collect';
    } else {
      url = '/program/pro_song/add_song_collect';
    }
    console.log(this.data.sheetInfo);
    util.request(url, {
      withToken: true,
      method: 'POST',
      data: {
        id: this.data.sheetId,
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          console.log("loveSongChange");
          this.getSheetInfo(this.data.sheetId, this.data.type);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  shareSheetFn:function(id){
    request('/program/pro_song/add_song_share', {
      withToken: true,
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          console.log("分享成功");
          this.getSheetInfo(this.data.sheetId, this.data.type);
        }
        else {
          wx.showError(res.msg);
        }
      }.bind(this)
    })
  },
  manageSheet: function () {
    this.setData({
      showDelet: !this.data.showDelet
    })
  },
  deleteSong: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      confirmColor: '#e5d1a1',
      title: '提示',
      content: '是否确认删除歌曲',
      success: function (res) {
        if (res.confirm) {
          if (this.data.type == 'favoriteList'){
            this.deleteLoveSong(id);
          }else{
            this.deleteSongFn(id);
          }
          
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }.bind(this)
    })
  },
  deleteSongFn:function(id){
    util.request('/program/pro_song/delete_song_info_collect', {
      withToken: true,
      method: 'POST',
      data: {
        songId:this.data.sheetId,
        songInfoId: id
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          // this.getSheetList(this.data.type);
          this.getSheetInfo(this.data.sheetId, this.data.type);
          console.log("删除歌曲成功");
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  deleteLoveSong:function(id){
    util.request('/program/pro_song_info/delete_song_like', {
      withToken: true,
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          this.getSheetInfo(this.data.sheetId, this.data.type);
          console.log("删除love歌曲成功");
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  }
})