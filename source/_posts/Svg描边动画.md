---
title: Svg描边Loading动画
thumbnail: 'https://bitiful.hudi.space/posts/2024/11/d063b0b7b68302ca0dc1cb5177187c69.png'
cover: 'https://bitiful.hudi.space/posts/2024/11/d063b0b7b68302ca0dc1cb5177187c69.png'
description: >-
  之前在浏览他人的博客时，看到loading动画是蒙娜丽莎的svg描边。觉得挺对自己胃口的，但是又不知道这样的效果怎么去实现，去b站刷了一些前端的学习视频，其中看到一个特别好看的动画特效。active状态下导航栏的每一个菜单项图标的动画描边，但是奈何不知道怎么把svg的图标放到butterfly的__config.yml当中，所以决定写一个svg的描边loading动画。
categories:
  - Hexo博客美化
tags:
  - svg
  - 动画
  - hexo
abbrlink: ca287c24
swiper_index: 5
---

# Svg描边动画

​		之前在浏览他人的博客时，看到loading动画是蒙娜丽莎的svg描边。觉得挺对自己胃口的，但是又不知道这样的效果怎么去实现，去b站刷了一些前端的学习视频，其中看到一个特别好看的动画特效。active状态下导航栏的每一个菜单项图标的动画描边，但是奈何不知道怎么把svg的图标放到butterfly的__config.yml当中，所以决定写一个svg的描边loading动画。

​		svg图标的定义本文不再描述。

## 一、Svg图标库

### 1、Svg图标

1、目前国内使用比较火的就是阿里巴巴矢量图标库iconfont 官网地址：https://www.iconfont.cn  图标比较多，并且是免费使用的。本文以阿里云图标为例。使用方法都是相同的。

2、当然还有一些其他的图标库，会列举一二，但是具体收付费情况需要自行查看官网。

iconpark：官网地址：https://iconpark.oceanengine.com。

iconfinder：官网地址： https://www.iconfinder.com

flaticon：官网地址：https://www.flaticon.com

### 2、获取Svg图标

首先登录阿里巴巴矢量图标库iconfont 官网地址：https://www.iconfont.cn 官方网站。由于获取的是svg图标，其实就是图标的路径信息。所以只需要复制svg的路径信息就可以直接使用了。

在搜索栏输入想要的图标信息。支持中文直接搜索，也可使用英文。

