<h1 align="center" style="font-size: 80px;color:#61dafb">🔌</h1>
<h1 align="center" style="color: #61dafb;">RenderApi</h1>

<br>

<p align="center">通过调用api来渲染react组件</p>

<br>

`RenderApi` 提供了在主React实例外渲染组件的方式，与 `React Portal api` 相比，此库提供了一系列管理已渲染组件的方法
和一些主观约定，简而言之, 它：

* 通过简洁的api管理你的外部组件实例, 并且你可以进行更新实例状态、控制显示、卸载等操作
* 渲染的组件在react上下文中, 所以 `React Context api` 是可用的
* 单例，你可以创建多个api接口而不用担心它们彼此干扰

<br />

🤔 能用来做什么？

* 最常见的用例是用来渲染Modal等需要挂载到节点树外的组件，并且将其api化，可以通过api来直接创建实例并进行管理

<br />

🔥 一些用例:

敬请期待...
