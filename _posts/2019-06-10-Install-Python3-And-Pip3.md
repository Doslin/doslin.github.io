---
layout: post
title: '安装Python3和pip3'
description: "安装Python3，防止和Python2.7冲突"
author: qiuzhilin
tags: 
  - Python
last_modified_at: 2019-06-10T13:46:18-05:00
---

# [教程]安装Python3，防止和Python2.7冲突

在宝塔面板环境下，安装Python3，防止和宝塔Python2.7冲突

## 1.下载python3安装包并解压

1. wget https://www.python.org/ftp/python/3.6.0/Python-3.6.0.tgz

1. tar –xzvf Python–3.6.0.tgz

## 2、进入解压，编译安装包，指定安装路径，并执行安装命令

1. cd Python–3.6.0

1. ./configure –prefix=/usr/local/python36 #注意：prefix参数用于指定将Python安装在新目录，防止覆盖系统默认安装的python
2. make && make install

## 3.建立软链接（python3的环境变量）

1. ln –s /usr/local/python36/bin/python3.6 /usr/bin/python3

## 4、完成

1. [root@Rserver–1 Python–3.6.0]# python3
2. Python 3.6.0 (default, May 25 2017, 11:39:00)
3. [GCC 4.4.7 20120313 (Red Hat 4.4.7–18)] on [linux](https://yunzhuji.shop/tag/linux)
4. Type “help”, “copyright”, “credits” or “license” for more information.
5. \>>>
6. \>>>****

## 5、python3安装pip

**方法一.**python3安装完成后默认已经带有pip3

![640](https://res.cloudinary.com/dvu6persj/image/upload/v1560184874/Blog/Python/1011560184648_.pic.jpg)

pip3

 你可以用以下命令,创建软链接

```
ln -s /Library/Frameworks/Python.framework/Versions/3.7/bin/pip3 /usr/bin/pip3
```



**方法二.**使用以下方法重新安装pip插件
 下载get-pip.py脚本

```
wget https://bootstrap.pypa.io/3.2/get-pip.py
```

运行脚本

```
python3 get-pip.py
```

python3创建pip3索引
 `ln -s /usr/python3.6.1/bin/pip /usr/bin/pip3`

##### 7.测试是否安装成功



![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560184736/Blog/Python/1021560184648_.pic.jpg)

