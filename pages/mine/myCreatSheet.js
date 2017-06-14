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
      this.setData({
         type:options.type
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
    wx.showLoading({
      title: '正在加载',
    });
    this.getSheetList(this.data.type,"more");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
        res = res.data;
        console.log(res);
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
    util.request('/program/pro_song/delete_song', {
      withToken: true,
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          this.getSheetList();
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
})