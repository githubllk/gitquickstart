const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    p: 0,
    navList: [],
    order: {},
    prompt: {
      hidden: !0,
      icon: '/assets/images/iconfont-order-default.png',
      title: '没有相关的数据',
      text: '可以去看看有哪些想买的',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getList()
  },
  getList() {
    App.HttpService.llkget('/liteapp/distribution/superior').then(data => {
      if (data.code == 0) {
        this.setData({
          list: data.data,
        })
      } else {
        this.setData({
          'prompt.hidden': !1,
          tipText: ""
        })
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})