---
title: 快速上手
order: 2
---

## 安装

```shell
yarn add @m78/render-api
```

或者使用 npm

```shell
npm install @m78/render-api
```

<br/>

## 使用

大致步骤如下:

1. 约定组件的状态
2. 创建要全局渲染的组件, `render-api`会在其 props 中传入当前状态和实例对象，该组件 props 可通过 `RenderApiComponentBaseProps` 描述
3. 通过`create()`和创建的组件来生成 api
4. 使用生成的 api 渲染和管理组件

<code src="./demos/demo1.tsx" />
