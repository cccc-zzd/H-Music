// pages/recommendSong/recommendSong.js
import request from "../../../utils/request";
import PubSub from "pubsub-js"
//本页面是订阅方，接收songDetail的消息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: '',
    dat: '',
    recommendList: [],
    index: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    //更新日期数据
    this.setData({
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    })
    //获取每日推荐数据
    this.getRecommendList();

    //订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let {recommendList, index} = this.data;
      if (type === 'pre') {
        (index === 0) && (index = recommendList.length);
        index -= 1;
      } else {
        (index === recommendList.length - 1) && (index = -1)
        index += 1;
      }
      this.setData({
        index
      })

      let musicId = recommendList[index].id;
      //将musicId回传给songDetail页面
      PubSub.publish('musicId', musicId)
    })

  },

  //获取用户每日推荐数据
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs');
    this.setData({
        recommendList: recommendListData.recommend
      }
    )
  },
  toSongDetail(event) {
    let song = event.currentTarget.dataset.song;
    let index = event.currentTarget.dataset.index;
    this.setData({
      index
    })
    //路由跳转传参

    wx.navigateTo({
      /*不能直接传对象，太长了，会被截取*/
      /*url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song)*/
      url: '/songPackage/pages/songDetail/songDetail?musicId=' + song.id
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