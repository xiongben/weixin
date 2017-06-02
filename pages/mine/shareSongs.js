// pages/mine/shareSongs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    list: [],
    dd: '',
    hidden: false,
    page: 2,
    size: 20,
    hasMore: true,
    hasRefesh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinfo();
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
      title:"加载更多中..."
    });
    wx.request({
      url: 'http://api2.heyhou.com/app2/perform/search?city=%E5%85%A8%E5%9B%BD&uid=6160&token=a6e0209d693fdccc924f94f5436a85c2',
      data: {
        page: ++this.data.page,
        pageSize: 10
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data.data[0].content);
        let resdata = res.data.data[0].content;
        this.setData({
          list: this.data.list.concat(res.data.data[0].content),
          hidden: true,
          hasMore: false,
        });
      }.bind(this)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getinfo: function () {
    var that = this;
    that.setData({
      hasMore: true,
      hidden: false,
    });
    if (!this.data.hasMore) return
    wx.request({
      url: 'http://api2.heyhou.com/app2/perform/search?city=%E5%85%A8%E5%9B%BD&uid=6160&token=a6e0209d693fdccc924f94f5436a85c2',
      data: {
        page: this.data.page,
        pageSize: 10
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data[0].content);
        let resdata = res.data.data[0].content;
        this.setData({
          list: resdata,
           hidden: true,
           hasMore:false
        });
      }.bind(this)
    })
  },
  loadMore: function (e) {
    console.log("chufa111");
    var that = this;
    that.setData({
      hasMore: true,
    });
    if (!this.data.hasMore) return

    wx.request({
      url: 'http://api2.heyhou.com/app2/perform/search?city=%E5%85%A8%E5%9B%BD&uid=6160&token=a6e0209d693fdccc924f94f5436a85c2',
      data: {
        page: ++this.data.page,
        pageSize: 10
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data[0].content);
        let resdata = res.data.data[0].content;
        this.setData({
          list: this.data.list.concat(res.data.data[0].content),
          hidden: true,
          hasMore: false,
        });
      }.bind(this)
    })
  },
})