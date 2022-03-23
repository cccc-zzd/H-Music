import request from "../../../utils/request";
import PubSub from "pubsub-js"
import moment from "moment";
//本页面是发布方，给songDetail发送消息

//获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,//音乐是否在播放
    song: {},//歌曲详情对象
    musicId: '',//音乐id
    musicLink: '', // 音乐的链接
    currentTime: '00:00',//当前时长
    durationTime: '00:00',//总时长
    currentWidth: 0,//实时进度条宽度

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;

    this.setData({
      musicId
    })
    this.getMusicInfo(musicId);
    /*
    * 如果用户操作 系统的播放暂停按钮，页面不知道，会导致两边的表现不一样
    * 解决：
    *   1.通过控制音频的实例backgroudAudioManager去监视音乐播放暂停
    * */
    //判断当前页面是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }

    //创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    //监视播放\暂停\终止
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      //修改全局音乐播放的状态
      appInstance.isMusicPlay = true;
      appInstance.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
      //修改全局音乐播放的状态
      appInstance.isMusicPlay = false;
      /*appInstance.musicId = musicId;*/
    });
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
      //修改全局音乐播放的状态
      appInstance.isMusicPlay = false;
      /*appInstance.musicId = musicId;*/
    });
    //监听音乐播放自动结束
    this.backgroundAudioManager.onEnded(() => {
      //自动切换下一首且自动播放
      PubSub.publish('switchType', 'next');
      //将实时进度还原成0
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })

    });
    //监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },
  //修改音乐播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    //修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  //获取音乐详情
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {ids: musicId});
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  //点击播放暂停的回调
  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    /* this.setData({
       isPlay
     })*/
    let {musicId, musicLink} = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  //控制音乐的暂停和播放
  async musicControl(isPlay, musicId, musicLink) {

    if (isPlay) {
      if (!musicLink) {
        //获取音乐播放连接
        let musicLinkData = await request('/song/url', {id: musicId});
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      this.backgroundAudioManager.pause();

    }
  },

  //点击切歌的回调
  handleSwitch(event) {
    //获取切歌的类型
    let type = event.currentTarget.id;
    //关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    //发布消息给recommendSong界面
    PubSub.publish('switchType', type)
    //订阅回传的音乐id
    PubSub.subscribe('musicId', (msg, musicId) => {

      //获取音乐详细信息
      this.getMusicInfo(musicId);
      //自动播放
      this.musicControl(true, musicId)
      //取消订阅
      PubSub.unsubscribe('musicId');
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