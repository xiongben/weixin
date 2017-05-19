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
    lrcsrc: 'http://xiongsanniu.com/music/data.json',
    lyricArr: [],
    timeArr: [],
    showArr: [],
    lrcHighIndex: 0,
    currentPosition: 0,
    status: 0,

    isPlaying: false,
    song_lyr: [],
    cur_time: "0:00",
    total_time: "0:00",
    duration: 0,
    current: 0,
    angle: 0,
    top: 0,
    textActive: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    loadPage(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

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
        // console.log(res);
        let lyric = this.createArrMap(res.data[0].lyric);
        // console.log(lyric);
        this.renderLyric(lyric);
      }.bind(this)
    })
  },
  createArrMap: function (lyric) {
    var timeArr = [],
      lyricArr = [];
    var tempArr = lyric.split("\n");
    tempArr.splice(-1, 1);
    var tempStr = "";
    for (let i = 0; i < tempArr.length; i++) {
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
  renderLyric: function (obj) {
    this.setData({
      lyricArr: obj.lyricArr,
      timeArr: obj.timeArr
    });

  },
  formatLyricTime: function (timeArr) {
    var result = [];
    var time = 0;
    var m = 0;
    var s = 0;
    for (let i = 0; i < timeArr.length; i++) {
      time = timeArr[i].replace(/[\[]|]|\s|:/ig, "");
      m = +time.substring(0, 2);
      s = +time.substring(2);
      result.push(Math.floor(m * 60 + s));
    }
    return result;
  },
  syncLyric: function (curS, formatTimeArr) {
    if (Math.floor(curS) >= formatTimeArr[IrcHighIndex]) {
      let showArr = this.data.showArr;
      showArr[IrcHighIndex] = true;
      this.setData({
        showArr: showArr
      });
    }
    IrcHighIndex++;
  },
  timeUpData: function () {
    // wx.playBackgroundAudio({
    //   dataUrl: this.data.src,
    //   success: function (res) {
    //     console.log(res);
    //     wx.seekBackgroundAudio({
    //       position: 0
    //     });
        
    //   }
    // });
    // wx.stopBackgroundAudio();

    var that = this;
    // var time=setTimeout(function(){
    //   wx.seekBackgroundAudio({
    //     position:20
    //   });
    //   wx.onBackgroundAudioPlay(function(){
    //   wx.getBackgroundAudioPlayerState({
    //     success: function (res) {
    //       console.log(res);
    //     }
    //   })
    // })
    // },1000);

    wx.onBackgroundAudioPlay(function(){
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          console.log(res);
        }
      })
    });
  },
  //播放暂停
  playSong: function () {
    if (!this.data.isPlaying) {
      play(this);
    } else {
      wx.pauseBackgroundAudio({})
      this.setData({
        isPlaying: false
      })
    }
  },
  //拖动滚动条
  changeSongPross: function (e) {
    this.setData({
      current: e.detail.value,
      cur_time:util.formate(e.detail.value)
    })
    play(this)
  },
});

function play(page){
  wx.playBackgroundAudio({
    dataUrl: page.data.src,
    success: function (res) {
      wx.seekBackgroundAudio({
        position: page.data.current
      })
    }
  })
  page.setData({
    isPlaying: true
  })
}

//播放中
function playing(page) {
  wx.getBackgroundAudioPlayerState({
    success: function (res) {
      if (!page.data.duration) {
        page.setData({
          duration: parseInt(res.duration),
          total_time: util.formate(res.duration)
        })
      }
      if (res.status == 1) {
        page.setData({
          current: res.currentPosition,
          cur_time: util.formate(res.currentPosition)
        })
        // scrollLyr(page)
      }
      //循环播放,这里存在bug，差值可能为1
      if (page.data.duration - page.data.current <= 1) {
        page.setData({
          current: 0,
          cur_time: '0:00'
        })
        play(page)
      }
    }
  })
}

function loadPage(page) {
  //播放
  play(page);
  // loadLyr(page);
  //记录播放状态
  playing(page);
  setInterval(function () {
    playing(page)
  }, 1000);
  //动画头像
  // setInterval(function () {
  //   if (page.data.isPlaying) {
  //     animation(page)
  //   }
  // }, 100)
}