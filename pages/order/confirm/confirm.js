const App = getApp()

Page({
  data: {
    hidden: !0,
    carts: {},
    address: {
      item: {},
    }
  },
  onLoad(option) {
    this.setData({
      address_id: option.addr_id,
      order_id: option.order_id
    })

    const carts = {
      items: App.WxService.getStorageSync('confirmOrder'),
      totalAmount: 0,
    }
    App.WxService.setStorageSync('confirmOrder','')/////mingkan
    carts.items.forEach(n => carts.totalAmount += n.totalAmount)
    // var goods = []
    // carts.items.forEach(function (t) {
    //   goods.push({
    //     num: t.total,
    //     goods_id: t.goods_id
    //   })

    // })
    this.setData({
      carts: carts,
      // goods: goods
    })
    const address_id = this.data.address_id
    if (address_id) {
      this.getAddressDetail(address_id)
    } else {
      this.getDefalutAddress()
    }
  },
  onShow() {
    // const address_id = this.data.address_id
    // if (address_id) {
    //   this.getAddressDetail(address_id)
    // } else {
    //   this.getDefalutAddress()
    // }
  },
  redirectTo(e) {
    console.log(e)
    App.WxService.redirectTo('/pages/address/confirm/index', {
      address_id: this.data.address_id
    })
  },
  getDefalutAddress() {
    App.HttpService.llkget("/liteapp/addrs/index").then(data => {
      if (data.code == 0) {
        this.setData({
          address_id: data.data.addr_id,
          address: data.data,
        })
      } else {
        this.showModal()
      }
    });
  },
  showModal() {
    App.WxService.showModal({
      title: '友情提示',
      content: '没有收货地址，请先设置',
    })
      .then(data => {
        if (data.confirm == 1) {
          App.WxService.redirectTo('/pages/address/list/index')
        } else {
          App.WxService.navigateBack()
        }
      })
  },
  getAddressDetail(id) {
    App.HttpService.llkget("/liteapp/addrs/index", {
      addr_id: id
    }).then(data => {
      if (data.code == 0 && data.data.user_id) {
        this.setData({
          address_id: data.data.addr_id,
          address: data.data,
        })
      } else {
        this.showModal()
      }
    });
  },
  addOrder() {
    // App.WxService.requestPayment({
    //   'timeStamp': '',
    //   'nonceStr': '',//随机字符串
    //   'package': '',//prepay_id
    //   'signType': 'MD5',
    //   'paySign': '',//签名
    //   'success': function (res) {
    //   },
    //   'fail': function (res) {
    //   }
    // })
    const address_id = this.data.address_id
    const order_id = this.data.order_id
    const params = {
      table: 'order',
      // items: App.Tools.serializeValue(this.data.carts.items), 
      // address_id: address_id,
      code: App.WxService.getStorageSync('code'),
      // num: JSON.stringify(this.data.goods)
      addr_id: address_id,
      openid: App.WxService.getStorageSync('openId')      
    }

    App.HttpService.llkpost("/liteapp/mall/pay2/order_id/"+order_id, params).then(data => {
      // wx.requestPayment({})
      if (data.code == 0) {
        console.log(data)
        wx.requestPayment({
          'timeStamp': data.data.timeStamp,
          'nonceStr': data.data.nonceStr,
          'package': data.data.package,
          'signType': data.data.signType,
          'paySign': data.data.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '/pages/order/detail/index?order_id=' + order_id,
            })
          },
          'fail': function (res) {
          }
        })
      } else {

        App.WxService.showModal({
          title: '友情提示',
          content: data.message,
        })
      }
    });

  },
  clear() {
    App.HttpService.clearCartByUser()
      .then(data => {
        console.log(data)
      })
  },
})