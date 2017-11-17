const App = getApp()

Page({
  data: {
    userInfo: {},
    items: [
      {
        icon: '/assets/images/shouyi.png',
        text: '收益统计',
        path: '/pages/distribution/profit/index'
      },
      {
        icon: '/assets/images/down.png',
        text: '我的下级',
        path: '/pages/distribution/subordinate/index'
      },
      {
        icon: '/assets/images/up.png',
        text: '我的上级',
        path: '/pages/distribution/superior/index',
      },
      {
        icon: '/assets/images/erweima.png',
        text: '我的二维码',
        path: '/pages/distribution/qrcode/index',
      }
    ],
    fileBasePath: App.Config.fileBasePath,
    imgurl: "/assets/images/"
  },
  onLoad() {
    this.getUserInfo()
    this.getUserProperty()//获取 用户 股份
  },
  getUserProperty() {
    App.HttpService.llkpost('/liteapp/distribution/index').then(data => {

      this.setData({
        member: data.data,
        // profit:data.data
      })
    })
  },
  onPullDownRefresh: function () {
    this.getUserInfo()
    this.getUserProperty()//获取 用户 股份
    wx.stopPullDownRefresh()
  },
  navigateTo(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path
    App.WxService.navigateTo(path)
  },
  getUserInfo() {
    const userInfo = App.globalData.userInfo

    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
      return
    }
    App.getUserInfo()
      .then(data => {
        this.setData({
          userInfo: data
        })
      })
  },
  bindtap(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path

    switch (index) {
      case 0:
        App.WxService.showModal({
          title: '友情提示',
          content: '确定要清除缓存吗？',
        })
          .then(data => data.confirm == 1 && App.WxService.clearStorage())
        break
      default:
        App.WxService.navigateTo(path)
    }
  },
  logout() {
    App.WxService.showModal({
      title: '友情提示',
      content: '确定要登出吗？',
    })
      .then(data => data.confirm == 1 && this.signOut())
  },
  signOut() {
    App.HttpService.signOut()
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          App.WxService.removeStorageSync('token')
          App.WxService.redirectTo('/pages/login/index')
        }
      })
  },
  to_order(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/order/list/index?type=' + e.currentTarget.dataset.type,
    })
  }
})