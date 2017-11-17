const App = getApp()

Page({
  data: {
    userInfo: {},
    items: [
      {
        icon: '/assets/images/gears.png',
        text: '账户管理',
        path: '/pages/mcenter/information/index'
      },
      // {
      //   icon: '/assets/images/home-big.png',
      //   text: '管理我的商家',
      //   path: '/pages/address/list/index'
      // },
      // {
      //   icon: '/assets/images/money.png',
      //   text: '余额充值',
      //   path: '/pages/money/money',
      // },
      {
        icon: '/assets/images/users.png',
        text: '我的分销',
        path: '/pages/distribution/distribution/index',
      },
      // {
      //   icon: '/assets/images/win.png',
      //   text: '中奖记录',
      //   path: '/pages/money/money',
      // },
      // {
      //   icon: '/assets/images/delivery.png',
      //   text: '我的快递',
      //   path: '/pages/money/money',
      // }
    ],
    settings: [
      {
        icon: '/assets/images/clear.png',
        text: '清除缓存',
        path: '0.0KB'
      },
      {
        icon: '/assets/images/about.png',
        text: '关于我们',
        path: '/pages/about/index'
      },
    ],
    fileBasePath: App.Config.fileBasePath,
    imgurl : "/assets/images/"
  },
  onLoad() {
    this.getUserInfo()
    this.getUserProperty()//获取 用户 股份
    this.getStorageInfo()
  },
  getUserProperty(){
    App.HttpService.llkpost('/liteapp/member/index').then(data=>{
      // console.log(data.data.member)
      data.data.member.money = data.data.member.money / 100
      data.data.member.face = this.data.fileBasePath +"/attachs/"+data.data.member.face
      this.setData({
        member:data.data.member
      })
    })
  },
  onPullDownRefresh: function () {
     this.getUserInfo()
    this.getUserProperty()//获取 用户 股份
    this.getStorageInfo()
    wx.stopPullDownRefresh()
  },
  navigateTo(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path

    // switch (index) {
    //   case 2:
    //     App.WxService.makePhoneCall({
    //       phoneNumber: path
    //     })
    //     break
    //   default:
        App.WxService.navigateTo(path)
    // }
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
  getStorageInfo() {
    App.WxService.getStorageInfo()
      .then(data => {
        // console.log(data)
        this.setData({
          'settings[0].path': `${data.currentSize}KB`//当前占用的空间大小, 单位kb
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
  to_order(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/order/list/index?type='+e.currentTarget.dataset.type,
    })
  }
})