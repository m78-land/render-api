import React, {useEffect, useMemo} from 'react';
import MyModalApi from './my-modal-api';
import {createRandString} from "@lxjx/utils";

const Test = () => {

  useMemo(() => {
    console.time('ttt')
    const a = Array.from({ length: 200000 }).map(() => createRandString(5));
    console.timeEnd('ttt')

    return a;
  }, []);

  return (
    <div>
      <div>这是model的内容</div>
      可以放置<strong>任意</strong>内容
    </div>
  )
}

const Demo1 = () => {
  useEffect(() => {
    MyModalApi.events.change.on(() => {
      console.log(123123123);
    });
  }, []);

  function renderHandle() {
    console.time('time');
    // 每次render执行会返回一个RenderApiComponentInstance实例对象, 可以管理该实例的各种状态和行为
    MyModalApi.render({
      title: '这是modal的标题',
      content: (
        <Test />
      ),
    });
    console.timeEnd('time');
  }

  return (
    <div>
      {/* 将api的渲染上下文放到当前react渲染树中，以支持Context等api的使用 */}
      <MyModalApi.RenderBoxTarget />

      <div>
        <button onClick={renderHandle}>show modal</button>
        <button onClick={MyModalApi.disposeAll}>hide all</button>
      </div>
    </div>
  );
};

export default Demo1;
