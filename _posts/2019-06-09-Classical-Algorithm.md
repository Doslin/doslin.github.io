---
layout: post
title: '经典算法整理'
description: "经典算法整理"
author: qiuzhilin
tags: 
  - Algorithm
last_modified_at: 2019-06-09T13:46:12-05:00
---

## 经典算法整理

**算法思想：** 

​	1.在待排序的元素任取一个元素作为主元(通常选第一个元素，但最的选择方法是从待排序元素中随机选取一个作为基准)，称为基准元素；

​	2.将待排序的元素进行分区，比基准元素大的元素放在它的右边，比其小的放在它的左边；

​	3.对左右两个分区重复以上步骤直到所有元素都排好序。

### 快速排序

**两种partition方案:**

第一种：

[![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_19.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_19.png) [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_20.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_20.png) [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_21.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_21.png) [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_22.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_22.png)

第二种：

[![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_28.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_28.png) [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_29.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_29.png) [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_12.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_12.png) [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_13.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_13.png)

随机pivot：

```
	public static void quickSort(int[] arr, int left, int right) {
		if (left < right) {
			int p = partition(arr, left, right, true);
			quickSort(arr, left, p - 1);
			quickSort(arr, p + 1, right);
		}
	}

	private static int partition(int[] arr, int left, int right, boolean isRandomPivot) {
		int pivot = isRandomPivot ? randomPivot(arr, left, right) : arr[left];
		int l = left;
		int r = right;
		while (l < r) {
			while (l < r && arr[r] >= pivot)
				r--;
			arr[l] = arr[r];
			while (l < r && arr[l] < pivot)
				l++;
			arr[r] = arr[l];
		}
		arr[l] = pivot;
		return l;
	}

	private static int randomPivot(int[] arr, int left, int right) {
		int r = new Random().nextInt(right - left + 1) + left;
		int temp = arr[left];
		arr[left] = arr[r];
		arr[r] = temp;
		return arr[left];
	}
```

三数取中法：

- 对于相等元素处理l和r都停止，可以做到均匀的划分
- 选用数组的中值做为pivot可以得到一个最优的划分，三数取中做为中值的估计量，可以很好消除预排序输入的坏情形

```
private static int partition2(int[] arr, int left, int right) {
		int pivot = median3(arr, left, right);
		int l = left;
		int r = right - 1;
		// arr[left],arr[right]在本轮次上已经在正确的位置，right-1位置存放pivot
		while (l < r) {
			// 遇到相等时都停止,可以做到均匀的划分
			while (arr[--r] > pivot)
				;
			while (arr[++l] < pivot)
				;
			if (l < r) {
				swap(arr, l, r);
			}
		}
		// 主元归位
		swap(arr, l, right - 1);
		return l;
	}

	private static int median3(int[] arr, int left, int right) {
		int mid = (left + right) >> 1;
		// arr[left] <= arr[mid] <= arr[right]
		if (arr[left] > arr[mid]) {
			swap(arr, left, mid);
		}
		if (arr[left] > arr[right]) {
			swap(arr, left, right);
		}
		if (arr[mid] > arr[right]) {
			swap(arr, mid, right);
		}
		// 主元存放在right-1位置
		swap(arr, mid, right - 1);
		return arr[right - 1];
	}
	private static void swap(int[] arr, int i, int j) {
		int temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
```

### 堆排序

**算法思想：** 堆是完全二叉树的一种：每个结点的值都大于或等于其左右孩子叫大顶堆；每个结点的值都小于或等于其左右孩子结点的值，称为小顶堆。 堆上的操作有**建堆以及堆调整**。

堆排序正是利用堆这种数据结构而设计的一种排序算法，以升序为例，堆排序的基本思想是：

- 1.将待排序序列构造成一个大顶堆，此时，整个序列的最大值就是堆顶的根节点。
- 2.将其与末尾元素进行交换，此时末尾就为最大值。然后将剩余n-1个元素堆调整 重复过程2 n-1次，便能得到一个升序的序列了。

整体主要由建堆，堆调整两部分组成。其中构建初始堆经推导复杂度为O(n)，在重建堆的过程中，要重复n-1次，每次是(lgn), 所以总的时间复杂度是O(nlgn)

代码实现：

```
public static void headSort(int[] arr) {
		// 1.构建大顶堆
		for (int i = arr.length / 2 - 1; i >= 0; i--) {
			heapify(arr, i, arr.length);
		}
		// 2.交换堆顶元素与末尾元素+调整堆结构
		for (int size = arr.length - 1; size > 0; size--) {
			swap(arr, 0, size);
			heapify(arr, 0, size);
		}
	}

	// 调整堆
	public static void heapify(int[] arr, int i, int length) {
		int left = 2 * i + 1;
		int right = left + 1;

		if (left >= length || right >= length) {
			return;
		}
		// 求根结点，子结点中的最大值的下标
		int max = max(arr, left, right, i);

		// 如果最大不是根，则根和最大交换
		if (max != i) {
			swap(arr, i, max);
			// 递归过程
			heapify(arr, max, length);
		}
	}
```

### 归并排序

**算法思想：** 归并排序是利用分治的思想实现的排序方法。该算法策略是将序列分成两半，对每一半分别进行排序，`这个过程可以是递归`。待它们分别排好序之后，合并这两个已经有序的序列。 分治过程：

[![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/1024555-20161218163120151-452283750.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/1024555-20161218163120151-452283750.png)

**代码实现：**

```
void merge(int arr[], int low, int mid, int high) {
		int Lsize = mid - low + 1;
		int Rsize = high - mid ;
		for (int i = 0; i < Lsize; i++) {
			L[i] = arr[low + i];
		}
		for (int i = 0; i < Rsize; i++) {
			R[i] = arr[mid + i + 1];
		}
		L[Lsize] = 0x0FFFFFFF;
		R[Rsize] = 0x0FFFFFFF;
		for (int k = low, i = 0, j = 0; k <= high; k++) {
			if (L[i] <= R[j]) {
				arr[k] = L[i++];
			} else {
				arr[k] = R[j++];
			}
		}
}
void merge_sort(int arr[], int low, int high){
    int mid = 0;
    if(low<high){
        mid = (low+high)/2; 
        merge_sort(arr, low, mid);
        merge_sort(arr, mid+1,high);
        merge(arr,low,mid,high);
    }
}
```

## 树和图算法

### 搜索算法

DFS

- 当碰到分支时，总是以深度作为前进的关键词，不到边界不回头。
- 当到达边界时，会选择最近的一个分支进行深度的前进。

**背包问题dfs解法：**

```
	/**
	 * 
	 * @param w 物品的重量
	 * @param v 物品的价值
	 * @param k 挑选的物品编号
	 * @param curVal 当前已有的价值
	 * @param W 当前剩余载重
	 * @return 最大价值
	 */
	private static int dfsKnapsack(int[] w, int[] v, int k, int curVal, int W) {
		//物品挑选完 | 容量没有剩余 都是边界条件
    if (k == w.length || W <= 0) {
			return curVal;
		}
		return Math.max(dfsKnapsack(w, v, k + 1, curVal + v[k], W - w[k]), 
						dfsKnapsack(w, v, k + 1, curVal, W));
	}
```

BFS

- 碰到分支时，以广度为关键词，**依次**访问该分支能直接到达的点，然后按这些点的访问顺序依次访问它们能又直接到达的点。
- BFS是按步数依次访问所有的分支，所以最先达到终点的分支一定的最短的 岛屿的个数：

```
public static int numIslands(char[][] grid) {
	int res = 0;
	if (grid == null || grid.length == 0 || grid[0].length == 0)
		return res;
	int m = grid.length;
	int n = grid[0].length;
	for (int i = 0; i < m; i++) {
		for (int j = 0; j < n; j++) {
			if (grid[i][j] == '1') {
				bfs(grid, i, j);
				res += 1;
			}
		}
	}
	return res;
}
protected static void bfs(char[][] grid, int i, int j) {
	//代表上下左右方向
	int[][] dir = { { 0, 1 }, { 0, -1 }, { 1, 0 }, { -1, 0 } };
	int m = grid.length;
	int n = grid[0].length;
	Queue<Integer> q = new LinkedList<Integer>();
	grid[i][j] = '0';
	q.add(i * n + j);

	while (!q.isEmpty()) {
		int cur = q.poll();
		int x = cur / n;
		int y = cur % n;
		for (int k = 0; k < 4; k++) {
			int nextX = x + dir[k][0];
			int nextY = y + dir[k][1];
			//将所有一步可达的点置为'0' 并加入queue中，以访问它们可达的点
			if (nextX >= 0 && nextY >= 0 && nextX < m 
				&& nextY < n && grid[nextX][nextY] == '1') {
				grid[nextX][nextY] = '0';
				q.add(nextX * n + nextY);
			}
		}
	}
}
```

### 二叉树的遍历

递归方式：

```
public static void preOrderRecur(Node root) {
		if (root == null) {
			return;
		}
		System.out.print(root.value + " ");
		preOrderRecur(root.left);
		preOrderRecur(root.right);
	}

	public static void inOrderRecur(Node root) {
		if (root == null) {
			return;
		}
		inOrderRecur(root.left);
		System.out.print(root.value + " ");
		inOrderRecur(root.right);
	}

	public static void posOrderRecur(Node root) {
		if (root == null) {
			return;
		}
		posOrderRecur(root.left);
		posOrderRecur(root.right);
		System.out.print(root.value + " ");
	}
```

非递归方式： 先序： [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190521_2.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190521_2.png)

```
public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> list = new ArrayList<>();
        if (root != null) {
            Stack<TreeNode> stack = new Stack<>();
            //先压根结点
            stack.add(root);
            while (!stack.isEmpty()) {
                root = stack.pop();
                list.add(root.val);
                //在压右子树
                if (root.right != null) {
                    stack.push(root.right);
                }
                //再压左子树
                if (root.left != null) {
                    stack.push(root.left);
                }
                //这样出栈顺序就能做到根左右
            }
        }
        return list;           
    }
```

中序： [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190521_1.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190521_1.png)

```
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<Integer>();
        if(root == null){
            return ans;
        }
        TreeNode cur = root;
        Stack<TreeNode> stack = new Stack<TreeNode>();
        while(!stack.isEmpty() || cur != null){
            //压左边界 直到为null
            while(cur!=null){
                stack.push(cur);
                cur = cur.left;
            }
            //弹出一个结点 收集val 并让cur = node.right;
            TreeNode node = stack.pop();
            ans.add(node.val);
            cur = node.right;
        }
        return ans;
    }
```

后序： [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190521_3.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190521_3.png)

```
public List<Integer> postorderTraversal(TreeNode root) {
		List<Integer> list = new ArrayList<>();
        if (root != null) {
			Stack<TreeNode> s1 = new Stack<TreeNode>();
			Stack<Integer> data = new Stack<Integer>();
			s1.push(root);
            TreeNode node = null;
			while (!s1.isEmpty()) {
				node = s1.pop();
                //第次弹出元素压入data中 可以保证 根右左顺序
				data.push(node.val);
				if (node.left != null) {
					s1.push(node.left);
				}
				if (node.right != null) {
					s1.push(node.right);
				}
			}
            //出栈收集 左右根顺序
			while (!data.isEmpty()) {
				list.add(data.pop());
			}
		}
        return list;
    }
```

或者直接用list，每次add到0号的位置

```
public static List<Integer> postorderTraversal(TreeNode root) {
	List<Integer> list = new ArrayList<>();
	if (root != null) {
		Stack<TreeNode> stack = new Stack<TreeNode>();
		stack.push(root);
		TreeNode node = null;
		while (!stack.isEmpty()) {
			node = stack.pop();
			list.add(0, node.val);
			if (node.left != null) {
				stack.push(node.left);
			}
			if (node.right != null) {
				stack.push(node.right);
			}
		}
	}
	return list;
}
```

### 最短路径

### 最小生成树

## 字符串算法

### BM

### KMP

#### next数组：

保存的是以当前字符(不包含)结尾的最长的前缀和后缀

[![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190531_8.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190531_8.png)

**求解过程：**

- next[0] = -1,next[1] = 0
- 假设next[i-1]已知，则只需要对比p[i-1]和p[i-1]的最长前缀的下一个字符(也就是`p[next[i-1]]`)是否相等 如果相等，则next[i] = next[i-1]+1 如果不等，则需要往前推，将p[i-1]和p[next[next[i-1]-1]对比，直到相等，或者next[i-1] = -1

一个例子：

[![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190531_10.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190531_10.png)

```
next[0] = -1
pre = -1
i = 1
while i < next.length:
	if pre == -1 or p[i - 1] == p[pre]:
		next[i++] = ++pre
	 else 
		pre = next[pre]
```

#### KMP求解

- 如果T[i]==P[j]，则i++，j++
- 如果不等：则j需要回退到next[j]的位置，直到无法回退，或者T[i]和P[j]相等

```
while i < t.length && j < p.length:
	if j == -1 or t[i] == p[j]:
		i++;j++
	else:
		j = next[j]
```

**一个例子：** [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190531_9.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190531_9.png)

**完整算法：**

```
public static int kmp(String T, String P) {
		int[] next = next(P);
		char[] t = T.toCharArray();
		char[] p = P.toCharArray();
		int i = 0, j = 0;
		while (i < t.length && j < p.length) {
			// 如果相等 或者j已经没法回退了
			// 则都接着匹配一下个
			if (j == -1 || t[i] == p[j]) {
				i++;
				j++;
			}
			// j回退至j位置最长前缀的位置
			// 继续和i匹配
			else {
				j = next[j];
			}
		}
		return j == p.length ? i - j : -1;
	}

	public static int[] next(String P) {
		char[] p = P.toCharArray();
		int[] next = new int[p.length];
		next[0] = -1;
		int pre = -1;
		int i = 1;
		while (i < next.length) {
			if (pre == -1 || p[i - 1] == p[pre]) {
				next[i++] = ++pre;
			} else {
				pre = next[pre];
			}
		}
		return next;
	}
```

#### 扩展问题

- (str)*n = strstr...str 如何判断一个字符串是否是由某一个范式重复得到的

  如何符合这种范式，则next数组一定从某一位置开始，呈现一个+1的趋势

  [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_2.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_2.png)

  且从第一个重复的开头位置始，出现一个倍数关系

- 给定一个字符串，只能在后面添加字符，求添加最少，使原始串出现两次 例：`abcabc -> [abc(abc]abc)` 解法：再求next数组时，只需要将多求一步就可以了，由于前缀和后缀是相等的，又多添加了一个后缀，所以整体就能出现两次了。 [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_1.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_1.png)

- 如何判断在一棵树中是否存在和一棵给定树的子树 对两树序列化，看原树中是否包含另一棵树的子树，只需要是其子串即可

- 再字符串的`开头`添加字符，使其成为回文串，求其中最短的

  `ABAEFG`

  [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_3.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_3.png) 只要将后面的字符逆序添加到开头即可

- 再字符串的`末尾`添加字符，使其成为回文串，求其中最短的 `CBA` [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_4.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_4.png)

### Manacher

#### 几个概念

回文半径，回文左右边界： [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_5.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_5.png) 两种情况：

- 若当前考察的位置不包括在回文半径内，则进行常规的往外扩的过程

- 若当前考察的位置包括在回文半径内，则又有下面三种情况

  1. 若i点关于c的镜像i0在L内部，此时i的回文半径和i0相同，为什么？ [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/2019-06-01_091041.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/2019-06-01_091041.png)

  2. 若i点关于c的镜像i0在L外部，则回文半径最就是和R的距离，为什么？ [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/2019-06-01_091925.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/2019-06-01_091925.png) 证明如下：

     x0 != x，因为大回文没能包住，x0=y0，因为在i0的回文内

     y0 = y，因为是关于c点对称的，推出y!=x，所以最长半径为i->R

     [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/2019-06-01_141524.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/2019-06-01_141524.png)

  3. 若i点关于c的镜像i0等于L，此时需要考察R之后的字符才能确定。 [![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/2019-06-01_092247.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/2019-06-01_092247.png)

#### 代码实现

```
// #A#B#C#C#E#
	public static char[] manacherString(String str) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < str.length(); i++) {
			sb.append("#");
			sb.append(str.charAt(i));
		}
		sb.append("#");
		return sb.toString().toCharArray();
	}

	public static String manacher(String str) {
		if (str == null || str.length() == 0) {
			return "";
		}
		char[] charArr = manacherString(str);
		int[] radius = new int[charArr.length];
    String res = null;
		int C = -1;
		int R = -1;
		int max = 0;
		int rc = 0;
		for (int i = 0; i != charArr.length; i++) {
			// 区分了当i在回文半径里外时
			radius[i] = R > i ? Math.min(radius[2 * C - i], R - i) : 1;
			while (i + radius[i] < charArr.length && i - radius[i] > -1) {
				// 以点i为中心往外扩
				if (charArr[i + radius[i]] == charArr[i - radius[i]])
					radius[i]++;
				else {
					break;
				}
			}
			// 更新最右回文边界
			if (i + radius[i] > R) {
				R = i + radius[i];
				C = i;
			}
			// 当有更大的回文半径时，记录中心点和最大值
			if (radius[i] > max) {
				max = radius[i];
				rc = i;
			}
		}
		res = String.valueOf(charArr).substring(rc - max + 1, rc + max - 1).replace("#", "");
		return res;
	}
```

#### 扩展问题

- 再字符串的`开头`添加字符，使其成为回文串，求其中最短的 求以`第一个字符开头`的，最长回文子串，将其`之后`的部分逆序添加到`开头`
- 再字符串的`末尾`添加字符，使其成为回文串，求其中最短的 求以`最后一个字符结尾`的，最长回文子串，将其`之前`的部分逆序添加到`最后`
- 这两个问题的本质是只要找到以`开头或结尾字符`的最长回文子串，然后将剩余的部分`逆序添加`即可

## 其它算法

### 使用单调栈解决最大矩形面积

保持栈中元素递增，当要压入的元素小于栈顶元素时，进行计算以当前为界的矩形的面积

```
    def largestRectangleArea(self, heights):
        s = []
        res = 0
        # 可以保证在最后总会计算
        heights.append(0)
        for i in range(len(heights)):
            # 当前位置小于栈顶位置时计算
            while s and heights[s[-1]] > heights[i]:
                h = heights[s.pop()]
                # i-s[-1]-1 和 i 是底
                area = h * (i-s[-1]-1 if s else i)
                res = max(res,area)
            s.append(i)
        return res
```

### 完美洗牌算法

有个长度为2n的数组 {a1, a2, a3, ..., an, b1, b2, b3, ..., bn} ，希望排序后 {a1, b1, a2, b2, ...., an, bn} ，请考虑有无时间复杂度 O(n)，空间复杂度 O(1) 的解法。

链接：https://www.jianshu.com/p/9c841ad88ded

如果要排序成这种形式： a1<=a2>=a3<=a4>=a5

则只要将它们排序，再应用完美洗牌算法即可 例：

> 1 2 3 4 5 6

> 1 4 2 5 3 6

### 求两个排序数组的上中位数(长度相等)

[![img](https://github.com/gyx2110/algorithm-book/raw/master/algorithm-notes/assets/Snip20190601_14-9385620.png)](https://github.com/gyx2110/algorithm-book/blob/master/algorithm-notes/assets/Snip20190601_14-9385620.png)

### 求两个排序数组的第k小的数(长度不等)

假设一个数组长度为10，一个为17

1<=k<=10 拿出前k个比较进行二分可以了

17<k<=27 23 先比较6号和13号是不是 如果不是，则对6之后和13之后进行二分 (6+13) +4 = 23(淘汰的 +二分出来的)

10<k<=17 13 短数组1-10都有可能 1>12' 1>3' 判断3'是不是 如果是则返回，否则进行二分[1,10],[4',13'] 3+10(淘汰的 +二分出来的)

