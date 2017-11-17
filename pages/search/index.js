const App = getApp()

Page({
    data: {
        inputVal: ''
    },
    clearInput() {
        this.setData({
            inputVal: ''
        })
    }, 
    inputTyping(e) {  // 当键盘输入时，触发input事件，event.detail = { value, cursor }，处理函数可以直接 return 一个字符串，将替换输入框的内容。
      this.setData({
            inputVal: e.detail.value
        })
        this.search()
    },
    search() {
    	if (!this.data.inputVal) return
    	App.HttpService.llkpost('/liteapp/all/index',{
            keyword: this.data.inputVal
        })
        .then(data => {
            console.log(data)
            if (data.code == 0) {
              data.data.list.forEach(function (n) {
                n.t_photo = App.renderImage("/attachs/"+n.t_photo)
              })
            	this.setData({
            		items: data.data
            	})
            }
        })
    },
    redirectTo(e) {
// redirectTo
        App.WxService.navigateTo('/pages/goods/deile/deile', {
            goods_id: e.currentTarget.dataset.keyword
        })
    },
    onLoad(){
      this.setData({
        inputVal: ''
      })
    },
    onShow(){
      this.setData({
        inputVal: ''
      })
    },
})