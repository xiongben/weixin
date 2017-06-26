// pages/index/createSheetName.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let sheetName = e.detail.value.sheetName;
    if (sheetName == "") {
      util.showError("请输入歌单名称");
    } else if (sheetName.length>20){
      util.showError("字数过长，请限制在20个字符内");
    } else {
      util.request('/program/pro_song/add_song', {
        withToken: true,
        method: 'POST',
        data: {
          name: sheetName
        },
        success: function (res) {
          res = res.data;
          console.log(res);
          if (res.ret == 0) {
            wx.showToast({
              title: '歌单创建成功',
              icon: 'success',
              duration: 2000,
            })
            setTimeout(function(){
              // wx.navigateTo({
              //   url: '/pages/mine/myPage',
              // })
              wx.navigateBack({
                delta: 1
              });
            },2000);
          }
          else {
            util.showError(res.msg);
          }
        }.bind(this)
      })
    }
  },
})