// pages/audioPlayer/audioPlay.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    // name: '此时此刻',
    // author: '许巍',
    // src: 'http://xiongsanniu.com/music/0.mp3',
    // lrcsrc: 'http://xiongsanniu.com/music/data.json',
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
    height: 220,
    played_list: [],
    is_show_lyr: false,
    is_show_played: false,
    item: {
      id: '0',
      songName: "下完这场雨",
      singer: "后弦",
      poster: {
        origin:''
      },
      songSrc: "http://yinyueshiting.baidu.com/data2/music/5583b4d475d522a487f16d39b799a67e/272954076/272954076.mp3?xcode=c98405eb18453184b59adc403ebeee44",
      lyric: "[00:22.990]看昨天的我们 走远了↵[00:27.669]在命运广场中央 等待↵[00:32.976]那模糊的 肩膀↵"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      if(options.id =="all"){
        let playlist = wx.getStorageSync('playlist');
        playlist=JSON.parse(playlist);
        console.log(playlist);
        this.setData({
          played_list: playlist,
        });
        this.setData({
          item: this.data.played_list[0],
        });
        loadPage(this);
      } else if (options.id == "single"){
        let singleinfo = wx.getStorageSync('singleinfo');
        singleinfo = JSON.parse(singleinfo);
        console.log(singleinfo);
        this.setData({
          item: singleinfo,
        });
        loadPage(this);
      }

    }
    
    // this.getlyric();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    // wx.setNavigationBarTitle({
    //   title:this.data.item.songName,
    // })
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
     console.log("下拉动作");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      console.log("上拉动作");
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
  // audioPlay: function () {
  //   this.audioCtx.play()
  // },
  // audioPause: function () {
  //   this.audioCtx.pause()
  // },
  // audio14: function () {
  //   this.audioCtx.seek(14)
  // },
  // audioStart: function () {
  //   this.audioCtx.seek(0)
  // },
  //展示播放过的列表
  showPlayed: function () {
    var flag = this.data.is_show_played;
    this.setData({
      is_show_played: !flag
    })
  },
  //删除所有歌曲
    delAllSong: function () {
    this.setData({
      played_list: []
    })
    wx.setStorageSync('playlist', []);
  },
  //切换歌曲
  changeSong: function (e) {
    var id = e.currentTarget.dataset.id;
    this.data.played_list.forEach(ele => {
      this.data = Object.assign(this.data)
      if (ele.id == id) {
        this.setData({
          item: ele,
          is_show_played: false
        })
        console.log(this.data.item);
        loadPage(this);
      }
    })
  },
  showLyr: function () {
    if (!this.data.is_show_lyr) {
      this.setData({
        is_show_lyr: true,
        height: 640
      })
    } else {
      this.setData({
        is_show_lyr: false,
        height: 220
      })
    }
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
 
  //播放暂停
  playSong: function () {
    if (!this.data.isPlaying) {
      play(this);
    } else {
      wx.pauseBackgroundAudio({})
      this.setData({
        isPlaying: false,
      })
    }
  },
  //拖动滚动条
  changeSongPross: function (e) {
    this.setData({
      current: e.detail.value,
      cur_time: util.formate(e.detail.value)
    })
    play(this)
  },
  //前一首歌曲
  prevSong: function () {
    var ele;
    for (var i = 0; i < this.data.played_list.length; i++) {
      if (this.data.played_list[i].id == this.data.item.id) {
        if (i != 0) {
          // this.data = Object.assign(this.data, initData)
           ele = this.data.played_list[i - 1];
        }else{
          ele = this.data.played_list[i];
          wx.showToast({
            title: '已是第一首',
            icon: 'success',
            duration: 2000
          });
        }
      }
    }
    this.setData({
      item: ele
    })
    loadPage(this);
  },
  //下一首歌曲
  nextSong: function () {
    var l = this.data.played_list.length;
    var ele;
    for (let i = 0; i < l; i++) {
      if (this.data.played_list[i].id == this.data.item.id) {
        if (i != l - 1) {
          // this.data = Object.assign(this.data)
           ele = this.data.played_list[i + 1];
        }else{
          ele = this.data.played_list[i];
          wx.showToast({
            title: '已是最后一首',
            icon: 'success',
            duration: 2000
          });
        }
      }
    }
    this.setData({
      item: ele
    })
    console.log(this.data.item);
    loadPage(this)
  },
  getlyric: function (url) {
    util.request(url, {
      success: function (res) {
        console.log(res);
        this.setData({
          played_list: res.data
        });
        let lyric = this.createArrMap(res.data[0].lyric);
        this.renderLyric(lyric);
      }.bind(this)
    })
  },
  getOnlyPlay:function(id){
    util.request('/program/pro_song_info/get_song_info', {
      withToken: false,
      method: 'GET',
      data: {
        id:id,
      },
      success: function (res) {
        wx.hideLoading();
        res = res.data;
        if (res.ret == 0) {
          this.setData({
            item:res.data
          })
          console.log(this.data.item);
          loadPage(this);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
});

function play(page) {
  wx.playBackgroundAudio({
    dataUrl: page.data.item.music,
    success: function (res) {
      wx.seekBackgroundAudio({
        position: page.data.current
      })
    }
  })
  page.setData({
    isPlaying: true,
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
  //  let time = setInterval(function () {
  //   if (page.data.isPlaying) {
  //     animation(page)
  //   }
  // }, 20);

  wx.setNavigationBarTitle({
    title: page.data.item.name,
  })
}

function animation(page) {
  var angle = page.data.angle + 0.5;
  page.setData({
    angle: angle
  })
}

//加载歌词
function loadLyr(page) {
  let lyric = page.data.item.lyric;
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
  // return {
  //   timeArr: timeArr,
  //   lyricArr: lyricArr
  // };
  page.setData({
    lyricArr: lyricArr
  })
  
}

