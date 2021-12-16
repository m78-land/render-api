import { __assign, __spreadArray } from 'tslib';
import React, { useMemo, useState } from 'react';
import { createEvent } from '@lxjx/hooks';
import { omit, createRandString, defer, getPortalsNode } from '@lxjx/utils';
import ReactDom from 'react-dom';

// RenderApiInstance.setOption()的有效值
var updateOptionWhiteList = ['defaultState', 'wrap', 'maxInstance'];
// RenderApiComponentProps.setState()的有效值onChange应动态从changeKey获取
var setStateWhiteList = ['onDispose', 'instanceRef'];
/**
 * 接收配置并创建一个api实例
 * - S - 组件能够接收的状态, 对应实现组件的扩展props
 * - I - 组件扩展api
 * @param opt - 创建配置
 * */
function create(opt) {
    var option = __assign({}, opt);
    // updateOptionWhiteList类的配置是可更改的, 必须在使用时实时获取
    var Component = option.component, _a = option.namespace, namespace = _a === void 0 ? 'RENDER__BOX' : _a, _b = option.showKey, showKey = _b === void 0 ? 'show' : _b, _c = option.changeKey, changeKey = _c === void 0 ? 'onChange' : _c;
    /** 对组件进行强缓存, 只允许在_updateFlag变更时更新 */
    var MemoComponent = React.memo(Component, function (prev, next) { return prev._updateFlag === next._updateFlag; });
    /** 实例长度变更 */
    var changeEvent = createEvent();
    /** 在内部共享的状态对象 */
    var ctx = {
        list: [],
        /** target是否已渲染, 未渲染时调用render会渲染默认Target */
        targetIsRender: false,
    };
    function hide(id) {
        var _a;
        var current = getItemById(id);
        if (!current)
            return;
        if (!current.state[showKey])
            return;
        setStateByCurrent(current, (_a = {},
            _a[showKey] = false,
            _a));
    }
    function show(id) {
        var _a;
        var current = getItemById(id);
        if (!current)
            return;
        if (current.state[showKey])
            return;
        setStateByCurrent(current, (_a = {},
            _a[showKey] = true,
            _a));
    }
    function dispose(id) {
        var ind = getIndexById(id);
        if (ind === -1)
            return;
        ctx.list.splice(ind, 1);
        changeEvent.emit();
    }
    function disposeAll() {
        ctx.list = [];
        changeEvent.emit();
    }
    /** 设置所有实例的开启或关闭状态 */
    function setAllShow(open) {
        ctx.list.forEach(function (item) {
            var _a;
            return setStateByCurrent(item, (_a = {},
                _a[showKey] = open,
                _a), false);
        });
        changeEvent.emit();
    }
    /** 设置指定id的实例状态, 不更新状态 */
    function setStateById(id, nState) {
        var ind = getIndexById(id);
        if (ind === -1)
            return;
        setStateByCurrent(ctx.list[ind], nState);
    }
    /**
     * 根据实例信息设置其状态并更新updateFlag, autoUpdate = true时才会触发更新
     * 这是更新组件的唯一途径
     * */
    function setStateByCurrent(current, nState, autoUpdate) {
        if (autoUpdate === void 0) { autoUpdate = true; }
        var omitKeys = __spreadArray(__spreadArray([], setStateWhiteList), [changeKey]).join(',');
        Object.assign(current.state, omit(nState, omitKeys));
        current.updateFlag += 1;
        autoUpdate && changeEvent.emit();
    }
    /** 获取指定id的实例 */
    function getItemById(id) {
        return ctx.list.find(function (item) { return item.id === id; });
    }
    /** 获取指定id实例所在的索引位置 */
    function getIndexById(id) {
        return ctx.list.findIndex(function (item) { return item.id === id; });
    }
    /** 创建并渲染一个实例 */
    function render(state) {
        var _a;
        var id = createRandString();
        var innerInstance = null;
        /** 存储所有safe操作, 并在RenderApiComponentInstance.current存在时调用 */
        var unsafeCallQueue = [];
        /** 创建组件state */
        var _state = __assign(__assign(__assign({}, option.defaultState), state), (_a = {}, _a[showKey] = true, _a[changeKey] = function (cur) {
            var _a;
            setStateById(id, (_a = {}, _a[showKey] = cur, _a));
            changeEvent.emit();
        }, 
        // RenderApiComponentBaseProps
        _a.onDispose = dispose.bind(null, id), _a.instanceRef = function (instance) {
            innerInstance = instance;
            // 在实例可用后, 如果unsafeCallQueue存在内容, 则全部进行处理
            if (innerInstance && unsafeCallQueue.length) {
                unsafeCallQueue.splice(0, unsafeCallQueue.length).forEach(function (cb) { return cb(); });
            }
        }, _a));
        var instance = {
            hide: hide.bind(null, id),
            show: show.bind(null, id),
            dispose: dispose.bind(null, id),
            state: _state,
            setState: setStateById.bind(null, id),
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
        });
        ctx.list.push({
            id: id,
            state: _state,
            instance: instance,
            updateFlag: 0,
        });
        shakeOverInstance();
        if (!ctx.targetIsRender) {
            ctx.targetIsRender = true;
            // 可能会在瞬间接收到多个render请求, 延迟渲染target以同时处理初始化的多个render
            defer(mountDefaultTarget);
        }
        changeEvent.emit();
        return instance;
    }
    // 将超出maxInstance的实例移除, 不会主动触发更新
    function shakeOverInstance() {
        if (option.maxInstance && ctx.list.length > option.maxInstance) {
            ctx.list.splice(0, ctx.list.length - option.maxInstance);
        }
    }
    var setOption = function (_opt) {
        var o = {};
        var keys = Object.keys(_opt);
        // 是否需要更新ui
        var needUpdate = false;
        keys.forEach(function (key) {
            if (updateOptionWhiteList.includes(key)) {
                o[key] = _opt[key];
            }
            if (key === 'wrap' || key === 'maxInstance') {
                needUpdate = true;
            }
        });
        Object.assign(option, o);
        if (needUpdate) {
            changeEvent.emit();
        }
    };
    function mountDefaultTarget() {
        var container = document.createElement('div');
        container.setAttribute('data-describe', 'RENDER-API DEFAULT TARGET');
        document.body.appendChild(container);
        ReactDom.render(React.createElement(RenderTarget, null), container);
    }
    /** 挂载点 */
    function RenderTarget() {
        useMemo(function () { return (ctx.targetIsRender = true); }, []);
        var _a = useState(0), update = _a[1];
        changeEvent.useEvent(function () {
            update(function (p) { return p + 1; });
        });
        function renderList() {
            return ctx.list.map(function (_a) {
                var id = _a.id, instance = _a.instance, state = _a.state, updateFlag = _a.updateFlag;
                return React.createElement(MemoComponent, __assign({}, state, { key: id, instance: instance, _updateFlag: updateFlag }));
            });
        }
        var Wrap = option.wrap;
        var node = Wrap ? React.createElement(Wrap, null, renderList()) : renderList();
        return ReactDom.createPortal(node, getPortalsNode(namespace));
    }
    return {
        RenderTarget: RenderTarget,
        render: render,
        hideAll: function () { return setAllShow(false); },
        showAll: function () { return setAllShow(true); },
        disposeAll: disposeAll,
        getInstances: function () { return ctx.list.map(function (item) { return item.instance; }); },
        events: {
            change: changeEvent,
        },
        setOption: setOption,
        getOption: function () { return (__assign({}, option)); },
    };
}

export default create;
