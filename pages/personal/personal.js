// pages/personal/personal.js
import request from "../../utils/request";

let startY = 0;  //手指起始的坐标
let moveY = 0;  //手指移动的坐标
let moveDistance = 0;   //手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(200)',
    coverTransition: '',
    userInfo: {},//用户信息
    recentPlayList: [],//用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户的信息
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      });
      //获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)

    }
  },
  //获取用户播放记录的功能函数
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request('/user/record', {uid: userId, type: 0});
    //由于获取的数组字段中没有唯一标识的值，需要在这里新加一个id。供wx.key使用
    let index = 0;
    let recentPlayList = recentPlayListData.allData.slice(0, 10).map((item) => {
      item.id = index++;
      return item;
    })
    this.setData({
      //key-value一致，所以可以省略
      /*recentPlayList:recentPlayList*/
      recentPlayList
    })
  },

  handleTouchStart(event) {
    this.setData({
      coverTransition: '',
    })
    //获取手指起始坐标
    startY = event.touches[0].clientY;

  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 80) {
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })

  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'

    })
  },
  /*跳转至登录页面的回调*/
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
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

  }
})