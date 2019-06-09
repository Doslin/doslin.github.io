---
layout: post
title: 'ThreadPool'
tags: JDK
last_modified_at: 2019-06-08 T13:46:12-05:00
description: 聊一聊被问倒的线程池
---
<p class="description"></p>

### 首先说说为什么用线程池？

创建并开启一个线程开销很大。
如果我们每次需要执行任务时重复这个步骤，那将会是一笔巨大的性能开销，这也是我们希望通过多线程解决的问题。 
为了更好理解创建和开启一个线程的开销，让我们来看一看 JVM 在后台做了哪些事：

```: 出处:  ~/深入Java虚拟机/Java线程.java

为线程栈分配内存，保存每个线程方法调用的栈帧。 
每个栈帧包括本地变量数组、返回值、操作栈和常量池 
一些 JVM 支持本地方法，也将分配本地方法栈 
每个线程获得一个程序计数器，标识处理器正在执行哪条指令 
系统创建本地线程，与 Java 线程对应 
和线程相关的描述符被添加到JVM内部数据结构 
线程共享堆和方法区 


```

当然，这些步骤的具体细节取决于 JVM 和操作系统。 
另外，更多的线程意味着更多工作量，系统需要调度和决定哪个线程接下来可以访问资源。 
线程池通过减少需要的线程数量并管理线程生命周期，来帮助我们缓解性能问题。 

<blockquote class="question">本质上，线程在我们使用前一直保存在线程池中，在执行完任务之后，线程会返回线程池等待下次使用。
这种机制在执行很多小任务的系统中十分有用。</blockquote>

在web开发中，服务器需要接受并处理请求，所以会为一个请求来分配一个线程来进行处理。如果每次请求都新创建一个线程的话实现起来非常简便，但是存在一个问题：

**如果并发的请求数量非常多，但每个线程执行的时间很短，这样就会频繁的创建和销毁线程，如此一来会大大降低系统的效率。可能出现服务器在为每个请求创建新线程和销毁线程上花费的时间和消耗的系统资源要比处理实际的用户请求的时间和资源更多。**

那么有没有一种办法使执行完一个任务，并不被销毁，而是可以继续执行其他的任务呢？

这就是线程池的目的了。线程池为线程生命周期的开销和资源不足问题提供了解决方案。通过对多个任务重用线程，线程创建的开销被分摊到了多个任务上。

**什么时候使用线程池？**

- 单个任务处理时间比较短
- 需要处理的任务数量很大

**使用线程池的好处**

