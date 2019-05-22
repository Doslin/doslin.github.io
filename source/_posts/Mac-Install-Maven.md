---
title: Mac_Install_Maven
tags: [Maven]
date: 2019-05-06 23:39:56
permalink: Mac_Install_Maven
categories: Java
description:  Maven在Mac上配置环境变量
image:  https://res.cloudinary.com/dvu6persj/image/upload/v1557157387/Blog/JDK/pexels-photo-2237795.jpg
---
<p class="description"></p>

<img src="https://" alt="" style="width:100%" />

<!-- more -->

记录自己给Mac安装maven的一天

自己最开始给自己根据网上的路子走了一遍，但是都是报错,报的错是如下两种

![屏幕快照 2019-05-05 下午1.45.43](https://res.cloudinary.com/dvu6persj/image/upload/v1557579214/Blog/Mac_Maven01.png)

```bash
localhost:opt doude$ mvn -v 

Error: JAVA_HOME is not defined correctly.

We cannot execute /Library/Java/JavaVirtualMachines/jdk1.8.0_211/Contents/Home/bin/java#
```



```bash
localhost:~ doude$ mvn -v 

The JAVA_HOME environment variable is not defined correctly

This environment variable is needed to run this program

NB: JAVA_HOME should point to a JDK not a JRE
```

![屏幕快照 2019-05-05 下午1.46.25](https://res.cloudinary.com/dvu6persj/image/upload/v1557579196/Blog/Mac_Maven02.png)



历经更换maven版本，更换maven放置的目录

但是最后通过更改 ~/.bash_profile 

```java 
export JAVA_HOME=$(/usr/libexec/java_home)

export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_211.jdk/Contents/Home/jre

export PATH=$JAVA_HOME/bin:$PATH

export  CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```

如上把JAVA_HOME进行了更改

```
 localhost:opt doude$ mvn -v 

**Apache Maven 3.5.0 (ff8f5e7444045639af65f6095c62210b5713f426; 2017-04-04T03:39:06+08:00)**

Maven home: /opt/apache-maven-3.5.0

Java version: 1.8.0_211, vendor: Oracle Corporation

Java home: /Library/Java/JavaVirtualMachines/jdk1.8.0_211.jdk/Contents/Home/jre

Default locale: zh_CN, platform encoding: UTF-8

OS name: "mac os x", version: "10.14.4", arch: "x86_64", family: "mac" 
```

终于出来了自己想要的模样

给你一个可以下载previous版本的maven库[http://archive.apache.org/dist/maven/maven-3/3.3.3/binaries/](http://archive.apache.org/dist/maven/maven-3/3.3.3/binaries/)











<hr />
