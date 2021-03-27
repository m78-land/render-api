(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"9kvl":function(n,e,t){"use strict";var o=t("FfOG");t.d(e,"a",(function(){return o["b"]}));t("bCY9")},F4QJ:function(n,e,t){"use strict";function o(){var n=a(t("q1tI"));return o=function(){return n},n}function r(){var n=t("dEAq");return r=function(){return n},n}function a(n){return n&&n.__esModule?n:{default:n}}function i(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,o)}return t}function s(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?i(Object(t),!0).forEach((function(e){c(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function c(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=void 0;var p=function(n,e){var t=[],a=n.match.params.uuid,i=void 0===n.location.query.wrapper,c=e[a];if(c){var p=s(s({},c.previewerProps),{},{hideActions:(c.previewerProps.hideActions||[]).concat(["EXTERNAL"])});void 0!==n.location.query.capture&&(p.motions=(p.motions||[]).slice(),p.motions.unshift("autoplay"),p.motions.every((function(n){return!n.startsWith("capture")}))&&p.motions.push("capture:[id|=root]")),t=i?[o()["default"].createElement((function(){return(0,r().useMotions)(p.motions||[],document.documentElement),o()["default"].createElement("div",{},o()["default"].createElement(c.component))}))]:[p,o()["default"].createElement(c.component)]}return t};e["default"]=p},Rsk4:function(n,e,t){"use strict";t.r(e);var o=t("9og8"),r=t("WmNS"),a=t.n(r),i=t("rlch"),s="import React from 'react';\nimport MyModalApi from './my-modal-api';\n\nconst Demo1 = () => {\n  function renderHandle() {\n    // \u6bcf\u6b21render\u6267\u884c\u4f1a\u8fd4\u56de\u4e00\u4e2aRenderApiComponentInstance\u5b9e\u4f8b\u5bf9\u8c61, \u53ef\u4ee5\u7ba1\u7406\u8be5\u5b9e\u4f8b\u7684\u5404\u79cd\u72b6\u6001\u548c\u884c\u4e3a\n    MyModalApi.render({\n      title: '\u8fd9\u662fmodal\u7684\u6807\u9898',\n      content: (\n        <div>\n          <div>\u8fd9\u662fmodel\u7684\u5185\u5bb9</div>\n          \u53ef\u4ee5\u653e\u7f6e<strong>\u4efb\u610f</strong>\u5185\u5bb9\n        </div>\n      ),\n    });\n  }\n\n  return (\n    <div>\n      {/* \u5c06api\u7684\u6e32\u67d3\u4e0a\u4e0b\u6587\u653e\u5230\u5f53\u524dreact\u6e32\u67d3\u6811\u4e2d\uff0c\u4ee5\u652f\u6301Context\u7b49api\u7684\u4f7f\u7528 */}\n      <MyModalApi.RenderBoxTarget />\n\n      <div>\n        <button onClick={renderHandle}>show modal</button>\n        <button onClick={MyModalApi.hideAll}>hide all</button>\n      </div>\n    </div>\n  );\n};\n\nexport default Demo1;",c="import React, { useEffect, useState } from 'react';\nimport clsx from 'clsx';\nimport create, { RenderApiComponentBaseProps } from '@m78/render-api';\n\nimport sty from './my-modal.module.css';\n\n/* \u7ec4\u4ef6\u63a5\u6536\u72b6\u6001\uff0c\u540c\u65f6\u4e5f\u662fapi\u8c03\u7528\u65f6\u7684\u53c2\u6570 */\ninterface MyModalState {\n  /** \u5f39\u7a97\u6807\u9898 */\n  title: string;\n  /** \u5f39\u7a97\u5185\u5bb9 */\n  content: React.ReactNode;\n}\n\n/* \u5b9e\u73b0api\u7ec4\u4ef6, api\u4f1a\u5411\u5176\u4f20\u5165RenderApiComponentBaseProps\u683c\u5f0f\u7684prop */\nconst MyModal = ({ state, instance }: RenderApiComponentBaseProps<MyModalState>) => {\n  const { open, title, content } = state;\n\n  const [show, setShow] = useState(false);\n\n  useEffect(() => {\n    setShow(open);\n  }, [open]);\n\n  return (\n    <div className={clsx(sty.MyModal, show ? sty.Open : sty.Close)}>\n      <div className={sty.Title}>\n        <span>{title}</span>\n        <span className={sty.CloseBtn} onClick={instance.hide}>\n          close\n        </span>\n      </div>\n      <div className={sty.Content}>{content}</div>\n    </div>\n  );\n};\n\n/* \u4f7f\u7528\u7ec4\u5b9e\u73b0\u4ef6\u521b\u5efaapi */\nconst MyModalApi = create<MyModalState>({\n  component: MyModal,\n});\n\nexport default MyModalApi;",p=".MyModal {\n  position: fixed;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  width: 400px;\n  height: 300px;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  z-index: 1000;\n  box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);\n  transition: 0.2s;\n}\n\n.Open {\n  opacity: 1;\n  transform: translate(-50%, -50%) scale(1);\n}\n\n.Close {\n  opacity: 0;\n  transform: translate(-50%, -50%) scale(0.6);\n}\n\n.Title {\n  display: flex;\n  justify-content: space-between;\n  border-bottom: 1px solid #eee;\n  padding: 12px 16px;\n}\n\n.CloseBtn {\n  color: #25c2a0;\n  cursor: pointer;\n}\n\n.Content {\n  padding: 16px;\n}";e["default"]={"docs-demo1":{component:Object(i["dynamic"])({loader:function(){var n=Object(o["a"])(a.a.mark((function n(){return a.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,Promise.all([t.e(1),t.e(10),t.e(5)]).then(t.bind(null,"hK5f"));case 2:return n.abrupt("return",n.sent["default"]);case 3:case"end":return n.stop()}}),n)})));function e(){return n.apply(this,arguments)}return e}()}),previewerProps:{sources:{_:{tsx:s},"my-modal-api.tsx":{import:"./my-modal-api",content:c},"my-modal.module.css":{import:"./my-modal.module.css",content:p}},dependencies:{react:{version:"17.0.2"},clsx:{version:"1.1.1"}},identifier:"docs-demo1"}}}},x2v5:function(n){n.exports=JSON.parse("{}")}}]);