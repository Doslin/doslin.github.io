---
layout: post
title: '如何使用JDK来实现自己的缓存'
description: "JDK实现自己的缓存"
author: qiuzhilin
categories: 
  - Interview
tags: 
  - Problem
last_modified_at: 2019-06-04T13:46:12-05:00



---

### 面试官：你是如何使用JDK来实现自己的缓存（支持高并发）？

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1559741258/Blog/640.png)

转载自：https://dwz.cn/HGarfiB9 作者：浅醉樱花雨

### 需求分析

项目中经常会遇到这种场景：一份数据需要在多处共享，有些数据还有时效性，过期自动失效。比如手机验证码，发送之后需要缓存起来，然后处于安全性考虑，一般还要设置有效期，到期自动失效。我们怎么实现这样的功能呢？

### 解决方案

1. 使用现有的缓存技术框架，比如redis,ehcache。优点：成熟，稳定，功能强大；缺点，项目需要引入对应的框架，不够轻量。
2. 如果不考虑分布式，只是在单线程或者多线程间作数据缓存，其实完全可以自己手写一个缓存工具。下面就来简单实现一个这样的工具。

先上代码：

```
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;

/**
 * @Author: lixk
 * @Date: 2018/5/9 15:03
 * @Description: 简单的内存缓存工具类
 */
public class Cache {
    //键值对集合
    private final static Map<String, Entity> map = new HashMap<>();
    //定时器线程池，用于清除过期缓存
    private final static ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();

    /**
     * 添加缓存
     *
     * @param key  键
     * @param data 值
     */
    public synchronized static void put(String key, Object data) {
        Cache.put(key, data, 0);
    }

    /**
     * 添加缓存
     *
     * @param key    键
     * @param data   值
     * @param expire 过期时间，单位：毫秒， 0表示无限长
     */
    public synchronized static void put(String key, Object data, long expire) {
        //清除原键值对
        Cache.remove(key);
        //设置过期时间
        if (expire > 0) {
            Future future = executor.schedule(new Runnable() {
                @Override
                public void run() {
                    //过期后清除该键值对
                    synchronized (Cache.class) {
                        map.remove(key);
                    }
                }
            }, expire, TimeUnit.MILLISECONDS);
            map.put(key, new Entity(data, future));
        } else {
            //不设置过期时间
            map.put(key, new Entity(data, null));
        }
    }

    /**
     * 读取缓存
     *
     * @param key 键
     * @return
     */
    public synchronized static Object get(String key) {
        Entity entity = map.get(key);
        return entity == null ? null : entity.getValue();
    }

    /**
     * 读取缓存
     *
     * @param key 键
     *            * @param clazz 值类型
     * @return
     */
    public synchronized static <T> T get(String key, Class<T> clazz) {
        return clazz.cast(Cache.get(key));
    }

    /**
     * 清除缓存
     *
     * @param key
     * @return
     */
    public synchronized static Object remove(String key) {
        //清除原缓存数据
        Entity entity = map.remove(key);
        if (entity == null) return null;
        //清除原键值对定时器
        Future future = entity.getFuture();
        if (future != null) future.cancel(true);
        return entity.getValue();
    }

    /**
     * 查询当前缓存的键值对数量
     *
     * @return
     */
    public synchronized static int size() {
        return map.size();
    }

    /**
     * 缓存实体类
     */
    private static class Entity {
        //键值对的value
        private Object value;
        //定时器Future 
        private Future future;

        public Entity(Object value, Future future) {
            this.value = value;
            this.future = future;
        }

        /**
         * 获取值
         *
         * @return
         */
        public Object getValue() {
            return value;
        }

        /**
         * 获取Future对象
         *
         * @return
         */
        public Future getFuture() {
            return future;
        }
    }
}
```

本工具类主要采用 **HashMap+定时器线程池** 实现，`map` 用于存储键值对数据，`map`的value是 `Cache` 的内部类对象 Entity，Entity 包含 value 和该键值对的生命周期定时器 `Future`。`Cache` 类对外只提供了 `put(key, value)`, `put(key, value, expire)`, `get(key)`, `get(key, class)`, `remove(key)`, `size()`几个同步方法。

当添加键值对数据的时候，首先会调用`remove()`方法，清除掉原来相同 key 的数据，并取消对应的定时清除任务，然后添加新数据到 `map` 中，并且，如果设置了有效时间，则添加对应的定时清除任务到定时器线程池。

##### 测试

```
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * @Author: lixk
 * @Date: 2018/5/9 16:40
 * @Description: 缓存工具类测试
 */
public class CacheTest {

    /**
     * 测试
     *
     * @param args
     */
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        String key = "id";
        //不设置过期时间
        System.out.println("***********不设置过期时间**********");
        Cache.put(key, 123);
        System.out.println("key:" + key + ", value:" + Cache.get(key));
        System.out.println("key:" + key + ", value:" + Cache.remove(key));
        System.out.println("key:" + key + ", value:" + Cache.get(key));

        //设置过期时间
        System.out.println("\n***********设置过期时间**********");
        Cache.put(key, "123456", 1000);
        System.out.println("key:" + key + ", value:" + Cache.get(key));
        Thread.sleep(2000);
        System.out.println("key:" + key + ", value:" + Cache.get(key));

        /******************并发性能测试************/
        System.out.println("\n***********并发性能测试************");
        //创建有10个线程的线程池，将1000000次操作分10次添加到线程池
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        Future[] futures = new Future[10];
        /********添加********/
        {
            long start = System.currentTimeMillis();
            for (int j = 0; j < 10; j++) {
                futures[j] = executorService.submit(() -> {
                    for (int i = 0; i < 100000; i++) {
                        Cache.put(Thread.currentThread().getId() + key + i, i, 300000);
                    }
                });
            }
            //等待全部线程执行完成，打印执行时间
            for (Future future : futures) {
                future.get();
            }
            System.out.printf("添加耗时：%dms\n", System.currentTimeMillis() - start);
        }

        /********查询********/
        {
            long start = System.currentTimeMillis();
            for (int j = 0; j < 10; j++) {
                futures[j] = executorService.submit(() -> {
                    for (int i = 0; i < 100000; i++) {
                        Cache.get(Thread.currentThread().getId() + key + i);
                    }
                });
            }
            //等待全部线程执行完成，打印执行时间
            for (Future future : futures) {
                future.get();
            }
            System.out.printf("查询耗时：%dms\n", System.currentTimeMillis() - start);
        }

        System.out.println("当前缓存容量：" + Cache.size());
    }
}
```

测试结果：

```
***********不设置过期时间**********
key:id, value:123
key:id, value:123
key:id, value:null

***********设置过期时间**********
key:id, value:123456
key:id, value:null

***********并发性能测试************
添加耗时：2313ms
查询耗时：335ms
当前缓存容量：1000000
```

测试程序使用有10个线程的线程池来模拟并发，总共执行一百万次添加和查询操作，时间大约都在两秒多，表现还不错，每秒40万读写并发应该还是可以满足大多数高并发场景的^_^