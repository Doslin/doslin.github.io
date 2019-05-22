---
title: Java实现数字金额转换成汉字大写金额
tags: [Study]
date: 2019-05-15 20:54:28
permalink:  Java-Number-BigChinese
categories:  Java
description:  小写的财务金额要转换成汉字的大写金额
image: https://res.cloudinary.com/dvu6persj/image/upload/v1557925119/Blog/0623223854_94361_219_489_287.jpg
---
<p class="description"></p>

<img src="https://" alt="" style="width:100%" />

<!-- more -->

我们经常在做项目的财务报表，需要打印发票等情况时需要用到小写的财务金额要转换成汉字的大写金额，下面就是实现该功能的代码



```java
import java.lang.Math;

/**
*通用型金钱转换类
*
*/
public class Money {
  private String HanDigiStr[] = new String[] { "零", "壹", "贰", "叁", "肆", "伍",
      "陆", "柒", "捌", "玖" };
  private String HanDiviStr[] = new String[] { "", "拾", "佰", "仟", "万", "拾",
      "佰", "仟", "亿", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰",
      "仟", "万", "拾", "佰", "仟" };
  /**

- @param NumStr 输入字符串必须正整数，只允许前导空格(必须右对齐)，不宜有前导零
- @return
  */
    String PositiveIntegerToHanStr(String NumStr) {
    String RMBStr = "";
boolean lastzero = false;
boolean hasvalue = false; // 亿、万进位前有数值标记
int len, n;
len = NumStr.length();
if (len > 15)
  return "数值过大!";
for (int i = len - 1; i >= 0; i--) {
  if (NumStr.charAt(len - i - 1) == ' ')
    continue;
  n = NumStr.charAt(len - i - 1) - '0';
  if (n < 0 || n > 9)
    return "输入含非数字字符!";

  if (n != 0) {
    if (lastzero)
      RMBStr += HanDigiStr[0]; // 若干零后若跟非零值，只显示一个零
    // 除了亿万前的零不带到后面
    // if( !( n==1 && (i%4)==1 && (lastzero || i==len-1) ) ) //
    // 如十进位前有零也不发壹音用此行
    if (!(n == 1 && (i % 4) == 1 && i == len - 1)) // 十进位处于第一位不发壹音
      RMBStr += HanDigiStr[n];
    RMBStr += HanDiviStr[i]; // 非零值后加进位，个位为空
    hasvalue = true; // 置万进位前有值标记

  } else {
    if ((i % 8) == 0 || ((i % 8) == 4 && hasvalue)) // 亿万之间必须有非零值方显示万
      RMBStr += HanDiviStr[i]; // “亿”或“万”
  }
  if (i % 8 == 0)
    hasvalue = false; // 万进位前有值标记逢亿复位
  lastzero = (n == 0) && (i % 4 != 0);
}

if (RMBStr.length() == 0)
  return HanDigiStr[0]; // 输入空字符或"0"，返回"零"
return RMBStr;
  }
```





<hr />
