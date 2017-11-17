const App = getApp()

Page({
  data: {
    id: 'aready/1',
    activeIndex: 0,
    navList: [],
    order: {},
    prompt: {
      hidden: !0,
      icon: '../../../assets/images/iconfont-order-default.png',
      title: '没有更多相关的订单',
      text: '可以去看看有哪些想买的',
    },
  },
  onLoad(e) {
    let _type = e.type;
    // this.setData({
    App.HttpService.llkget('/liteapp/goods/type_',
      { 'type': _type }).then(data => {
        this.setData({
          navList: data.data
        })
      })
    //   if(_type = 'goods') {
    //     navList: [
    //       {
    //         title: '全部',
    //         id: 'all',
    //       },
    //       {
    //         title: '已提交',
    //         id: 'submitted',
    //       },
    //       {
    //         title: '已确认',
    //         id: 'confirmed',
    //       },
    //       {
    //         title: '已完成',
    //         id: 'finished',
    //       },
    //       {
    //         title: '已取消',
    //         id: 'canceled',
    //       },
    //     ]
    //    }

    // // })
    this.onPullDownRefresh()
    console.log(this.data)
  },
  initData() {

    this.setData({
      order: {
        items: [],
        params: {
          // table:'order',
          p: 1,
          // limit: 10
        },
        paginate: {}
      }
    })
  },
  navigateTo(e) {
    console.log(e)
    App.WxService.navigateTo('/pages/order/detail/index', {
      order_id: e.currentTarget.dataset.id
    })
  },
  getList() {
    const order = this.data.order;
    let params = order.params;
    //  if(this.data.status){
    let id = this.data.id;

    // }

    App.HttpService.llkget("/liteapp/goods/goodsloaddata/" + id, {
      p: params.p
    }).then(data => {
      console.log(data)
      order.total = data.data.list ? 1 : 0;
      order.hasNext = order.params.p <= data.data.totalPage;
      order.params.p = order.params.p + 1;
      // if (data.data.list){
      //   data.data.list.forEach(n => {
      //     //  n.items = App.Tools.fromJson(n.items);
      //     //  n.totalAmount = 0;
      //     //  n.items.forEach(c => n.totalAmount += c.totalAmount)
      //     n.total_express = n.total_express / 100,
      //       n.price = n.price / 100,
      //       n.total_price = n.total_price / 100
      //     // n.total_express = n.total_express / 100
      //   });
      // }
      order.items = order.items.concat(data.data.list);
      this.setData({
        order: order,
        'prompt.hidden': order.total
      });
    });

  },
  onPullDownRefresh() {
    console.log('onPullDownRefresh')
    this.initData();
    this.getList()
    setTimeout(function () { wx.stopPullDownRefresh() }, 2000);
  },
  onReachBottom() {//上拉函数
    // console.info('onReachBottom1')
    // console.info(this.data.order.hasNext)

    if (!this.data.order.hasNext) return
    this.getList()
  },
  onTapTag(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    this.initData()
    this.setData({
      activeIndex: index,
      id: id,
    })
    this.getList()
  },
  aready_jump(e) {
    let order_id = e.currentTarget.dataset.order_id
    let id = this.data.id
    if (id == 'aready/1') {
      wx.navigateTo({
        url: '/pages/order/aconfirm/confirm?order_id=' + order_id,
      })
    } else {
      wx.switchTab({
        url: '/pages/mall/mall',
      })
    }
  },
})