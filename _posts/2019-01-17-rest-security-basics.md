---
layout: post
title: REST API 的安全基础
tags: ["rest", "翻译"]
---

REST 是一种现代架构风格，它定义了一种设计 Web 服务的新方法。和之前的 HTTP 以及 SOA 不同，它不是一个协议（即：一套严格的规则），而是一些关于 Web 服务应该如何相互通信的一些建议和最佳实践。按照 REST 最佳实践开发的服务被称为 “RESTful Web 服务”。

安全性是 RESTful 服务的基石。启用它的方法之一是尽可能内置用户身份验证和授权机制。

在 RESTful 服务中实现用户身份验证和授权的方法有很多。我们今天要讲的主要方法（或标准）有：

- Basic 认证
- OAuth 2.0
- OAuth 2.0 + JWT

为了让我们的讨论更加具体，假设我们的后端程序有微服务，并且每个用户请求时，必须调用后端的几个服务来返回请求的数据。所以，我们将不仅从安全性问题方面，而且在它们产生的额外流量和服务器负载的背景下检查每个标准。下面开始吧...

# Basic 认证

最古老也是最简单的标准。

**看起来像：** 用户名 + 密码 + Base64（对用户名和密码做哈希的基础算法）。

**工作原理：**加入有人尝试登录用户的 Fackbook 账户，去访问他的消息、历史记录、群组信息，这些都是独立的服务。当用户输入用户名和密码后，系统会允许登录。但是，默认情况下，系统不知道用户的角色和权限是什么，他们可以访问哪些服务等等。

所以每次用户尝试访问任何一个服务的时候，系统都应该再次验证是否允许执行这个操作，这意味着需要对身份验证进行额外的调用。就我们的示例中有四个服务而言，在这种情况下，每个用户将有四个额外的调用。

现在假设每秒有 3k 个请求，在 Facebook 的系统中每秒 300k 请求更现实。将这请求乘以四，结果是每秒要向服务器发出 12k 次调用。

![Basic认证]({{ "/public/images/2019/01/baseline_architecture_1.jpg" | prepend: site.cdnurl }} "Basic 认证" )

**总结：**可伸缩性差，大量的额外流量（额外调用）没有带来业务价值，服务器的负载很大。

# OAuth 2.0

**看起来像：**用户名 + 密码 + 访问令牌 + 过期令牌

**工作原理：**OAuth 2.0 标准的核心思想是，用户使用用户名和密码登录系统后，客户端（用户访问系统的设备）会收到一对令牌，这是一个访问权限令牌和刷新令牌。

访问令牌用于访问系统中的所有服务。到期后，系统使用刷新令牌生成一对新的令牌。所以，如果用户每天都进入系统，令牌也会每天更新，不需要每次都用用户名和密码登录系统。刷新令牌也有它的过期时间（虽然它比访问令牌长得多），如果一个用户一年没有进入系统，那么很可能会被要求再次输入用户名和密码。

OAuth 2.0 标准取代了基本的身份验证方法，它具有一定的优势，例如用户每次想要进入系统时不用输入用户名和密码。但是，系统仍然需要调用身份验证服务器，就像使用基本身份验证方法时一样，以检查拥有该令牌的用户有权限做什么。

假设有效期是一天。这意味着登录服务器上的负载要少得多，因为用户每天只需要输入一次凭证，而不是每次都要进入系统。但是，系统仍需要验证每个令牌并检查用户角色的存储状态。所以我们最终还要调用身份验证服务器。

![OAuth2认证]({{ "/public/images/2019/01/OAuth2-Password_Grant_2.jpg" | prepend: site.cdnurl }} "OAuth2 认证" )

**总结：**和 Basic 验证有相同的问题 - 可伸缩性差，身份验证服务器负载较高。

# OAuth2 + JSON Web 令牌

**看起来像：**用户名 + 密码 + JSON数据 + Base64 + 私钥 + 到期日期

**工作原理：**当用户第一次使用用户名和密码登录系统时，系统不仅会返回一个访问令牌（只是一个字符串），而是一个包含所有用户信息的 JSON 对象，比如角色和权限，使用 Base64 进行编码并使用私钥签名。下图是它在没有编码的情况下的样子：

![JWT认证]({{ "/public/images/2019/01/encodedvs.decoded_4.jpg" | prepend: site.cdnurl }} "JWT 认证" )

看起来很可怕，但这确实有效！主要区别在于我们可以在令牌中存储状态，而服务保持无状态。这意味着用户自己拥有自己的信息，不需要额外的调用来检查它，因为所有的内容都在令牌里。这对于减少服务器负载方面是一个很大的优势。这个标准在世界范围内得到广泛应用。

**总结：**良好的可伸缩性，可以和微服务一起工作。

# 新玩意：亚马逊签名方式

一种全新的，奇特的方法，称为 HTTP 签名，亚马逊是目前使用它的大厂之一。

它的思路是，当你创建亚马逊帐户的时候，会生成一个永久的、非常安全的访问令牌，你要非常小心地存储起来并且不要给任何人显示。当你要从 Amazon 请求某些资源时，你可以获取到所有相关的 http 头信息，使用这个私钥对其进行签名，然后将签名的字符串作为 header 发送。

在服务器端，亚马逊也有你的访问密钥。它们接下来做什么？只需要使用你的 http 头信息和这个密钥进行签名。然后将签名字符串和你作为签名的字符串进行比较；如果相同那么就知道你是谁。

最大的好处是你只需要发送一次用户名和密码 - 就可以获得令牌。至于使用私钥签名的 header 信息，基本上没有机会对它们进行编码。就算有人截获了信息——谁在乎呢 ;）

> 英文原文：[https://yellow.systems/blog/rest-security-basics](https://yellow.systems/blog/rest-security-basics)