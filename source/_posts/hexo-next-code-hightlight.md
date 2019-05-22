---
title: Hexo下的代码高亮及其扩展修改
tags: [Hexo]
date: 2019-04-26 14:51:20
permalink: hexo-next-code-hightlight
categories: Hexo
description: hexo代码显示深度定制化
image: https://res.cloudinary.com/dvu6persj/image/upload/v1556261764/Blog/hexo/highhight.jpg
---
<p class="description"></p>

​	<img src="https://" alt="" style="width:100%" />

<!-- more -->

本文主要记录一下，修改Hexo下语法高亮的各种用法，修改后的语法可以快速设置多种样式，主要功能如：

- [设置语法语言](#shezhiyufayuyan)

- [设置标题](https://qiuzhilin.cn/Hexo/2019/04/26/hexo-next-code-hightlight/index.html#设置标题)

- [是否显示行号](#jump)

- [设置起始行号](https://qiuzhilin.cn/Hexo/2019/04/26/hexo-next-code-hightlight/index.html#设置起始行号)

- [选定行号标记](https://qiuzhilin.cn/Hexo/2019/04/26/hexo-next-code-hightlight/index.html#选定行号标记)

- [设置代码添加删除标记](https://qiuzhilin.cn/Hexo/2019/04/26/hexo-next-code-hightlight/index.html#设置代码添加删除标记) （新增）

- [设置跳转超级链接](https://qiuzhilin.cn/Hexo/2019/04/26/hexo-next-code-hightlight/index.html#设置跳转超级链接)

## 格式总览

主要功能如上，都是自带功能，更重要的是只是想在后直接实现设置，不想使用`{ % ... % }`去实现这些功能。

- 格式

  ```
  ​```[language] [:title] [lang:language] [line_number:(true|false)] [first_line:number] [mark:#,#-#] [diff:true|false] [url:http...]
  code snippet
  ​```
  ```

- 自定义

  ```
  ​```:sam
  code snippet
  ​```
  ```

- 效果

  ``` sam
  code snippet
  ```

## 使用方法

### <span id= "shezhiyufayuyan"> 设置语法语言</span>

- 格式

  ```
  ​``` language             //注意 语言类型 需要写在其他定义之前
  code snippet
  ​```
  ```

- 样例

  ```
  ​```java
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
      }
  }
  ​```
  ```

- 效果

  ```
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
      }
  }
  ```

### 设置标题

- 格式

  ```
  ​``` [:words|:path|:url|:ftp|:ip/path]             //以英文冒号开头即可
  code snippet 
  ​```
  ```

- 样例

  ```
  ​``` :file:///D:/qiuzhilin xia/HelloWorldClass.java   //如果没有定义语言，词后缀可辅助
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
      }
  }
  ​```
  ```

- 效果

  ```
  file:///D:/qiuzhilin xia/HelloWorldClass.java
  
  
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
      }
  }
  ```

### <span id = "jump">是否显示行号</span>

- 格式

  ```
  ​``` [line_number:(true|false)]             //默认true
  code snippet
  ​```
  ```

- 样例

  ```
  ​```java line_number:false   
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
      }
  }
  ​```
  ```

- 效果

  ```
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
      }
  }
  ```

### 设置起始行号

- 格式

  ```
  ​``` [first_line:number]             //默认
  code snippet
  ​```
  ```

- 样例

  ```
  ​```java first_line:22   
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
      }
  }
  ​```
  ```

- 效果

  ```java
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
      }
  }
  ```

### 选定行号标记

- 格式

  ```
  ​``` [mark:#,#-#]             //#行号，#-#行号范围
  code snippet
  ​```
  ```

- 样例

  ```
  ​```java mark:2,4,8,10-14,18   
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
      }
  }
  ​```
  ```

- 效果

  ```java
  public Class HelloWorldClass(){
      public static void main(String[] args){
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
          System.Out.printl("Hello World");
      }
  }
  ```

### 设置代码添加删除标记

- 格式

  ```
  ​``` [diff:true|false]   
  code snippet
  ​```
  ```

- 样例

  ```
  ​```js diff:true   
  'use struct';
  
  -var name = 'zhu'
  +var name = 'qiuzhilinxia';
  
  function sayHello(){
  -    alert(name);
  +    console.log(name);
  }
  ​```
  ```

- 效果

  ```
  'use struct';
  
  var name = 'zhu'
  var name = 'qiuzhilinxia';
  
  function sayHello(){
      alert(name);
      console.log(name);
  }
  ```

还有更惊喜的功能，你点击左上角 `复制` 按钮，粘贴出去试试看！只会复制出最新代码哦。

### 设置跳转超级链接

- 格式

  ```
  ​``` [url:http... download|下载]  //url:http 开头，无download则跳转链接，有则下载内容
  code snippet
  ​```
  ```

- 样例

  ```
  ​``` :需要标题 url:http://qiuzhilinyule.com/images/avatar.png download
  这里会下载我的头像！
  ​```
  ```

- 效果

  ```
  需要标题 download
  
  
  这里会下载我的头像！
  ```

## 修改代码

如果需要实现以上功能，需要更改 `./node_modules/`目录下插件：

```
 node_module 
|--hexo
|  |--lib
|     |--plugins
|        |--filter
|           |--before_post_render
|              |--backtick_code_block.js 
|
|--hexo-util
|  |--lib
|     |--highlight.js 
```

覆盖以上文件即可，详细不在这里描述了。

在添加样式文件即可：

```
 themes 
|--next
|  |--source
|     |--css
|        |--_custom
|           |--highlight.styl 
|           |--custom.styl      //感谢 @maoshengyang 提醒，还需要添加文件引用：@import highlight;     
```



`custom.styl`中添加样式文件引用：

```
custom.styl


@import highlight;
```



`theme.styl`中直接添加颜色，可以自己调整颜色（放在这里好控制管理皮肤）：

```
.\themes\next\source\css\_common\components\highlight\theme.styl


$highlight-diffdeletion = #c7ffd7
$highlight-diffaddition = #ffd3d8
```



也可以这样，这是我的 自己使用的皮肤配色：

```
.\themes\next\source\css\_common\components\highlight\theme.styl


if $highlight_theme == "custom light"
  $highlight-figcaptionBK   = #eee
  $highlight-figcaptionFont = #777
  $highlight-background   = #f8f8f8
  $highlight-emphasisBK   = #ffffff
  $highlight-emphasisFont = #111
  $highlight-current-line = #efefef
  $highlight-selection    = #d6d6d6
  $highlight-foreground   = #4d4d4c
  $highlight-comment      = #6eb55e
  $highlight-red          = #c82829
  $highlight-orange       = #f5871f
  $highlight-yellow       = #eab700
  $highlight-green        = #718c00
  $highlight-aqua         = #3e999f
  $highlight-blue         = #4271ae
  $highlight-purple       = #1212a0
  $highlight-diffdeletion = #c7ffd7
  $highlight-diffaddition = #ffd3d8
  $highlight-gutter       = {
    color: #5c5c5c,
    bg-color: #e7e5dc,
    right-border-color: #aed581
  }
```

<hr />
