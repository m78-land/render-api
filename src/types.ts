import { createEvent } from '@lxjx/hooks';
import React from 'react';
import { AnyFunction } from '@lxjx/utils';

export type ComponentType<P = any> = React.ComponentType<P> | AnyFunction;

/** create() 方法接收的配置对象 */
export interface RenderApiOption<S> {
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

/** api实例，通过create()方法创建 */
export interface RenderApiInstance<S, Extend> {
  /** 创建并渲染一个实例, 返回创建的实例 */
  render: (state: S) => RenderApiComponentInstance<S, Extend>;
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
  getInstances: () => Array<RenderApiComponentInstance<S, Extend>>;
  /** 可用事件对象 */
  events: {
    /** 实例列表发生改变(增加或减少) */
    update: ReturnType<typeof createEvent>;
  };
  /** 设置默认state */
  setDefaultState: (state: Partial<S>) => void;
  /** 获取的默认state */
  getDefaultState: () => Partial<S> | undefined;
  /** 设置最大实例数 */
  setMaxInstance: (max: number) => void;
  /** 获取最大实例数 */
  getMaxInstance: () => number | undefined;
}

/** 实现组件会接受的基础props, 可用于描述实现组件的props */
export interface RenderApiComponentBaseProps<S> {
  /** 组件状态 */
  state: RenderApiComponentMixState<S>;
  /** 当前实例 */
  instance: RenderApiComponentInstance<S>;
}

/** 向state中添加内置状态 */
export type RenderApiComponentMixState<S> = S & {
  /** 是否开启 */
  open: boolean;
};

/** 调用render后生成的组件实例 */
export interface RenderApiComponentInstance<S, C = null> {
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
  /** 存放组件内部对外暴露的属性和方法，由于组件渲染过程是异步的，所以此属性会延迟设置，如果实现组件未扩展任何东西则始终为null */
  current: C | null;
}

/** 实例的元信息 */
export interface ComponentItem<S> {
  id: string;
  state: RenderApiComponentMixState<S>;
  instance: RenderApiComponentInstance<S>;
  updateFlag: number;
}
