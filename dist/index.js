import { __assign } from 'tslib';
import React, { useMemo, useState } from 'react';
import { createEvent } from '@lxjx/hooks';
import { createRandString, getPortalsNode } from '@lxjx/utils';
import ReactDom from 'react-dom';

function create(opt) {
    var Component = opt.component, defaultState = opt.defaultState, Wrap = opt.wrap, maxInstance = opt.maxInstance, _a = opt.namespace, namespace = _a === void 0 ? 'RENDER__BOX' : _a, _b = opt.controlKey, controlKey = _b === void 0 ? 'open' : _b;
    var MemoComponent = React.memo(Component, function (prev, next) { return prev._updateFlag === next._updateFlag; });
    /** 实例更新通知 */
    var updateEvent = createEvent();
    /** 实例长度变更 */
    var changeEvent = createEvent();
    /** 在内部共享的状态对象 */
    var ctx = {
        list: [],
        event: {
            update: updateEvent,
            change: changeEvent,
        },
        defaultState: defaultState,
        maxInstance: maxInstance,
        /** target是否已渲染, 未渲染时调用render会渲染默认Target */
        targetIsRender: false,
    };
    function hide(id) {
        var _a;
        var current = getItemById(id);
        if (!current)
            return;
        if (!current.state[controlKey])
            return;
        setStateByCurrent(current, (_a = {},
            _a[controlKey] = false,
            _a));
    }
    function show(id) {
        var _a;
        var current = getItemById(id);
        if (!current)
            return;
        if (current.state[controlKey])
            return;
        setStateByCurrent(current, (_a = {},
            _a[controlKey] = true,
            _a));
    }
    function dispose(id) {
        var ind = getIndexById(id);
        if (ind === -1)
            return;
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
    function setAllOpen(open) {
        ctx.list.forEach(function (item) {
            var _a;
            return setStateByCurrent(item, (_a = {},
                _a[controlKey] = open,
                _a), false);
        });
        updateEvent.emit();
    }
    /** 创建并渲染一个实例 */
    function render(state) {
        var _a;
        var id = createRandString();
        var maxIns = ctx.maxInstance;
        var _state = __assign(__assign(__assign({}, ctx.defaultState), state), (_a = {}, _a[controlKey] = true, _a));
        var innerInstance = null;
        /** 存储所有safe操作, 并在RenderApiComponentInstance.current存在时调用 */
        var unsafeCallQueue = [];
        var instance = {
            setState: setStateById.bind(null, id),
            state: _state,
            hide: hide.bind(null, id),
            show: show.bind(null, id),
            dispose: dispose.bind(null, id),
            current: null,
            safe: function (cb) {
                if (!cb)
                    return;
                if (innerInstance) {
                    cb();
                    return;
                }
                unsafeCallQueue.push(cb);
            },
        };
        // 实例被设置时接收通知
        Object.defineProperty(instance, 'current', {
            get: function () {
                return innerInstance;
            },
            set: function (ins) {
                innerInstance = ins;
                // 在实例可用后, 如果unsafeCallQueue存在内容, 则全部进行处理
                if (unsafeCallQueue.length) {
                    unsafeCallQueue.splice(0, unsafeCallQueue.length).forEach(function (cb) { return cb(); });
                }
            },
        });
        ctx.list.push({
            id: id,
            state: _state,
            instance: instance,
            updateFlag: 0,
        });
        if (maxIns && ctx.list.length > maxIns) {
            ctx.list.splice(0, 1);
        }
        updateEvent.emit();
        changeEvent.emit();
        if (!ctx.targetIsRender) {
            ctx.targetIsRender = true;
            mountDefaultTarget();
        }
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
    function mountDefaultTarget() {
        var container = document.createElement('div');
        container.setAttribute('data-describe', 'this is render-api default target');
        document.body.appendChild(container);
        ReactDom.render(React.createElement(RenderBoxTarget, null), container);
    }
    /** 挂载点 */
    function RenderBoxTarget() {
        useMemo(function () { return (ctx.targetIsRender = true); }, []);
        var _a = useState(0), update = _a[1];
        updateEvent.useEvent(function () {
            update(function (p) { return p + 1; });
        });
        function renderList() {
            return ctx.list.map(function (_a) {
                var id = _a.id, instance = _a.instance, state = _a.state, updateFlag = _a.updateFlag;
                return React.createElement(MemoComponent, __assign({}, state, { key: id, instance: instance, _updateFlag: updateFlag }));
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
        setDefaultState: function (state) { return (ctx.defaultState = state); },
        getDefaultState: function () { return ctx.defaultState; },
        setMaxInstance: function (max) { return (ctx.maxInstance = max); },
        getMaxInstance: function () { return ctx.maxInstance; },
    };
}

export default create;