引用自 [ifeve.com/java-thread…](https://link.juejin.im/?target=http%3A%2F%2Fifeve.com%2Fjava-threadpool%2F) 的说明：

- 降低资源消耗。通过重复利用已创建的线程降低线程创建和销毁造成的消耗。
- 提高响应速度。当任务到达时，任务可以不需要的等到线程创建就能立即执行。
- 提高线程的可管理性。线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控。

例如：记创建线程消耗时间 T1，执行任务消耗时间 T2，销毁线程消耗时间 T3

> 如果 T1 + T3 > T2，那么是不是说开启一个线程来执行这个任务太不划算了！ 正好，线程池缓存线程，可用已有的闲置线程来执行新任务，避免了 T1 + T3 带来的系统开销。

### 线程池种类

再说线程池种类之前，先说一下初始化线程池的几个参数，如果这个参数弄明白了，对于线程池你就基本上就可以了解了。

先来看一下线程池的几个构造函数。

```java
 //五个参数的构造函数

    public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue)
//六个参数的构造函数 -1

    public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory)

//六个参数的构造函数 -2

    public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          RejectedExecutionHandler handler)
//七个参数的构造函数

    public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)

int corePoolSize => 该线程池中核心线程数最大值
```

#### 1. 核心线程

> 线程池新建线程的时候，如果当前线程总数小于 corePoolSize，则新建的是核心线程，如果超过 corePoolSize，则新建的是非核心线程
>
> 核心线程默认情况下会一直存活在线程池中，即使这个核心线程啥也不干 (闲置状态)。
>
> 如果指定 ThreadPoolExecutor 的 allowCoreThreadTimeOut 这个属性为 true，那么核心线程如果不干活(闲置状态)的话，超过一定时间(时长下面参数决定)，就会被销毁掉
>
> 很好理解吧，正常情况下你不干活我也养你，因为我总有用到你的时候，但有时候特殊情况 (比如我自己都养不起了)，那你不干活我就要把你干掉了

#### 2. 线程总数

int maximumPoolSize=> 该线程池中线程总数最大值线程总数 = 核心线程数 + 非核心线程数。

核心线程在上面解释过了，这里说下非核心线程：不是核心线程的线程(别激动，把刀放下...)，其实在上面解释过了。

#### 3. 超时时间

long keepAliveTime => 该线程池中非核心线程闲置超时时长 一个非核心线程，如果不干活(闲置状态)的时长超过这个参数所设定的时长，就会被销毁掉。 如果设置 allowCoreThreadTimeOut = true，则会作用于核心线程

#### 4. 时间单位

TimeUnit unit keepAliveTime 的单位，TimeUnit 是一个 枚举类型，其包括：

> NANOSECONDS ： 1微毫秒 = 1微秒 / 1000
> MILLISECONDS ： 1毫秒 = 1秒 /1000
> SECONDS ： 秒
> MINUTES ： 分
> HOURS ： 小时
> DAYS ： 天

#### 5. 队列

BlockingQueue<Runnable> workQueue 该线程池中的任务队列：维护着等待执行的 Runnable 对象

> 当所有的核心线程都在干活时，新添加的任务会被添加到这个队列中等待处理，如果队列满了，则新建非核心线程执行任务

#### 6. 常用的 workQueue 类型

- SynchronousQueue：这个队列接收到任务的时候，会直接提交给线程处理，而不保留它，如果所有线程都在工作怎么办？那就新建一个线程来处理这个任务！所以为了保证不出现<线程数达到了maximumPoolSize而不能新建线程>的错误，使用这个类型队列的时候，maximumPoolSize 一般指定成 Integer.MAX_VALUE，即无限大
- LinkedBlockingQueue：这个队列接收到任务的时候，如果当前线程数小于核心线程数，则新建线程(核心线程)处理任务；如果当前线程数等于核心线程数，则进入队列等待。由于这个队列没有最大值限制，即所有超过核心线程数的任务都将被添加到队列中，这也就导致了 maximumPoolSize 的设定失效，因为总线程数永远不会超过 corePoolSize
- ArrayBlockingQueue：可以限定队列的长度，接收到任务的时候，如果没有达到 corePoolSize 的值，则新建线程(核心线程)执行任务，如果达到了，则入队等候，如果队列已满，则新建线程 (非核心线程) 执行任务，又如果总线程数到了 maximumPoolSize，并且队列也满了，则发生错误
- DelayQueue：队列内元素必须实现 Delayed 接口，这就意味着你传进去的任务必须先实现 Delayed 接口。这个队列接收到任务时，首先先入队，只有达到了指定的延时时间，才会执行任务

#### 7. ThreadFactory

创建线程的方式，这是一个接口，你 new 他的时候需要实现他的Thread newThread(Runnable r)方法，一般用不上。

小伙伴应该知道 AsyncTask 是对线程池的封装吧？那就直接放一个 AsyncTask 新建线程池的 threadFactory 参数源码吧：

```java
    new ThreadFactory() {
        private final AtomicInteger mCount = new AtomicInteger(1);

        public Thread new Thread(Runnable r) {
               return new Thread(r,"AsyncTask#"+mCount.getAndIncrement());
        }
    }
```

> 这么简单？就给线程起了个名!

#### 8. RejectedExecutionHandler

这玩意儿就是抛出异常专用的，比如上面提到的两个错误发生了，就会由这个handler抛出异常，你不指定他也有个默认的

> ThreadPoolExecutor.AbortPolicy:丢弃任务并抛出RejectedExecutionException异常 ThreadPoolExecutor.DiscardPolicy：也是丢弃任务，但是不抛出异常 ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列最前面的任务，然后重新尝试执行任务（重复此过程）。 ThreadPoolExecutor.CallerRunsPolicy：由调用线程处理该任务

#### 9. ThreadPoolExecutor 的策略

上面介绍参数的时候其实已经说到了 ThreadPoolExecutor 执行的策略，这里给总结一下，当一个任务被添加进线程池时：

> 1.线程数量未达到corePoolSize，则新建一个线程(核心线程)执行任务 2.线程数量达到了 corePools，则将任务移入队列等待 3.队列已满，新建线程(非核心线程)执行任务 4.队列已满，总线程数又达到了 maximumPoolSize，就会由上面那位星期天 (RejectedExecutionHandler) 抛出异常

### 常见四种线程池

如果你不想自己写一个线程池，那么你可以从下面看看有没有符合你要求的 (一般都够用了)，如果有，那么很好你直接用就行了，如果没有，那你就老老实实自己去写一个吧。

Java 通过 Executors 提供了四种线程池，这四种线程池都是直接或间接配置 ThreadPoolExecutor 的参数实现的，下面我都会贴出这四种线程池构造函数的源码，各位大佬们一看便知！

#### CachedThreadPool

优势：

> 1.线程数无限制
> 2.有空闲线程则复用空闲线程，若无空闲线程则新建线程
> 3.一定程序减少频繁创建/销毁线程，减少系统开销

创建方法：

```java
    ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());

    }
```

#### FixedThreadPool

优势：

> 1.可控制线程最大并发数（同时执行的线程数）
> 2.超出的线程会在队列中等待

```java
    创建方法：
    //nThreads => 最大线程数即maximumPoolSize
    ExecutorService fixedThreadPool = Executors.newFixedThreadPool(int nThreads);
    //threadFactory => 创建线程的方法，这就是我叫你别理他的那个星期六！你还看！
    ExecutorService fixedThreadPool = Executors.newFixedThreadPool(int nThreads, ThreadFactory threadFactory);
    源码：
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
    }
```

2个参数的构造方法源码，不用我贴你也知道他把星期六放在了哪个位置！所以我就不贴了，省下篇幅给我扯皮

#### ScheduledThreadPool

支持定时及周期性任务执行。

```java
    //创建方法：
    //nThreads => 最大线程数即maximumPoolSize
    ExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(int corePoolSize);
    //源码：
    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }
    //ScheduledThreadPoolExecutor():public ScheduledThreadPoolExecutor(int corePoolSize) {
        super(corePoolSize, Integer.MAX_VALUE,
              DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
              new DelayedWorkQueue());
    }
```

#### SingleThreadExecutor

优势：

> 1.有且仅有一个工作线程执行任务
> 2.所有任务按照指定顺序执行，即遵循队列的入队出队规则

```java
    //创建方法：
    ExecutorService singleThreadPool = Executors.newSingleThreadPool();
    //源码：
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
   // 还有一个Executors.newSingleThreadScheduledExecutor()结合了 3 和 4，就不介绍了，基本不用
```

### 准确的指定参数大小

#### 系统负载

参数的设置跟系统的负载有直接的关系，下面为系统负载的相关参数：

- tasks：每秒需要处理的最大任务数量
- tasktime：处理第个任务所需要的时间
- responsetime：系统允许任务最大的响应时间，比如每个任务的响应时间不得超过2秒。

#### 参数设置

##### **corePoolSize:**

每个任务需要 tasktime 秒处理，则每个线程每钞可处理 1 / tasktime 个任务。

系统每秒有 tasks 个任务需要处理，则需要的线程数为：tasks / ( 1 / tasktime )，即 tasks * tasktime 个线程数。

假设系统每秒任务数为 100 ~ 1000，每个任务耗时 0.1 秒，则需要 100 * 0.1 至 1000 * 0.1，即 10 ~ 100 个线程。

那么 corePoolSize 应该设置为大于 10，具体数字最好根据 8020 原则，即 80 % 情况下系统每秒任务数，若系统80%的情况下第秒任务数小于 200，最多时为 1000，则 corePoolSize 可设置为 20。

##### **queueCapacity:**

任务队列的长度要根据核心线程数，以及系统对任务响应时间的要求有关。 队列长度可以设置为 ( corePoolSize / tasktime ) * responsetime ： ( 20 / 0.1 ) * 2 = 400，即队列长度可设置为 400。

队列长度设置过大，会导致任务响应时间过长，切忌以下写法：

```java
 LinkedBlockingQueue queue = new LinkedBlockingQueue();
```

这实际上是将队列长度设置为Integer.MAX_VALUE，将会导致线程数量永远为corePoolSize，再也不会增加，当任务数量陡增时，任务响应时间也将随之陡增。

##### **maxPoolSize:**

当系统负载达到最大值时，核心线程数已无法按时处理完所有任务，这时就需要增加线程。

每秒 200 个任务需要 20 个线程，那么当每秒达到 1000 个任务时，则需要 ( 1000 - queueCapacity ) * ( 20 / 200 )，即 60 个线程，可将 maxPoolSize 设置为 60。

##### **keepAliveTime:**

线程数量只增加不减少也不行。当负载降低时，可减少线程数量，如果一个线程空闲时间达到 keepAliveTiime，该线程就退出。 默认情况下线程池最少会保持 corePoolSize 个线程。

##### **allowCoreThreadTimeout:**

默认情况下核心线程不会退出，可通过将该参数设置为 true，让核心线程也退出。

#### 须知：

以上关于线程数量的计算并没有考虑 CPU 的情况。

若结合 CPU 的情况，比如，当线程数量达到 50 时，CPU 达到 100%，则将 maxPoolSize 设置为 60 也不合适，此时若系统负载长时间维持在每秒 1000个 任务，则超出线程池处理能力，应设法降低每个任务的处理时间 ( tasktime )。

在创建了线程池后，默认情况下，线程池中并没有任何线程，而是等待有任务到来才创建线程去执行任务，（除非调用了 prestartAllCoreThreads () 或者 prestartCoreThread () 方法，从这 2 个方法的名字就可以看出，是预创建线程的意思，即在没有任务到来之前就创建 corePoolSize 个线程或者一个线程）。

### 线程池监控

在线程池中，线程池的监控也是很重要的一个点。

我们经常会注意的点有当前的排队线程池数，当前的活动线程数，执行完成线程数，总线程数。

```java
private static ExecutorService executor = new ThreadPoolExecutor(50, 100, 0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<Runnable>(100000));

public static void main(String[] args) throws Exception {
    for (int i = 0; i < 100000; i++) {
        executor.execute(() -> {
            System.out.print(1);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
    }

    ThreadPoolExecutor tpe = ((ThreadPoolExecutor) executor);

    while (true) {
        System.out.println();

        int queueSize = tpe.getQueue().size();
        System.out.println("当前排队线程数：" + queueSize);

        int activeCount = tpe.getActiveCount();
        System.out.println("当前活动线程数：" + activeCount);

        long completedTaskCount = tpe.getCompletedTaskCount();
        System.out.println("执行完成线程数：" + completedTaskCount);

        long taskCount = tpe.getTaskCount();
        System.out.println("总线程数：" + taskCount);

        Thread.sleep(3000);
    }

}
```

### 深入源码分析Java线程池的实现原理

Jdk提供给外部的接口也很简单。直接调用ThreadPoolExecutor构造一个就可以了，也可以通过Executors静态工厂构建，但一般不建议。

可以看到，开发者想要在代码中使用线程池还是比较简单的，这得益于Java给我们封装好的一系列API。但是，这些API的背后是什么呢，让我们来揭开这个迷雾，看清线程池的本质。

**线程池构造函数**

通常，一般构造函数会反映出这个工具或这个对象的数据存储结构。

[![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556117515/Blog/JDK/ThreadPool/ThreadPoolExecutor.jpg)

**构造函数**

如果把线程池比作一个公司。公司会有正式员工处理正常业务，如果工作量大的话，会雇佣外包人员来工作。

闲时就可以释放外包人员以减少公司管理开销。一个公司因为成本关系，雇佣的人员始终是有最大数。

如果这时候还有任务处理不过来，就走需求池排任务。

- acc : 获取调用上下文
- corePoolSize: 核心线程数量，可以类比正式员工数量，常驻线程数量。
- maximumPoolSize: 最大的线程数量，公司最多雇佣员工数量。常驻+临时线程数量。
- workQueue：多余任务等待队列，再多的人都处理不过来了，需要等着，在这个地方等。
- keepAliveTime：非核心线程空闲时间，就是外包人员等了多久，如果还没有活干，解雇了。
- threadFactory: 创建线程的工厂，在这个地方可以统一处理创建的线程的属性。每个公司对员工的要求不一样，恩，在这里设置员工的属性。
- handler：线程池拒绝策略，什么意思呢?就是当任务实在是太多，人也不够，需求池也排满了，还有任务咋办?默认是不处理，抛出异常告诉任务提交者，我这忙不过来了。

**添加一个任务**

接着，我们看一下线程池中比较重要的execute方法，该方法用于向线程池中添加一个任务。

[![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556117694/Blog/JDK/ThreadPool/execute.jpg)

源码

核心模块用红框标记了。

- 第一个红框：workerCountOf方法根据ctl的低29位，得到线程池的当前线程数，如果线程数小于corePoolSize，则执行addWorker方法创建新的线程执行任务;
- 第二个红框：判断线程池是否在运行，如果在，任务队列是否允许插入，插入成功再次验证线程池是否运行，如果不在运行，移除插入的任务，然后抛出拒绝策略。如果在运行，没有线程了，就启用一个线程。
- 第三个红框：如果添加非核心线程失败，就直接拒绝了。

这里逻辑稍微有点复杂，画了个流程图仅供参考

[![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556117776/Blog/JDK/ThreadPool/%E7%BA%BF%E7%A8%8B%E6%B1%A0%E7%9A%84%E6%B5%81%E7%A8%8B%E5%9B%BE.jpg)

接下来，我们看看如何添加一个工作线程的?

**添加worker线程**

从方法execute的实现可以看出：addWorker主要负责创建新的线程并执行任务，代码如下(这里代码有点长，没关系，也是分块的，总共有5个关键的代码块)：

[![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556117873/Blog/JDK/ThreadPool/add-worker1.jpg)

- 第一个红框：做是否能够添加工作线程条件过滤：

判断线程池的状态，如果线程池的状态值大于或等SHUTDOWN，则不处理提交的任务，直接返回;

- 第二个红框：做自旋，更新创建线程数量：

通过参数core判断当前需要创建的线程是否为核心线程，如果core为true，且当前线程数小于corePoolSize，则跳出循环，开始创建新的线程

有人或许会疑问 retry 是什么?这个是java中的goto语法。只能运用在break和continue后面。

接着看后面的代码：

[![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556117930/Blog/JDK/ThreadPool/adder-work2.jpg)

- 第一个红框：获取线程池主锁。

线程池的工作线程通过Woker类实现，通过ReentrantLock锁保证线程安全。

- 第二个红框：添加线程到workers中(线程池中)。
- 第三个红框：启动新建的线程。

接下来，我们看看workers是什么。

[![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556117979/Blog/JDK/ThreadPool/works.jpg)

一个hashSet。所以，线程池底层的存储结构其实就是一个HashSet。

**worker线程处理队列任务**

[![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556118033/Blog/JDK/ThreadPool/works%E7%BA%BF%E7%A8%8B%E5%A4%84%E7%90%86%E4%BB%BB%E5%8A%A1.jpg)

- 第一个红框：是否是第一次执行任务，或者从队列中可以获取到任务。
- 第二个红框：获取到任务后，执行任务开始前操作钩子。
- 第三个红框：执行任务。
- 第四个红框：执行任务后钩子。

这两个钩子(beforeExecute，afterExecute)允许我们自己继承线程池，做任务执行前后处理。

到这里，源代码分析到此为止。接下来做一下简单的总结。

**总结**

所谓线程池本质是一个hashSet。多余的任务会放在阻塞队列中。

只有当阻塞队列满了后，才会触发非核心线程的创建。所以非核心线程只是临时过来打杂的。直到空闲了，然后自己关闭了。

线程池提供了两个钩子(beforeExecute，afterExecute)给我们，我们继承线程池，在执行任务前后做一些事情。

线程池原理关键技术：锁(lock,cas)、阻塞队列、hashSet(资源池)

[![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556118198/Blog/JDK/ThreadPool/%E7%BA%BF%E7%A8%8B%E6%B1%A0%E6%80%BB%E7%BB%93.jpg)

线程池的底层数据结构采用HashSet来实现

<hr />
