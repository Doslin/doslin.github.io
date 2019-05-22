---
title: HashMap-Infiniteloop
tags: [JDK,Collection]
date: 2019-04-14 22:50:50
permalink: hashMap-infiniteLoop
categories: Java
description: 并发情况造成Race Condition，导致死循环
image: https://res.cloudinary.com/dvu6persj/image/upload/v1555254466/Blog/pexels-photo-849835.jpg
---
<p class="description"></p>

<img src="https://" alt="" style="width:100%" />

<!-- more -->

##  Race Condition的由来(JDK7)

<div class="note default"><p>问题的症状</p></div>

我一直使用HashMap这个东西，但是当时Servlet编程，设计到的编程环境尽管有多线程但是不是对单个HashMap的并发操作，一切都没有问题，后来需求改了，很多地方需要考虑多线程了，于是变到多线程，有些情况自己去压测的时候，程序可以看到占了100%的CPU，查看堆栈，可以看到程序都会Hang在HashMap.get()这个方法上了，重启可以做到短暂性的问题消息。这个问题也是极少数出现。

我们查看自己的代码，HashMap被多个线程操作，而Java API说HashMap是非线程安全的，应该使用ConcurrentHashMap。

<div class="note default"><p>Hash表的数据结构</p></div>

简单的说一下HashMap这个经典的数据结构。

HashMap通常会用一个指针数组（假设为table[]）来做分散所有的key，当一个key被加入的时候，通过Hash算法拿Key可以算出这个数组的下标i，然后把这个<key,value>插到table[i]中，如果有不同的key被算在了同一个i，那么就叫冲突，又叫做碰撞，这样会在table[i]上形成一个链表。

我们知道，如果table[]的尺寸非常小，比如只有两个，如果要放进去10个keys的话，那么碰撞会非常频繁，于是一个O(1)的查找算法，就变成了链表遍历，性能变成了O(n)，这是Hash表的缺陷。

这样一来，Hash表的尺寸和容量变得非常重要。一般来说，Hash表这个容器当有数据要插入的时候，都会检查容量有没有超过限定的thredhold，如果超过，需要增大Hash表的尺寸，但是这样一来，整个Hash表里的元素几乎都要重算一遍。这叫做rehash，成本相当的大。

<div class="note default"><p>正常ReHash的过程</p></div>

- 假设我们的hash算法就是简单的用key mod一下表的大小（也就是数组的长度）

- 最上面的是 old hash表，其中Hash表的size=2，所以key=3,7,5，在mod 2以后都冲突到table[1]这里了

- 接下来的三个步骤是Hash表resize成4，然后所有的<key,value>重新rehash的过程

  

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1555311542/Blog/HashMap01.jpg)

<div class="note default"><p>并发下ReHash的过程</p></div>

JDK7下的HashMap的拉链中插入元素是头插法

1.于是我们假设有两个线程，线程一刚执行到定义下个Entry，就被挂起，紧接着线程二执行完成了

于是有了这个样子。

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1555311776/Blog/HashMap02.jpg)

注意，因为Thread1的e指向了key(3)，而next指向了key(7)，其在线程二rehash后，指向了线程二重组后的链表。我们可以看到链表被反转后。

2.线程一被调度回来执行

- 先是执行newtable[i] = e;
- 然后是e=next，导致了e指向了key(7),
- 而下一次循环的next=e.next导致了next指向了key(3)

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1555313176/Blog/HashMap03.jpg)

3.一切安好。

线程接着工作。把key(7)摘下来，放到newTable[i]的第一个，然后把e和next往下移



![img](https://coolshell.cn/wp-content/uploads/2013/05/HashMap04.jpg)

4.环形链接出现

e.next = newTable[i]导致key(3).next指向了key7

注意：此时的key(7).next 已经指向了key(3)，环形链表就这样出现了

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1555313769/Blog/HashMap05.jpg)

于是当我们的线程一调用到，HashTable.get(11)时，悲剧就出现了——Infinitite Loop.

<div class="note default"><p>其它</p></div>

JDK8已经修复了这个问题，在JDK8中，每个Entry采用尾插法

<hr />

1.  参考：<<https://coolshell.cn/articles/9606.html>> 