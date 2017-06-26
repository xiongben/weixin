// pages/index/selectPage.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectPage:true,
    searchText:"",
    inputKeyword: "",
    currentTab: 0,
    start: [0, 0, 0],
    historyStart:0,
    limit: 8,
    resultArr: [[], [], []],
    noinfo:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotSearch();
    this.getHistory();
    
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
    if (!this.data.selectPage){
      wx.showLoading({
        title: "加载更多中..."
      });
      let index = this.data.currentTab;
      let keyword = this.data.keyword;
      this.getSearchResult(keyword, index, "more");
    }else{
      this.getHistory("more");
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getHotSearch();
    this.getHistory();
  },
  getHotSearch:function(){
    util.request('/program/search/hot_word_list', {
      withToken: false,
      method: 'GET',
      data: {
        start:0,
        limit:5
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          let data=res.data;
          this.setData({
            hotSearchList:data,
          })
          
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  formSubmit: function (e) {
    console.log(e.detail.value);
    console.log( e.detail.value);
    let keyword = e.detail.value.keyword;
    if(keyword != ""){
      let index = this.data.currentTab;
      this.setData({
        keyword:keyword,
        selectPage:false
      })
      this.getSearchResult(this.data.keyword, index);

    }else{
      wx.showToast({
        title: '关键词不能为空',
        icon: 'warn',
        duration: 2000
      })
    }
   
  },
  keyformSubmit:function(e){
    let keyword = e.detail.value;
    if (keyword != "") {
      let index = this.data.currentTab;
      this.setData({
        keyword: keyword,
        selectPage: false
      })
      this.getSearchResult(this.data.keyword, index);

    } else {
      wx.showToast({
        title: '关键词不能为空',
        icon: 'warn',
        duration: 2000
      })
    }
  },
  formReset: function () {
    console.log('form发生了reset事件');
    this.setData({
      keyword:'',
      selectPage: true,
      noinfo:false
    });
  },
  getHistory:function(more){
    if(!!more){
      this.setData({
        historyStart: this.data.historyStart+8
      })
    }
    util.request('/program/search/record_list', {
      withToken: true,
      method: 'GET',
      data: {
        start: this.data.historyStart,
        limit: this.data.limit
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          let data = res.data;
          if(!!more){
            let newhistoryList = this.data.historyList.concat(data);
            this.setData({
              historyList: newhistoryList,
            })
          }else{
            this.setData({
              historyList: data,
            })
          }
          
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  hotSearchkeyword:function(e){
    let keyword = e.currentTarget.dataset.keyword;
    this.setData({
      keyword: keyword,
      selectPage: false
    })
    let index = this.data.currentTab;
    this.getSearchResult(this.data.keyword, index);

  },
  clearHistory:function(){
    util.request('/program/search/delete_record', {
      withToken: true,
      method: 'POST',
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          this.setData({
            historyList: '',
          })
        } else if (res.ret === 45){
          util.showError("历史记录已为空");
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },

  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    this.setData({
       noinfo:false,
    });
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      });
      let index = e.target.dataset.current;
      let keyword = that.data.keyword;
      that.getSearchResult(keyword, index);

    }
  },
  getSearchResult: function (keyword, index, more) {
    let typeArr = ["song_info_list", "singer_list", "song_list"];
    let url = "/program/search/" + typeArr[index];
    let start;
    if (!!more) {
      let newStart = this.data.start;
      start = this.data.start[index] + 4;
      newStart[index] = start;
      this.setData({
        start: newStart,
      });
    } else {
      start = this.data.start[index];
    }
    util.request(url, {
      withToken: true,
      method: 'GET',
      data: {
        start: start,
        limit: this.data.limit,
        keyword: keyword
      },
      success: function (res) {
        wx.hideLoading();
        this.setData({
          noinfo: false
        });
        res = res.data;
        if (res.ret == 0) {
          let data = res.data;
          let searchArr = this.data.resultArr;
          if (!!more) {
            if (data == "") {
              wx.showToast({
                title: '此栏没有更多哦',
                icon: 'success',
                duration: 2000
              });
            }
            if (index == 0) {
              searchArr[index] = searchArr[index].concat(data.list);
            }else{
              searchArr[index] = searchArr[index].concat(data);
            }
          } else {
            if (data == ""||data.list =="") {
              this.setData({
                 noinfo:true
              });
            }
            searchArr[index] = data;
            if(index == 0){
              searchArr[index] = data.list;
            }
          }
          this.setData({
            resultArr: searchArr,
          });
          console.log(this.data.resultArr);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  // formSubmit: function (e) {
  //   console.log(e.detail.value);
  //   let keyword = e.detail.value.keyword;
  //   if (keyword != "") {
  //     this.setData({
  //       keyword: keyword
  //     });
  //     let index = this.data.currentTab;
  //     this.getSearchResult(keyword, index);
  //   } else {
  //     wx.showToast({
  //       title: '关键词不能为空',
  //       icon: 'warn',
  //       duration: 2000
  //     })
  //   }
  // },
  toAudioPlay: function (e) {
    let index = e.currentTarget.dataset.index;
    let songinfo = this.data.resultArr[0][index];
    songinfo = JSON.stringify(songinfo);
    wx.setStorageSync('singleinfo', songinfo);
    wx.navigateTo({
      url: '/pages/audioPlayer/audioPlay?id=single',
    })
  },
  toSingerDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/musician/musicianDetail?type=singerDetail&singerid=' + id,
    })
  },
  toSheetDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/list/songDetails?id=' + id,
    })
  },
})