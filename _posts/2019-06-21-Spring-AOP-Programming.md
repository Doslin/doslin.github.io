---
layout: post
title: 'Spring AOP 的编程思想和高效使用'
description: "Spring AOP 的编程思想和高效使用"
author: qiuzhilin
tags: 
  - Spring
last_modified_at: 2019-06-210T18:46:18-05:00

---

实际开发过程中，我们在日志记录，性能统计，安全控制，事务处理，异常处理等等模块里面大量会见到 Spring AOP 的身影，如果要解释 Spring AOP 怎么能够做到这些功能呢，我这边建议回到我们上一次对于代理模式的讨论，毕竟 Spring AOP 的实现方式就是使用的就是动态代理。

而我今天主要想和大家一起讨论的是**面向切面编程（Aspect Oriented Programming）** 的编程思想，如果我们想理解 Spring AOP 就必须先了解面向切面编程这种编程思想。

### 什么是面向切面编程？

假如此时我们有一条电脑生产线（这里我们就简化思想认为电脑有 CPU、内存、硬盘、主板、机箱 5 大组件），我们只需要依据客户的需求对应的生产并组装 CPU、内存、硬盘、主板、机箱就可以生产电脑了。

![enter image description here](https://images.gitbook.cn/f1ec2e90-b734-11e8-9826-f7de489f9882)

此时我们对应定义电脑 5 大组件为（@Data 是 lombok 插件，有了它可以省略 getter/setter 方法）：

![enter image description here](https://images.gitbook.cn/a3cfadd0-b730-11e8-9826-f7de489f9882)

假设此时每次客户来购买电脑时，我们会给客户一张电脑组装清单，我们的电脑生产线会依据客户的电脑组装清单来生产电脑。

```java
@Data
//电脑组装清单
public class ComputerParams {

    public ComputerParams(){}

    public ComputerParams(int cpuCore,int memorySize,int hardDiskSize,String mainBoardBrand,String chassisBrand){
        this.cpuCore = cpuCore;
        this.memorySize = memorySize;
        this.hardDiskSize = hardDiskSize;
        this.mainBoardBrand = mainBoardBrand;
        this.chassisBrand = chassisBrand;
    }

    //机箱品牌
    private String chassisBrand;

    //CPU核心数
    private int cpuCore;

    //硬盘大小
    private int hardDiskSize;

    //主板品牌
    private String mainBoardBrand;

    //内存大小
    private int memorySize;

    //Builder模式模拟客户填写组装清单
    public static class ComputerParamsBuilder{
        private final ComputerParams params;

        public ComputerParamsBuilder(){
            //为客户提供默认选择
            params = new ComputerParams(4,16,1000,"default","default");
        }

        public ComputerParamsBuilder setChassisBrand(String chassisBrand){
            this.params.setChassisBrand(chassisBrand);
            return this;
        }

        public ComputerParamsBuilder setCpuCore(int cpuCore){
            this.params.setCpuCore(cpuCore);
            return this;
        }

        public ComputerParamsBuilder setHardDiskSize(int hardDiskSize){
            this.params.setHardDiskSize(hardDiskSize);
            return this;
        }

        public ComputerParamsBuilder setMainBoardBrand(String mainBoardBrand){
            this.params.setMainBoardBrand(mainBoardBrand);
            return this;
        }

        public ComputerParamsBuilder setMemorySize(int memorySize){
            this.params.setMemorySize(memorySize);
            return this;
        }

        public ComputerParams build(){
            return params;
        }
    }

}
```

然后我们的电脑生产线依据客户的组装清单来生产电脑。

```Java
@Data
public class Computer {

    //内存
    private Memory memory;

    private CPU cpu;

    //主板
    private MainBoard mainBoard;

    //硬盘
    private HardDisk hardDisk;

    //机箱
    private Chassis chassis;

    public Computer(Memory memory,CPU cpu,HardDisk hardDisk,MainBoard mainBoard,Chassis chassis){
        this.memory = memory;
        this.cpu = cpu;
        this.hardDisk = hardDisk;
        this.mainBoard = mainBoard;
        this.chassis = chassis;
    }

    @Data
    //Builder模式模拟电脑生产线
    public static class Builder{

        private final ComputerParams params;
        private final Computer computer;

        //工厂接收客户组装清单生产
        public Builder(ComputerParams params){
            System.out.println("接收电脑组装清单");
            if(params == null){
                this.params = new ComputerParams.ComputerParamsBuilder().build();
            }else{
                this.params = params;
            }
            this.computer = new Computer(null,null,null,null,null);
        }


        public Builder buildMemory(){
            System.out.println("建造了一个"+this.params.getMemorySize()+"G内存的Memory");
            this.computer.setMemory(new Memory(this.params.getMemorySize()));
            return this;
        }

        public Builder buildCpu(){
            System.out.println("建造了一个"+this.params.getCpuCore()+"核的CPU");
            this.computer.setCpu(new CPU(this.params.getCpuCore()));
            return this;
        }

        public Builder buildHardDisk(){
            System.out.println("建造了一个"+this.params.getHardDiskSize()+"G空间的硬盘");
            this.computer.setHardDisk(new HardDisk(this.params.getHardDiskSize()));
            return this;
        }

        public Builder buildMainBoard(){
            System.out.println("建造了一个"+this.params.getMainBoardBrand()+"品牌的主板");
            this.computer.setMainBoard(new MainBoard(this.params.getMainBoardBrand()));
            return this;
        }

        public Builder buildChassis(){
            System.out.println("建造了一个"+this.params.getChassisBrand()+"品牌的机箱");
            this.computer.setChassis(new Chassis(this.params.getChassisBrand()));
            return this;
        }

        public Computer build(){

            System.out.println("建造一台"+computer.getCpu().getCore()
                    +"核CPU "+computer.getMemory().getSize()
                    +"G内存 "+computer.getHardDisk().getSize()
                    +"G磁盘 "+computer.getMainBoard().getBrand()
                    +"品牌主板 "+computer.getChassis().getBrand()
                    +"品牌机箱 的电脑");
            return computer;
        }
    }

}
```

OK，此时按照我们的生产逻辑来看，我们的生产代码为：

```java
        //先让客户填写组装清单
        ComputerParams params = new ComputerParams.ComputerParamsBuilder()
                //请填写内存大小
                .setMemorySize(16)
                //请填写核心数
                .setCpuCore(8)
                //请填写硬盘大小
                .setHardDiskSize(2000)
                //请选择主板品牌
                .setMainBoardBrand("dell")
                //请选择机箱品牌
                .setChassisBrand("dell")
                .build();

        //电脑生产线依据客户的清单配置我们的电脑
        Computer computer = new Computer.Builder(params)
                .buildMemory()
                .buildCpu()
                .buildHardDisk()
                .buildMainBoard()
                .buildChassis()
                .build();
```

生产过程如下：

![enter image description here](https://images.gitbook.cn/d29deb60-b733-11e8-a68d-db44b34afaf4)

这时候呢，为了提升我们我们电脑生产线的知名度，我们要求在我们的产线生产完硬盘之后在硬盘里面内置我们我们自己的宣传视频（当然不能在电脑生产完之后再开机配置，毕竟开过机就是2手的了）。此时呢虽然我们的电脑生产线出厂的时候是固定的（相当于源代码闭源，不与许修改），但是呢，实际生活中，我们生产线在完成了硬盘生产之后，我们可以把我们的硬盘从我们的生产传送带上拿下来，等我们对硬盘做完处理之后再放回传送带，此时产线再继续完成生产。

产线逻辑图如下：

![enter image description here](https://images.gitbook.cn/12a3e570-b739-11e8-a68d-db44b34afaf4)

OK，这里我们先对比一下我们的 Computer.Builder 的建造顺序和我们的生产线。此时，我们可以发现我们的 Builder 的建造顺序和产线的生产顺序是一致的。其实也很好理解，我们最终的一系列 build 函数调用也是顺序执行的。我们生产线的生产过程就相当于我们的函数调用过程。

那么实际情况下，由于空间的存在我们可以把硬盘在我们的产线生产组装完成之后拿出来（我们可以空间想象一下，把从硬盘从传送带拿起来的空间感类比面向切面）处理完成之后再继续生产，那么在编码中我们可以不可以呢，实际上也是可以的，面向切面编程思想应运而生。

实际上不管是 C 这种面向过程的语言还是 Java 这种纯粹的面向对象的语言。我们的业务执行过程最终都是一系列的函数调用过程，我们可以像切入生产线一样在不破坏原一系列的函数调用过程中在任何一个函数执行我们想要的切入。听起来是不是很恐怖，但是也确实是这个样子，Spring AOP 也确实有这个能力，这也就是为什么我们可以用 Spring AOP 做到日志记录、性能统计、安全控制、事务处理、异常处理等等。

接下来还是一样，我们先抛开所有会影响我们理解的细节。我们先来看一下 Spring AOP 是怎么做到的。

下面是具体的实现方案，大家不用关心具体的实现细节，我们先看一下在不改动我们的生产线的情况下能不能达到我们的目标。

```java
    @AfterReturning(pointcut = "execution (* com.pubutech.example.patterns.factory..*.buildHardDisk(..))",returning = "result")
    public void afterBuildHardDisk(Object result){
        Computer.Builder builder = (Computer.Builder)result;
        System.out.println("把"+builder.getComputer().getHardDisk().getSize()+"G的硬盘预先放入我们自己的宣传视频");
    }
```

还是一样工厂的建造顺序没有任何改动：

```java
    @Bean
    public Computer.Builder computerBuilder(){
        return new Computer.Builder(new ComputerParams.ComputerParamsBuilder().setMemorySize(16)
                .setCpuCore(8)
                .setHardDiskSize(2000)
                .setMainBoardBrand("dell")
                .setChassisBrand("aoc").build());
    }
        computerBuilder.buildMemory()
                .buildCpu()
                .buildHardDisk()
                .buildMainBoard()
                .buildChassis()
                .build();
```

验证一下我们的预想：

![enter image description here](https://images.gitbook.cn/252b2b60-b746-11e8-bb53-294539be73f6)

OK，既然理解了这个思想，我们下一步所需要做的掌握 AOP 这一个恐怖的能力。

### Spring AOP 的概念

在开始使用 AOP 之前，让我们先来熟悉 AOP 的概念和术语（下面所有的内容仅针对 Spring AOP ，并不代表 AspectJ）。

- **Aspect（方面/切面）**：一个面向切面的模块，这个模块可以有多个切面。（字面意思，一个 AOP 的完整模块，它的出现就预示着 AOP，就好比你看见 Application 能想到一个应用）。
- **Advice（通知／增强）**：在切入点指定范围的连接点上执行的切面，其中包括了“around”、“before”和“after”等一系列的增强。（我觉得理解为在切入点所做的增强功能）。
- **Joinpoint（连接点）**：程序执行过程中能够插入切面的一个点。这个点可以是调用方法时，抛出异常时，甚至修改一个字段时。切面代码可以利用这些点插入到应用的正常流程中，并添加新的行为。（可以这样理解这些点是一个横向切面将要切入的位置，当然是程序执行过程中的点）。
- **Pointcut（切点）**：可以理解为 Advice 定义的是什么是切面，怎么增强。Joinpoint 就定义 Advice 的连接点。但是我们需要为 Joinpoint 指定一个范围，那么这个范围就是切点。（可以这样理解这三者的关系 切点有助于缩小切面所通知的连接点的范围。）
- **AOP Proxy（AOP代理）**：还记得切面的实现原理吗？动态代理。用于指定 JDK 动态代理或者 CGLIB 代理。
- **Target Object（目标对象）**：被一个或者多个切面所通知的对象。也被称做被通知（advised）对象。（通俗的理解就是被切入的对象）。

增强的概念（我们切入最终的目的是做什么）：

- Weaving（织入）：对方法进行增强。
  - **Before advice（前置通知）**：在某连接点之前执行的通知（目标方法执行之前的增强）。
  - **After returning advice（后置通知）**：在目标方案执行后增强，该增强可以接收到目标方法返回结果。
  - **After throwing advice（异常通知）**：在目标方法抛出对应的类型后执行，可以接收到对应的异常信息。
  - **After (finally) advice（最终通知）**：在某连接点正常完成后执行的通知（目标方法返回之后的增强）。
  - **Around Advice（环绕通知）**：监控包围整个切入点执行过程的增强。这是最强大的一种通知类型。（可以这样理解，上面 4 中增强在环绕里面都可以做到）。
- Introduction（引入）：对类进行增强
  - **DeclareParentsAdvice（引入增强）**：想让程序在运行的时候动态向现有类添加新的方法，想想是不是很激动呢。

#### 切入点指示符（PCD）（PointCut 的定义）

Spring AOP 支持在切入点表达式中使用如下的 AspectJ 切入点指示符：

- **execution** - 匹配方法执行的连接点，这是你将会用到的 Spring 的最主要的切入点指示符。
- **within** - 包匹配下方法执行的连接点，我们用它指定 package。
- **this** - 接口代理对象的方法执行的连结点，指定接口，高级用法后面说明普通类似 target。
- **target** - 接口实现对象的方法执行的连结点，指定接口。
- **args** - 拿到切入点参数的时候使用，看案例吧，很难解释啊。
- **@target** - 类级别的注解方法执行的连接点（同 within）。
- **@args** - 函数参数级别的注解 方法执行的连接点。
- **@within** - 类级别的注解方法执行的连接点。
- **@annotation** - 函数级别的注解方法执行的连接点。

另外，Spring AOP 还提供了一个名为 `bean` 的 PCD。这个 PCD 允许你限定匹配连接点到一个特定名称的 Spring bean，或者到一个特定名称 Spring bean 的集合（当使用通配符时）。`bean` PCD 具有下列的格式：

```
 bean(idOrNameOfBean)
```

`idOrNameOfBean` 标记可以是任何 Spring bean 的名字，也可以限定通配符'*'来匹配，如果你为 Spring bean 制定一些命名约定，你可以非常容易地编写一个 `bean` PCD 表达式将它们选出来。

**切入点指示符通配符**：

```
*：匹配所有字符
..：0个或者多个 一般用于匹配多个包，多个参数
+：表示类及其子类
```

**切入点指示符运算符**：

切入点表达式可以使用 `&`、`||` 和 `!` 来组合。

这里和大家强调一下，Spring AOP 限制了连接点必须是方法执行级别的，Spring AOP 是一个基于代理的系统，并且严格区分代理对象本身（对应于 `this`）和背后的目标对象（对应于 `target`）。还可以通过名字来指向切入点表达式。

Spring AOP 用户可能会经常使用 execution 切入点指示符。执行表达式的格式如下（`?` 代表可选）：

```
execution（modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern（param-pattern）
          throws-pattern?）
```

对应中文格式：

```
execution([可见性] 返回类型 [声明类型].方法名(参数) [异常])
```

其中 [] 中的为可选

OK，概念我们先抛出来，现在能不能全部理解并不是很重要，反正有个大概的印象即可，剩下的，我们看看案例，再理解透彻就好了，完全记住这些概念定义是完全没有必要的，理解了就好了，那天那部分忘记了，回来再当成 API 查查就好了。

首先我们知道，可以通过名字来指向切入点表达式（看个案例说话）。

```java
    /*
    在一个方法执行连接点代表了任意public方法的执行时匹配
     */
    @Pointcut("execution (public * * (..)) ")
    private void anyPublicOperation(){}
```

我们定义了一个 pointCut。`@Pointcut("execution (public * * (..)) ")`，我们给他配了一个名字 anyPublicOperation()，为什么要定义一个名字呢，因为我们可以使用可以使用`&`、`||` 和 `!` 来组合，有个名字是不是很方便。

剩下的我就不一个个解释了，大家看着注释慢慢理解，后面有需要用到的时候当成 API 再回来慢慢理解。

```java
    /*
    在任意public方法的执行时匹配
     */
    @Pointcut("execution (public * * (..)) ")
    private void anyPublicOperation(){}

    /*
    任何以do开头的函数
     */
    @Pointcut("execution (* do* (..)) ")
    private void anyDoOperation(){}

    /*
    Package下的任意连接点(方法)执行时匹配
    */
    @Pointcut("within (com.pubutech.example.aop.thinking.*)")
    private void inPackage(){}

    /*
    Package下或者子包下的任意连接点(方法)执行时匹配
     */
    @Pointcut("within (com.pubutech.example.aop.thinking..*)")
    private void inPackages(){}

    /*
    Package下或者子包下的任意public连接点(任意public方法)执行时匹配
     */
    @Pointcut("inPackages() && anyPublicOperation() ")
    private void inPackageAnyPublicOPeration(){}

    /*
    Package下或者子包下的任意public连接点(任意public方法)执行时匹配
    理论上 这里想告诉大家 within  target args 都没有我们都可以用execution 直接做到
    */
    @Pointcut("execution (public * com.pubutech.example.aop.thinking..*.*(..)) ")
    private void inPackageAnyPublicOPerationInexecution(){}


    /*
    Package下或者子包下的任意连接点(方法)执行时匹配
    */
    @Pointcut("execution(* com.pubutech.example.aop.thinking..*.*(..))")
    public void executioniInPackagesPointCut() {}

    /*
    Package下的任意连接点(方法)执行时匹配
    */
    @Pointcut("execution(* com.pubutech.example.aop.thinking.*.*(..))")
    public void executioniInPackagePointCut() {}

    /*
    实现接口的所有实体对象的所有方法执行
    */
    @Pointcut("target (com.pubutech.example.aop.interfacetest.IBussiness)")
    public void targetPointCut(){}

    /*
    接口的所有代理对象的所有方法执行，一般情况下和target一样，高深用法后面演示
    */
    @Pointcut("this (com.pubutech.example.aop.interfacetest.IBussiness)")
    public void thisPointCut(){}

    /*
    精确拿到方法执行传递的参数
    实际上  args参数我们可以用JAVA反射拿到，所以不用也是可以的，后面Around有案例
     */
    @Pointcut("execution(* com.pubutech.example.aop.interfacetest.BusinessImpl.doException(..)) && args(msg)")
    public void argsPointCut(Message msg){}

    /*
    类级别的注解 里面所有的函数执行时
    */
    @Pointcut("@within(org.springframework.stereotype.Component)")
    public void withinPointCut(){}

    /*
    函数传递的参数使用的注解对象
    RequestBody Controller里面的Mapping方法里面请求参数是JSON格式的注解，帮助大家理解函数参数注解
    @PostMapping(value = "/add")
    public ObjectResponse add(@RequestBody UserEntity user) {
     */
    @Pointcut("@args(org.springframework.web.bind.annotation.RequestBody)")
    public void aArgsPointCut(){}

    /*
    方法的注解所使用的
    Transactional   方法事务执行的注解，这边只是一个案例，帮助大家理解一下方法注解
    @Transactional(propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = {Exception.class})
    public void addRoleResources(Long roleId, String resourcesId) {
     */
    @Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")
    public void annotationPointcut() {
    }

    /*
    Spring 特有的bean操作
     */
    @Pointcut("bean(serviceImpl)")
    public void beanPointCut(){}
```

我认为有上面的那些案例，大家应该都可以做到自由定义切入点了。当然除了上面的基本案例，我们还可以`&'`、`||` 和 `!` 自由组合，上面也有一个案例了。这里我就不做过多演示了。

#### Weaving（织入）

下面我们再理解一下增强：

**Weaving（织入）**：对方法进行增强。

```java
@Before("inPackageAnyPublicOPerationInexecution()")
    public void before(JoinPoint point) {
        System.out.println("前置切入成功");
    }

    @AfterThrowing(pointcut = "argsPointCut(msg)",throwing = "ex")
    public void AfterThrowing(Message msg, Exception ex){
        System.out.println("这里演示抛出异常增强和拿到切入方法参数"+msg.getMessage());
        System.out.println(ex);
    }

    @AfterReturning(pointcut = "thisPointCut()",returning = "result")
    public void afterReturn(Object result){
        System.out.println("AfterReturning 拿到返回的结果增强"+result);
    }

    @After("beanPointCut()")
    public void after(JoinPoint point) {
        System.out.println("后置切入成功");
    }

    @Around("execution(* com.pubutech.example.aop.interfacetest.BusinessImpl.doException(..))")
    private Object around(ProceedingJoinPoint point){
        //执行业务之前，我们可以做到Before
        //doBefore

        //获取拦截方法类和方法
        String className = AspectUtil.getClassName(point);
        Method currentMethod = null;
        try {
            currentMethod = AspectUtil.getMethod(point);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }

        System.out.println("className = "+className+" currentMethod = "+currentMethod.getName());
        //?代表范型  编辑器原因，你懂的
        Map?String,Object? nameAndArgs = null;
        //获取参数名称和值 是的 参数也可以获取
        try {
            nameAndArgs = AspectUtil.getFieldsName(this.getClass(), point.getTarget().getClass().getName(), currentMethod.getName(),point.getArgs());
        } catch (Exception e) {
            e.printStackTrace();
        }


        Object result = null;
        //执行业务
        try {
            //拿到执行结果
            result = point.proceed();
        } catch (Throwable throwable) {
            //拿到异常,我们可以处理异常afterThrow
            throwable.printStackTrace();
        }

        //拿到结果之后我们可以做到AfterReturn
        //DoAfterReturn

//doFinalAfter 切入点执行完成之后做什么
        return result;
    }
```

注释可能已经表明了我想说什么了，这里就不再说那么多了，有一点再和这里说一下，希望大家可以理解 Around 基本上可以做到全部的增强的原理。

好的，到目前为止，我们工作中可能能用的上的 AOP 基本上就差不多了，大家不累的话呢，还有兴趣坚持的话，我们再继续看：

#### Introduction（引入）

**Introduction（引入）**：对类进行增强（可以执行没有的方法）

那么什么叫对类增强呢，文雅一点的说明就是让一个人拥有它没有的能力，例如让人能够飞，不文雅的说法呢，比如母猪能上树，听起来是不是很有吸引力，但是很可惜，编程可以，实际生活不可以。

OK，这理我们有一个舞蹈家会跳舞。

```
@Data
@EqualsAndHashCode(callSuper = false)
public class Human {

    private String name;

    private String gender;

    private int age;
}

public class Dancer extends Human {

    public void dance(){
        System.out.println("我可以跳舞哦");
    }

}
```

我们怎么让我们舞蹈家能够愉快的编写代码呢？

```
public interface ISkill {

    void coding();

}
```

记得前面说的吗，实现他不具有的能力，所以我们不可以让舞蹈家或者人类来实现这个接口。

但是又要赋予他这种能力怎么办呢？好为难啊。

此时 引入增强就可以起作用了。

```java
public class SkillImpl implements ISkill {
    @Override
    public void coding() {
        System.out.println("天啦，我居然会写代码了");
    }
}
    // “....Human”后面的 “+” 号，表示只要是Human及其子类都可以添加新的方法
    @DeclareParents(value = "com.pubutech.example.aop.interfacetest.Human+", defaultImpl = SkillImpl.class)
    public ISkill skill;
```

此时，我们的Dancer就可以愉快的编码了

```
        dancer.dance();
        ISkill skill = (ISkill)dancer;
        ((ISkill) dancer).coding();
```

有兴趣的话就赶紧试试吧。

OK，到这里，我觉得我应该都说的比较清楚了，如果不清楚的话，建议还是多和我们上一次的话代理模式结合起来一起理解。SpringAOP 的思想呢，本质上来说还是很简单的，但是把它融汇贯通轻松自由的用到我们的项目中还是需要多加理解的。我这里就不赘述了。