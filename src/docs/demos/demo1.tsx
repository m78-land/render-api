import React from 'react';
import MyModalApi from './my-modal-api';

const Demo1 = () => {
  function renderHandle() {
    // 每次render执行会返回一个RenderApiComponentInstance实例对象, 可以管理该实例的各种状态和行为
    MyModalApi.render({
      title: '这是modal的标题',
      content: (
        <div>
          <div>这是model的内容</div>
          可以放置<strong>任意</strong>内容
        </div>
      ),
    });
  }

  return (
    <div>
      {/* 将api的渲染上下文放到当前react渲染树中，以支持Context等api的使用 */}
      <MyModalApi.RenderBoxTarget />

      <div>
        <button onClick={renderHandle}>show modal</button>
        <button onClick={MyModalApi.hideAll}>hide all</button>
      </div>
    </div>
  );
};

export default Demo1;
