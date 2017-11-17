// pages/distribution/profit/index.js
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 'status/1',
    activeIndex: 0,
    p:0,
    navList: [],
    order: {},
    prompt: {
      hidden: !0,
      icon: '../../../assets/images/iconfont-order-default.png',
      title: '没有相关的数据',
      text: '可以去看看有哪些想买的',
    },
    tipText: "查看更多"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navList: [
        {
          title: '已分成',
          id: 'status/1',
        },
        {
          title: '已取消分成',
          id: 'status/2',
        }
      ]
    }),
      this.getList()
  },
  getList() {
    App.HttpService.llkget('/liteapp/distribution/profit/' + this.data.id).then(data => {
      if (data.code == 0) {
        this.setData({
          list: data.data.list,
          p: 1,
          totalPages: data.data.totalPages
        })
      }else{
       this.setData({
         'prompt.hidden': !1,
          tipText: "查看更多"
       })
      }
    })
  },
  onReachlist(){
    let that = this
    let p = this.data.p + 1
    console.log(this)
    App.HttpService.llkget('/liteapp/distribution/profit/' + this.data.id, {
      p: p
    }).then(data => {
      if (data.code == 0) {
        if(that.totalPages < p){
          this.setData({
            tipText: "没有更多了1..."
          })
        }else{
          this.setData({
            list: that.data.list.concat(data.data.list),
            p: p,
          })
        }
      } else {
        this.setData({
          // 'prompt.hidden': !1,
          tipText: "没有更多了..."
        })
      }
    })
  },
  onTapTag(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      id: id,
    })
    this.getList()
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
    this.onReachlist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})