// pages/audioPlayer/audioPlay.js
var util = require('../../utils/util.js');
var time;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showControl:false,
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
    item: {},
    loveSongIf:false,
    noLyric:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      console.log(options);
      if(options.id =="all"){
        let index=options.index;
        let playlist = wx.getStorageSync('playlist');
        let listsrc = wx.getStorageSync('listsrc');
        playlist=JSON.parse(playlist);
        listsrc = JSON.parse(listsrc);
        // console.log(playlist);
        // console.log(listsrc);

        for(let i=0;i<playlist.length;i++){
           playlist[i].indexNum=i;
        }
        this.setData({
          played_list: playlist,
          showControl:true,
        });
        console.log(this.data.played_list);
        this.setData({
          item: this.data.played_list[index],
        });
        console.log(this.data.item);
        loadPage(this);
        this.getMoreList(listsrc, this.data.played_list);
      }
       else if (options.id == "single"){
        let singleinfo = wx.getStorageSync('singleinfo');
        singleinfo = JSON.parse(singleinfo);
        console.log(singleinfo);
        this.setData({
          item: singleinfo,
        });
        loadPage(this);
      }else{
        this.getIdSong(options.id);
      }
    }
    
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
  onShareAppMessage: function (res) {
    let that = this;
    return {
      title: '打榜歌曲',
      path: '/pages/audioPlayer/audioPlay?id=' + res.target.dataset.songid,
      success: function (res) {
        console.log("分享成功");
        util.sharefn(res.target.dataset.songid);
      },
      fail: function (res) {
        wx.showToast({
          title: '打榜失败',
        });
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

  },
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
          is_show_played: false,
          current:0
        })
        clearInterval(time);
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
  // changeSongPross: function (e) {
  //   this.setData({
  //     current: e.detail.value,
  //     cur_time: util.formate(e.detail.value)
  //   })
  //   play(this)
  // },
  //前一首歌曲
  prevSong: function () {
    var ele;
    for (var i = 0; i < this.data.played_list.length; i++) {
      if (this.data.played_list[i].indexNum == this.data.item.indexNum) {
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
      item: ele,
      current:0
    })
    clearInterval(time);
    loadPage(this);
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
      item: ele,
      current:0
    })
    clearInterval(time);
    console.log(this.data.item);
    loadPage(this)
  },

  getMoreList:function(url,list){
    let start=list.length;
    let limit=100;
    util.request(url, {
      withToken: true,
      method: 'GET',
      data: {
        start:start,
        limit:limit
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          let newplayed_list = this.data.played_list.concat(res.data.list);
          for (let i = 0; i < newplayed_list.length; i++) {
            newplayed_list[i].indexNum = i;
          }
          this.setData({
            played_list: newplayed_list
          })
          console.log(this.data.played_list);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  getIdSong:function(id){
    util.request('/program/pro_song_info/get_song_info', {
      withToken: true,
      method: 'GET',
      data: {
        id:id
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          this.setData({
            item: res.data,
          });
          loadPage(this);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  loveSong:function(e){
    let id = this.data.item.id;
    this.setData({
      loveSongIf:!this.data.loveSongIf
    });
    let url;
    if (this.data.loveSongIf){
      url ='/program/pro_song_info/delete_song_like';
    }else{
      url ='/program/pro_song_info/add_song_like';
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
 
  collectSong:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/addToSheet?songid='+id,
    })
  },
});

function play(page) {
  console.log(page.data.current);
  wx.playBackgroundAudio({
    dataUrl: page.data.item.music,
    // coverImgUrl:page.data.item.cover,
    success: function (res) {
      wx.seekBackgroundAudio({
        position: page.data.current,
      });
      let playSongInfo={
        cover: page.data.item.cover,
        name: page.data.item.name,
        singer: page.data.item.singerName
      };
      playSongInfo = JSON.stringify(playSongInfo);
      wx.setStorageSync('playSongInfo', playSongInfo);
      // page.globalData.playSongInfo = playSongInfo;
    }
  })
  page.setData({
    isPlaying: true,
  })
}

//播放中
function playing(page) {
  // console.log("playing执行吃书");
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
      // console.log(page.data.duration+":"+page.data.current);
      if (page.data.duration - page.data.current <= 1) {
        // page.setData({
        //   current: 0,
        //   cur_time: '0:00'
        // })
        // play(page)
        page.setData({
          current: 0,
        });
       
        // console.log("看你有几次");
        page.nextSong();
      }
    }
  })
}

function loadPage(page) {
  // console.log("loadpage执行吃书");
  countRecentTime(page)
  //播放
  play(page);
  loadLyr(page);
  //记录播放状态
  // playing(page);
  time=setInterval(function () {
    playing(page);
  }, 1000);
 // 动画头像
  //  let times = setInterval(function () {
  //   if (page.data.isPlaying) {
  //     animation(page)
  //   }
  // }, 20);
  
  wx.setNavigationBarTitle({
    title: page.data.item.name,
  })
}

function animation(page) {
  var angle = page.data.angle +1;
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

function countRecentTime(page){
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

