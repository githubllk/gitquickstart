// mall.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter:
    {
      imgurl: '../../assets/images',
      selectPerson1: true,
      selectPerson2: true,
      selectPerson3: true,
      selectArea1: false,
      selectArea2: false,
      selectArea3: false,
    },
    goods: [],
    lastLoadTime: 0,//上一次load的时间
    tipText: "查看更多"
  },
  //点击选择类型 wx.navigateBack()
  clickPerson: function (e) {
    var selectPerson = this.data.selectPerson;
    var da = e.currentTarget.dataset.ta
    var tt = this
    var filter = this.data.filter
    switch (da) {
      case '1':
        var se1 = this.data.filter.selectArea1 ? false : true
        filter.selectArea1 = se1,
          filter.selectArea2 = false,
          filter.selectArea3 = false,
          filter.selectPerson1 = !se1,
          filter.selectPerson2 = true,
          filter.selectPerson3 = true,
          this.setData({
            filter: filter
          })
        break
      case '2':
        var se2 = this.data.filter.selectArea2 ? false : true
        filter.selectArea2 = se2,
          filter.selectArea1 = false,
          filter.selectArea3 = false,
          filter.selectPerson2 = !se2,
          filter.selectPerson1 = true,
          filter.selectPerson3 = true
        this.setData({
          filter: filter
        })
        break
      case '3':
        var se3 = this.data.filter.selectArea3 ? false : true
        filter.selectArea3 = se3,
          filter.selectArea1 = false,
          filter.selectArea2 = false,
          filter.selectPerson3 = !se3,
          filter.selectPerson1 = true,
          filter.selectPerson2 = true
        this.setData({
          filter: filter
        })
        break
      default:
        break
    }
  },
  // navigateTo(e) {
  //   console.log(e)
  //   // wx.navigateTo({
  //   //   url: '../goods/deile?deile_id=' + e.currentTarget.id,
  //   // })
  // },
  //点击切换
  mySelect: function (e) {
    this.setData({
      firstPerson: e.target.dataset.me,
      selectPerson: true,
      selectArea: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading',
    //   duration: 10000,
    //   mask: !0,
    // })
    this.getgoodsinfo()
    this.getcartnumcart()//获取购物车数量
  },

  //获取goods
  getgoodsinfo() {
    App.HttpService.llkget('/liteapp/mall/loaddata', {
    }).then(data => {
      if (data.code == 0) {
        console.log(data)

        data.data.forEach(n => n.photo = App.renderImage("/attachs/" + n.photo));
        data.data.forEach(n => n.mall_price = App.formatMoney(n.mall_price));
        data.data.forEach(n => n.price = App.formatMoney(n.price));

        this.setData({
          goods: data.data,
          p: 1
        })
        this.showToast(data.message)
      }
    });
    // this.setData({
    //   goods: [
    //     {
    //       title: 222222222222222,
    //       desc: 22222222,
    //       red: 4,
    //       grep: 111,
    //       id: 1,
    //     }
    //   ]
    // })
  },
  pullUpLoad: function (e) {
    var that = this
    var curTime = e.timeStamp;
    //上一次加载的时间
    var lastTime = this.data.lastLoadTime;
    if (curTime - lastTime < 300) {
      console.log("不正常的加载间隔时间");
      return;
    }
    this.setData({
      lastLoadTime: curTime
    });
    this.setData({
      tipText: "加载中..."
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 6000//loading时间
    })

    App.HttpService.llkget('/liteapp/mall/loaddata', {
      p: this.data.p + 1
    }).then(data => {
      if (data.code == 0) {
        data.data.forEach(function (n) {
          n.photo = App.renderImage("/attachs/" + n.photo)
          n.mall_price = App.formatMoney(n.mall_price)
          n.price = App.formatMoney(n.price)
        });
        var list = data.data;
        that.setData({
          goods: that.data.goods.concat(list),
          tipText: "查看更多",
          p: this.data.p + 1
        })
      }
    });
  },
  // fileBasePath= ,
  imgerr: function (e) {
    var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    var imgObject = "goods[" + errorImgIndex + "].photo" //carlistData为数据源，对象数组
    var errorImg = {}
    errorImg[imgObject] = App.Config.fileBasePath + "/upload/default.png" //我们构建一个对象
    this.setData(errorImg) //修改数据源对应的数据
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
    // console.log(2222)
    this.getcartnumcart()//获取购物车数量
  },
  getcartnumcart: function () {
    App.HttpService.llkget('/liteapp/cart/numcart').then(data => {
      this.setData({
        numcart: data.data.count ? data.data.count : 0
      })
    })
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