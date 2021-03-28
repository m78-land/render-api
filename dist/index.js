import { __assign } from 'tslib';
import React, { useState } from 'react';
import { createEvent } from '@lxjx/hooks';
import { createRandString, getPortalsNode } from '@lxjx/utils';
import ReactDom from 'react-dom';

function create(opt) {
    var Component = opt.component, defaultState = opt.defaultState, Wrap = opt.wrap, maxInstance = opt.maxInstance, _a = opt.namespace, namespace = _a === void 0 ? 'RENDER__BOX' : _a;
    var MemoComponent = React.memo(Component, function (prev, next) { return prev._updateFlag === next._updateFlag; });
    /** 实例更新通知 */
    var updateEvent = createEvent();
    /** 在内部共享的状态对象 */
    var ctx = {
        list: [],
        event: {
            update: updateEvent,
        },
    };
    function hide(id) {
        var current = getItemById(id);
        if (!current)
            return;
        if (!current.state.open)
            return;
        setStateByCurrent(current, {
            open: false,
        });
    }
    function show(id) {
        var current = getItemById(id);
        if (!current)
            return;
        if (current.state.open)
            return;
        setStateByCurrent(current, {
            open: true,
        });
    }
    function dispose(id) {
        var ind = getIndexById(id);
        if (ind === -1)
            return;
        ctx.list.splice(ind, 1);
        updateEvent.emit();
    }
    function disposeAll() {
        ctx.list = [];
        updateEvent.emit();
    }
    /** 设置所有实例的开启或关闭状态 */
    function setAllOpen(open) {
        ctx.list.forEach(function (item) {
            return setStateByCurrent(item, {
                open: open,
            }, false);
        });
        updateEvent.emit();
    }
    /** 创建并渲染一个实例 */
    function render(state) {
        var id = createRandString();
        var _state = __assign(__assign(__assign({}, defaultState), state), { open: true });
        var instance = {
            setState: setStateById.bind(null, id),
            state: _state,
            hide: hide.bind(null, id),
            show: show.bind(null, id),
            dispose: dispose.bind(null, id),
            current: null,
        };
        ctx.list.push({
            id: id,
            state: _state,
            instance: instance,
            updateFlag: 0,
        });
        if (maxInstance && ctx.list.length > maxInstance) {
            ctx.list.splice(0, 1);
        }
        updateEvent.emit();
        return instance;
    }
    /** 根据实例信息设置其状态 */
    function setStateByCurrent(current, nState, autoUpdate) {
        if (autoUpdate === void 0) { autoUpdate = true; }
        Object.assign(current.state, nState);
        current.updateFlag += 1;
        autoUpdate && updateEvent.emit();
    }
    /** 设置指定id的实例状态 */
    function setStateById(id, nState) {
        var ind = getIndexById(id);
        if (ind === -1)
            return;
        setStateByCurrent(ctx.list[ind], nState);
    }
    /** 获取指定id的实例 */
    function getItemById(id) {
        return ctx.list.find(function (item) { return item.id === id; });
    }
    /** 获取指定id实例所在的索引位置 */
    function getIndexById(id) {
        return ctx.list.findIndex(function (item) { return item.id === id; });
    }
    /** 挂载点 */
    function RenderBoxTarget() {
        var _a = useState(0), update = _a[1];
        updateEvent.useEvent(function () {
            update(function (p) { return p + 1; });
        });
        function renderList() {
            return ctx.list.map(function (_a) {
                var id = _a.id, instance = _a.instance, state = _a.state, updateFlag = _a.updateFlag;
                return (React.createElement(MemoComponent, { key: id, instance: instance, state: state, _updateFlag: updateFlag }));
            });
        }
        var node = Wrap ? React.createElement(Wrap, null, renderList()) : renderList();
        return ReactDom.createPortal(node, getPortalsNode(namespace));
    }
    return {
        RenderBoxTarget: RenderBoxTarget,
        render: render,
        hideAll: function () { return setAllOpen(false); },
        showAll: function () { return setAllOpen(true); },
        disposeAll: disposeAll,
        getInstances: function () { return ctx.list.map(function (item) { return item.instance; }); },
        events: ctx.event,
    };
}

export default create;
