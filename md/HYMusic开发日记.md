# `YXMusic音乐小程序开发日记`
- 注：为了适配移动端各种机型，像素单位用rpx才能适配多端
&emsp;

# 2022/5/27
## 项目更新：
### 界面：
- 完成tabbar导航栏实现页面切换。


# 2022/5/28
## 微信基础库版本
tips：为了避免新版本的基础库给线上的小程序带来未知的影响，微信客户端下载时都是携带`上一个稳定版`的基础库发布的。
### 灰度发布：
- 后台选取一小部分用户推送最新的基础库版本(SDK)用于用户测试，如果有问题则修复问题再发布，以此往复使得新版本基础库达到稳定状态。
### 全量发布：
- 当经过灰度发布后，用户测试没有bug和问题后在开始向全部用户推送更新微信APP的基础库版本。

&emsp;

## 知识点
### 1、控制台 `SiteMap` 警告忽略：
- 当在tabbar切换界面时，每切换一次sitmap警告就弹出一次，可在`project.config.json`中将`checkSitMap:false`设置为false即可。
### 2、async & await：
参考文章：https://zhuanlan.zhihu.com/p/112081953
#### async & await `主要的作用就是用同步的方式编写异步的代码`
`example1`：简洁封装异步请求代码如下，按顺序执行异步请求，但依旧不够简洁。
```js
// 后一个请求不需要前一个请求的数据时
request("ajaxA")
.then((data)=>{
   //处理data
   return request("ajaxB")
})
.then((data)=>{
   //处理data
   return request("ajaxC")
})
.then((data)=>{
   //处理data
   return request("ajaxD")
})

// 后一个请求需要前一个请求的数据时
request("ajaxA")
.then((data1)=>{
   return request("ajaxB", data1);
})
.then((data2)=>{
   return request("ajaxC", data2)
})
.then((data3)=>{
   return request("ajaxD", data3)
})
```
`example2`：利用async和await执行异步函数使其变为同步，按顺序执行。
```js
// 后一个请求不需要前一个请求的数据时
async function load(){
  // await代表停止在这,等待当前异步函数执行完毕。
    await request("ajaxA");
    await request("ajaxB");
    await request("ajaxC");
    await request("ajaxD");
}

// 后一个请求需要前一个请求的数据时
async function load(){
    let data1 = await request("ajaxA");  
    let data2 = await request("ajaxB", data1);
    let data3 = await request("ajaxC", data2);
    let data4 = await request("ajaxD", data3);
    //await不仅等待Promise完成, 而且还拿到了resolve方法的参数
}
```
### 3、子组件在父组件的flex布局中会错乱，不能在封装子组件时给固定的宽高，需要在父组件中给子组件套个外层`view`给其宽高，子组件中给与100%,这样父组件在flex布局时才不会把子组件当成组件，而是当成自己的子标签去布局。

&emsp;

## 项目更新：
### 界面：
- 视频内容列表展示完成。
- 视频项抽离封装成 `video-item-v1` 组件
### 逻辑：
- 封装 `YXRequest` 类，对其进行二次封装，每个页面的请求逻辑分别对应service中的一个js文件
- 封装`format.wxs`工具文件，用于时间及播放量格式转换


# 2022/5/29
## 知识点：
### 小程序使用npm包
- #### 1、npm init初始化npm环境，在项目中生成package.json
- #### 2、开发IDE顶部工具栏 工具->构建npm，项目生成miniprogram_npm文件夹(这才是小程序真正使用npm包的地方，而非是从node_modules)
- #### 3、页面注册组件，在页面index.json注册组件，例如注册vant ui库的search搜索框组件
```json
  "usingComponents": {
    "van-search": "@vant/weapp/search/index"
  }
```
## 项目更新：
### 界面：
- #### 小程序引入`vant-ui`库，使用库内组件
- #### MV视频详情页完成。(缺乏相关视频点击跳转到对应的detail页，网络请求中没有视频id暂时无法实现)
- #### 音乐主页引入vant库的search搜索框组件
- #### 详情页组件封装完毕
### 逻辑：
- #### 封装detail-video下的网络请求
- #### 配置npm

