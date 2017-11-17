const App = getApp()

Page({
  data: {
    swi: !1,
    order: {
      item: {},
    },
  },
  onLoad(option) {

    this.setData({
      id: option.order_id,
      // swi:option.swi?1:!1
    })
  },
  onShow() {
    this.getOrderDetail(this.data.id)
    this.getagorder(this.data.id)
  },
  getagorder(order_id) {
    App.HttpService.llkget('/liteapp/mall/pay', {
      order_id: order_id
    }).then(data => {
      if (data.code == 0) {
        data.data.ordergoods.forEach(n => {
          //  n.items = App.Tools.fromJson(n.items);
          //  n.totalAmount = 0;
          //  n.items.forEach(c => n.totalAmount += c.totalAmount)
          n.total_price = n.total_price / 100,
            n.price = n.price / 100,
            n.mall_price = n.mall_price / 100
          n.total_express = n.total_express / 100
        });
        data.data.order.total_price = data.data.order.total_price / 100
        data.data.order.total_express = data.data.order.total_express / 100
        this.setData({
          carts: {
            totalAmount: data.data.order.total_price,
            total_express: data.data.order.total_express,
            items: data.data.ordergoods
          },
          // address_id : data.data.order.addr_id,onLoad setdata 要比onshow 的setdata 后执行
          order_id: order_id
        })
      } else {
        console.log(data)
        App.WxService.showModal({
          title: '友情提示',
          content: data.message,
        }).then(data => {
            App.WxService.navigateBack()
          })
      }
    })
  },
  getOrderDetail(id) {
    App.HttpService.llkget('/liteapp/goods/order_detail', {
      order_id: id,
    }).then(data => {
      if (data.code == 0) {
        data.data.ordergoods.total_express = data.data.ordergoods.total_express / 100,
          data.data.ordergoods.price = data.data.ordergoods.price / 100,
          data.data.ordergoods.total_price = data.data.ordergoods.total_price / 100
        // let addr_id = data.data.addr
        // App.HttpService.llkget('/liteapp/addrs/index', { addr_id:addr_id}).then(
        //   addrs=>{
        //     this.setData({
        //       'order.item': data.data.ordergoods,
        //       'order.address': addrs.data
        //     });
        //   })
        this.setData({
          'order.item': data.data.ordergoods,
          // 'order.address': addrs.data
        });
        return data;
      } else {
        App.WxService.showModal({
          title: '友情提示',
          content: data.message,
        }).then(data => {
            App.WxService.navigateBack()
          })
      }
    })
      .then(data => {
        let addr_id = data.data.addr
        return App.HttpService.llkget('/liteapp/addrs/index', { addr_id: addr_id }).then(
          addrs => {
            this.setData({
              'order.address': addrs.data
            });
          })
      })
  },
})