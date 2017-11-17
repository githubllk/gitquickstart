const App = getApp()
Page({
    data: {
        indicatorDots: !1,
        autoplay: !1,
        current: 0,
        interval: 1000,
        duration: 1000,
        circular: !1,
        fileBasePath: App.Config.fileBasePath
    },
    onLoad() {},
    onShow() {},
    bindload(e) {
    	setTimeout(wx.getStorageSync('openId') ? this.goIndex : this.goLogin, 1000)
    },
    goIndex() {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    goLogin() {
      wx.navigateTo({
        url: '/pages/login/index'
        })
    },
})
