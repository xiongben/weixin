// pages/audioPlayer/audioPlay.js
var util = require('../../utils/util.js');
var time;
var outTime;
var getTimesOut;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showControl: false,
    lyricArr: [],
    timeArr: [],
    showArr: [],
    lrcHighIndex: 0,
    currentPosition: 0,
    status: 0,
    isPlaying: true,
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
    item: {},
    loveSongIf: false,
    noLyric: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      console.log(options);
      this.setData({
        option: options
      })
      // if (options.id == "all") {
      //   let index = options.index;
      //   let listsrc = options.url;
      //   listsrc = JSON.parse(listsrc);
      //   if (options.singerId) {
      //     listsrc = listsrc + "?singerId=" + options.singerId;
      //   } else if (options.sheetId) {
      //     listsrc = listsrc + "?id=" + options.sheetId;
      //   } else if (options.categoryId){
      //     listsrc = listsrc + "?categoryId=" + options.categoryId;
      //   }

      //   this.setData({
      //     showControl: true,
      //     playIndex: index
      //   });

      //   this.getMoreList(listsrc);
      // }
      // else {
      //   // this.audioCtx = wx.createAudioContext('myAudio');
      //   this.getIdSong(options.id);
      // }
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    
    if (this.data.option.id == "all") {
      let index = this.data.option.index;
      let listsrc = this.data.option.url;
      listsrc = JSON.parse(listsrc);
      if (this.data.option.singerId) {
        listsrc = listsrc + "?singerId=" + this.data.option.singerId;
      } else if (this.data.option.sheetId) {
        listsrc = listsrc + "?id=" + this.data.option.sheetId;
      } else if (this.data.option.categoryId) {
        listsrc = listsrc + "?categoryId=" + this.data.option.categoryId;
      }

      this.setData({
        showControl: true,
        playIndex: index
      });

      this.getMoreList(listsrc);
    }
    else {
      // this.audioCtx = wx.createAudioContext('myAudio');
      this.getIdSong(this.data.option.id);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.audioCtx = wx.createAudioContext('myAudio');
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
        path: '/pages/index/index',
        success: function (data) {

        },
      }
    }
    
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
    wx.stopPullDownRefresh();
  },
  
  //删除所有歌曲
  delAllSong: function () {
    this.setData({
      played_list: []
    })
    wx.setStorageSync('playlist', []);
  },
  backList:function(){
    this.setData({
      is_show_played: false,
    })
  },
  //切换歌曲
  changeSong: function (e) {
    var id = e.currentTarget.dataset.id;
    this.data.played_list.forEach(ele => {
      this.data = Object.assign(this.data)
      if (ele.id == id) {
        this.setData({
          item: ele,
          is_show_played: false,
          current: 0
        })
        // clearInterval(time);
        // console.log(this.data.item);
        // loadPage(this);
        this.play();
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
      this.play();
    } else {
      wx.pauseBackgroundAudio({})
      this.setData({
        isPlaying: false,
      })
    }
  },
  // 拖动滚动条
  changeSongPross: function (e) {
    this.setData({
      current: e.detail.value,
      cur_time: util.formate(e.detail.value)
    })
    // this.audioCtx.seek(e.detail.value);
    // this.play();
  },
  //前一首歌曲
  prevSong: function () {
    var ele;
    for (var i = 0; i < this.data.played_list.length; i++) {
      if (this.data.played_list[i].indexNum == this.data.item.indexNum) {
        if (i != 0) {
          // this.data = Object.assign(this.data, initData)
          ele = this.data.played_list[i - 1];
        } else {
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
      item: ele,
      current: 0
    })
    clearInterval(time);
    // loadPage(this);
    this.play();
  },
  //下一首歌曲
  nextSong: function () {
    var l = this.data.played_list.length;
    var ele;
    for (let i = 0; i < l; i++) {
      if (this.data.played_list[i].indexNum == this.data.item.indexNum) {
        if (i != l - 1) {
          // this.data = Object.assign(this.data)
          ele = this.data.played_list[i + 1];
        } else {
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
      item: ele,
      current: 0
    })
    clearInterval(time);
    // console.log(this.data.item);
    // loadPage(this)
    this.play();
  },
  songEnd: function () {
    this.nextSong();
  },
  getMoreList: function (url, list) {
    console.log(this.audioCtx);
    let limit = 100;
    util.request(url, {
      withToken: true,
      method: 'GET',
      data: {
        start: 0,
        limit: limit,
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          if (res.data.list) {
            // var newplayed_list = this.data.played_list.concat(res.data.list);
            var newplayed_list = res.data.list;
            for (let i = 0; i < newplayed_list.length; i++) {
              newplayed_list[i].indexNum = i;
              newplayed_list[i].cover = util.calcCenterImg(newplayed_list[i].cover, 1, 1);
            }
            this.setData({
              played_list: newplayed_list
            })
            this.setData({
              item: this.data.played_list[this.data.playIndex],
            });
            console.log(this.data.item);
            // loadPage(this);
            this.play();
          } else if (res.data.songList) {
            var newplayed_list = res.data.songList;
            for (let i = 0; i < newplayed_list.length; i++) {
              newplayed_list[i].indexNum = i;
              newplayed_list[i].cover = util.calcCenterImg(newplayed_list[i].cover, 1, 1);
            }
            this.setData({
              played_list: newplayed_list
            })
            this.setData({
              item: this.data.played_list[this.data.playIndex],
            });
            console.log(this.data.item);
            clearTimeout(outTime);
            let that=this;
            outTime=setTimeout(function(){
              that.play();
            },1000);
            
            // loadPage(this);
          }

        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  getIdSong: function (id) {
    util.request('/program/pro_song_info/get_song_info', {
      withToken: false,
      method: 'GET',
      data: {
        id: id
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          this.setData({
            item: res.data,
          });
          let that = this;
          outTime = setTimeout(function () {
            that.play();
          }, 1000);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  loveSong: function (e) {
    let id = this.data.item.id;
    let newItem = this.data.item;
    newItem.isLike = !newItem.isLike;
    this.setData({
      item: newItem
    });
    let url;
    if (!this.data.item.isLike) {
      url = '/program/pro_song_info/delete_song_like';
    } else {
      url = '/program/pro_song_info/add_song_like';
    }
    util.request(url, {
      withToken: true,
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          console.log("loveSongChange");
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })

  },
  showPlayed: function () {
    var flag = this.data.is_show_played;
    this.setData({
      is_show_played: !flag
    })
  },
  collectSong: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/addToSheet?songid=' + id,
    })
  },
  play: function () {
    wx.playBackgroundAudio({
      dataUrl: this.data.item.music,
      success: function (res) {
        wx.seekBackgroundAudio({
          position: this.data.current,
        });
      }.bind(this)
    });

    this.setData({
      isPlaying: true,
    })
    clearInterval(time);
    let page = this;
    time = setInterval(function () {
      playing(page);
    }, 2000);
    loadLyr(this);
    let playInfo=JSON.stringify(this.data.item.name);
    clearTimeout(getTimesOut);
    getTimesOut=setTimeout(function(){
      countRecentTime(page);
      wx.setStorageSync('playName', playInfo);
    },5000);
  }
});

// function play(page) {
//   page.audioCtx = wx.createAudioContext('myAudio');
//   page.audioCtx.setSrc(this.data.item.music);
//   page.setData({
//     isPlaying: true,
//   })
//   setTimeout(function(){
//     page.audioCtx.play();
//   },2000);

// }

//播放中
function playing(page) {
  console.log("playing执行吃书");

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
        if (page.data.duration - page.data.current <= 1) {
          page.setData({
            current: 0,
          });
          page.nextSong();
        }
      }
      //循环播放,
      // console.log(page.data.duration+":"+page.data.current);
      if (page.data.duration - page.data.current <= 1) {
        page.setData({
          current: 0,
        });
      }

    }
  })
}

// function loadPage(page) {
//   console.log("loadpage执行吃书");
//   countRecentTime(page)
//   播放
//   play(page);
//   loadLyr(page);
//   记录播放状态
//   playing(page);
//   clearInterval(time);

//   time = setInterval(function () {
//     playing(page);
//   }, 2000);


//   wx.setNavigationBarTitle({
//     title: page.data.item.name,
//   })
// }

function animation(page) {
  var angle = page.data.angle + 1;
  page.setData({
    angle: angle
  })
}

//加载歌词
function loadLyr(page) {
  let lyric = page.data.item.lyrics;
  page.setData({
    noLyric: lyric == "",
  });

  var timeArr = [],
    lyricArr = [];
  var tempArr = lyric.split("\n");
  tempArr.splice(-1, 1);
  tempArr.splice(0, 3);
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

function countRecentTime(page) {
  util.request('/program/pro_song_info/add_song_play', {
    withToken: true,
    method: 'POST',
    data: {
      id: page.data.item.id,
    },
    success: function (res) {
      res = res.data;
      if (res.ret == 0) {
        util.request('/program/pro_list/add_play_score', {
          withToken: true,
          method: 'POST',
          data: {
            songInfoId: page.data.item.id,
          },
          success: function (res) {
            res = res.data;
            if (res.ret == 0) {

            }
          }.bind(page)
        })
      }
      else {
        util.showError(res.msg);
      }
    }.bind(page)
  })
}

