---
title: about_http
tags: [HTTP]
date: 2019-04-23 22:49:21
permalink: about-http
categories: NetWork
description: 是时侯知道HTTP全家桶了
image: https://res.cloudinary.com/dvu6persj/image/upload/v1556032888/Blog/http/HTTP-vs-HTTPS.png
---
<p class="description"></p>

<img src="https://" alt="" style="width:100%" />

<!-- more -->
#### 什么是 HTTP 协议

首先我们来看协议是什么？协议是指计算机通信网络中两台计算机之间进行通信所必须共同遵守有规则的文本格式。一但有了协议，就可以使很多公司分工起来，有些公司做 Server 端，如 Tomcat，而有些公司就可以做浏览器了。这样大家只要一套约定，彼此的通讯就会相互兼容。

接下来我们看什么是 HTTP？HTTP 是基于 TCP/IP 的应用层通信协议，它是客户端和服务器之间相互通信的标准。它规定了如何在互联网上请求和传输内容。通过应用层协议，我的意思是，它只是一个规范了主机（客户端和服务器）如何通信的抽象层，并且它本身依赖于 TCP/IP 来获取客户端和服务器之间的请求和响应。默认的 TCP 端口是80端口，当然，使用其他端口也是可以的。然而，HTTPS 使用的端口是443端口。

#### HTTP 协议的简单历史

