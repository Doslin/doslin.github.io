---
title: CentOS更新NodeJS
tags: [Centos]
date: 2019-04-11 19:19:21
permalink: centos-install-node
categories: Study
description: CentOS安装最新版本NodeJS
image: http://ppscnu16d.bkt.clouddn.com/NodeJS.png 
---

<img src="https://" alt="" style="width:100%" />

<! -- more  -- > 

## CentOS 下安装 Node.js

​	自己安装了好几次Node都没能够安装成功，今天自己再琢磨了一变，总算可拿出来了

我们知道CentOS通过yum安装也可以安装NodeJS，但是版本太老了，我自己通过执行

```
sudo yum -y install nodejs
```

拿到了 6.14的版本，但是查看官网，最新版本是 ：[Latest LTS Version: **10.15.3** (includes npm 6.4.1)](<https://nodejs.org/en/download/>)

<div class="note primary"><p>于是开始了折腾之旅</p></div>

 1. 下载Nodejs 官网提供了编译好的 Linux 二进制包（不需要自己编译安装）[官网](https://nodejs.org/en/download/) 下载最新的Nodejs版本 ,本文以**10.15.3** 为例

    <blockquote class="question">cd /usr/local/
        wget https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-x64.tar.xz</blockquote>

2. 解压安装

   <blockquote class="question">tar -xvJf node-v10.15.3-linux-x64.tar.xz</blockquote>

3. 配置NODE_HOME，进入profile编辑环境变量

   <blockquote class="question">vim /etc/profile</blockquote>

   设置 nodejs 环境变量，在 ***export PATH USER LOGNAME MAIL HOSTNAME HISTSIZE HISTCONTROL*** 一行的上面添加如下内容:

   <blockquote class="question">#set for nodejs
   export NODE_HOME=/usr/local/node-v10.15.3-linux-x64
   export PATH=$NODE_HOME/bin:$PATH</blockquote>


   :wq保存并退出，编译/etc/profile 使配置生效

   <blockquote class="question">source /etc/profile</blockquote>

   验证是否安装配置成功

   <blockquote class="question">node -v</blockquote>

   输出版本号标识配置成功

   npm模块安装路径

   <blockquote class="question">/usr/local/node-v10.15.3-linux-x64/lib/node_modules/</blockquote>

   

<hr />
