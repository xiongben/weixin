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
    start:0,
    limit:10,
    swiperHeight:120*10,
    shareSongId:"",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTypeInfo();
    
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
        // 转发失败
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMoreList(this.data.currentTab);
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
    }
  },
  rulePage:function(){
    wx.navigateTo({ url: '/pages/index/rulePage' });
  },
  getTypeInfo:function(){
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
            idOne: data[0].id,
            idTwo: data[1].id
          });
          let [idOne, idTwo] = [this.data.idOne, this.data.idTwo];
          this.getListInfo(idOne,0);
          this.getListInfo(idTwo,1);
        }
        else {
          util.showError(res.msg);
        }
      }.bind(this)
    })
  },
  getListInfo:function(id,type){
    util.request('/program/pro_list/song_info_list', {
      withToken: false,
      method: 'GET',
      data: {
        categoryId:id,
        start:this.data.start,
        limit:this.data.limit,
      },
      success: function (res) {
        res = res.data;
        console.log(res);
        if (res.ret == 0) {
          let data=res.data.list;
          if(type == 0){
            this.setData({
              listInfoOne: data,
            });
          }else if(type == 1){
            this.setData({
              listInfoTwo: data,
            });
          }
        }
        else {
          util.showError(res.msg);
       }
      }.bind(this)
    })
  },
  getMoreList: function (currentTab){
    wx.showLoading({
      title: "加载更多中..."
    });
    let id;
    if(currentTab == 0){
       id=this.data.idOne;
    }else if(currentTab == 1){
      id=this.data.idTwo;
    }
    this.setData({
      start:this.data.start+10,
    });
    util.request('/program/pro_list/song_info_list',{
      withToken: false,
      method: 'GET',
      data: {
       start:this.data.start,
        limit: 10,
        categoryId: id,
      },
      success: function (res) {
        wx.hideLoading();
        let resdata = res.data.data.list;
        if (currentTab == 0) {
          console.log("加载更多");
          this.setData({
            listInfoOne: this.data.listInfoOne.concat(resdata),
          });
          this.setData({
            swiperHeight: this.data.listInfoOne.length * 120,
            typeOneHeight: this.data.listInfoOne.length * 120,
          });
        } else if (currentTab == 1) {
          this.setData({
            listInfoTwo: this.data.listInfoTwo.concat(resdata),
            typeTwoHeight: this.data.listInfoTwo.length * 120,
            swiperHeight: Math.max(this.data.typeOneHeight, this.data.typeTwoHeight),
          });
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
})