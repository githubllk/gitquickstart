const App = getApp()

Page({
  data: {
    canEdit: !1,
    carts: {
      items: []
    },
    prompt: {
      hidden: !0,
      icon: '../../assets/images/iconfont-cart-empty.png',
      title: '购物车空空如也',
      text: '来挑几件好货吧',
      buttons: [
        {
          text: '随便逛',
          bindtap: 'bindtap',
        },
      ],
    },
  },
  bindtap: function (e) {
    const index = e.currentTarget.dataset.index
    switch (index) {
      case 0:
        App.WxService.switchTab({
          url: '/pages/index/index'
        })
        break
      default:
        break
    }
  },
  
  onLoad() {
    // this.getCarts()
  },
  onShow() {
    this.setData({
        'carts.items': '',
    })
    this.getCarts()
  },
  getCarts() {
    App.HttpService.llkget('/liteapp/mall/cart').then(data => {

      if (data.code == 0) {
        let cart_goods = data.data.cart_goods;
        cart_goods.forEach(function (n) {
          n.photo = App.renderImage("/attachs/" + n.photo),
            n.totalAmount = n.buy_num * n.mall_price / 100,
          // n.photo = App.renderImage("/attachs/" + n.photo)//App.renderImage("/attachs/" + n.photo),
          n.mall_price = n.mall_price / 100
        });

        // console.log(33333333333333)
        // console.log(cart_goods)
        // console.log(data.data.cart_goods)
        this.setData({
          'carts.items': data.data.cart_goods,
          'prompt.hidden': data.total,
          'prompt.hidden': !0,
          // addr_id: 122
        });
      } else {
        App.WxService.showModal({
          title: '友情提示',
          content: data.message,
          showCancel: !1,
        }).then(data => {
          App.WxService.switchTab({
            url: '../mall/mall',
          })
          console.log(data)
        })
      }
    });
    // this.setData({
    //   'carts.items': [{
    //     goods_id: 1207,
    //     name: 2,
    //     totalAmount: 222,
    //     path: App.Config.fileBasePath + "/attachs/2017/07/09/thumb_59623e065d057.jpg",
    //     total: 2,
    //     price: 2,

    //   }],
    //   'prompt.hidden': !0,
    //   addr_id: 122
    // });
  },
  // getAddr_id(){
  //   App.HttpService.llkget('/liteapp/addrs/index/')
  // },
  onPullDownRefresh() {//下拉刷新
    this.getCarts()
  },
  navigateTo(e) {
    console.log(e)
    App.WxService.navigateTo('/pages/goods/detail/index', {
      id: e.currentTarget.dataset.id
    })
  },
  confirmOrder(e) {
    var goods = []
    this.data.carts.items.forEach(function (t) {
      goods.push({
        num: t.buy_num,
        goods_id: t.goods_id
      })

    })
    // const address_id = this.data.address_id
    const params = {
      user_id: App.WxService.getStorageSync('openId'),
      num: JSON.stringify(goods)
    }

    App.HttpService.llkpost("/liteapp/mall/order", params).then(data => {
      if (data.code == 0) {
        // console.log(data)
        if (data.data.order_id > 0) {
          // App.WxService.redirectTo('/pages/order/detail/index', {
          //   order_id: data.data.order_id
          // })
          App.WxService.navigateTo('/pages/order/confirm/confirm?order_id=' + data.data.order_id )
        }else if(data.data.log_id > 0){
          App.WxService.navigateTo('/pages/order/confirm/confirm?log_id=' + data.data.log_id )
        }else{
          App.WxService.showModal({
            title: '友情提示',
            content: '系统繁忙1220',
          })
        }
      } else {
        App.WxService.showModal({
          title: '友情提示',
          content: data.message,
        })
      }
    });
    App.WxService.setStorageSync('confirmOrder', this.data.carts.items)

  },
  del(e) {
    const id = e.currentTarget.dataset.id

    App.WxService.showModal({
      title: '友情提示',
      content: '确定要删除这个宝贝吗？',
    })
    // .then(data => {
    //     // if (data.confirm == 1) {
    //     //   App.HttpService.delData({
    //     //     table: 'cart',
    //     //     id: id
    //     //   }).then(data => {
    //     //     if (data.code == 0) {
    //     //       // this.getCarts()
    //     //     }
    //     //   });
    //     // }
    // })

  },
  clear() {
    App.WxService.showModal({
      title: '友情提示',
      content: '确定要清空购物车吗？',
    })
    // .then(data => {
    //     if (data.confirm == 1) {
    //       App.HttpService.delData({
    //         table: 'cart',
    //         user_id: App.WxService.getStorageSync('openId')
    //       }).then(data => {
    //         if (data.code == 0) {
    //           this.getCarts()
    //         }
    //       });
    //     }
    // })
  },
  onTapEdit(e) {
    this.setData({
      canEdit: !!e.currentTarget.dataset.value
    })
  },
  showToast(message) {
    App.WxService.showToast({
      title: message,
      icon: 'success',
      duration: 1000,
    })
  },
  changeCartTotal: function (id, total) {
    var items = this.data.carts.items;
    items.forEach(function (n) {
      if (n.id == id) {
        n.total = total;
        n.totalAmount = n.price * n.total;
      }
    });
    this.setData({
      'carts.items': items
    });
    App.HttpService.updateData({
      table: 'cart',
      total: total,
      id: id
    }).then(data => {
      if (data.code == 0) {
        this.showToast(data.message);
      }
    });
  },
  bindKeyInput(e) {
    const id = e.currentTarget.dataset.id
    const total = Math.abs(e.detail.value)
    if (total <= 0 || total > 100) return
    this.changeCartTotal(id, total);

  },
  decrease(e) {
    const id = e.currentTarget.dataset.id
    const total = Math.abs(e.currentTarget.dataset.total)
    if (total == 1) return
    e.currentTarget.dataset.total = total - 1;
    this.changeCartTotal(id, total - 1);
  },
  increase(e) {
    const id = e.currentTarget.dataset.id
    const total = Math.abs(e.currentTarget.dataset.total)
    if (total == 100) return
    e.currentTarget.dataset.total = total + 1;
    this.changeCartTotal(id, total + 1);
  },
})