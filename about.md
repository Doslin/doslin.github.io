---
layout: page
title: 关于
permalink: about.html
image: /public/images/redflag.jpg
order: 5
---

{% if site.author.photo %}
![{{ site.author.name }}]({{ site.author.photo | prepend: site.cdnurl }}){:.me}
{% endif %}

目前还没什么其他可说的，如果想看我的代码可以去我的 [Github](https://github.com/doslin){:target="_blank"}，想看我的视频教程可以去 [Youtube](https://www.youtube.com/channel/UClYx3HnKZ93pcZVlhhoNn1Q?view_as=subscriber){:target="_blank"} 频道。

## 编程理念

仰慕「优雅编码的艺术」，追崇实践 + 理论得真知。

## 做过什么

- 一切都不值得留下

**My Github chart:**

![Mogeko's Github chart](http://ghchart.rshah.org/mogeko)

## 版权说明

我坚信着开放、自由和乐于分享是推动计算机技术发展的动力之一。所以本站所有内容均采用[署名 4.0 国际（CC BY
4.0）](http://creativecommons.org/licenses/by/4.0/deed.zh)创作共享协议。通俗地讲，只要在使用时署名，那么使用者可以对本站所有内容进行转载、节选、二次创作，并且允许商业性使用。

## 其他

我的博客使用 Jekyll 搭建，源码托管在 [Coding](https://dev.tencent.com/u/doude){:target="_blank"}。如果你有什么自认为伟大的想法或者想对我说的请发送邮件至 `zhizhiqiu#163.com`，注意逻辑清晰，表明来意，否则不回复。

<!-- Add Disqus Comments -->
{% if site.disqus %}
{% include disqus.html %}
{% endif %}