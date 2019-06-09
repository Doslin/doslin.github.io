---
layout: post
title: '为博客添加 CDN (Cloudflare，腾讯云)'
description: "CDN 就是部署在世界各地的缓存服务器"
author: qiuzhilin
image: 
  path: /images/20181225/ssi-cover.jpg
  thumbnail: /images/20181225/ssi-cover.jpg
categories: 
  - CDN
tags: 
  - CDN
last_modified_at: 2019-05-29T13:46:12-05:00

---

CDN 就是部署在世界各地的缓存服务器，它们会提前缓存网站上的资源，然后当用户想要访问相关资源时，直接从 CDN 服务器上取就可以了。这样不仅可以增加访问速度减少访问延迟，还可以减缓网站服务器上的压力

<!-- more -->

# 为博客添加 CDN (Cloudflare，腾讯云)

正如前面的几篇文章提到的那样，本博客是部署到 GitHub Pages 上的。

GitHub Pages 不仅不花钱，而且还有免费的证书拿，可以说是相当划算的。但有个问题就是 GitHub 的服务器都部署在海外，也就是说在国内访问本博客的速度的速度会比较慢 (Ping 下来 100 到 200 多毫秒)。

解决这一问题的最优解就是使用 CDN。

## CDN 是什么？

> **内容分发网络**（英语：**C**ontent **d**elivery **n**etwork或**C**ontent **d**istribution **n**etwork，[缩写](https://zh.wikipedia.org/wiki/縮寫)：**CDN**）是指一种透过[互联网](https://zh.wikipedia.org/wiki/互聯網)互相连接的计算机网络系统，利用最靠近每位用户的服务器，更快、更可靠地将音乐、图片、影片、应用程序及其他文件发送给用户，来提供高性能、可扩展性及低成本的网络内容传递给用户。
>
>  *—— 维基百科*

简单来说，CDN 就是部署在世界各地的缓存服务器，它们会提前缓存网站上的资源，然后当用户想要访问相关资源时，直接从 CDN 服务器上取就可以了。这样不仅可以增加访问速度减少访问延迟，还可以减缓网站服务器上的压力。

世界上的 CDN 服务提供商有很多，七牛云、阿里云、腾讯云等等都提供了 CDN 服务，它们有的收费有的部分免费。我今天选择的 CDN 服务来自于 Cloudflare。

## Why Cloudflare？

[Cloudflare](https://dash.cloudflare.com/) 是全球最大的 DNS 服务提供商之一 (号称是全球最快的 DNS `1.1.1.1` 就是它们搞的)。除此之外他们还提供 CDN、SSL 证书、DDos 保护等服务，并且 Cloudflare 与百度有合作，在国内也部署有大量的节点，还能顺便解决百度爬无法抓取 GitHub Pages 的问题。我今天要使用的就是免费版的 SSL 证书以及 CDN 服务。

除了 Cloudflare 比较 NB 以外选择他的另一个更重要的原因是国内的 CDN 无一例外都要要求域名在公安局备过案。作为一个遵纪守法的好市民，我肯定是不怕什么公安局备案的，我主要是觉得太麻烦了。并且在公安局备案后，放到网站上的那个小图标有点丑 ,,Ծ‸Ծ,,

## 配置 CDN

首先要去 [Cloudflare](https://dash.cloudflare.com/) 注册一个帐号。注册好后点击 `Add site` 添加你的网站。

![Add site](https://mogeko.github.io/blog-images/r/056/add-site.png)

添加好后选择免费的那个计划 (Plan)，有钱也可以选择收费的，提供的服务更多。

![Free Plan](https://mogeko.github.io/blog-images/r/056/free-plan.png)

然后 Cloudflare 会读取你的 DNS 配置，没有问题的话直接点 `Continue` 即可。

![DNS Config](https://mogeko.github.io/blog-images/r/056/dns-config.png)

然后 Cloudflare 会要求你将你的 DNS 服务器替换成他提供的，到你的域名商那里设置一下即可 (添加或替换均可)

![Change DNS Server](https://mogeko.github.io/blog-images/r/056/change-dns-server.png.png)

等几分钟，等到它显示 `Great news! Cloudflare is now protecting your site` 就说明设置成功了。

![Success](https://mogeko.github.io/blog-images/r/056/success.png)

## 设置 SSL 证书

除了免费的 DNS 和 CDN 以外，Cloudflare 还提供了免费的 SSL 证书。

Cloudflare 的 SSL 证书默认是已经开启了的。不过最好还是在 `Crypto` 页面将 `Always Use HTTPS` 勾选上，这个选项可以自动在访问你的网站时将所有的 `http` 的链接重定向到相应的 `https` 链接上。

![Always Use HTTPS](https://mogeko.github.io/blog-images/r/056/always-use-https.png)



##腾讯云的CDN

最近把博客搬到腾讯云后，使用腾讯云的COS存储
免费50G的存储空间，放个小博客还是够用的

而且，还可以使用免费的CDN加速
国内访问博客速度比放在GitHub上要快多了

申请腾讯云COS ，每个月有免费的10GB的CDN流量可以使用；

1. 在腾讯云COS控制台中 创建一个bucket;
2. 然后在设置中开启静态网站设置
3. 在自定义域名中设置上自己的域名





配置过程需要等待五分钟，然后上传网站静态文件，就可以访问了

为了能上传到腾讯云需要再安装个插件

- 安装

```
$ npm install hexo-deployer-cos --save
```

- 在Hexo配置文件（_config.yml）中配置 :

```
deploy:
  type: cos
  appId: yourAppId
  secretId: yourSecretId
  secretKey: yourSecretKey
  bucket: yourBucketName
  region: yourRegion
```

最后还是一样的 操作

**hexo clean**
**hexo g -d**

ok,可以访问了

**关于CDN的刷新**

每次更新博客内容完后，都要登陆腾讯云后台手动刷新一下CDN
这样未免也太麻烦

所以用腾讯云官方给的api做了个脚本用来每次更新博客内容后，自动刷新CDN

[腾讯云cdn官方文档](https://github.com/QCloudCDN/CDN_API_DEMO/tree/master/Qcloud_CDN_API/nodejs)

上面时官方的node.js版本的api

安装（在博客根目录执行）

```
npm install qcloud-cdn-node-sdk --save
```

然后在主题的script文件夹下，创建脚本qcloudcdn.js

```
const qcloudSDK = require(qcloud-cdn-node-sdk);

qcloudSDK.config({
    secretId: 你的ID,
    secretKey: 你的密钥
})

qcloudSDK.request(RefreshCdnDir, {
	dirs.1: http://博客地址 
}, (res) => {
    console.log(res)
})
```

[官方api文档](https://github.com/QCloudCDN/CDN_API_SDK/blob/master/README.md)

