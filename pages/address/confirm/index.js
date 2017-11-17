const App = getApp()

Page({
    data: {
        hidden: !0,
        address: {}
    },
    onLoad(option) {
        console.log(option)
        this.setData({
          address_id: option.address_id,
          order_id: option.order_id
        })  
    },
    onShow(){
      this.onPullDownRefresh()
    },
    initData() {
        this.setData({
            address: {
                items: [],
                params: {
                    p : 1,
                },
                paginate: {}
            }
        })
    },
    radioChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        App.WxService.redirectTo('/pages/order/aconfirm/confirm', {
            order_id: this.data.order_id,
            addr_id: e.detail.value
        })
    },
    getAddressList() {
        const address = this.data.address
        const params = address.params

        this.setData({ 
            hidden: !1
        })
      let thiss = this.data
        App.HttpService.llkget('/liteapp/addrs/addr_list',params)
        .then(data => {
            console.log(data)
            if (data.code == 0) {
              console.log(data.data.addr)
                address.items = address.items.concat(data.data.addr)
                address.totalPage = data.data.totalPage
                address.items.forEach(function(n, i) {
                  n.checked = n.addr_id === thiss.address_id,
                    n.addr = data.data.province[n.province_id].province_name + "~" + data.data.citys[n.city_id].name + "~" + data.data.areas[n.area_id].area_name + "~" + n.addr
                   })
                this.setData({
                    address: address
                })
            }

            this.setData({ 
                hidden: !0
            })
        })
    },
    onPullDownRefresh() {
        this.initData()
        this.getAddressList()
    },
    onReachBottom() {
        this.lower()
    },
    lower() {
        if (!this.data.address.paginate.hasNext) return
        this.getAddressList()
    },
    toAddressAdd(e) {
      console.log(e)
      App.WxService.navigateTo('/pages/address/add/index')
    },
})