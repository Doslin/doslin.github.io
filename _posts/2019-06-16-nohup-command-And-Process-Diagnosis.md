---
layout: post
title: 'nohup和&后台运行，进程查看及终止'
description: "nohup和&后台运行，进程查看及终止"
author: qiuzhilin
tags: 
  - OS
last_modified_at: 2019-06-16T13:46:18-05:00
---

1.nohup

用途：不挂断地运行命令。

语法：nohup Command [ Arg … ] [　& ]

　　无论是否将 nohup 命令的输出重定向到终端，输出都将附加到当前目录的 nohup.out 文件中。

　　如果当前目录的 nohup.out 文件不可写，输出重定向到 $HOME/nohup.out 文件中。

　　如果没有文件能创建或打开以用于追加，那么 Command 参数指定的命令不可调用。

退出状态：该命令返回下列出口值： 　　

　　126 可以查找但不能调用 Command 参数指定的命令。 　　

　　127 nohup 命令发生错误或不能查找由 Command 参数指定的命令。 　　

　　否则，nohup 命令的退出状态是 Command 参数指定命令的退出状态。

2.&

用途：在后台运行

一般两个一起用

nohup command &

eg:

```bash
nohup /usr/local/node/bin/node /www/im/chat.js >> /usr/local/node/output.log 2>&1 &
```

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560693827/Blog/OS/798214-20170320150831908-545166421.png)

进程号7585

查看运行的后台进程

（1）jobs -l

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560693861/Blog/OS/798214-20170320150912955-1772662776.png)

jobs命令只看当前终端生效的，关闭终端后，在另一个终端jobs已经无法看到后台跑得程序了，此时利用ps（进程查看命令）

（2）ps -ef 

```bash
ps -aux|grep chat.js
```

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560693847/Blog/OS/798214-20170320153334877-1168175476.png)

注：

　　用ps -def | grep查找进程很方便，最后一行总是会grep自己

　　用grep -v参数可以将grep命令排除掉

```bash
ps -aux|grep chat.js| grep -v grep
```

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560693742/Blog/OS/1381560693648_.pic.jpg)

　　再用awk提取一下进程ID　

```bash
ps -aux|grep chat.js| grep -v grep | awk ``'{print $2}'
```

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560693744/Blog/OS/1391560693669_.pic.jpg)

```

```

3.如果某个进程起不来，可能是某个端口被占用

查看使用某端口的进程

```bash
lsof -i:8090
```

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560693929/Blog/OS/798214-20170320154514377-1985478430.png)

```bash
netstat -ap|grep 8090
```

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560693938/Blog/OS/798214-20170320154600658-246972161.png)

查看到进程id之后，使用netstat命令查看其占用的端口

```bash
netstat -nap|grep 7779
```

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560693984/Blog/OS/798214-20170320155041815-1272481492.png)

使用kill杀掉进城后再启动

4.终止后台运行的进程

```bash
kill -9  进程号
```

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1560694019/Blog/OS/798214-20170320153728049-88100874.png)