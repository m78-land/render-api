import { createEvent } from '@lxjx/hooks';
import React from 'react';
import { AnyFunction } from '@lxjx/utils';
export declare type ComponentType<P = any> = React.ComponentType<P> | AnyFunction;
/**
 * create() 方法接收的配置对象
 * @param S - 实现组件接收的额外props
 * */
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
    /** 'open' | 自行定义控制组件显示/隐藏的props key */
    controlKey?: string;
}
/**
 * 实现组件会接受的基础props, 实现组件可以以此类型作为基础props
 * @param S - 组件能够接收的状态, 对应实现组件的扩展props
 * */
export declare type RenderApiComponentBaseProps<S> = S & {
    /** 当前实例 */
    instance: RenderApiComponentInstance<S, any>;
};
/** api实例，通过create()方法创建 */
export interface RenderApiInstance<S, Extend> {
    /** 创建并渲染一个实例, 返回创建的实例 */
    render: (state: S) => RenderApiComponentInstance<S, Extend>;
    /**
     * 实例的挂载组件，一般会放在组件树的根节点下，并且应该避免其被延迟渲染
     * - 此配置存在的目的是保证外部挂载的组件被解析到主react实例树中从而使得React context等api正常可用
     * - 挂载位置与渲染位置无关，最终都会渲染到body下
     * - 如果RenderBoxTarget在第一次运行render时仍没有没渲染, 则会自动渲染到body下, 此时将不能再正常在渲染的组件内接收context等
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
        /** 实例数量发生改变 */
        change: ReturnType<typeof createEvent>;
        /** 实例改变时触发的事件(状态、数量等) */
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
/**
 * 调用render后生成的实例
 * @param S - 组件接收的状态
 * @param C - 组件内部对外暴露的实例, 组件内部可通过对此项直接赋值来扩展api的能力
 * */
export interface RenderApiComponentInstance<S, C> {
    /** 隐藏 */
    hide: () => void;
    /** 显示 */
    show: () => void;
    /** 销毁 */
    dispose: () => void;
    /** 组件共享到外部的状态 */
    state: S;
    /** 更新state状态 */
    setState: (nState: Partial<S>) => void;
    /** 存放组件内部对外暴露的属性和方法，由于组件渲染过程是异步的，所以此属性会延迟设置，如果实现组件未扩展任何东西则始终为null */
    current: C;
    /**
     * 由于组件的渲染是异步的, current在创建render实例后并不能马上访问
     * 此时可以通过safe调用来安全的访问实例, safe会在实例可用后立刻进行回调
     * 通常实现组件渲染的时间都非常的短, 所以只要不是在render后立刻访问, 直接使用instance.current访问实例也是可行的
     * */
    safe: (cb: () => void) => void;
}
/** 内部使用的实例的元信息 */
export interface ComponentItem {
    id: string;
    state: any;
    instance: RenderApiComponentInstance<any, any>;
    updateFlag: number;
}
//# sourceMappingURL=types.d.ts.map