---
title: Integer-To-Roman
tags: [Leetocode]
date: 2019-05-15 20:43:23
permalink: Integer-To-Roman
categories:  Leetocode
description:  数字转为罗马数字
image:  https://res.cloudinary.com/dvu6persj/image/upload/v1557924343/Blog/i6ubikr2fyshqdgc0gco.png
---
<p class="description"></p>

<img src="https://" alt="" style="width:100%" />

<!-- more -->

Leettcode 第12题

<div class="note default"><p>
Given an integer, convert it to a roman numeral.
The number is guaranteed to be within the range from `1` to `3999`.
</p></div>

```java
class Solution {
   public String intToRoman(int num) {
		if(num <= 0) {
			return "";
		}
	    int[] nums = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
	    String[] symbols = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
	    StringBuilder res = new StringBuilder();
	    int digit=0;
	    while (num > 0) {
	        int times = num / nums[digit];
	        num -= nums[digit] * times;
	        for ( ; times > 0; times--) {
	            res.append(symbols[digit]);
	        }
	        digit++;
	    }
	    return res.toString();
	}
}
```



<hr />
