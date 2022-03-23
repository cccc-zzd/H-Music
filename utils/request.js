//发送ajax请求
//引入
import config from "./config";

export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1)
      },
      success: (res) => {

        if (data.isLogin) {
          //如果是登录请求，将用户的cookies存入本地
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        resolve(res.data)
      },
      fail: (err) => {

        reject(err)
      }
    })
  })
}