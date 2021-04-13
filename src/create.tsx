import React, { useState } from 'react';
import { createEvent } from '@lxjx/hooks';
import { createRandString, getPortalsNode } from '@lxjx/utils';
import ReactDom from 'react-dom';
import {
  RenderApiComponentMixState,
  RenderApiComponentInstance,
  RenderApiInstance,
  RenderApiOption,
  ComponentItem,
} from './types';

function create<S, Extend = null>(opt: RenderApiOption<S>): RenderApiInstance<S, Extend> {
  /** 混合内部属性的State */
  type MixState = RenderApiComponentMixState<S>;
  type MixInstance = RenderApiComponentInstance<S, Extend>;

  const {
    component: Component,
    defaultState,
    wrap: Wrap,
    maxInstance,
    namespace = 'RENDER__BOX',
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
    list: [] as ComponentItem<S>[],
    event: {
      update: updateEvent,
      change: changeEvent,
    },
    defaultState,
    maxInstance,
  };

  function hide(id: string) {
    const current = getItemById(id);

    if (!current) return;
    if (!current.state.open) return;

    setStateByCurrent(current, {
      open: false,
    });
  }

  function show(id: string) {
    const current = getItemById(id);

    if (!current) return;
    if (current.state.open) return;

    setStateByCurrent(current, {
      open: true,
    });
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
          open,
        },
        false,
      ),
    );
    updateEvent.emit();
  }

  /** 创建并渲染一个实例 */
  function render(state: S) {
    const id = createRandString();

    const maxIns = ctx.maxInstance;

    const _state: MixState = {
      ...ctx.defaultState,
      ...state,
      open: true,
    };

    const instance: RenderApiComponentInstance<S> = {
      setState: setStateById.bind(null, id),
      state: _state,
      hide: hide.bind(null, id),
      show: show.bind(null, id),
      dispose: dispose.bind(null, id),
      current: null,
    };

    ctx.list.push({
      id,
      state: _state,
      instance: instance as any,
      updateFlag: 0,
    });

    if (maxIns && ctx.list.length > maxIns) {
      ctx.list.splice(0, 1);
    }

    updateEvent.emit();
    changeEvent.emit();

    return instance as MixInstance;
  }

  /** 根据实例信息设置其状态 */
  function setStateByCurrent(
    current: ComponentItem<S>,
    nState: Partial<RenderApiComponentMixState<{}>>,
    autoUpdate = true,
  ) {
    Object.assign(current.state, nState);

    current.updateFlag += 1;

    autoUpdate && updateEvent.emit();
  }

  /** 设置指定id的实例状态 */
  function setStateById(id: string, nState: Partial<RenderApiComponentMixState<{}>>) {
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

  /** 挂载点 */
  function RenderBoxTarget() {
    const [, update] = useState(0);

    updateEvent.useEvent(() => {
      update(p => p + 1);
    });

    function renderList() {
      return ctx.list.map(({ id, instance, state, updateFlag }) => {
        return (
          <MemoComponent key={id} instance={instance} state={state} _updateFlag={updateFlag} />
        );
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