# 2022/6/1
## 知识点：
### this.setData是异步还是同步
- #### this.setData被设计成同步函数，在设置data数据上是同步的。
- #### 通过最新的数据对wxml进行渲染，渲染的过程是异步的。
- #### 同步这就导致如下代码的情况，this.setData执行完毕后，直接打印banners的值是有值的，但是前台wxml还是利用先前的[]空数组进行渲染banner，并没有响应更改后的新数组。
```js
getPageData:function(){
  getBanners().then(res=>{
    this.setData({banners:res.banners})
    console.log(this.data.banners)
  })
}
```
&emsp;
### 小程序slot插槽没有默认值解决方法
- #### 1、JS实现，设置props标识值(接受父组件传递的参数)，组件内部利用wx:if判断该标识值，如果为true则代表传入了插槽内容，则不显示默认内容，如果为false则标识不传递插槽，使用默认插槽样式。
- #### 这种方法虽然能够实现但是每次都要传递参数，不太优雅。
```html
<!-- home-music.wxml -->
<view class="recommend-song">
  <!-- 自定义默认插槽(css实现) -->
  <area-header title="歌曲推荐" isSlot="{{true}}">
    <view>自定义插槽</view>
  </area-header>
</view>
<!-- end -->

<!-- area-header.wxml -->
<view class="area-header">
  <view class="title">{{title}}</view>
  <view class="right">
    <view class="slot" wx:if="{{isSlot}}"><slot></slot></view>
    <view class="default" wx:else="{{isSlot}}">
      <text>{{rightText}}</text> 
      <image class="icon" src="../../assets/images/icons/arrow-right.png"></image>
    </view>
  </view>
</view>
<!-- end -->
```
```js
properties: {
  isSlot:{
    type:Boolean,
    value:true
  }
},
```

&emsp;

- #### 2、CSS实现,灵活应用选择器，默认给default内容display:none,当css的empty检测到.slot标签内部没有外部传入的插槽内容时，将default内容display:flex显示。
```html
<!-- home-music.wxml -->
<view class="recommend-song">
  <!-- 自定义默认插槽(css实现) -->
  <area-header title="歌曲推荐"></area-header>
</view>
<!-- end -->

<!-- area-header.wxml -->
<view class="area-header">
  <view class="title">{{title}}</view>
  <view class="right">
    <view class="slot"><slot></slot></view>
    <view class="default">
      <text>{{rightText}}</text> 
      <image class="icon" src="../../assets/images/icons/arrow-right.png"></image>
    </view>
  </view>
</view>
<!-- end -->
```
```css
/* 默认插槽内容不显示 */
.default{
  display: none;
  align-items: center;
}
/* 实现默认插槽 当未插入插槽时.slot标签内部为空，则显示default默认内容*/
.area-header .slot:empty + .default{
  display: flex;
}
```

# 2022/6/16
## 项目更新：
### 界面：
- #### 多机型适配完成
- #### 歌曲推荐栏目完成
- #### 歌曲榜单栏目完成
- #### 歌单详情页完成
### 逻辑：
- #### 各种网络请求封装完成，热门歌曲、榜单以及歌单的数据格式都有点不同，通过后台对数据进行整理使其都一样，在wxml就可用一套代码渲染多组请求数据。

# 2022/7/12
## 知识点：
### bindtap与catchtap事件
- #### bindtap点击事件，触发过后会继续向上冒泡传递事件，而catchtap触发之后不会继续向上传递。
- #### home-music页面的播放条就用到了catchtap，由于需要实现播放条点击跳转到播放页，就给播放条设置bindtap，点击跳转页面，但是由于暂停按钮在播放条view容器的下层，这就导致了当点击暂停按钮时会触发跳转和暂停两个事件，这是由于暂停按钮的bindtap事件触发之后，事件还会继续向上传递给播放条的bindtap这就导致执行了两个点击事件，将暂停按钮改为catchtap问题解决。

# 2022/7/12
## 知识点：
### OpenId & UnioId
- OpenId：微信用户的唯一标识
- UnioId：多平台登录标识