![http åè®®åå²](https://res.cloudinary.com/dvu6persj/image/upload/v1556032058/Blog/http/http%E7%9A%84%E5%8F%91%E5%B1%95.png)

**第一阶段，1996年之前。**第一版的 HTTP 文档是1991年提出来的 HTTP/0.9，其主要特点有：（1）它仅有一个 GET 方法。（2）没有 header 数据块。（3）必须以HTML格式响应。

**第二阶段，HTTP/1.0 - 1996。**HTML 格式响应，HTTP/1.0 能够处理其他的响应格式，例如：图像、视频文件、纯文本或其他任何的内容类型（Content-Type 来区分）。它增加了更多的方法（即 POST 和 HEAD），请求/响应的格式也发生了改变，请求和响应中均加入了 HTTP 头信息，响应数据还增加了状态码标识，还介绍了字符集的支持、多部分发送、权限、缓存、内容编码等很多内容。HTTP/1.0 的主要缺点之一是，你不能在每个连接中发送多个请求。也就是说，每当客户端要向服务器端请求东西时，它都会打开一个新的 TCP 连接，并且在这个单独请求完成后，该连接就会被关闭。每一次连接里面都包含了著名的三次握手协议。于是有些 HTTP/1.0 的实现试图通过引入一个新的头信息 Connection: keep-alive，来解决这个问题。

**第三个阶段，HTTP/1.1 - 1999。**HTTP/1.0 发布之后，随着 HTTP 开始普及之后，它的缺点也开始展现。时隔三年，HTTP/1.1 便在1999年问世，它在之前的基础上做了很多的改进。主要内容包含：

- 新增的 HTTP 方法有 PUT、PATCH、HEAD、OPTIONS、DELETE。
- 主机名标识。在 HTTP/1.0 中，Host 头信息不是必须项，但 HTTP/1.1 中要求必须要有 Host 头信息。
- 持久性连接。正如前面所说，在 HTTP/1.0 中每个连接只有一个请求，且在这个请求完成后该连接就会被关闭，从而会导致严重的性能下降及延迟问题。HTTP/1.1 引入了对持久性连接的支持，例如：默认情况下连接不会被关闭，在多个连续的请求下它会保存连接的打开状态。想要关闭这些连接，需要将 Connection: close 加入到请求的头信息中。客户端通常会在最后一次请求中发送这个头信息用来安全的关闭连接。
- 管道机制。HTTP/1.1 也引入了对管道机制的支持，客户端可以向服务器发送多个请求，而无需等待来自同一连接上的服务器响应，并且当收到请求时服务器必须以相同的顺序来响应。但你可能会问客户端是怎么知道第一个响应下载完成和下一个响应内容开始的？要解决这个问题，必须要有 Content-Length 头信息，客户端可以用它来确定响应结束，然后开始等待下一个响应。

**第四个阶段，SPDY - 2009。**Google 走在前面，它开始试验一种可替换的协议来减少网页的延迟，使得网页加载更快、提升 Web 安全性。2009年，他们称这种协议为 SPDY。SPDY 的功能包含多路复用、压缩、优先级、安全等。2015年，谷歌不想存在两个相互竞争的标准，因此他们决定把它合并到 HTTP 中成为 HTTP/2，同时放弃 SPDY。

**第五个阶段，HTTP/2 - 2015。**HTTP/2 是专为低延迟传输的内容而设计。关键特征或与 HTTP / 1.1 旧版本的差异，如下。

- 二进制协议。HTTP/2 倾向于使用二进制协议来减少 HTTP/1.x 中的延迟。二进制协议更容易解析，而不具有像 HTTP/1.x 中那样对人的可读性。HTTP/2 中的数据块是帧和流。
  帧和流：

HTTP 消息是由一个或多个帧组成的。有一个叫做 HEADERS 的帧存放元数据，真正的数据是放在 DATA 帧中的，帧类型定义在the HTTP/2 specs（HTTP/2规范），如 HEADERS、DATA、`RST_STREAM`、SETTINGS、PRIORITY 等。每个 HTTP/2 请求和响应都被赋予一个唯一的流 ID 且放入了帧中。帧就是一块二进制数据。一系列帧的集合就称为流。每个帧都有一个流 id，用于标识它属于哪一个流，每一个帧都有相同的头。同时，除了流标识是唯一的，值得一提的是，客户端发起的任何请求都使用奇数和服务器的响应是偶数的流 id。除了 HEADERS 和 DATA， 另外一个值得说一说帧类型是 `RST_STREAM`，它是一个特殊的帧类型，用于中止流，如客户端发送这儿帧来告诉服务器我不再需要这个流了。在 HTTP/1.1 中只有一种方式来实现服务器停止发送响应给客户端，那就是关闭连接引起延迟增加，因为后续的请求就需要打开一个新的连接。 在 HTTP/2 中，客户端可以使用 RST_FRAME 来停止接收指定的流而不关闭连接且还可以在此连接中接收其它流。

- 多路复用。由于 HTTP/2 现在是一个二进制协议，且是使用帧和流来实现请求和响应，一旦 TCP 连接打开了，所有的流都通过这一连接来进行异步的发送而不需要打开额外的连接。反过来，服务器的响应也是异步的方式，如响应是无序的、客户端使用流 id 来标识属于流的包。这就解决了存在于 HTTP/1.x 中 head-of-line 阻塞问题，如客户端将不必耗时等待请求，而其他请求将被处理。如下图所示。

![http2.0 Multiplexing](https://res.cloudinary.com/dvu6persj/image/upload/v1556032112/Blog/http/http1%E5%92%8Chttp2%E7%9A%84%E7%AE%80%E5%8D%95%E6%AF%94%E8%BE%83.png)

- HPACK 头部压缩。它是一个单独的用于明确优化发送 Header RFC 的一部分。它的本质是，当我们同一个客户端不断的访问服务器时，在 header 中发送很多冗余的数据，有时 cookie 就增大 header，且消耗带宽和增加了延迟。为了解决这个问题， HTTP/2 引入了头部压缩。与请求和响应不同，header 不是使用 gzip 或 compress 等压缩格式，它有不同的机制，它使用了霍夫曼编码和在客户端和服务器维护的头部表来消除重复的 headers（如 User Agent)，在后续的请求中就只使用头部表中引用。它与 HTTP/1.1 中的一样，不过增加了伪 header，如 :method、:scheme、:host 和:path。
- 服务器推送。在服务器端，Server Push 是 HTTTP/2 的另外一个重要功能，我们知道，客户端是通过请求来获取资源的，它可以通过推送资源给客户端而不需客户端主动请求。例如，浏览器载入了一个页面，浏览器解析页面时发现了需要从服务器端载入的内容，接着它就发送一个请求来获取这些内容。Server Push允许服务器推送数据来减少客户端请求。它是如何实现的呢，服务器在一个新的流中发送一个特殊的帧 PUSH_PROMISE，来通知客户端：“嘿，我要把这个资源发给你!你就不要请求了。”
- 请求优先级。客户端可以在一个打开的流中在流的 HEADERS 帧中放入优先级信息。在任何时间，客户端都可以发送一个 PRIORITY 的帧来改变流的优先级。如果没有优先级信息，服务器就会异步的处理请求，比如无序处理。如果流被赋予了优先级，它就会基于这个优先级来处理，由服务器决定需要多少资源来处理该请求。
- 安全。大家对 HTTP/2 是否强制使用安全连接（通过 TLS）进行了充分的讨论。最后的决定是不强制使用。然而，大多数厂商表示，他们将只支持基于 TLS 的 HTTP/2。所以，尽管 HTTP/2 规范不需要加密，但它已经成为默认的强制执行的。在这种情况下，基于 TLS 实现的 HTTP/2 需要的 TLS 版本最低要求是1.2。 因此必须有最低限度的密钥长度、临时密钥等。

当然 HTTP 协议也在不断地进化过程中，在 HTTP1.1 基础上便有了 HTTP 2.0。

HTTP 1.1 在应用层以纯文本的形式进行通信。每次通信都要带完整的 HTTP 的头，而且不考虑 pipeline 模式的话，每次的过程总是像上面描述的那样一去一回。这样在实时性、并发性上都存在问题。

为了解决这些问题，HTTP 2.0 会对 HTTP 的头进行一定的压缩，将原来每次都要携带的大量 key value 在两端建立一个索引表，对相同的头只发送索引表中的索引。

另外，HTTP 2.0 协议将一个 TCP 的连接中，切分成多个流，每个流都有自己的 ID，而且流可以是客户端发往服务端，也可以是服务端发往客户端。它其实只是一个虚拟的通道。流是有优先级的。

HTTP 2.0 还将所有的传输信息分割为更小的消息和帧，并对它们采用二进制格式编码。常见的帧有Header 帧，用于传输 Header 内容，并且会开启一个新的流。再就是Data 帧，用来传输正文实体。多个 Data 帧属于同一个流。

通过这两种机制，HTTP 2.0 的客户端可以将多个请求分到不同的流中，然后将请求内容拆成帧，进行二进制传输。这些帧可以打散乱序发送， 然后根据每个帧首部的流标识符重新组装，并且可以根据优先级，决定优先处理哪个流的数据。

我们来举一个例子。

假设我们的一个页面要发送三个独立的请求，一个获取 css，一个获取 js，一个获取图片 jpg。如果使用 HTTP 1.1 就是串行的，但是如果使用 HTTP 2.0，就可以在一个连接里，客户端和服务端都可以同时发送多个请求或回应，而且不用按照顺序一对一对应。

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556032289/Blog/http/Image_3.jpg)

