import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import create, { RenderApiComponentBaseProps } from '@m78/render-api';

import sty from './my-modal.module.css';

/* 组件接收状态，同时也是api调用时的参数 */
interface MyModalState {
  /** 弹窗标题 */
  title: string;
  /** 弹窗内容 */
  content: React.ReactNode;
}

/* 实现api组件, api会向其传入RenderApiComponentBaseProps格式的prop */
const MyModal = ({ state, instance }: RenderApiComponentBaseProps<MyModalState>) => {
  const { open, title, content } = state;

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(open);
  }, [open]);

  return (
    <div className={clsx(sty.MyModal, show ? sty.Open : sty.Close)}>
      <div className={sty.Title}>
        <span>{title}</span>
        <span className={sty.CloseBtn} onClick={instance.hide}>
          close
        </span>
      </div>
      <div className={sty.Content}>{content}</div>
    </div>
  );
};

/* 使用组实现件创建api */
const MyModalApi = create<MyModalState>({
  component: MyModal,
});

export default MyModalApi;
