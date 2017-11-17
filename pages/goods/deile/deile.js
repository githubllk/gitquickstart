const App = getApp()

Page({
  data: {
    indicatorDots: !0,
    vertical: !1,
    autoplay: 1,
    interval: 3000,
    duration: 1000,
    current: 0,
    fileBasePath: App.Config.fileBasePath,
    goods: {
      item: {}
    },
    is_def: !0,
  },
  swiperchange(e) {
    this.setData({
      current: e.detail.current,
    })
  },
  onLoad(option) {
    //this.goods = App.HttpResource('/goods/:id', {id: '@id'})
    console.log(option)
    this.setData({
      id: option.goods_id
    })
  },
  onShow() {
    this.getDetail(this.data.id)
  },
  addCart(e) {
    const goods = this.data.goods;
    App.HttpService.llkpost('/liteapp/cart/cartadd2', {
      goods_id: this.data.id,
    }).then(data => {
      if (data.code == 0) {
        this.showToast(data.message)
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/cart/cart'
          })
        }, "3000") 
      }
    });
  },
  // forEach(n => n.photo = App.renderImage("/attachs/" + n.photo))
  previewImage(e) {
    const qq = ''
    const urls = this.data.images.forEach(n => n.photo = n.photo + ",")
    // const index = e.currentTarget.dataset.index
    // const current = urls[Number(index)]
    console.log(urls)
    console.log(qq)///////////单击图片不放大
    // console.log(current)
    // console.log(urls)
    // console.log(index)
    // console.log(current)
    // wx.previewImage({
    //   current: current,
    //   urls: urls,
    // })
  },
  showToast(message) {
    App.WxService.showToast({
      title: message,
      icon: 'success',
      duration: 2000,
    })
  },
  getDetail(id) {
    const goods = this.data.goods;
    App.HttpService.llkget("/liteapp/mall/detail/goods_id/" + id, ).then(data => {
      if (data.code != 0) {
        App.WxService.showModal({
          title: '友情提示',
          content: data.message,
          showCancel: !1,
        }).then(data => {///1 是确定
          wx.navigateBack()
        })
      } else {
        var $img = data.data.img
        if (!$img) {
          $img = [{ "photo": `${App.Config.imgPath}${data.data.detail.photo}` }]
        } else {
          $img.forEach(n => n.photo = App.renderImage("/attachs/" + n.photo))
        }
        console.log(data.data.detail)
        this.setData({
          is_def: 0,
          images: $img,
          goods: data.data.detail
        });
      }

    });
    // let img = App.renderImage('/upload/goods_fill1.jpg')
    // this.setData({
    //   images: [img,img]
    // })
  }
})