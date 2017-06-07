// pages/musician/musicianRankingList.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerTitle: "",
    start: 0,
    limit: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      let typeid = options.id;
      this.setData({
        type: typeid
      });
    }
    this.getListInfo(this.data.type);
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
  onShareAppMessage: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载更多',
    });
    this.getListInfo(this.data.type, "more");

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getListInfo: function (type, more) {
    if (!!more) {
      this.setData({
        start: this.data.start + 10,
      })
    }
    util.request('/program/pro_list/singer_list', {
      withToken: false,
      method: 'GET',
      data: {
        type: this.data.type,
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
            }
            let moreMusicianList = this.data.musicianList.concat(res.data.list);
            this.setData({
              musicianList: moreMusicianList,
            });
          } else {
            this.setData({
              musicianList: res.data.list,
            });
            this.titleText(type, res.data);
          }
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  titleText: function (type, data) {
    if (type == "week") {
      this.setData({
        headerTitle: "第" + data.week + "周榜"
      });
    } else if (type == "month") {
      this.setData({
        headerTitle: "第" + data.month + "月榜"
      });
    }
  },
  ToMusicianDetail:function(e){
    let singerId = e.currentTarget.dataset.singerid;
    wx.navigateTo({
      url: '/pages/musician/musicianRankingDetail?singerid=' + singerId,
    });
  },
})