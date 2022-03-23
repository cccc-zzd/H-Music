// pages/index/index.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],//轮播图数据
    recommendList: [],//推荐歌曲数据
    topList: []//排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    /*
      //将这个函数封装到request.js
      wx.request({
      url: 'http://localhost:3000/banner',
      data: {type: 2},
      success: () => {
        console.log('请求成功', res);
      },
      fail: () => {
        console.log('请求失败', onerror);
      }
    })*/
    let bannerListData = await request('/banner', {type: 2});
    this.setData({
      bannerList: bannerListData.banners,
    })
    let recommendListData = await request('/personalized', {limit: 10});
    this.setData({
      recommendList: recommendListData.result,
    })
    //获取排行榜数据
    //一个排行榜需要发送一次请求
    //飙升榜
    let resultArr = [];
    let topListData1 = await request('/toplist/detail', {id: 19723756});
    let topListItem1 = {
      name: topListData1.list[0].name,
      tracks: topListData1.list[0].tracks,
      imgUrl: topListData1.list[0].coverImgUrl
    };
    resultArr.push(topListItem1);
    this.setData({
      topList: resultArr
    })
    //新歌榜
    let topListData2 = await request('/toplist/detail', {id: 3779629});
    let topListItem2 = {
      name: topListData2.list[1].name,
      tracks: topListData2.list[1].tracks,
      imgUrl: topListData2.list[1].coverImgUrl
    }
    resultArr.push(topListItem2);
    this.setData({
      topList: resultArr
    })
    //原创榜
    let topListData3 = await request('/toplist/detail', {id: 2884035});
    let topListItem3 = {
      name: topListData3.list[2].name,
      tracks: topListData3.list[2].tracks,
      imgUrl: topListData3.list[2].coverImgUrl
    }
    resultArr.push(topListItem3);
    this.setData({
      topList: resultArr
    })
    //热歌榜
    let topListData4 = await request('/toplist/detail', {id: 3778678});
    let topListItem4 = {
      name: topListData4.list[3].name,
      tracks: topListData4.list[3].tracks,
      imgUrl: topListData4.list[3].coverImgUrl
    }
    resultArr.push(topListItem4);
    this.setData({
      topList: resultArr
    })
    //在此处更新topList的值，会导致发送请求的过程中页面长时间等待
    /*this.setData({
      topList: resultArr
    })*/
  },


  //跳转到toRecommendSong页面
  toRecommendSong() {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong'
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