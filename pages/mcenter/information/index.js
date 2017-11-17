// pages/mcenter/information/index.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setphone : !1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    this.WxValidate = App.WxValidate({
      mobile: {
        required: true,
        minlength: 11,
        maxlength: 11,
      }
    }, {
        mobile: {
          required: '请输入正确的手机号',
        }
      })
  },
  getList(){
   let items = [
      {
        text: '上传头像',
        path: '/pages/mcenter/face/index'
      }, {
        text: '用户昵称',
        path: '/pages/money/money',
      },
      {
        text: '真实姓名',
        path: '/pages/distribution/distribution/index',
      },
      {
        text: '绑定手机',
        path: '/pages/money/money',
      },
      {
        text: '修改密码登录',
        path: '/pages/money/money',
      }
    ]
    App.HttpService.llkget('/liteapp/information/index').then(data=>{
      if(data.code==0){
          items.forEach(function(v,k){
          if(k==1){
            v.cen = data.data.res.nickname ? data.data.res.nickname : '未设置'
          }else if(k==2){
            console.log(111111)
            console.log(data.data.res)
            v.cen = data.data.res.truename ? data.data.res.truename : '未设置'
          } else if (k == 3) {
            v.cen = data.data.res.mobile ? data.data.res.mobile : '未设置'
          }
        })
        this.setData({
          items : items
        })  
      }else{
        wx.showModal({
          title: '温馨提示',
          content: data.message,
        })
      }
    })
  },
  setphone(e) {
    this.setData({
      setphone: !0,
      value: ''
    })
  }, 
  subphone(e){
    let url = ''
    let val = ''
    // if (!this.WxValidate.checkForm(e)) {
    //   const error = this.WxValidate.errorList[0]
    //   this.showErr(error.msg)
    //   return false
    // }
    let dataset = e.target.dataset.id
    // let val = e.detail.value.dataset   
    if(dataset == 'mobile'){
      url = '/liteapp/information/change_mobile'
      val = { mobile: e.detail.value.mobile }    
    }else if(dataset == "truename"){
      url = '/liteapp/information/truename'
      val = { truename: e.detail.value.truename }
    } else if (dataset == "password"){
      url = '/liteapp/information/password'
      val = { truename: e.detail.value.password }
    }
    App.HttpService.llkpost(url,val).then(data=>{
      if(data.code == 0){
        this.showErr(data.message)
          this.setData({
            setphone: !1,
          })
          this.getList()
      }else{
        this.showErr(data.message)
      }
    })
  },
  showErr(mess) {
    App.WxService.showModal({
      title: '友情提示',
      content: mess,
      showCancel: !1
    })
  },
  navigateTo(e) {
    const index = e.currentTarget.dataset.index
    const path = e.currentTarget.dataset.path

    if(index == 0){
      App.WxService.navigateTo(path)
    } else if (index == 2 || index == 3 || index == 4){
      let name = '';
      let name_ = '';
      let password = !1;
      if(index == 2){
        name = 'truename',
        name_ = '真实姓名'
      } else if (index == 3){
        name = 'mobile',
          name_ = '手机号'
      } else if (index == 4) {
        name = 'password',
          name_ = '密码',
          password = !0
      }
        this.setData({
          setphone : !0,
          name : name,
          name_: name_,
          password: password
        })
    }
   
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