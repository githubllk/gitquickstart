// call.js
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
    this.llcall()
  },

  llcall() {
    App.WxService.makePhoneCall({
      phoneNumber: '18301211034',
      success: function () {
        wx.switchTab({
          url: '../index/index',
        })
      },
      file: function () {
        wx.switchTab({
          url: '../index/index',
        })
      },
      complete: function(){
        wx.switchTab({
          url: '../index/index',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.llcall()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.llcall()
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