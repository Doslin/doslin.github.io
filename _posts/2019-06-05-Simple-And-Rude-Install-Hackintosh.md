---
layout: post
title: '简单粗暴安装黑苹果'
description: "黑苹果就是牛"
author: qiuzhilin
categories: 
  - Mac
tags: 
  - Hackintosh
  - MacOS
last_modified_at: 2019-06-06T13:46:12-05:00
---

首先这是我的电脑配置，当然，玩[黑苹果](http://bbs.pcbeta.com/)不一定得和我的配置一样~

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740430/Blog/Mac/4631695-12047e962c84a9bd.png.png)

所有文件在附件里面，， 全部下载即可

#### 1、做系统盘：

1、准备一个8G以上的U盘

打开上面工具里面的TransMac软件，检测到我们的U盘，然后右击，选择如图所示的第二个：

`Format Disk for Mac`，将我们的U盘转换为Mac格式。

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740453/Blog/Mac/4631695-8ee4a3fa2544ee71.png.png)

如果弹出提示或者格式化U盘的时候，选择ok或者格式化就行

#####  烧录镜像：

第一步好了之后，然后右击第三个，`Resrtore with Disk Image`

然后会弹出一个窗口，然后选择我们上面下载的Mac镜像文件就行。

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740549/Blog/Mac/4631695-42fea705ad8d25db.png.png)

点击OK

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740574/Blog/Mac/4631695-f0b7751cfb9d2071.jpg.jpg)

等待烧录完成

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740609/Blog/Mac/4631695-2a0073619da0926e.jpg.jpg)

完成之后我们使用`DiskGenius` 这个软件，自行百度搜索下载就行

打开之后我们找到自己的U盘，然后，右键如图所示EFI文件，然后点击复制到桌面

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740642/Blog/Mac/4631695-bf9398fd4b749553.png.png)

复制完成之后，我们将刚才所操作的ESP分区格式化

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740677/Blog/Mac/4631695-3c7d94f242eeb3bd.png.png)

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740749/Blog/Mac/4631695-fc8cbe9164631791.png.png)

格式化之后打开我的电脑：就能看到这个198MB的就是刚才们格式化的ESP分区了~

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740785/Blog/Mac/4631695-099a03314708493a.png.png)

然后将我们刚才链接里面给的EFI文件复制到这个`U盘`里面就行，因为这个EFI是我以前装过调整好驱动的，所以就直接用了~

至此，我们的启动盘就知错好啦



#### 2、把我们电脑的需要装Mac的盘弄好

我是直接将我的固态全部装的Mac~

首先我们进BIOS，这是BIOS的相关设置

第一张图是UEFI模式，然后禁用安全引导

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740813/Blog/Mac/4631695-01154e1ed9c3bf40.png.png)

第二张图是给BIOS设置密码

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740914/Blog/Mac/4631695-95da261ffa6b623b.png.png)

记得bios里面开启f12

操作完后记得按f10保存

然后找过这个装了win的pe，我直接将我的固态全部格式化，然后新建分区，记得将FEI(也就是ESP)分区调整到200MB，我这是的是300MB。记住这都是对硬盘操作的噢~

默认efi分区只有100m多，至于如何扩容efi分区，百度是个好东西

（efi分区里面的东西非专业人士不要瞎弄，否则后果自负）

至此我们的安装环境就配置好啦~



#### 3、开始安装：

首先进BIOS将我们第一步制作的U盘设置为电脑的启动项，然后按F10保存重启，等待电脑开启：

第一次安装只有这一张图，直接回车即可，

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740945/Blog/Mac/4631695-c89317b7547ac60d.jpg.jpg)

等待电脑重启，时间可能有点久，十几分钟到几十分钟不等，

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740959/Blog/Mac/4631695-2d14ee8f44598193.jpg.jpg)

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559740988/Blog/Mac/4631695-3a6949860d072618.jpg.jpg)

漫长的等待结束了，

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559741023/Blog/Mac/4631695-d1fe81f6bc40177b.png.png)

[图片来源：https://blog.daliansky.net]

然后我们选择磁盘工具：将我们要安装Mac系统所在的分区抹掉：选择`Mac OS拓展(日志式)`

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559741044/Blog/Mac/4631695-aba0e03845994a9d.jpg.jpg)

抹掉完成之后，返回我们的安装界面，选择刚才我们所抹掉的磁盘，点击安装

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559741067/Blog/Mac/4631695-d442996fecbaeb8d.jpg.jpg)

然后一步步按提示玩下面操作就行啦~

等待多次重启，至此我们的安装步骤就完成啦~

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559741089/Blog/Mac/4631695-222f4d4883883b86.jpg.jpg)



#### 4、进引导文件拷贝到我们的硬盘，拜托U盘启动：

##### 1、首先我们打开电脑的终端：输入`diskutil list` 回车

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559741116/Blog/Mac/4631695-334a36d1af8c2ab4.jpg.jpg)

我们看下面这几个位置，128G的是我们的固态硬盘，也就是我所安装Mac的位置

然后再看到EFI位置，也就是我们的Mac系统引导所在的位置，后面对应着`disk0s1`这个 ID

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559741186/Blog/Mac/4631695-63891811d03d449e.png.png)

##### 2、挂载我们Mac所安装盘的FEI分区，也就是我们上面所找的`disk0s1`

我们继续在终端输入：`diskutil mount disk0s1`，然后我们的EFI分区就会被挂载了~

##### 3、打开EFI分区：继续在终端注入`open .`注意点前面有空格~

找到我们刚才挂在的EFI分区，

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559741142/Blog/Mac/4631695-464ccb0b120d1336.jpg.jpg)

最后，打开桌面的一个`Untiled`的图标，里面就是我们之前U盘里面配置好了的EFI文件里面的内容，我们将U盘里面的EFI文件替换到我们刚才挂在的EFI文件里面。

至此，我们的引导文件就弄好啦~，现在我们就可以拔掉U盘，进行电脑重启啦~，当然，机型不一样，所需要的驱动也不一样，适配驱动的问题因机型而有差异，自己慢慢折腾吧 ~

相关参考：(感谢)

1、[远景论坛](https://blog.daliansky.net/)

3、[b站张云道的安装教学视频](https://www.bilibili.com/video/av19235761)

附件失效，，直接给上云盘地址吧： 链接: https://pan.baidu.com/s/1TQ-DmbnCa11ecmXiE7HTPw 提取码: fxiz 复制这段内容后打开百度网盘手机App，操作更方便哦