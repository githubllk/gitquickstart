import polyfill from 'assets/plugins/polyfill'
import WxValidate from 'helpers/WxValidate'
import HttpResource from 'helpers/HttpResource'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Config from 'etc/config'
App({
  onLaunch() {
    console.log('onLaunch')
  },
  onShow() {
    this.WxService.setStorageSync('PHPSESSID', null)//清空cookice,重新获取
    const params = {
      openId: wx.getStorageSync('openId'),
    }
    this.HttpService.llkpost('/liteapp/index/start',params).then(data => {
      if (data.code == 0) {
        this.WxService.setStorageSync('PHPSESSID', data.data.PHPSESSID)
        this.WxService.setStorageSync('uid', data.data.uid)
      }else{
        this.WxService.showModal({
          title: '友情提示',
          content: '服务器繁忙--1023',
          showCancel: !1,
        })
      }
    })

    console.log('onShow1111')
    
    // this.getRequest()
  },
  getUserInfo() {
    return this.WxService.login()
      .then(data => {
        // console.log(22222221)
        // console.log(data)
        return this.WxService.getUserInfo()
      })
      .then(data => {
        // console.log(data)
        this.globalData.userInfo = data.userInfo
        return this.globalData.userInfo
      })
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  },
  renderImage(path) {
    if (!path) return ''
    if (path.indexOf('http') !== -1) return path
    return `${this.Config.fileBasePath}${path}`
  },
  globalData: {
    userInfo: null
  },
// TODO 格式化钱
  formatMoney(money){
    return Math.round(money/100);////////////10.13
  },
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
  HttpService: new HttpService,
  WxService: new WxService,
  Tools: new Tools,
  Config: Config,
  /////遍历报错图片加载默认
  //e  wxml传过来的值 n 当前遍历数组名
  imgErrs(e,n) {
    let errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    
    let imgObject = n + '[' + errorImgIndex + '].photo' //carlistData为数据源，对象数组
    let errorImg = {}
    errorImg[imgObject] = this.Config.fileBasePath + "/upload/default.png" //我们构建一个对象
    // this.setData(errorImg) //修改数据源对应的数据
    
    return errorImg
  },
})