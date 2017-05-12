// pages/audioPlayer/audioPlay.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '此时此刻',
    author: '许巍',
    // src: 'http://res.heyhou.com/av/2017/01/06/b1a2fcd14ab8331942048c51c6bf58a4.mp3',
    src: 'http://xiongsanniu.com/music/0.mp3',
    lrcsrc:'http://res.heyhou.com/file/2017/01/06/51c19a06e2412f8e4f9d3f1d4c6225db.lrc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlyric();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    this.audioCtx = wx.createAudioContext('myAudio');
    // this.audioCtx.setSrc('../');
    this.audioCtx.play()
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
  },
  getlyric: function () {
    util.request(this.data.lrcsrc, {
      success: function (res) {
        let lyric = this.createArrMap(res.data);
        console.log(lyric);
      }.bind(this)
    })
  },
  createArrMap: function (lyric) {
    var timeArr = [],
      lyricArr = [];
    var tempArr = lyric.split("\n");
    tempArr.splice(-1, 1);
    var tempStr = "";
    for(let i=0;i<tempArr.length;i++){
      tempStr = tempArr[i];
      if (tempStr.charAt(9).match(/\d/) !== null) {
        tempStr = tempStr.substring(0, 9) + tempStr.substring(10);
      }
      timeArr.push(tempStr.substring(0, 10));
      lyricArr.push(tempStr.substring(10));
    }
    
    return {
      timeArr: timeArr,
      lyricArr: lyricArr
    };
  },
});