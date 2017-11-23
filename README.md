# 微信小程序-移动端小商城

## 项目说明：

微信小程序：实现一个移动端小商城，项目持续更新中...

使用技术：**Weui.wxss** 、 **ES6**

## 目录结构：

```
weimall/
  |-assets/
     |- images/
     |- plugins/
     |- styles/
     |- ...
  |-etc/
     |- config.js
     |- ...
  |-helpers/
     |- HttpResource.js
     |- HttpService.js
     |- ServiceBase.js
     |- Tools.js
     |- WxResource.js
     |- WxService.js
     |- WxValidate.js
     |- ...
  |-pages/
      |- start
        |- index.js
        |- index.json
        |- index.wxml
        |- index.wxss
      |- ...
  |-app.js
  |-app.json
  |-app.wxss
  |-...
```

- assets — 存放静态文件，例如：images、styles、plugins
- etc — 存放配置文件，例如：config.js
- helpers — 存放帮助文件，例如：Promise 微信原生API、Promise wx.request、RESTful http client、Form validation
- pages — 存放项目页面相关文件
- app.js — 小程序逻辑
- app.json — 小程序公共设置
- app.wxss — 小程序公共样式表


##增删改查
    import ServiceBase from 'ServiceBase'
    
    class Service extends ServiceBase {
    	constructor() {
    		super()
    		this.$$prefix = ''
    		this.$$path = {
          wechatSignUp: '/index/wechatSignUp',
          wechatSignIn: '/index/wechatSignIn',
          decryptData: '/index/decryptData',
          signIn: '/index/signIn',
          signOut: '/index/signOut',
          data:'/index/data',
          detail: '/index/detail',
          add: '/index/add', 
          del: '/index/del', 
          update: '/index/update'
        }
    	}
    
    	wechatSignUp(params) {
    		return this.postRequest(this.$$path.wechatSignUp, params)
    	}
    
    	wechatSignIn(params) {
    		return this.postRequest(this.$$path.wechatSignIn, params)
    	}
    
    	wechatDecryptData(params) {
    		return this.postRequest(this.$$path.decryptData, params)
    	}
    	
      
    	signIn(params) {
    		return this.postRequest(this.$$path.signIn, params) 
    	}
    
    	signOut() {
    		return this.postRequest(this.$$path.signOut) 
    	}
    
      //获取表格分页数据
      getData(params) {
        return this.getRequest(this.$$path.data, params)
      }
    
      //获取单条数据
      getDetail(params) {
        return this.getRequest(this.$$path.detail, params)
      }
      
      //新增数据
      addData(params){
        return this.postRequest(this.$$path.add, params)
      }
    
      //删除数据
      delData(params) {
        return this.getRequest(this.$$path.del, params)
      }
      
      //更新数据
      updateData(params) {
        return this.getRequest(this.$$path.update, params)
      }
    	
    }
    
    export default Service
         //调用数据
          App.HttpService.getData({
              table:'banner',
              page:1
          }).then(data=>{
            if(data.code==0){
              data.data.forEach(n => n.path = App.renderImage(n.img));
              this.setData({
                images: data.data
              });
            }else{
              this.showModal(data.message);
            }
          });
    
        //新增数据
        App.HttpService.addData(params).then(data => {
          if (data.code == 0) {
            this.showToast(data.message)
          }
        }); 
    
       //更新数据
        App.HttpService.updateData(params).then(data => {
          if (data.code == 0) {
            this.showToast(data.message);
          }
        });
    
      //删除数据
        App.WxService.showModal({
          title: '友情提示',
          content: '确定要删除这个地址吗？',
        })
          .then(data => {
            if (data.confirm == 1) {
              App.HttpService.delData({
                table: 'address',
                id: id
              }).then(() => App.WxService.navigateBack());
            }
          })

## Form validation

```html
<form bindsubmit="submitForm">
    <view class="weui-cells">
        <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
                <view class="weui-label">姓名</view>
            </view>
            <view class="weui-cell__bd">
                <input name="name" value="{{ form.name }}" class="weui-input" type="text" placeholder="请输入姓名" />
            </view>
        </view>
        <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
                <view class="weui-label">邮箱</view>
            </view>
            <view class="weui-cell__bd">
                <input name="email" value="{{ form.email }}" class="weui-input" type="text" placeholder="请输入邮箱" />
            </view>
        </view>
    </view>
    <view class="button-sp-area">
        <button class="weui-btn" type="primary" formType="submit">确定</button>
    </view>
</form>
```

```js
import WxValidate from 'helpers/WxValidate'

Page({
    data: {
    	form: {
			name : '', 
			email: '', 
        },
    },
    onLoad() {
    	this.WxValidate = new WxValidate({
			name: {
				required: true, 
				minlength: 2, 
				maxlength: 10, 
			},
			email: {
				required: true, 
				email: true, 
			},
		}, {
			name: {
				required: '请输入姓名', 
			},
			email: {
				required: '请输入邮箱', 
				email: '请输入有效的电子邮件地址', 
			},
		})
    },
	submitForm(e) {
		const params = e.detail.value
		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList
			console.log(error)
			return false
		}
	},
})

## 感谢:

感谢开源作者：[m-mall](https://github.com/skyvow/m-mall)


