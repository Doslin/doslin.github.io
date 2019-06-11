---
layout: post
title: 'Mysql 并发插入、存在不插入，存在更新操作'
description: "Mysql 并发插入、存在不插入，存在更新操作"
author: qiuzhilin
tags: 
  - MySQL
last_modified_at: 2019-06-11T13:46:19-05:00
---

# Mysql 并发插入、存在不插入，存在更新操作

我们遇到挺多这样的问题，当用户并发提交数据，重复提交数据。导致数据重复，或者 报错。

几种解决办法，对应到几种业务场景。

## 方案一，先查再插

这个应该是最常见的处理方式，是醉不安全的，因为一旦有并发其实完全防止不了，来看看伪代码。



```sql
Entity entity = service.findById(10);if(null == entity){    service.insert(obj);}else{    service.update(obj);}
```

先根据条件查询，存在就更新，不存在添加，但是往往我们是集群、多列的状态下，会再你正在判断`null == entity`的时候，另外一个线程已经插入完毕了，导致你以为是不存在，重复插入。

## 方案二，存在即更新，不存在即插入

我们平常的`INSERT INTO`   **SQL**是这么写：



```sql
INSERT INTO demo_in(a,b,c)  VALUES(123, 2, 4);
```

比如`C`是主键，插入2次就会抛出异常：



```sql
[23000][1062] Duplicate entry '4' for key 'PRIMARY'
```

所以我们用到`REPLACE`关键字，他的作用如题，存在即更新，不存在即插入，和`delete` + `Insert Into` 一样。但是它一个原子操作，是一步完成，所以我们不用担心有其他问题的出现，但是使用`REPLACE`的时候，一定要保证表有唯一主键。

重要：执行`REPLACE` 语句后，系统返回了所影响的行数，如果返回1，说明在表中并没有重复的记录，如果返回2，说明有一条重复记录，系统自动先调用了`DELETE`删除这条记录，然后再记录用`INSERT`来插入这条记录。

 改造一下上面的语句就是：



```sql
REPLACE INTO demo_in(a,b,c)  VALUES(123, 2, 4);
```

## 方案三，存在不插入，不存在再插入

这个其实很简单，因为  **Mysql** 不能做到插入的时候带`where`条件，故用了一张临时表来处理。



```sql
INSERT INTO demo_in(a,b,c) SELECT 123, 2, 4 FROM DUAL WHERE NOT EXISTS(SELECT c FROM demo_in WHERE c = 4);
```

用临时表`DUAL`来标记数据，然后插入到`demo_in`表中。条件是`c=4`，并且`not exists`，也就是当`c=4`条件满足，则不插入。