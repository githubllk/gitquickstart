const App = getApp()

Page({
    data: {
      province: '--请选择--',
      city: '请选择--',
      district: '请选择--',
      pro: false,
      city_: false,
      district_ : false,
    	show: !0,
    	form: {
			name   : '', 
			gender : 'male', 
			tel    : '', 
			address: '', 
      is_default : !1, 
        },
        radio: [
            {
            	name: '先生', 
            	value: 'male', 
            	checked: !0, 
            },
            {
            	name: '女士', 
            	value: 'female', 
            },
        ],
    },
    onLoad() {
    	this.WxValidate = App.WxValidate({
			name: {
				required: true, 
				minlength: 2, 
				maxlength: 10, 
			},
			mobile: {
				required: true, 
				tel: true, 
        maxlength: 11,
        minlength:11,
			},
      province: {
        required: true,
      },
      city: {
        required: true,
      },
      district: {
        required: true,
      },
      addr: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },

		}, {
			name: {
				required: '请输入收货人姓名', 
			},
			mobile: {
				required: '请输入收货人电话', 
			},
      province: {
        required: '请选择省',
      },
      city: {
        required: '请选择市',
      },
      district: {
        required: '请选择县/区',
      },
      addr: {
        required: '请输入收货人地址',
      },
		})
      this.Province()
        
    },
	radioChange(e) {		 
		console.log('radio发生change事件，携带value值为：', e.detail.value)
		const params = e.detail.value
		const value = e.detail.value
		const radio = this.data.radio
		radio.forEach(n => n.checked = n.value === value)
		this.setData({
			radio: radio, 
			'form.gender': value, 
		})
	},
  Province() {
    App.HttpService.llkget('/liteapp/addrs/cab/prv/ecv').then(data => {
      if (data.code != 0) {
        this.showErr(data.message)
        return false;
      }
      var dd = [];
      data.data.province.forEach(function(n){
        dd.push(n.province_name)
      })
      this.setData({
        arrayProvince: dd,
        arrayProvinces: data.data.province,
      })
    })
  },
  selectedProvince(e){
    let p = e.detail.value
    let pro_id = this.data.arrayProvinces[p].province_id
    this.setData({
      province: this.data.arrayProvince[p],
      city_ : true,
      city : '请选择--',
      district:'请选择--',
      district_:false
    })
    App.HttpService.llkget('/liteapp/addrs/cab',{province_id:pro_id}).then(it=>{
      if (it.code != 0) {
        this.showErr(it.message)
        return false;
      }
      let cc = [];
      it.data.city.forEach(function (n) {
        cc.push(n.name)
      })
      this.setData({
        arrayCity: cc,
        arrayCitys: it.data.city,
        province_id: pro_id
      })
      console.log(this.data)
    })
  },
  selectedCity(e){
    let p = e.detail.value
    let cit_id = this.data.arrayCitys[p].city_id
    this.setData({
      city: this.data.arrayCity[p],
      district_: true,
      district: '请选择--',
    })
    App.HttpService.llkget('/liteapp/addrs/cab', { city_id: cit_id }).then(it => {
      if (it.code != 0) {
        this.showErr(it.message)
        return false;
      }
      let ar = [];
      it.data.area.forEach(function (n) {
        ar.push(n.area_name)
      })
      this.setData({
        arrayDistrict: ar,
        arrayDistricts: it.data.area,
        city_id: cit_id
      })
      console.log(this.data)
    })
  },
  selectedDistrict(e){
    let p = e.detail.value
    this.setData({
      district: this.data.arrayDistrict[p],
      area_id: this.data.arrayDistricts[p].area_id
    })
    console.log(this.data)
  },
	submitForm(e) {
		const params = e.detail.value
    params.province_id = this.data.province_id
    params.city_id = this.data.city_id
    params.area_id = this.data.area_id
    params.is_default = params.is_default?1:0;
		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
      console.log(error)
      this.showErr(error.msg)
			return false
		}
    // params.table='address';
    // params.user_id = App.WxService.getStorageSync('openId');
    //新增数据
    App.HttpService.llkpost('/liteapp/addrs/add_addr',params).then(data => {
      if (data.code == 0) {
        this.showToast(data.message).then(
           this.setData({
            arrayCity: "",
            arrayCitys: "",
            arrayDistrict: "",
            arrayDistricts: "",
            arrayProvince: "",
            arrayProvinces:"",
          })
        )
      }else{
        this.showErr(data.message)
      }
    }); 
    
	},
  showErr(mess){
    App.WxService.showModal({
      title: '友情提示',
      content: mess,
      showCancel: !1
    })
  },
	showToast(message) {
		App.WxService.showToast({
			title   : message, 
			icon    : 'success', 
			duration: 1500, 
    }).then(() => App.WxService.navigateBack())
	},
	chooseLocation() {
		App.WxService.chooseLocation()
	    .then(data => {
	        console.log(data)
	        this.setData({
	        	'form.addr': data.address
	        })
	    })
	},
})