// article.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.article_id= options.article_id
   this.getNews(this.article_id)
  },
  getNews(article_id) {
    //调用数据
    App.HttpService.getData({
      g: 'liteapp',
      m: 'news',
      a: 'detail',      
      article_id: article_id
    }).then(data => {
      if (data.code == 0) {
        wx.setNavigationBarTitle({
          title: data.data.news.cate.cate_name,
        })
        data.data.rands.forEach(function(n){
          if(n.photo==''){
            n.photo = App.Config.imgDefault//+'../../assets/images/default.jpg'
          }else{
            n.photo = App.renderImage("/attachs/" + n.photo)
          }
        })
        this.setData({
          data: data.data
        })
      } else {
        this.showModal(data.message);
      }
    });
  },
  //图片报错 加载默认
  imgerr: function (e) {
    // var errorImgIndex = e.target.dataset.errorimg //获取循环的下标
    // var imgObject = "data.rands[" + errorImgIndex + "].photo" //carlistData为数据源，对象数组
    // var errorImg = {}
    // errorImg[imgObject] = App.Config.fileBasePath + "/upload/default.png" //我们构建一个对象
    // this.setData(errorImg) //修改数据源对应的数据
    console.log(App.imgErrs(e, 'data.rands'))
    this.setData(App.imgErrs(e,'data.rands')) //修改数据源对应的数据
  },
  article_bind(e){
    let article_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './article?article_id=' + article_id,
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