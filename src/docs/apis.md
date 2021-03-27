---
title: API
order: 3
---

## RenderApiComponentBaseProps

实现组件会接受的基础 props, 可用于描述实现组件的 props

```ts
interface RenderApiComponentBaseProps<S> {
  /** 组件状态 */
  state: RenderApiComponentMixState<S>;
  /** 当前实例 */
  instance: RenderApiComponentInstance<S>;
}
```

## create(opt)

接收配置并创建一个 api 实例

```ts
function create<S>(opt: RenderApiOption<S>): RenderApiInstance<S>;
```

## RenderApiOption

`create()` 方法接收的配置对象

```ts
interface RenderApiOption<S> {
  /** 交由api渲染的组件，该组件接受RenderApiComponentProps */
  component: ComponentType<RenderApiComponentBaseProps<any>>;
  /** 默认state状态，会和render(state)时传入的state合并 */
  defaultState?: Partial<S>;
  /** 包装组件，如果你的实现组件依赖于特定的布局，可以通过传递此项来包裹它们 */
  wrap?: ComponentType;
  /** 最大实例数，当渲染的组件数超过此数值时，会将最先进入的实例的open设为false */
  maxInstance?: number;
  /** 将实例渲染到指定命名空间的节点下, 而不是使用默认的渲染节点 */
  namespace?: string;
}
```

## RenderApiInstance

api 实例，通过`create()`方法创建

```ts
interface RenderApiInstance<S> {
  /** 创建并渲染一个实例, 返回创建的实例 */
  render: (state: S) => RenderApiComponentInstance<S>;
  /**
   * 实例的挂载组件，一般会放在组件树的根节点下，并且应该避免其被延迟渲染
   * - 此配置存在的目的是保证外部挂载的组件被解析到主react实例树中从而使得React context等api正常可用
   * - 挂载位置与渲染位置无关，最终都会渲染到body下
   * */
  RenderBoxTarget: ComponentType;
  /** 关闭全部实例 */
  hideAll: () => void;
  /** 开启全部实例 */
  showAll: () => void;
  /** 销毁全部实例 */
  disposeAll: () => void;
  /** 获取所有实例的列表 */
  getInstances: () => RenderApiComponentInstance<S>[];
  /** 可用事件对象 */
  events: {
    /** 实例列表发生改变(增加或减少) */
    update: ReturnType<typeof createEvent>;
  };
}
```

## RenderApiComponentInstance

调用 render 后生成的组件实例

```ts
interface RenderApiComponentInstance<S> {
  /** 隐藏 */
  hide: () => void;
  /** 显示 */
  show: () => void;
  /** 销毁 */
  dispose: () => void;
  /** 组件共享到外部的状态 */
  state: RenderApiComponentMixState<S>;
  /** 更新state状态 */
  setState: (nState: Partial<RenderApiComponentMixState<S>>) => void;
}
```

## RenderApiComponentMixState

一个扩展至 state 的对象，除了组件状态外还包含一些内部添加的状态

```ts
type RenderApiComponentMixState<S> = S & {
  /** 是否开启 */
  open: boolean;
};
```
