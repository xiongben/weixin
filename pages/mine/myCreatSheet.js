// pages/mine/myCreatSheet.js
var util = require('../../utils/util.js');
Page({
  data: {
    start: 0,
    limit: 10,
    showDelet: false,
    
  },
  onLoad: function (options) {
    if(options.type){
      console.log(options.type);
      this.setData({
         type:options.type
      });
      let titleArr={
        mycreat:"我创建的歌单",
        mycollect:"我收藏的歌单"
      };
        wx.setNavigationBarTitle({
        title: titleArr[this.data.type]
        });
      this.getSheetList(this.data.type);
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
    this.getSheetList(this.data.type);
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
    this.setData({
      start: 0,
      limit: 10,
    });
    this.getSheetList(this.data.type);
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '正在加载',
    });
    this.getSheetList(this.data.type,"more");
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
  getSheetList: function (type,more) {
    let urlArr = {
      mycreat: '/program/pro_song/get_my_song_list',
      mycollect: '/program/pro_song/get_collect_song_list'
    }
    let url = urlArr[type];
    if (!!more) {
      this.setData({
        start: this.data.start + 10,
      })
    }
    util.request(url, {
      withToken: true,
      method: 'GET',
      data: {
        start: this.data.start,
        limit: this.data.limit,
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        res = res.data;
        // console.log(res);
        if (res.ret == 0) {
          this.setData({
            sheetTotal:res.data.total
          });
          if (!!more) {
            wx.hideLoading();
            if (res.data.list == "") {
              wx.showToast({
                title: '没有更多了',
                icon: 'success',
                duration: 2000
              })
            }
            let moreSheetList = this.data.sheetList.concat(res.data.list);
            this.setData({
              sheetList: moreSheetList,
            });
          } else {
            this.setData({
              sheetList: res.data.list,
            });
          }
          let imglist = this.data.sheetList;
          for (let j = 0; j < imglist.length; j++) {
            imglist[j].cover = util.calcCenterImg(imglist[j].cover, 0.8, 0.8);
          }
          this.setData({
            sheetList: imglist,
          })
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  manageSheet: function () {
    this.setData({
      showDelet: !this.data.showDelet
    })
  },
  addSheet: function () {
    wx.navigateTo({
      url: '/pages/index/createSheetName',
    })
  },
  deleteSheet: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      confirmColor: '#e5d1a1',
      title: '提示',
      content: '是否确认删除歌单',
      success: function (res) {
        if (res.confirm) {
          this.deleteSheetFn(id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }.bind(this)
    })
  },
  deleteSheetFn: function (id) {
    let urlArr = {
      mycreat: '/program/pro_song/delete_song',
      mycollect: '/program/pro_song/delete_song_collect'
    }
    let url = urlArr[this.data.type];
    util.request(url, {
      withToken: true,
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        res = res.data;
        // console.log(res);
        if (res.ret == 0) {
          this.getSheetList(this.data.type);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  toSheetDetail:function(e){
    let id = e.currentTarget.dataset.id;
    if(this.data.type == 'mycreat'){
      wx.navigateTo({
        url: '/pages/list/songDetails?id=' + id + '&type=mycreat',
      })
    } else if (this.data.type == 'mycollect'){
      wx.navigateTo({
        url: '/pages/list/songDetails?id=' + id + '&type=common',
      })
    }
   
  },
})