// pages/login/login.js
/*
* 登录流程
* 1.收集表单数据
* 2.前端验证
*   1-验证用户信息是否合法
*   2-前端验证不通过就提示，且不发请求给后端
*   3-验证通过，发请求（携带账号，密码）
* 3.后端验证
*   1-验证用户是否存在-----不存在，直接告诉前端不存在
*                  -----存在就验证密码
*   2-正确则返回给前端数据，提示登录成功（会携带用户的信息）
*
* */
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    password: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /*表单内容发生改变回调*/
  handleInput(event) {
    /*let type = event.currentTarget.id;  //id传值    */
    let type = event.currentTarget.dataset.type;
    /*对象里面操作变量，需要给变量加[]*/
    this.setData({
      [type]: event.detail.value
    })
  },
  //登录的回调
  async login() {
    //1.收集表单项数据
    let {email, password} = this.data;
    //2.前端验证
    /*if (!phone) {
      wx.showToast({
        title: '没手机是吧？？？',
        icon: "none"
      })
      return;
    }*/
    //定义正则
    /*let phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号也记不住是吧？？？',
        icon: "none"
      })
      return;
    }*/
    if (!password) {
      wx.showToast({
        title: '好家伙，想偷渡是吧？？？',
        icon: "none"
      })
      return;
      ;
    }
    //包含字母、数字、符号中至少两种
    // 密码长度为8-20位
    let passwordReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;
    /*if (!passwordReg.test(password)) {
      wx.showToast({
        title: '不会有人连密码都记不住吧？？？',
        icon: "none"
      })
      return;
    }*/
    /*wx.showToast({
      title: '赶快进入云村吧'
    })*/
    /*后端验证*/
    let result = await request('/login', {email, password, isLogin: true})
    if (result.code == 200) {
      wx.showToast({
        title: '赶快进入云村吧',
      })

      /*console.log(JSON.stringify(result.profile.backgroundUrl))*/
      /*将用户的信息存储在本地*/
      wx.setStorageSync('userInfo', JSON.stringify(result.profile));
      //跳转到个人中心页面
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    } else if (result.code == 400) {
      wx.showToast({
        title: '手机号也记不住是吧',
        icon: "none"
      })
    } else if (result.code == 502) {
      wx.showToast({
        title: '不会有人连密码都记不住吧？？？',
        icon: "none"
      })
    } else {
      wx.showToast({
        title: '登录失败，建议去QQ音乐',
        icon: "none"
      })
    }

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