(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{Rsk4:function(n,e,t){"use strict";t.r(e);var a=t("9og8"),o=t("WmNS"),l=t.n(o),r=t("rlch"),i="import React from 'react';\nimport MyModalApi from \"./my-modal-api\";\n\nconst Demo1 = () => {\n\n  function renderHandle() {\n    // \u6bcf\u6b21render\u6267\u884c\u4f1a\u8fd4\u56de\u4e00\u4e2aRenderApiComponentInstance\u5b9e\u4f8b\u5bf9\u8c61, \u53ef\u4ee5\u7ba1\u7406\u8be5\u5b9e\u4f8b\u7684\u5404\u79cd\u72b6\u6001\u548c\u884c\u4e3a\n    MyModalApi.render({\n      title: '\u8fd9\u662fmodal\u7684\u6807\u9898',\n      content: (\n        <div>\n          <div>\u8fd9\u662fmodel\u7684\u5185\u5bb9</div>\n          \u53ef\u4ee5\u653e\u7f6e<strong>\u4efb\u610f</strong>\u5185\u5bb9\n        </div>\n      )\n    });\n  }\n\n  return (\n    <div>\n      {/* \u5c06api\u7684\u6e32\u67d3\u4e0a\u4e0b\u6587\u653e\u5230\u5f53\u524dreact\u6e32\u67d3\u6811\u4e2d\uff0c\u4ee5\u652f\u6301Context\u7b49api\u7684\u4f7f\u7528 */}\n      <MyModalApi.RenderBoxTarget />\n\n      <div>\n        <button onClick={renderHandle}>show modal</button>\n        <button onClick={MyModalApi.hideAll}>hide all</button>\n      </div>\n    </div>\n  );\n};\n\nexport default Demo1;",s="import React, { useEffect, useState } from 'react';\nimport clsx from 'clsx';\nimport create, { RenderApiComponentBaseProps } from '@m78/render-api';\n\nimport sty from './my-modal.module.css';\n\n/* \u7ec4\u4ef6\u63a5\u6536\u72b6\u6001\uff0c\u540c\u65f6\u4e5f\u662fapi\u8c03\u7528\u65f6\u7684\u53c2\u6570 */\ninterface MyModalState {\n  /** \u5f39\u7a97\u6807\u9898 */\n  title: string;\n  /** \u5f39\u7a97\u5185\u5bb9 */\n  content: React.ReactNode;\n}\n\n/* \u5b9e\u73b0api\u7ec4\u4ef6, api\u4f1a\u5411\u5176\u4f20\u5165RenderApiComponentBaseProps\u683c\u5f0f\u7684prop */\nconst MyModal = ({ state, instance }: RenderApiComponentBaseProps<MyModalState>) => {\n  const { open, title, content } = state;\n\n  const [show, setShow] = useState(false);\n\n  useEffect(() => {\n    setShow(open);\n  }, [open]);\n\n  return (\n    <div className={clsx(sty.MyModal, show ? sty.Open : sty.Close)}>\n      <div className={sty.Title}>\n        <span>{title}</span>\n        <span className={sty.CloseBtn} onClick={instance.hide}>\n          close\n        </span>\n      </div>\n      <div className={sty.Content}>{content}</div>\n    </div>\n  );\n};\n\n/* \u4f7f\u7528\u7ec4\u5b9e\u73b0\u4ef6\u521b\u5efaapi */\nconst MyModalApi = create<MyModalState>({\n  component: MyModal,\n});\n\nexport default MyModalApi;",c=".MyModal {\n  position: fixed;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  width: 400px;\n  height: 300px;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  z-index: 1000;\n  box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);\n  transition: 0.2s;\n}\n\n.Open {\n  opacity: 1;\n  transform: translate(-50%, -50%) scale(1);\n}\n\n.Close {\n  opacity: 0;\n  transform: translate(-50%, -50%) scale(0.6);\n}\n\n.Title {\n  display: flex;\n  justify-content: space-between;\n  border-bottom: 1px solid #eee;\n  padding: 12px 16px;\n}\n\n.CloseBtn {\n  color: #25c2a0;\n  cursor: pointer;\n}\n\n.Content {\n  padding: 16px;\n}";e["default"]={"docs-demo1":{component:Object(r["dynamic"])({loader:function(){var n=Object(a["a"])(l.a.mark((function n(){return l.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,Promise.all([t.e(1),t.e(10),t.e(5)]).then(t.bind(null,"DT12"));case 2:return n.abrupt("return",n.sent["default"]);case 3:case"end":return n.stop()}}),n)})));function e(){return n.apply(this,arguments)}return e}()}),previewerProps:{sources:{_:{tsx:i},"my-modal-api.tsx":{import:"./my-modal-api",content:s},"my-modal.module.css":{import:"./my-modal.module.css",content:c}},dependencies:{react:{version:"17.0.2"},clsx:{version:"1.1.1"}},identifier:"docs-demo1"}}}},gql7:function(n,e,t){"use strict";t.r(e);var a=t("q1tI"),o=t.n(a);t("dEAq"),t("Rsk4");e["default"]=function(){return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"markdown"},o.a.createElement("p",null,o.a.createElement("code",null,"RenderApi")," \u63d0\u4f9b\u4e86\u5728\u4e3bReact\u5b9e\u4f8b\u5916\u6e32\u67d3\u7ec4\u4ef6\u7684\u65b9\u5f0f\uff0c\u4e0e ",o.a.createElement("code",null,"React Portal api")," \u76f8\u6bd4\uff0c\u6b64\u5e93\u63d0\u4f9b\u4e86\u4e00\u7cfb\u5217\u7ba1\u7406\u5df2\u6e32\u67d3\u7ec4\u4ef6\u7684\u65b9\u6cd5 \u548c\u4e00\u4e9b\u4e3b\u89c2\u7ea6\u5b9a\uff0c\u7b80\u800c\u8a00\u4e4b, \u5b83\uff1a"),o.a.createElement("ul",null,o.a.createElement("li",null,"\u901a\u8fc7\u7b80\u6d01\u7684api\u7ba1\u7406\u4f60\u7684\u5916\u90e8\u7ec4\u4ef6\u5b9e\u4f8b, \u5e76\u4e14\u4f60\u53ef\u4ee5\u8fdb\u884c\u66f4\u65b0\u5b9e\u4f8b\u72b6\u6001\u3001\u63a7\u5236\u663e\u793a\u3001\u5378\u8f7d\u7b49\u64cd\u4f5c"),o.a.createElement("li",null,"\u6e32\u67d3\u7684\u7ec4\u4ef6\u5728react\u4e0a\u4e0b\u6587\u4e2d, \u6240\u4ee5 ",o.a.createElement("code",null,"React Context api")," \u662f\u53ef\u7528\u7684"),o.a.createElement("li",null,"\u5355\u4f8b\uff0c\u4f60\u53ef\u4ee5\u521b\u5efa\u591a\u4e2aapi\u63a5\u53e3\u800c\u4e0d\u7528\u62c5\u5fc3\u5b83\u4eec\u5f7c\u6b64\u5e72\u6270")),o.a.createElement("br",null),o.a.createElement("p",null,"\ud83e\udd14 \u80fd\u7528\u6765\u505a\u4ec0\u4e48\uff1f"),o.a.createElement("ul",null,o.a.createElement("li",null,"\u6700\u5e38\u89c1\u7684\u7528\u4f8b\u662f\u7528\u6765\u6e32\u67d3Modal\u7b49\u9700\u8981\u6302\u8f7d\u5230\u8282\u70b9\u6811\u5916\u7684\u7ec4\u4ef6\uff0c\u5e76\u4e14\u5c06\u5176api\u5316\uff0c\u53ef\u4ee5\u901a\u8fc7api\u6765\u76f4\u63a5\u521b\u5efa\u5b9e\u4f8b\u5e76\u8fdb\u884c\u7ba1\u7406")),o.a.createElement("br",null),o.a.createElement("p",null,"\ud83d\udd25 \u4e00\u4e9b\u7528\u4f8b:"),o.a.createElement("p",null,"\u656c\u8bf7\u671f\u5f85...")))}},x2v5:function(n){n.exports=JSON.parse("{}")}}]);