---
title: Maven-webxml attribute is required
tags: [Maven,Web.xml]
date: 2019-04-12 09:32:28
permalink: Maven-webxml-attribute-is-required
categories: Java
description: Error assembling WAR webxml attribute is required 
image: http://ppscnu16d.bkt.clouddn.com/maven.png
---
<p class="description"></p>

<img src="https://" alt="" style="width:100%" />

<!-- more -->
Maven package a web application and hits the following error message :

```
$ mvn package
//...
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-war-plugin:2.2:war 
(default-war) on project spring4-mvc-maven-ajax-example: 

Error assembling WAR: webxml attribute is required 
(or pre-existing WEB-INF/web.xml if executing in update mode) -> [Help 1]
```

### Solution

1.For servlet container < 3, make sure <font color=f42c00 >WEB-INF/web.xml</font>file exists.

2.For servlet container >=3, and NO <font color=f42c00 >WEB-INF/web.xml</font> web application, declares the following<font color=f42c00 >maven-war-plugin</font>  plugin, and set the <font color=f42c00 >failOnMissingWebXml</font> option to false.





pom.xml

```xml
  <build>
	<plugins>
		
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-war-plugin</artifactId>
			<version>2.6</version>
			<configuration>
				<failOnMissingWebXml>false</failOnMissingWebXml>
			</configuration>
		</plugin>
		
	</plugins>
  </build>	
```

​		

<hr />



