import React, { useMemo, useState } from 'react';
import { createEvent } from '@lxjx/hooks';
import { AnyFunction, createRandString, defer, getPortalsNode } from '@lxjx/utils';
import ReactDom from 'react-dom';
import {
  RenderApiComponentInstance,
  RenderApiInstance,
  RenderApiOption,
  ComponentItem,
} from './types';

function create<S extends object, Extend = null>(
  opt: RenderApiOption<S>,
): RenderApiInstance<S, Extend> {
  type MixInstance = RenderApiComponentInstance<S, Extend>;

  const {
    component: Component,
    defaultState,
    wrap: Wrap,
    maxInstance,
    namespace = 'RENDER__BOX',
    controlKey = 'open',
  } = opt;

  const MemoComponent = React.memo(
    Component,
    (prev, next) => prev._updateFlag === next._updateFlag,
  );

  /** 实例更新通知 */
  const updateEvent = createEvent();
  /** 实例长度变更 */
  const changeEvent = createEvent();

  /** 在内部共享的状态对象 */
  const ctx = {
    list: [] as ComponentItem[],
    event: {
      update: updateEvent,
      change: changeEvent,
    },
    defaultState,
    maxInstance,
    /** target是否已渲染, 未渲染时调用render会渲染默认Target */
    targetIsRender: false,
  };

  function hide(id: string) {
    const current = getItemById(id);

    if (!current) return;
    if (!current.state[controlKey]) return;

    setStateByCurrent(current, {
      [controlKey]: false,
    } as any);
  }

  function show(id: string) {
    const current = getItemById(id);

    if (!current) return;
    if (current.state[controlKey]) return;

    setStateByCurrent(current, {
      [controlKey]: true,
    } as any);
  }

  function dispose(id: string) {
    const ind = getIndexById(id);

    if (ind === -1) return;

    ctx.list.splice(ind, 1);

    updateEvent.emit();
    changeEvent.emit();
  }

  function disposeAll() {
    ctx.list = [];
    updateEvent.emit();
    changeEvent.emit();
  }

  /** 设置所有实例的开启或关闭状态 */
  function setAllOpen(open: boolean) {
    ctx.list.forEach(item =>
      setStateByCurrent(
        item,
        {
          [controlKey]: open,
        } as any,
        false,
      ),
    );
    updateEvent.emit();
  }

  /** 创建并渲染一个实例 */
  function render(state: S) {
    const id = createRandString();

    const maxIns = ctx.maxInstance;

    const _state: S = {
      ...ctx.defaultState,
      ...state,
      [controlKey]: true,
    };

    let innerInstance: any = null;
    /** 存储所有safe操作, 并在RenderApiComponentInstance.current存在时调用 */
    const unsafeCallQueue: AnyFunction[] = [];

    const instance: RenderApiComponentInstance<S, any> = {
      setState: setStateById.bind(null, id),
      state: _state,
      hide: hide.bind(null, id),
      show: show.bind(null, id),
      dispose: dispose.bind(null, id),
      current: null,
      safe: cb => {
        if (!cb) return;
        if (innerInstance) {
          cb();
          return;
        }

        unsafeCallQueue.push(cb);
      },
    };

    // 实例被设置时接收通知
    Object.defineProperty(instance, 'current', {
      get() {
        return innerInstance;
      },
      set(ins) {
        innerInstance = ins;
        // 在实例可用后, 如果unsafeCallQueue存在内容, 则全部进行处理
        if (unsafeCallQueue.length) {
          unsafeCallQueue.splice(0, unsafeCallQueue.length).forEach(cb => cb());
        }
      },
    });

    ctx.list.push({
      id,
      state: _state,
      instance: instance as any,
      updateFlag: 0,
    });

    if (maxIns && ctx.list.length > maxIns) {
      ctx.list.splice(0, 1);
    }

    if (!ctx.targetIsRender) {
      ctx.targetIsRender = true;
      // 可能会在瞬间接收到多个render请求, 延迟选人target以同时处理初始化的多个render
      defer(mountDefaultTarget);
    }

    updateEvent.emit();
    changeEvent.emit();

    return instance as MixInstance;
  }

  /** 根据实例信息设置其状态 */
  function setStateByCurrent(current: ComponentItem, nState: Partial<S>, autoUpdate = true) {
    Object.assign(current.state, nState);

    current.updateFlag += 1;

    autoUpdate && updateEvent.emit();
  }

  /** 设置指定id的实例状态 */
  function setStateById(id: string, nState: Partial<S>) {
    const ind = getIndexById(id);
    if (ind === -1) return;
    setStateByCurrent(ctx.list[ind], nState);
  }

  /** 获取指定id的实例 */
  function getItemById(id: string) {
    return ctx.list.find(item => item.id === id);
  }

  /** 获取指定id实例所在的索引位置 */
  function getIndexById(id: string) {
    return ctx.list.findIndex(item => item.id === id);
  }

  function mountDefaultTarget() {
    const container = document.createElement('div');
    container.setAttribute('data-describe', 'this is render-api default target');
    document.body.appendChild(container);
    ReactDom.render(<RenderBoxTarget />, container);
  }

  /** 挂载点 */
  function RenderBoxTarget() {
    useMemo(() => (ctx.targetIsRender = true), []);

    const [, update] = useState(0);

    updateEvent.useEvent(() => {
      update(p => p + 1);
    });

    function renderList() {
      return ctx.list.map(({ id, instance, state, updateFlag }) => {
        return <MemoComponent {...state} key={id} instance={instance} _updateFlag={updateFlag} />;
      });
    }

    const node = Wrap ? <Wrap>{renderList()}</Wrap> : renderList();

    return ReactDom.createPortal(node, getPortalsNode(namespace));
  }

  return {
    RenderBoxTarget,
    render,
    hideAll: () => setAllOpen(false),
    showAll: () => setAllOpen(true),
    disposeAll,
    getInstances: () => ctx.list.map(item => item.instance as MixInstance),
    events: ctx.event,
    setDefaultState: state => (ctx.defaultState = state),
    getDefaultState: () => ctx.defaultState,
    setMaxInstance: max => (ctx.maxInstance = max),
    getMaxInstance: () => ctx.maxInstance,
  };
}

export default create;
