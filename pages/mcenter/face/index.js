// pages/mcenter/face/index.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:'/assets/images/default.jpg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let php = wx.getStorageSync("PHPSESSID")
    let uid = wx.getStorageSync("uid")
    this.setData({
      PHPSESSID: php,
      uid: uid,
    })
    this.getimage()
  },
  getimage(){
    App.HttpService.llkget('/liteapp/information/image').then(data=>{
      if(data.code==0){
        this.setData({
          image: App.Config.fileBasePath +"/attachs/"+ data.data
        })
      }
    })
  },
  updata_avatar(){
    let PHPSESSID = this.data.PHPSESSID 
    let uid = this.data.uid 
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: 'original',
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          image: res.tempFilePaths[0]
        })
        that.upload(res.tempFilePaths[0], PHPSESSID,uid)
      },
      fail: function(res){

      }
    })
  },
  upload(img, PHPSESSID,uid){
    wx.uploadFile({
      url: App.Config.fileBasePath + "/liteapp/information/upload_face",
      filePath: img,
      name: 'avatar',
      header: { "Content-Type": "multipart/form-data", "PHPSESSID": PHPSESSID },
      formData:{
        "PHPSESSID": PHPSESSID,
        "uid": uid
      },
      success:function(res){
        console.log(res.data)
        // if(res.data.code==0){
        App.WxService.showModal({
            title: '温馨提示!',
            content: res.data,
          }).then(data=>{wx.navigateBack()})
        // }else{
        //   wx.showModal({
        //     title: '温馨提示!',
        //     content: res.data.message,
        //   })
        // }
      },
      fail:function(res){
        console.log(res)
      },
      complete(res){
        console.log(res)
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