import { createEvent } from '@lxjx/hooks';
import React, { RefCallback } from 'react';
import { AnyFunction } from '@lxjx/utils';
/**
 * 一个更包容的组件接收器类型
 * */
export declare type ComponentType<P = any> = React.ComponentType<P> | AnyFunction;
/**
 * 实现组件的标准props, 实现组件可以选择继承此接口(如果未自定义show/onChange的key)或RenderApiComponentBaseProps
 * */
export interface RenderApiComponentProps<S, I = null> extends RenderApiComponentBaseProps<S, I> {
    /** 是否显示 */
    show: boolean;
    /** show状态变更时通知父组件 */
    onChange: (cur: boolean) => boolean;
}
/**
 * 实现组件会接受的基础props, 实现组件可以以此类型作为基础props
 *
 * 变更此类型时应注意是否需要同步setStateWhiteList
 * */
export interface RenderApiComponentBaseProps<S, I = null> {
    /** 通知上层组件销毁本组件的实例 */
    onDispose: () => void;
    /** 当需要对外暴露更多的api时使用, 将额外的api挂载到此ref */
    instanceRef: RefCallback<I>;
}
/**
 * create() 方法接收的配置对象
 *
 * 变更此类型时应注意是否需要更新updateOptionWhiteList
 * */
export interface RenderApiOption<S> {
    /** 交由api渲染的组件，该组件接受RenderApiComponentProps */
    component: ComponentType<RenderApiComponentBaseProps<any>>;
    /** 默认state状态，会和render(state)时传入的state合并 */
    defaultState?: Partial<_OmitBuiltState<S>>;
    /** 包装组件，如果你的实现组件依赖于特定的布局，可以通过传递此项来包裹它们 */
    wrap?: ComponentType;
    /** 最大实例数，当渲染的组件数超过此数值时，会将最先进入的实例移除 */
    maxInstance?: number;
    /** 将实例渲染到指定命名空间的节点下, 而不是使用默认的渲染节点 */
    namespace?: string;
    /** 'show' | 自行定义控制组件显示/隐藏的props key */
    showKey?: string;
    /** 'onChange' | 自定义show变更进行通知的方法 */
    changeKey?: string;
}
/** api实例，通过create()方法创建 */
export interface RenderApiInstance<S, I> {
    /** 创建并渲染一个实例, 返回创建的实例 */
    render: (state: _OmitBuiltState<S>) => RenderApiComponentInstance<S, I>;
    /**
     * 实例的挂载组件，一般会放在组件树的根节点下，并且应该避免其被延迟渲染
     * - 此配置存在的目的是保证外部挂载的组件被解析到主react实例树中从而使得React context等api正常可用
     * - 挂载位置与渲染位置无关，最终都会渲染到body下
     * - 如果RenderTarget在第一次运行render时仍没有没渲染, 则会自动渲染到body下, 此时将不能再正常在渲染的组件内接收context等
     * */
    RenderTarget: ComponentType;
    /** 关闭全部实例 */
    hideAll: () => void;
    /** 开启全部实例 */
    showAll: () => void;
    /** 销毁全部实例 */
    disposeAll: () => void;
    /** 获取所有实例的列表 */
    getInstances: () => Array<RenderApiComponentInstance<S, I>>;
    /** 可用事件对象 */
    events: {
        /** 实例发生可能会影响ui的改变时触发的事件 */
        change: ReturnType<typeof createEvent>;
    };
    /**
     * 更改create()时传入的配置, 只有白名单内的配置可以更改
     * whiteList: ['defaultState', 'wrap', 'maxInstance']
     * */
    setOption: (opt: Omit<RenderApiOption<S>, 'component' | 'namespace' | 'showKey' | 'changeKey'>) => void;
    /**
     * 获取正在使用的配置副本
     * */
    getOption: () => RenderApiOption<S>;
}
/** render实例, 调用render()后生成 */
export interface RenderApiComponentInstance<S, I> {
    /** 隐藏 */
    hide: () => void;
    /** 显示 */
    show: () => void;
    /** 销毁 */
    dispose: () => void;
    /** 渲染组件的state */
    state: S;
    /** 更新渲染组件的state */
    setState: (nState: Partial<_OmitBuiltState<S>>) => void;
    /** 存放组件内部对外暴露的属性和方法，由于组件渲染过程是异步的，所以此属性会延迟设置，如果实现组件未扩展任何东西则始终为null */
    current: I;
    /**
     * 由于组件的渲染是异步的, current在创建render实例后并不能马上访问
     * 此时可以通过safe调用来安全的访问实例, safe会在实例可用后立刻进行回调
     * 通常实现组件渲染的时间都非常的短, 所以只要不是在render后立刻访问, 直接使用instance.current访问实例也是可行的
     * */
    safe: (cb: () => void) => void;
}
/** 内部使用的实例的元信息 */
export interface _ComponentItem {
    /** 组件/实例的唯一id */
    id: string;
    state: any;
    instance: RenderApiComponentInstance<any, any>;
    /** 更新标记, 用于最大程度的避免不需要的re-render */
    updateFlag: number;
}
/**
 * 过滤调内部属性的state
 * */
export declare type _OmitBuiltState<S> = Omit<S, 'show' | 'onChange' | 'onDispose' | 'instanceRef'>;
//# sourceMappingURL=types.d.ts.map