HTTP 2.0 其实是将三个请求变成三个流，将数据分成帧，乱序发送到一个 TCP 连接中。

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556032315/Blog/http/Image_4.jpg)

HTTP 2.0 成功解决了 HTTP 1.1 的队首阻塞问题，同时，也不需要通过 HTTP 1.x 的 pipeline 机制用多条 TCP 连接来实现并行请求与响应；减少了 TCP 连接数对服务器性能的影响，同时将页面的多个数据 css、js、 jpg 等通过一个数据链接进行传输，能够加快页面组件的传输速度。

#### HTTP 协议的具体内容

而我们平时老生常谈的 HTTP 的协议大都是指的是 HTTP 1.1 协议的内容，接下去我们一起看一下 HTTP 1.1 协议的结构。如下图所示。 ![enter image description here](https://res.cloudinary.com/dvu6persj/image/upload/v1556032396/Blog/http/http%E5%8D%8F%E8%AE%AE%E7%BB%93%E6%9E%84.png)

接下来，我将通过四部分大概介绍一下 HTTP 协议的基本内容。

**1.URL & URI**

![enter image description here](https://res.cloudinary.com/dvu6persj/image/upload/v1556032447/Blog/http/http_url.png)

```
schema://host[:port#]/path/.../[;url-params][?query-string][#anchor]
```

URL（Uniform Resource Locator）主要包括以下几部分。

- scheme：指定低层使用的协议，一般是 HTTP，如果强调安全的话可以是 HTTPS。
- host：HTTP 服务器的 IP 地址或者域名。
- port：HTTP 服务器的默认端口是80，这种情况下端口号可以省略。如果使用了别的端口，必须指明。
- path：访问资源的路径。
- url-params：URL 的参数。
- query-string：发送给 HTTP 服务器的数据。
- anchor：锚。

URI，在 Java 的 Servlet 中指的是 resource path 部分。

**2.请求方法 Method**

主要包括以下几种请求方法。

- GET：向指定的资源发出“显示”请求。使用 GET 方法应该只用在读取数据，而不应当被用于产生“副作用”的操作中，例如在 Web Application 中。其中一个原因是 GET 可能会被网络蜘蛛等随意访问。
- POST：向指定资源提交数据，请求服务器进行处理（例如提交表单或者上传文件）。数据被包含在请求本文中。这个请求可能会创建新的资源或修改现有资源，或二者皆有。
- PUT：向指定资源位置上传其最新内容。
- DELETE：请求服务器删除 Request-URI 所标识的资源。
- OPTIONS：这个方法可使服务器传回该资源所支持的所有 HTTP 请求方法。用“*”来代替资源名称，向 Web 服务器发送 OPTIONS 请求，可以测试服务器功能是否正常运作。
- HEAD：与 GET 方法一样，都是向服务器发出指定资源的请求。只不过服务器将不传回资源的本文部分。它的好处在于，使用这个方法可以在不必传输全部内容的情况下，就可以获取其中“关于该资源的信息”（元信息或称元数据）。
- TRACE：回显服务器收到的请求，主要用于测试或诊断。
- CONNECT：HTTP/1.1 协议中预留给能够将连接改为渠道方式的代理服务器。通常用于 SSL 加密服务器的链接（经由非加密的 HTTP 代理服务器）。

Method 名称是区分大小写的。当某个请求所针对的资源不支持对应的请求方法的时候，服务器应当返回状态码 405（Method Not Allowed），当服务器不认识或者不支持对应的请求方法的时候，应当返回状态码 501（Not Implemented）。

**3.HTTP 之状态码**

状态代码有三位数字组成，第一个数字定义了响应的类别，共分五种类别:

- 1xx：指示信息--表示请求已接收，继续处理。
- 2xx：成功--表示请求已被成功接收、理解、接受。
- 3xx：重定向--要完成请求必须进行更进一步的操作。
- 4xx：客户端错误--请求有语法错误或请求无法实现。
- 5xx：服务器端错误--服务器未能实现合法的请求。

常见状态码有：

```
200 OK                        //客户端请求成功
400 Bad Request               //客户端请求有语法错误，不能被服务器所理解
401 Unauthorized              //请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用 
403 Forbidden                 //服务器收到请求，但是拒绝提供服务
404 Not Found                 //请求资源不存在，eg：输入了错误的URL
500 Internal Server Error     //服务器发生不可预期的错误
503 Server Unavailable        //服务器当前不能处理客户端的请求，一段时间后可能恢复正常
```

**4.请求体&响应体**

请求体&响应体，这个没有特殊规定，需要配合不同的 Content-Type 来使用。

唯一需要注意的是 multipart/form-data、application/x-www-from-urlencoded、raw、binary 的区别。

（1）multipart/form-data

它将表单的数据组织成 Key-Value 形式，用分隔符 boundary（boundary 可任意设置）处理成一条消息。由于有 boundary 隔离，所以当即上传文件，又有参数的时候，必须要用这种 content-type 类型。如下图所示。

![enter image description here](https://res.cloudinary.com/dvu6persj/image/upload/v1556032481/Blog/http/http-form-data.png)

（2）x-www-form-urlencoded

即 application/x-www-from-urlencoded，将表单内的数据转换为 Key-Value。这种和 Get 方法把参数放在 URL 后面一样的想过，这种不能文件上传。

![enter image description here](https://res.cloudinary.com/dvu6persj/image/upload/v1556032587/Blog/http/http-form-data-2.png)

（3）raw

可以上传任意格式的“文本”，可以上传 Text、JSON、XML、HTML 等。

![enter image description here](https://res.cloudinary.com/dvu6persj/image/upload/v1556032651/Blog/http/http-form-data-raw.png)

（4）binary

即 Content-Type:application/octet-stream，只可以上传二进制数据流，通常用来上传文件。由于没有键值，所以一次只能上传一个文件。

（5）Header

![enter image description here](https://res.cloudinary.com/dvu6persj/image/upload/v1556032707/Blog/http/http-header.png)

HTTP 消息的 Headers 共分为三种，分别是 General Headers、Entity Headers、Request/Response Headers。

- General Headers

我把被 Request 和 Response 共享的 Headers 成为General Headers，具体有：

```
general-header = Cache-Control           
               | Connection       
               | Date             
               | Pragma           
               | Trailer          
               | Transfer-Encoding
               | Upgrade          
               | Via              
               | Warning
```

其中，Cache-Control 指定请求和响应遵循的缓存机制；Connection 允许客户端和服务器指定与请求/响应连接有关的选项；Date 提供日期和时间标志，说明报文是什么时间创建的；Pragma 头域用来包含实现特定的指令，最常用的是 Pragma:no-cache；Trailer，如果报文采用了分块传输编码(chunked transfer encoding) 方式，就可以用这个首部列出位于报文拖挂（trailer）部分的首部集合；Transfer-Encoding 告知接收端为了保证报文的可靠传输，对报文采用了什么编码方式；Upgrade 给出了发送端可能想要“升级”使用的新版本和协议；Via 显示了报文经过的中间节点（代理，网嘎un）。

- Entity Headers

Entity Headers 主要用来描述消息体（message body）的一些元信息，具体有：

```
entity-header  = Allow                   
               | Content-Encoding 
               | Content-Language 
               | Content-Length   
               | Content-Location 
               | Content-MD5      
               | Content-Range    
               | Content-Type     
               | Expires          
               | Last-Modified
```

其中，以 Content 为前缀的 Headers 主要描述了消息体的结构、大小、编码等信息，Expires 描述了 Entity 的过期时间，Last-Modified 描述了消息的最后修改时间。

- Request/Response Headers

Request-Line 是 Request 消息体的第一部分，其具体定义如下：

```
Request-Line = Method SP URI SP HTTP-Version CRLF
Method = "OPTIONS"
       | "HEAD"  
       | "GET"  
       | "POST"  
       | "PUT"  
       | "DELETE"  
       | "TRACE"
```

其中 SP 代表字段的分隔符，HTTP-Version 一般就是"http/1.1"，后面紧接着是一个换行。

在 Request-Line 后面紧跟着的就是 Headers。我们在上面已经介绍了 General Headers 和 Entity Headers，下面便是 Request Headers的定义。

```
request-header = Accept                   
               | Accept-Charset    
               | Accept-Encoding   
               | Accept-Language   
               | Authorization     
               | Expect            
               | From              
               | Host              
               | If-Match          
               | If-Modified-Since 
               | If-None-Match     
               | If-Range          
               | If-Unmodified-Since
               | Max-Forwards       
               | Proxy-Authorization
               | Range              
               | Referer            
               | TE                 
               | User-Agent
```

Request Headers 扮演的角色其实就是一个 Request 消息的调节器。需要注意的是若一个 Headers 名称不在上面列表中，则默认当做 Entity Headers 的字段。前缀为 Accept 的 Headers 定义了客户端可以接受的媒介类型、语言和字符集等。From、Host、Referer 和 User-Agent 详细定义了客户端如何初始化 Request。前缀为 If 的 Headers 规定了服务器只能返回符合这些描述的资源，若不符合，则会返回 304 Not Modified。

Request Body，若 Request-Line 中的 Method 为 GET，请求中不包含消息体，若为 POST，则会包含消息体。

一个具体的 Request 消息实例，如下。

```
GET /articles/http-basics HTTP/1.1
Host: www.articles.com
Connection: keep-alive
Cache-Control: no-cache
Pragma: no-cache
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```

- Response 消息体

Response 消息格式和 Request 类似，也分为三部分，即 Response-Line、Response Headers、Response Body。

Response-Line 具体定义如下：

```
Status-Line = HTTP-Version SP Status-Code SP Reason-Phrase CRLF
HTTP-Version字段值一般为HTTP/1.1
Status-Code前面已经讨论过了
Reason-Phrase 是对status code的具体描述
```

一个最常见的 Response 响应为:

```
HTTP/1.1 200 OK    
```

Response Headers的定义如下。

```
response-header = Accept-Ranges
                | Age
                | ETag              
                | Location          
                | Proxy-Authenticate
                | Retry-After       
                | Server            
                | Vary              
                | WWW-Authenticate
```

其中，Age 表示消息自 server 生成到现在的时长，单位是秒；ETag 是对 Entity 进行 MD5 hash 运算的值，用来检测更改；Location 是被重定向的 URL；Server 表示服务器标识。

#### 缓存机制 HTTP 缓存

**1.如何缓存**

降低网络上发送 HTTP 请求的次数，这里采用“过期”机制。

HTTP 服务器通过两种实体头（Entity-Header）来实现“过期”机制：Expires 头和 Cache-Control 头的 max-age 子项。

Expires/Cache-Control 控制浏览器是否直接从浏览器缓存取数据还是重新发请求到服务器取数据。只是 Cache-Control 比 Expires 可以控制的多一些，而且 Cache-Control 会重写 Expires 的规则。

降低网络上完整回复 HTTP 请求包的次数，这里采用“确证”机制。

HTTP服务器通过两种方式实现“确证”机制：ETag 以及 Last-Modified。

**2.相关的 Header**

主要包括以下几个。

- Cache-Control

常用的值有：

（1）max-age（单位为 s）指定设置缓存最大的有效时间，定义的是时间长短。当浏览器向服务器发送请求后，在 max-age 这段时间里浏览器就不会再向服务器发送请求了。 （2）s-maxage（单位为 s）同 max-age，只用于共享缓存（比如 CDN 缓存），也就是说 max-age 用于普通缓存，而 s-maxage 用于代理缓存。如果存在 s-maxage，则会覆盖掉 max-age 和 Expires header。 （3）public 指定响应会被缓存，并且在多用户间共享。如果没有指定 public 还是 private，则默认为 public。 （4）private 响应只作为私有的缓存，不能在用户间共享。如果要求 HTTP 认证，响应会自动设置为 private。 （5）no-cache 指定不缓存响应，表明资源不进行缓存，比如，设置了 no-cache 之后并不代表浏览器不缓存，而是在缓存前要向服务器确认资源是否被更改。因此有的时候只设置 no-cache 防止缓存还是不够保险，还可以加上 private 指令，将过期时间设为过去的时间。 （6）no-store 表示绝对禁止缓存。一看就知道，如果用了这个命令，当然就是不会进行缓存啦！每次请求资源都要从服务器重新获取。 （7）must-revalidate 指定如果页面是过期的，则去服务器进行获取。这个指令并不常用，就不做过多的讨论了。

- Expires

缓存过期时间，用来指定资源到期的时间，是服务器端的具体时间点。也就是说，Expires=max-age + 请求时间，需要和 Last-modified 结合使用。但在上面我们提到过 cache-control 的优先级更高。Expires 是 Web 服务器响应消息头字段，在响应 HTTP 请求时告诉浏览器在过期时间前浏览器可以直接从浏览器缓存取数据，而无需再次请求。

- Last-modified

服务器端文件的最后修改时间，需要和 cache-control 共同使用，是检查服务器端资源是否更新的一种方式。当浏览器再次进行请求时，会向服务器传送 If-Modified-Since 报头，询问 Last-Modified 时间点之后资源是否被修改过。如果没有修改，则返回码为304，使用缓存；如果修改过，则再次去服务器请求资源，返回码和首次请求相同为200，资源为服务器最新资源。

- Etag

根据实体内容生成一段 hash 字符串，标识资源的状态，由服务端产生。浏览器会将这串字符串传回服务器，验证资源是否已经修改。

为什么要使用 Etag 呢?Etag 主要为了解决 Last-Modified 无法解决的一些问题。

一些文件也许会周期性的更改，但是它的内容并不改变（仅仅改变的修改时间），这个时候我们并不希望客户端认为这个文件被修改了，而重新 Get。

某些文件修改非常频繁，比如在秒以下的时间内进行修改（比方说1s内修改了 N 次），If-Modified-Since 能检查到的粒度是 s 级的，这种修改无法判断（或者说 UNIX 记录 MTIME 只能精确到秒）。

某些服务器不能精确的得到文件的最后修改时间。

缓存过程如下图所示。
![enter image description here](https://res.cloudinary.com/dvu6persj/image/upload/v1556032772/Blog/http/http-cache.png)

#### Session 与 Cookie 必知必会

很好的解决了 HTTP 通讯中状态问题，但其本身也存在一些问题，比如：

- 客户端存储，可能会被修改或删除。
- 发送请求时，Cookie 会被一起发送到服务器，当 Cookie 数据量较大时也会带来额外的请求数据量。
- 客户端对 Cookie 数量及大小有一定的限制，Session 解决了 Cookie 的一些缺点。Session 同样是为了记录用户状态，对于每个用户来说都会有相应的一个状态值保存在服务器中，而只在客户端记录一个 sessionID 用于区分是哪个用户的 Session。

与 Cookie 相比，Session有一定的优势，如：

- Session 值存储在服务器，相对来说更安全。
- 客户端发送给服务器的只有一个 sessionID，数据量更小。Session同样需要在客户端存储一个 sessionID。可以这个值存储在 Cookie，每次发送请求时通过 Cookie 请求头将其发送到服务器；也可以不使用 Cookie，而将 sessionID 作为一个额外的请求参数，通过 URL 或请求体发送到服务器。

基于 Cookie 实现 Session 的实现原理如下图的示。

![enter image description here](https://res.cloudinary.com/dvu6persj/image/upload/v1556032829/Blog/http/http-cookie-session.png)

由上可见，基于 Cookie 实现 Session 时，其本质上还是在客户端保存一个 Cookie 值。这个值就是 sessionID，sessionID 的名称也可按需要设置，为保存安全，其值也可能会在服务器端做加密处理。服务器在收到 sessionID 后，就可以对其解密及查找对应的用户信息等。

#### HTTP 与 HTTPS 的区别

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556032888/Blog/http/HTTP-vs-HTTPS.png)

**HTTP**（HyperText Transfer Protocol：超文本传输协议）是一种用于分布式、协作式和超媒体信息系统的应用层协议。 简单来说就是一种发布和接收 HTML 页面的方法，被用于在 Web 浏览器和网站服务器之间传递信息。

HTTP 默认工作在 TCP 协议 80 端口，用户访问网站 **http://** 打头的都是标准 HTTP 服务。

HTTP 协议以明文方式发送内容，不提供任何方式的数据加密，如果攻击者截取了Web浏览器和网站服务器之间的传输报文，就可以直接读懂其中的信息，因此，HTTP协议不适合传输一些敏感信息，比如：信用卡号、密码等支付信息。

**HTTPS**（Hypertext Transfer Protocol Secure：超文本传输安全协议）是一种透过计算机网络进行安全通信的传输协议。HTTPS 经由 HTTP 进行通信，但利用 SSL/TLS 来加密数据包。HTTPS 开发的主要目的，是提供对网站服务器的身份认证，保护交换数据的隐私与完整性。

HTTPS 默认工作在 TCP 协议443端口，它的工作流程一般如以下方式：

- 1、TCP 三次同步握手
- 2、客户端验证服务器数字证书
- 3、DH 算法协商对称加密算法的密钥、hash 算法的密钥
- 4、SSL 安全加密隧道协商完成
- 5、网页以加密的方式传输，用协商的对称加密算法和密钥加密，保证数据机密性；用协商的hash算法进行数据完整性保护，保证数据不被篡改。

> 截至 2018 年 6 月，Alexa 排名前 100 万的网站中有 34.6% 使用 HTTPS 作为默认值，互联网 141387 个最受欢迎网站的 43.1% 具有安全实施的 HTTPS，以及 45% 的页面加载（透过Firefox纪录）使用HTTPS。2017 年3 月，中国注册域名总数的 0.11％使用 HTTPS。
>
> 根据 Mozilla 统计，自 2017 年 1 月以来，超过一半的网站流量被加密。

#### HTTP 与 HTTPS 区别

- HTTP 明文传输，数据都是未加密的，安全性较差，HTTPS（SSL+HTTP） 数据传输过程是加密的，安全性较好。
- 使用 HTTPS 协议需要到 CA（Certificate Authority，数字证书认证机构） 申请证书，一般免费证书较少，因而需要一定费用。证书颁发机构如：Symantec、Comodo、GoDaddy 和 GlobalSign 等。
- HTTP 页面响应速度比 HTTPS 快，主要是因为 HTTP 使用 TCP 三次握手建立连接，客户端和服务器需要交换 3 个包，而 HTTPS除了 TCP 的三个包，还要加上 ssl 握手需要的 9 个包，所以一共是 12 个包。
- http 和 https 使用的是完全不同的连接方式，用的端口也不一样，前者是 80，后者是 443。
- HTTPS 其实就是建构在 SSL/TLS 之上的 HTTP 协议，所以，要比较 HTTPS 比 HTTP 要更耗费服务器资源。

#### TCP 三次握手

在TCP/IP协议中，TCP协议通过三次握手建立一个可靠的连接

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556032942/Blog/http/tcp-three_times_hands.jpg)

- 第一次握手：客户端尝试连接服务器，向服务器发送 syn 包（同步序列编号Synchronize Sequence Numbers），syn=j，客户端进入 SYN_SEND 状态等待服务器确认
- 第二次握手：服务器接收客户端syn包并确认（ack=j+1），同时向客户端发送一个 SYN包（syn=k），即 SYN+ACK 包，此时服务器进入 SYN_RECV 状态
- 第三次握手：第三次握手：客户端收到服务器的SYN+ACK包，向服务器发送确认包ACK(ack=k+1），此包发送完毕，客户端和服务器进入ESTABLISHED状态，完成三次握手

简化：

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556033005/Blog/http/http-tcp_2.png)

#### HTTPS 的工作原理

我们都知道 HTTPS 能够加密信息，以免敏感信息被第三方获取，所以很多银行网站或电子邮箱等等安全级别较高的服务都会采用 HTTPS 协议。

![img](https://res.cloudinary.com/dvu6persj/image/upload/v1556033082/Blog/http/https.jpg)

**1、客户端发起 HTTPS 请求**

这个没什么好说的，就是用户在浏览器里输入一个 https 网址，然后连接到 server 的 443 端口。

**2、服务端的配置**

采用 HTTPS 协议的服务器必须要有一套数字证书，可以自己制作，也可以向组织申请，区别就是自己颁发的证书需要客户端验证通过，才可以继续访问，而使用受信任的公司申请的证书则不会弹出提示页面(startssl 就是个不错的选择，有 1 年的免费服务)。

这套证书其实就是一对公钥和私钥，如果对公钥和私钥不太理解，可以想象成一把钥匙和一个锁头，只是全世界只有你一个人有这把钥匙，你可以把锁头给别人，别人可以用这个锁把重要的东西锁起来，然后发给你，因为只有你一个人有这把钥匙，所以只有你才能看到被这把锁锁起来的东西。

**3、传送证书**

这个证书其实就是公钥，只是包含了很多信息，如证书的颁发机构，过期时间等等。

**4、客户端解析证书**

这部分工作是有客户端的TLS来完成的，首先会验证公钥是否有效，比如颁发机构，过期时间等等，如果发现异常，则会弹出一个警告框，提示证书存在问题。

如果证书没有问题，那么就生成一个随机值，然后用证书对该随机值进行加密，就好像上面说的，把随机值用锁头锁起来，这样除非有钥匙，不然看不到被锁住的内容。

**5、传送加密信息**

这部分传送的是用证书加密后的随机值，目的就是让服务端得到这个随机值，以后客户端和服务端的通信就可以通过这个随机值来进行加密解密了。

**6、服务段解密信息**

服务端用私钥解密后，得到了客户端传过来的随机值(私钥)，然后把内容通过该值进行对称加密，所谓对称加密就是，将信息和私钥通过某种算法混合在一起，这样除非知道私钥，不然无法获取内容，而正好客户端和服务端都知道这个私钥，所以只要加密算法够彪悍，私钥够复杂，数据就够安全。

**7、传输加密后的信息**

这部分信息是服务段用私钥加密后的信息，可以在客户端被还原。

**8、客户端解密信息**

客户端用之前生成的私钥解密服务段传过来的信息，于是获取了解密后的内容，整个过程第三方即使监听到了数据，也束手无策。

<hr />