![image-20241126184904620](https://bitiful.hudi.space/posts/2024/11/3b3dc2ab52c4dd23150aa1644f11af53.png)

然后再搜索栏中点击心意的图标的下载按钮，就可以获取该图标的的信息了。可以在被选中图标的页面，对图标的颜色，大小等信息进行配置。也可以直接下载图标的png图片。这里我们点击【复制svg代码信息】按钮。本文仅以一个简单svg向右的图标为例。其他任何的复杂的svg图标描边动画都可以用该方法去实现。

![image-20241126190350090](https://bitiful.hudi.space/posts/2024/11/6c79073b3361657a6751a8d31c093e58.png)

将svg代码直接粘贴到的html页面的适当位置就可以正常显示了。但是他只是静静地显示在页面上。没有任何的动态效果。由于要使用css动画描边，所以建议图标的颜色最好是白色，描边的颜色是黑色或者是图标黑色，描边白色。这样更加能够去凸显描边的效果。

~~~html
<div class="loading">
<svg t="1732618860711" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9189" width="200" height="200">
    <path class="path" d="M782.222222 512L307.2 1012.622222c-14.222222 11.377778-39.822222 14.222222-51.2 2.844445-8.533333-8.533333-14.222222-28.444444 2.844444-45.511111l440.888889-455.111112L258.844444 56.888889S241.777778 28.444444 264.533333 14.222222c19.911111-14.222222 34.133333-8.533333 42.666667 0L782.222222 512z" fill="#ffffff" p-id="9190"></path>
    </svg>
</div>
~~~

## 二、Svg描边动画

### 1、添加css代码

首先为svg的path元素添加一个类样式，*注意选取的svg图标的复杂程度，svg元素下会有多个path元素，要为每一个path元素都添加类样式。*

css代码如下。该部分代码只是讲解svg描边的原理，并非最终代码。最终实现代码在后文中。

~~~css
.path{
     stroke: lightslategrey; 
     stroke-width:10;
     stroke-dasharray: 20;
     stroke-dashoffset: 10;
     stroke-linecap: round;
}
~~~

### 2、属性说明

| 属性名            | 作用                                                   |
| ----------------- | ------------------------------------------------------ |
| stroke            | 描边的颜色为lightslategrey                             |
| stroke-width      | 描边线条的宽度为10                                     |
| stroke-dasharray  | 描边线条的类型为虚线，表示虚线和间隔都是20个单位长度。 |
| stroke-dashoffset | 虚线与路径起点之间的偏移量为10                         |
| stroke-linecap    | 线段端点的样式                                         |

### 3、描边原理

1、当stroke-dashoffset正增长时，线条就会向线的起始位置去移动。

2、当stroke-dashoffset负增长时，线条就会向线的结束位置去移动。

3、当stroke-dasharray的值与路径的长度相等时，这时虚线中的一段，就会覆盖出整个路径。也就是一整个图标。当stroke-dashoffset的值是路径的长度值这时整个图标我们看到的就是空隙的部分。也就是图标呈现出不可见状态。这时定义动画让stroke-dashoffset从整个路径值向0改变。这时图标的路径的将向结束位置偏移。实线的部分也就慢慢的展现出来，就可以实现一个描边的效果了。但是由与复杂的svg图标路径长度我们是没办法直接获取到的。但是可以通过JavaScript去获取。同时要让JavaScript获取到的值，去绑定到对应元素的css的属性上，所以就需要引入一个css变量，--length表示整个svg图标的路径长度。

### 4、代码实现

获取路径长度的并设置--length属性的JavaScript代码

~~~JavaScript
let plist =document.querySelectorAll(".path")
    plist.forEach(p=>{
       const length= p.getTotalLength()
        p.style.setProperty("--length",length)
})
~~~

css代码,同时加上stroke-dashoffset的位移动画代码如下：

~~~css
 .path{
     stroke: lightslategrey;
     stroke-width:10;
     stroke-dasharray: var(--length);
     stroke-dashoffset: var(--length);
     stroke-linecap: round;
     animation: strokesanimation 2s infinite;
}
@keyframes strokesanimation {
    to{
         stroke-dashoffset: 0;
    }
}
~~~

到这里，整个svg描边就完成了。🎉🎉🎉🎉

## 三、动画替换

​		butterfly主题的fullpage_loading.pug的替换。由于本人刚接触butterfly，很多地方不熟悉。所以这里仅仅是一种参考方案。若您有更好方案的也可以分享出来。替换步骤如下。*注意：在替换前请注意备份原来的fullpage_loading.pug代码，防止替换失败，代码信息无法恢复。*

1、pug模版。文件路径：themes\butterfly\layout\includes\loading\fullpage_loading.pug

~~~diff
#loading-box
  .loading-left-bg
  .loading-right-bg
  .spinner-box
-    .configure-border-1
-      .configure-core
-    .configure-border-2
-      .configure-core
-    .loading-word= _p('loading')
+    .svg

# script代码中initloading方法中添加以下代码.svg.innerHTML替换你需要的svg图标的代码信息即可

initLoading: () => {
+      const svg= document.querySelector(".svg")
+      svg.innerHTML=``
+      let plist = document.querySelectorAll(".path")
+      plist.forEach(p => {
+         const length = p.getTotalLength()
+         p.style.setProperty("--length", length)
+       })
        $body.style.overflow = 'hidden'
        $loadingBox.classList.remove('loaded')
      }
}
~~~

2、style样式信息替换，文件路径：themes\butterfly\source\css\_layout\loading.styl

~~~css
#在.spinner-box下直接添加以下代码。注意缩进不然会报错
.path{
        stroke: lightslategrey;
        --length: 0;
        stroke-width:10;
        stroke-dasharray: var(--length);
        stroke-dashoffset: var(--length);
        stroke-linecap: round;
        animation: strokesanimation 2s infinite;
}
@keyframes strokesanimation {
  to{
    stroke-dashoffset: 0;
  }
}

#注释以下代码
.configure-border-1
   position: absolute
   padding: 3px
   width: 115px
   height: 115px
   background: #ffab91
   animation: configure-clockwise 3s ease-in-out 0s infinite alternate

.configure-border-2
   left: -115px
   padding: 3px
   width: 115px
   height: 115px
   background: rgb(63, 249, 220)
   transform: rotate(45deg)
   animation: configure-xclockwise 3s ease-in-out 0s infinite alternate

.loading-word
   position: absolute
   color: var(--preloader-color)
   font-size: 16px

@keyframes configure-clockwise
   0%
   		transform: rotate(0)
   25%
        transform: rotate(90deg)
   50% 
        transform: rotate(180deg)
   75%
        transform: rotate(270deg)
   100%
        transform: rotate(360deg)
@keyframes configure-xclockwise
   0%
        transform: rotate(45deg)  
   25%
        transform: rotate(-45deg)
   50%
        transform: rotate(-135deg)
   75%
        transform: rotate(-225deg)
   100%
        transform: rotate(-315deg)
~~~

完成上面的替换。你的博客也可以拥有一个svg加载动画了。🎉🎉🎉🎉 

​		
