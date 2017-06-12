// pages/list/monthWeekList.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareIcon:false,
    currentTab: 0,
    titleName:'',
    startArr:[0,0],
    limit:10,
    shareSongId:"",
    list:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeInfo(this.data.currentTab);
    
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
    this.setData({
      shareIcon:false,
    })
    return {
      title: '打榜歌曲',
      path: '/pages/list/monthWeekList?id='+this.data.shareSongId,
      success: function (res) {
        console.log("分享成功");
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
    wx.showLoading({
      title: '正在加载',
    });
    this.getTypeInfo(this.data.currentTab,"more");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      console.log(that.data.currentTab);
      this.getTypeInfo(that.data.currentTab);
    }
  },
  rulePage:function(){
    wx.navigateTo({ url: '/pages/index/rulePage' });
  },
  getTypeInfo: function (currentTab,more){
    util.request('/program/pro_category/get_all', {
      withToken: false,
      method: 'GET',
      data: {
        type:3
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          let data=res.data.list;
          this.setData({
            titleName:data,
            idArr: [data[0].id, data[1].id],
          });
          this.getListInfo(this.data.idArr[currentTab], currentTab,more);
          // this.getListInfo(this.data.idTwo,currentTab,more);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
 
  getListInfo: function (id,currentTab,more){
    if(!!more){
      let newStartArr=[];
      newStartArr[currentTab] = this.data.startArr[currentTab]+10;
      this.setData({
        startArr:newStartArr
      })
    }
    console.log(this.data.startArr[currentTab]);
    util.request('/program/pro_list/song_info_list', {
      withToken: false,
      method: 'GET',
      data: {
        categoryId: id,
        start: this.data.startArr[currentTab],
        limit: this.data.limit,
      },
      success: function (res) {
        res = res.data;
        if (res.ret == 0) {
          let data = res.data.list;
          if(data !=""){
            if(!!more){
              wx.hideLoading();
              let newList = this.data.list;
              newList[currentTab] = newList[currentTab].concat(data);
              this.setData({
                list: newList,
              })
            }else{
              let newList = this.data.list;
              newList[currentTab] = data;
              this.setData({
                list: newList,
              })
              console.log(this.data.list);
            }
          }else{
            wx.showToast({
              title: '没有更多了',
            });
          }
          console.log(this.data.list);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  shareSong:function(e){    
    let id = e.currentTarget.dataset.songid;
    this.setData({
      shareSongId:id,
      shareIcon:true,
    });
  
  },
  hideShareBack:function(){
    this.setData({
      shareIcon:!this.data.shareIcon,
    })
  },
  toAudioPlay: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/audioPlayer/audioPlay?id=' + id });
  },
})