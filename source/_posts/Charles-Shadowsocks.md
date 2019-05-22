---
title: Charles和Shadowsocks共同使用
tags: [Chat]
date: 2019-05-14 22:06:41
permalink: Charles-Shadowsocks
categories:  Study
description:  当发现自己的Charles打开的时候不能正常刷出数据的时候
image:  https://res.cloudinary.com/dvu6persj/image/upload/v1557843375/Blog/pexels-photo-2228123.jpg
---
<p class="description"></p>

<img src="https://" alt="" style="width:100%" />

<!-- more -->

一个是抓包利器Charles，一个是翻墙神器Shadowcocks，两个工具都是客户端开发必备的，但使用的时候有个尴尬的地方，就是二者不能同时使用。终于试出了二者同时使用(仅限全局模式下)的方法记录一下。

不能同时使用的原因是，二者都通过修改系统的代理来实现抓包或翻墙，打开任一应用的时候都可以观察到“系统偏好设置 - 网络 - 高级 - 代理栏”有修改。Shadowsocks覆盖了Charles的配置的话，使用Shadowsocks时自然用Charles抓不到包。

然而Charles是可以设置外部代理(External Proxy)的，解决方案就是将Charles的外部代理设置为Shadowsocks的Http代理。

## 步骤：

### 1. 查看Shadowsocks的Http代理。

Shadowsocks的Mac客户端推荐使用最新版本的[ ShadowsocksX-NG ](https://github.com/shadowsocks/ShadowsocksX-NG)（原ShadowsocksX的重写版本），Github上可直接[下载](https://github.com/shadowsocks/ShadowsocksX-NG/releases)最新版安装包。

启动ShadowsocksX-NG后，在菜单栏点击“Http代理设置”可查看代理的地址和端口：127.0.0.1:1087

![img](http://o9y0ug9gc.bkt.clouddn.com/pic/2016-12-04-071824.jpg)

![img](http://o9y0ug9gc.bkt.clouddn.com/pic/2016-12-04-072115.jpg_s)_

### 2.将Shadowsocks设置成全局模式。

在ShadowsocksX-NG菜单“代理”下选择“全局模式”（使用"PAC自动模式"Charles同样抓不到包）

![img](http://o9y0ug9gc.bkt.clouddn.com/pic/2016-12-04-074208.jpg_s)

### 3. 设置Charles的外部代理。

启动Charles，点击菜单栏的“Proxy - External Proxy Settings”，

![img](http://o9y0ug9gc.bkt.clouddn.com/pic/2016-12-04-072453.jpg_s)

勾选“Use external proxy servers”，并填上刚才查到的代理地址和端口，保存。

![img](http://o9y0ug9gc.bkt.clouddn.com/pic/2016-12-04-072402.jpg_s)

### 4. 重启Charles，能正常抓包。

## 注意事项：

- 该方法仅对全局模式有效，自动代理模式抓不到包
- 设置完成后抓不到包，请依次检查：
  - 是否打开了ShadowsocksX-NG，能否正常翻墙
  - ShadowsocksX-NG是否勾选全局模式
  - Charles的Proxy菜单下是否勾选External Proxy Settings
  - External Proxy Settings里的地址和端口设置是否与ShadowsocksX-NG的“Http代理设置”里显示的一致
  - 重启Charles
- 过段时间后上网不正常，报错“Failed to connect to external proxy”等，则可能是Charles设置打开了External Proxy Settings，却没有启动ShadowsocksX-NG。
  解决方法：启动ShadowsocksX-NG，或者取消Charles的Proxy栏下“External Proxy Settings”选项

<hr />
