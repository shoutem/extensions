!function(e){function t(t){for(var r,u,l=t[0],s=t[1],i=t[2],f=0,d=[];f<l.length;f++)u=l[f],Object.prototype.hasOwnProperty.call(a,u)&&a[u]&&d.push(a[u][0]),a[u]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(e[r]=s[r]);for(c&&c(t);d.length;)d.shift()();return o.push.apply(o,i||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],r=!0,l=1;l<n.length;l++){var s=n[l];0!==a[s]&&(r=!1)}r&&(o.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},a={0:0},o=[];function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="";var l=window.webpackJsonp=window.webpackJsonp||[],s=l.push.bind(l);l.push=t,l=l.slice();for(var i=0;i<l.length;i++)t(l[i]);var c=s;o.push([646,1]),n()}({1214:function(e,t){},126:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return e?"".concat(a.default.name,".").concat(e):a.default.name};var a=r(n(1410))},1405:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"SettingsPage",{enumerable:!0,get:function(){return r.SettingsPage}});var r=n(1406)},1406:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"SettingsPage",{enumerable:!0,get:function(){return a.default}});var a=r(n(1407))},1407:function(e,t,n){"use strict";var r=n(3),a=n(14);Object.defineProperty(t,"__esModule",{value:!0}),t.default=v;var o=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=a(e)&&"function"!=typeof e)return{default:e};var n=b(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var l=o?Object.getOwnPropertyDescriptor(e,u):null;l&&(l.get||l.set)?Object.defineProperty(r,u,l):r[u]=e[u]}return r.default=e,n&&n.set(e,r),r}(n(1)),u=n(127),l=r(n(302)),s=r(n(36)),i=r(n(0)),c=n(129),f=n(83),d=n(25),p=n(635),j=r(n(1422));function b(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(b=function(e){return e?n:t})(e)}function v(e){var t=e.extensionName,n=(0,u.useDispatch)(),r=(0,u.useSelector)(p.getApp),a=(0,u.useSelector)((function(e){return(0,f.getExtension)(e,t)})),i=s.default.get(a,"app");(0,o.useEffect)((function(){n((0,p.loadApp)(t,i))}),[t,i,n]);var b=(0,o.useCallback)((function(e){return n((0,p.updateApp)(t,i,e))}),[t,i,n]);return o.default.createElement("div",{className:"settings-page"},o.default.createElement("h3",null,l.default.t(j.default.CONFIGURATION)),o.default.createElement(c.LoaderContainer,{isLoading:!(0,d.isInitialized)(r)},o.default.createElement(p.AppForm,{app:r,onSubmit:b})))}n(1423),v.propTypes={extensionName:i.default.string.isRequired}},1408:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getApp",{enumerable:!0,get:function(){return o.getApp}}),Object.defineProperty(t,"loadApp",{enumerable:!0,get:function(){return r.loadApp}}),Object.defineProperty(t,"reducer",{enumerable:!0,get:function(){return a.reducer}}),Object.defineProperty(t,"updateApp",{enumerable:!0,get:function(){return r.updateApp}});var r=n(1409),a=n(1411),o=n(1412)},1409:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),t.loadApp=function(e,t){return function(n,r){var a=r(),c=(0,l.getExtension)(a,e),f=o.default.get(c,"settings.services.self.cloud"),d={schema:i.APPS,request:{endpoint:"".concat(f,"/v1/apps/").concat(t),headers:{Accept:"application/vnd.api+json"}}};return n((0,s.find)(d,(0,u.default)("app")))}},t.updateApp=function(e,t,n){return function(r,a){var c=a(),d=(0,l.getExtension)(c,e),p=o.default.get(d,"settings.services.self.cloud"),j={schema:i.APPS,request:{endpoint:"".concat(p,"/v1/apps/").concat(t),headers:{Accept:"application/vnd.api+json","Content-Type":"application/vnd.api+json"}}},b={type:i.APPS,attributes:f({},n)};return r((0,s.update)(j,b,(0,u.default)("app")))}};var a=r(n(18)),o=r(n(36)),u=r(n(126)),l=n(83),s=n(25),i=n(196);function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){(0,a.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}},1410:function(e){e.exports=JSON.parse('{"name":"shoutem.google-analytics","version":"3.0.1-beta.2","description":"Google analytics","scripts":{"lint":"eslint --no-eslintrc -c .eslintrc src/**/*.{js,jsx}","clean":"rimraf ./build/*","build":"npm run clean && cross-env NODE_ENV=production webpack --config ./bin/webpack/webpack.config.js","dev":"webpack-dev-server --config ./bin/webpack/webpack.config.js"},"devDependencies":{"@babel/core":"7.23.7","@babel/plugin-proposal-class-properties":"7.18.6","@babel/plugin-transform-modules-commonjs":"7.23.3","@babel/plugin-transform-runtime":"7.23.7","@babel/preset-env":"7.23.8","@babel/preset-react":"7.23.3","@shoutem/eslint-config-react":"1.0.10","babel-eslint":"10.1.0","babel-loader":"8.3.0","cross-env":"4.0.0","css-loader":"3.6.0","cssnano":"4.1.11","eslint":"6.8.0","eslint-loader":"3.0.3","eslint-plugin-babel":"5.3.0","eslint-plugin-import":"2.24.2","eslint-plugin-jsx-a11y":"6.8.0","eslint-plugin-prettier":"3.1.3","eslint-plugin-react":"7.21.5","eslint-plugin-react-hooks":"4.2.0","eslint-plugin-simple-import-sort":"7.0.0","file-loader":"6.2.0","html-webpack-plugin":"4.5.2","mini-css-extract-plugin":"0.12.0","optimize-css-assets-webpack-plugin":"5.0.8","path":"0.12.7","postcss-loader":"3.0.0","prettier":"1.19.1","rimraf":"3.0.2","sass":"1.70.0","sass-loader":"10.5.2","style-loader":"1.3.0","terser-webpack-plugin":"2.3.8","url-loader":"3.0.0","webpack":"4.47.0","webpack-cli":"3.3.12","webpack-dev-server":"3.11.3"},"dependencies":{"@shoutem/extension-sandbox":"0.1.4","@shoutem/react-web-ui":"1.0.2","@shoutem/redux-api-sdk":"2.0.0","@shoutem/redux-composers":"0.1.6","@shoutem/redux-io":"3.2.0","@shoutem/redux-sync-state-engine":"0.0.2","es6-promise":"4.1.1","fetch-everywhere":"1.0.5","i18next":"19.7.0","lodash":"4.17.4","prop-types":"15.7.2","react":"16.12.0","react-dom":"16.12.0","react-redux":"7.2.4","redux":"3.6.0","redux-thunk":"2.2.0","urijs":"1.19.2"},"babel":{"presets":["@babel/preset-env","@babel/preset-react"],"plugins":["@babel/plugin-transform-runtime","@babel/plugin-proposal-class-properties","@babel/plugin-transform-modules-commonjs"]}}')},1411:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),t.reducer=void 0;var a=r(n(18)),o=n(97),u=n(25),l=r(n(126)),s=n(196);t.reducer=(0,o.combineReducers)((0,a.default)((0,a.default)({},s.APPS,(0,u.storage)(s.APPS)),"app",(0,u.one)(s.APPS,(0,l.default)("app"))))},1412:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),t.getApp=function(e){var t=function(e){return e[(0,o.default)()][u.moduleName]}(e);return(0,a.getOne)(t.app,e)};var a=n(25),o=r(n(126)),u=n(196)},1413:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"AppForm",{enumerable:!0,get:function(){return r.AppForm}});var r=n(1414)},1414:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"AppForm",{enumerable:!0,get:function(){return a.default}});var a=r(n(1415))},1415:function(e,t,n){"use strict";var r=n(3),a=n(14);Object.defineProperty(t,"__esModule",{value:!0}),t.default=v;var o=r(n(257)),u=r(n(258)),l=r(n(1416)),s=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=a(e)&&"function"!=typeof e)return{default:e};var n=b(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var l=o?Object.getOwnPropertyDescriptor(e,u):null;l&&(l.get||l.set)?Object.defineProperty(r,u,l):r[u]=e[u]}return r.default=e,n&&n.set(e,r),r}(n(1)),i=n(20),c=r(n(302)),f=r(n(36)),d=r(n(0)),p=n(129),j=r(n(1420));function b(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(b=function(e){return e?n:t})(e)}function v(e){var t=e.app,n=e.onSubmit,r=(null==t?void 0:t.propertyId)||"",a=(null==t?void 0:t.serviceAccountKeyJson)||"",d=(0,s.useState)(r),b=(0,l.default)(d,2),v=b[0],g=b[1],y=(0,s.useState)(null),m=(0,l.default)(y,2),O=m[0],h=m[1],P=(0,s.useState)(a),_=(0,l.default)(P,2),k=_[0],w=_[1],E=(0,s.useState)(null),S=(0,l.default)(E,2),M=S[0],x=S[1],A=(0,s.useState)(!1),D=(0,l.default)(A,2),R=D[0],C=D[1],N=(0,s.useState)(null),z=(0,l.default)(N,2),I=z[0],W=z[1],L=(0,s.useCallback)((function(e){var t;g(null==e||null===(t=e.target)||void 0===t?void 0:t.value),h(null),W(null)}),[]),T=(0,s.useCallback)((function(e){var t;w(null==e||null===(t=e.target)||void 0===t?void 0:t.value),x(null),W(null)}),[]),F=(0,s.useCallback)((0,u.default)(o.default.mark((function e(){return o.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(W(null),!f.default.isEmpty(v)){e.next=4;break}return h(c.default.t(j.default.REQUIRED_FIELD_MESSAGE)),e.abrupt("return");case 4:if(!f.default.isEmpty(k)){e.next=7;break}return x(c.default.t(j.default.REQUIRED_FIELD_MESSAGE)),e.abrupt("return");case 7:if(C(!0),!f.default.isFunction(n)){e.next=18;break}return e.prev=9,e.next=12,n({propertyId:v,serviceAccountKeyJson:k});case 12:e.next=18;break;case 14:e.prev=14,e.t0=e.catch(9),console.log(e.t0),W(c.default.t(j.default.ERROR_MESSAGE));case 18:C(!1);case 19:case"end":return e.stop()}}),e,null,[[9,14]])}))),[v,k,n]),U=(0,s.useCallback)((function(){return v!==r||k!==a}),[v,k,r,a])(),B=O||M;return s.default.createElement("div",{className:"app-form"},s.default.createElement(p.FormInput,{elementId:"propertyId",name:c.default.t(j.default.PROPERTY_ID),value:v,error:O,debounceTimeout:0,onChange:L}),s.default.createElement(i.FormGroup,{controlId:"serviceAccountKeyJson",validationState:M?"error":"success"},s.default.createElement(i.ControlLabel,null,c.default.t(j.default.SERVICE_ACCOUNT_KEY_JSON)),s.default.createElement("textarea",{className:"form-control",cols:"4",type:"text",value:k,onChange:T}),!!M&&s.default.createElement(i.HelpBlock,null,M)),I&&s.default.createElement(i.FormGroup,{validationState:"error"},s.default.createElement(i.HelpBlock,null,I)),s.default.createElement("div",{className:"footer"},s.default.createElement(i.Button,{bsStyle:"primary",bsSize:"large",disabled:!U||B,type:"submit",onClick:F},s.default.createElement(p.LoaderContainer,{isLoading:R},c.default.t(j.default.SAVE)))))}n(1421),v.propTypes={app:d.default.object.isRequired,onSubmit:d.default.func.isRequired}},1420:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r="app-form",a="".concat(r,".property-id"),o="".concat(r,".service-account-key-json"),u="".concat(r,".required-field-message"),l="".concat(r,".save"),s="".concat(r,".error-message");t.default={PROPERTY_ID:a,SERVICE_ACCOUNT_KEY_JSON:o,REQUIRED_FIELD_MESSAGE:u,SAVE:l,ERROR_MESSAGE:s}},1421:function(e,t,n){},1422:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r="".concat("settings-page",".configuration");t.default={CONFIGURATION:r}},1423:function(e,t,n){},1424:function(e,t,n){"use strict";var r=n(3),a=n(14);Object.defineProperty(t,"__esModule",{value:!0}),t.reducer=void 0;var o=r(n(18)),u=n(83),l=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=a(e)&&"function"!=typeof e)return{default:e};var n=s(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var l=o?Object.getOwnPropertyDescriptor(e,u):null;l&&(l.get||l.set)?Object.defineProperty(r,u,l):r[u]=e[u]}return r.default=e,n&&n.set(e,r),r}(n(635));function s(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(s=function(e){return e?n:t})(e)}t.reducer=function(){return(0,u.createScopedReducer)({extension:(0,o.default)({},l.moduleName,l.default)})}},1425:function(e,t,n){"use strict";var r=n(3),a=n(14);Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var r=[s.default,l.apiMiddleware,i.apiStateMiddleware,(0,c.syncStateEngineMiddleware)(n)],a=(0,u.compose)(u.applyMiddleware.apply(void 0,r)),p=e.ownExtensionName,j=o.default.get(f,"reducer"),b=(0,i.enableRio)((0,d.createRootReducer)(p,j)),v=(0,c.enableStateSync)(b,n);return a(u.createStore)(v,t)};var o=r(n(36)),u=n(97),l=n(118),s=r(n(1426)),i=n(25),c=n(630),f=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=a(e)&&"function"!=typeof e)return{default:e};var n=p(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var l=o?Object.getOwnPropertyDescriptor(e,u):null;l&&(l.get||l.set)?Object.defineProperty(r,u,l):r[u]=e[u]}return r.default=e,n&&n.set(e,r),r}(n(634)),d=n(1427);function p(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(p=function(e){return e?n:t})(e)}n(636)},1427:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),t.createRootReducer=function(e,t){return(0,o.combineReducers)((0,a.default)({core:u.reducer},e,t))};var a=r(n(18)),o=n(97),u=n(83)},1428:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"LocalizationProvider",{enumerable:!0,get:function(){return a.default}});var a=r(n(1429))},1429:function(e,t,n){"use strict";var r=n(3),a=n(14);Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.LocalizationProvider=void 0;var o=r(n(257)),u=r(n(258)),l=r(n(18)),s=r(n(8)),i=r(n(9)),c=r(n(12)),f=r(n(13)),d=r(n(6)),p=r(n(11)),j=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=a(e)&&"function"!=typeof e)return{default:e};var n=h(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var l=o?Object.getOwnPropertyDescriptor(e,u):null;l&&(l.get||l.set)?Object.defineProperty(r,u,l):r[u]=e[u]}return r.default=e,n&&n.set(e,r),r}(n(1)),b=n(127),v=r(n(302)),g=r(n(36)),y=r(n(0)),m=n(129),O=r(n(1430));function h(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(h=function(e){return e?n:t})(e)}function P(e,t,n){return t=(0,f.default)(t),(0,c.default)(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],(0,f.default)(e).constructor):t.apply(e,n))}var _=t.LocalizationProvider=function(e){function t(e){var n;return(0,s.default)(this,t),(n=P(this,t,[e])).handleInjection=n.handleInjection.bind((0,d.default)(n)),n.state={inProgress:!0},n}var n;return(0,p.default)(t,e),(0,i.default)(t,[{key:"componentDidMount",value:function(){var e=this.props,t=e.ownExtensionName,n=e.locale,r=e.translationUrl,a=g.default.get(O.default,t);v.default.init({lng:"en",fallbackLng:"en",ns:[t],defaultNS:t,nsSeparator:!1,keySeparator:!1,resources:{en:(0,l.default)({},t,a)}}),this.handleInjection(n,r)}},{key:"componentWillReceiveProps",value:function(e){var t=e.locale,n=e.translationUrl,r=this.props,a=r.locale;r.translationUrl===n&&t===a||this.handleInjection(t,n)}},{key:"handleInjection",value:(n=(0,u.default)(o.default.mark((function e(t,n){var r,a,u,l;return o.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=this.props.ownExtensionName,!n){e.next=19;break}return e.prev=2,e.next=5,fetch(n);case 5:return a=e.sent,e.next=8,a.json();case 8:if(u=e.sent,!(l=g.default.get(u,r))){e.next=15;break}return e.next=13,v.default.addResourceBundle(t,r,l);case 13:return e.next=15,v.default.changeLanguage(t);case 15:e.next=19;break;case 17:e.prev=17,e.t0=e.catch(2);case 19:this.setState({inProgress:!1});case 20:case"end":return e.stop()}}),e,this,[[2,17]])}))),function(e,t){return n.apply(this,arguments)})},{key:"render",value:function(){var e=this.props.children;return this.state.inProgress?j.default.createElement(m.LoaderContainer,{size:"50px",isLoading:!0}):e}}]),t}(j.Component);_.propTypes={children:y.default.node,ownExtensionName:y.default.string,locale:y.default.string,translationUrl:y.default.string};t.default=(0,b.connect)((function(e,t){var n=t.context;return{ownExtensionName:g.default.get(n,"ownExtensionName"),locale:g.default.get(n,"i18n.locale"),translationUrl:g.default.get(n,"i18n.translationUrl")}}))(_)},1430:function(e){e.exports=JSON.parse('{"shoutem":{"google-analytics":{"app-form.property-id":"Property ID","app-form.service-account-key-json":"Service account key (.json)","app-form.required-field-message":"Required field","app-form.save":"Save","app-form.error-message":"Something went wrong, please try again","settings-page.configuration":"Configuration"}}}')},1431:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"Page",{enumerable:!0,get:function(){return o.default}}),Object.defineProperty(t,"PageProvider",{enumerable:!0,get:function(){return u.default}}),Object.defineProperty(t,"connectPage",{enumerable:!0,get:function(){return a.default}});var a=r(n(1432)),o=r(n(1433)),u=r(n(1434))},1432:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),t.connectPageContext=c,t.default=function(){return function(e){return c((0,u.connect)(f)(e))}};var a=r(n(17)),o=r(n(1)),u=n(127),l=r(n(36)),s=r(n(0)),i=n(83);function c(e){function t(t,n){var r=n.page,u=l.default.pick(r.getPageContext(),["appId","appOwnerId","extensionName","ownExtensionName","shortcutId","screenId"]),s=r.getParameters();return o.default.createElement(e,(0,a.default)({},u,{parameters:s}))}return t.contextTypes={page:s.default.object},t}function f(e,t){var n=t.shortcutId,r=t.extensionName,a=t.ownExtensionName;return{shortcut:(0,i.getShortcut)(e,n),extension:(0,i.getExtension)(e,r),ownExtension:(0,i.getExtension)(e,a)}}},1433:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=r(n(18)),o=r(n(8)),u=r(n(9)),l=r(n(126));function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}t.default=function(){function e(t,n){(0,o.default)(this,e),this.pageContext=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){(0,a.default)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({ownExtensionName:(0,l.default)()},t),this.parameters=n}return(0,u.default)(e,[{key:"getPageContext",value:function(){return this.pageContext}},{key:"getParameters",value:function(){return this.parameters}}]),e}()},1434:function(e,t,n){"use strict";var r=n(3),a=n(14);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=r(n(8)),u=r(n(9)),l=r(n(12)),s=r(n(13)),i=r(n(11)),c=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=a(e)&&"function"!=typeof e)return{default:e};var n=d(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var l=o?Object.getOwnPropertyDescriptor(e,u):null;l&&(l.get||l.set)?Object.defineProperty(r,u,l):r[u]=e[u]}return r.default=e,n&&n.set(e,r),r}(n(1)),f=r(n(0));function d(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(d=function(e){return e?n:t})(e)}function p(e,t,n){return t=(0,s.default)(t),(0,l.default)(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],(0,s.default)(e).constructor):t.apply(e,n))}var j=t.default=function(e){function t(){return(0,o.default)(this,t),p(this,t,arguments)}return(0,i.default)(t,e),(0,u.default)(t,[{key:"getChildContext",value:function(){return{page:this.props.page}}},{key:"render",value:function(){var e=this.props.children;return c.Children.only(e)}}]),t}(c.Component);j.propTypes={page:f.default.object,children:f.default.node},j.childContextTypes={page:f.default.object}},1435:function(e,t,n){"use strict";var r=n(3);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"SyncStateEngineProvider",{enumerable:!0,get:function(){return a.default}});var a=r(n(1436))},1436:function(e,t,n){"use strict";var r=n(3),a=n(14);Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.SyncStateEngineProvider=void 0;var o=r(n(81)),u=r(n(8)),l=r(n(9)),s=r(n(12)),i=r(n(13)),c=r(n(6)),f=r(n(11)),d=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=a(e)&&"function"!=typeof e)return{default:e};var n=g(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var l=o?Object.getOwnPropertyDescriptor(e,u):null;l&&(l.get||l.set)?Object.defineProperty(r,u,l):r[u]=e[u]}return r.default=e,n&&n.set(e,r),r}(n(1)),p=n(127),j=r(n(0)),b=r(n(126)),v=r(n(633));function g(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(g=function(e){return e?n:t})(e)}function y(e,t,n){return t=(0,i.default)(t),(0,s.default)(e,function(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return function(){return!!e}()}()?Reflect.construct(t,n||[],(0,i.default)(e).constructor):t.apply(e,n))}var m=t.SyncStateEngineProvider=function(e){function t(e){var n;return(0,u.default)(this,t),(n=y(this,t,[e])).handleActions=n.handleActions.bind((0,c.default)(n)),n.handleSandboxMessage=n.handleSandboxMessage.bind((0,c.default)(n)),n.checkData=n.checkData.bind((0,c.default)(n)),n.syncStateEngine=n.props.syncStateEngine,v.default.subscribe(n.handleSandboxMessage),n.checkData(e),n}return(0,f.default)(t,e),(0,l.default)(t,[{key:"componentDidMount",value:function(){this.syncStateEngine.subscribeToActions(this.handleActions)}},{key:"componentWillReceiveProps",value:function(e){this.checkData(e,this.props)}},{key:"componentWillUnmount",value:function(){this.syncStateEngine.unsubscribeFromActions(this.handleActions)}},{key:"checkData",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.state,r=e.state,a=this.syncStateEngine.calculateDifferences(n,r,(0,b.default)());a&&v.default.sendMessage.apply(v.default,(0,o.default)(a))}},{key:"handleActions",value:function(e,t){"builder"!==_.get(t,"id")&&v.default.sendMessage.apply(v.default,(0,o.default)(e))}},{key:"handleSandboxMessage",value:function(e){var t=this.syncStateEngine.processExternalChange(e,{id:"builder"});t&&this.props.syncAction(t)}},{key:"render",value:function(){var e=this.props.children;return d.Children.only(e)}}]),t}(d.Component);m.propTypes={state:j.default.object,syncStateEngine:j.default.object,syncAction:j.default.func,children:j.default.node};t.default=(0,p.connect)((function(e){return{state:e}}),(function(e){return{syncAction:function(t){return e(t)}}}))(m)},1438:function(e,t){},196:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.moduleName=t.APPS=void 0;t.moduleName="app",t.APPS="shoutem.google-analytics.apps"},634:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pageWillMount=function(){t.reducer=(0,a.reducer)()},t.reducer=t.pages=void 0;var r=n(1405),a=n(1424);t.pages={SettingsPage:r.SettingsPage},t.reducer=null},635:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"AppForm",{enumerable:!0,get:function(){return a.AppForm}}),t.default=void 0,Object.defineProperty(t,"getApp",{enumerable:!0,get:function(){return r.getApp}}),Object.defineProperty(t,"loadApp",{enumerable:!0,get:function(){return r.loadApp}}),Object.defineProperty(t,"moduleName",{enumerable:!0,get:function(){return o.moduleName}}),Object.defineProperty(t,"updateApp",{enumerable:!0,get:function(){return r.updateApp}});var r=n(1408),a=n(1413),o=n(196);t.default=r.reducer},646:function(e,t,n){"use strict";var r=n(3),a=n(14),o=r(n(1)),u=r(n(16)),l=n(127),s=r(n(36)),i=r(n(70)),c=n(129),f=r(n(83)),d=n(25),p=n(630);n(1401),n(633);var j=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=a(e)&&"function"!=typeof e)return{default:e};var n=m(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var l=o?Object.getOwnPropertyDescriptor(e,u):null;l&&(l.get||l.set)?Object.defineProperty(r,u,l):r[u]=e[u]}return r.default=e,n&&n.set(e,r),r}(n(634)),b=r(n(1425)),v=n(1428),g=n(1431),y=n(1435);function m(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(m=function(e){return e?n:t})(e)}n(636),n(1437).polyfill();var O=new i.default(window.location.href),h=s.default.get(O.search(!0),"page",""),P=s.default.get(j,["pages",h]),_=new d.RioStateSerializer;document.addEventListener("shoutemready",(function(e){var t=_.deserialize(e.detail.config),n=t.context,r=t.parameters,a=t.state,i=new g.Page(n,r);f.default.init(n);var c=s.default.get(j,"pageWillMount");c&&c(i);var d=new p.SyncStateEngine({stateSerializer:_}),m=(0,b.default)(n,a,d);u.default.unmountComponentAtNode(document.getElementById("root")),u.default.render(o.default.createElement(l.Provider,{store:m},o.default.createElement(y.SyncStateEngineProvider,{syncStateEngine:d},o.default.createElement(v.LocalizationProvider,{context:n},o.default.createElement(g.PageProvider,{page:i},function(){if(!P)return o.default.createElement("div",null,"Page not found: ",h);var e=(0,g.connectPage)()(P);return o.default.createElement(e,null)}())))),document.getElementById("root"))}),!1),u.default.render(o.default.createElement(c.LoaderContainer,{size:"50px",isLoading:!0}),document.getElementById("root"))},840:function(e,t,n){var r={"./af":370,"./af.js":370,"./ar":371,"./ar-dz":372,"./ar-dz.js":372,"./ar-kw":373,"./ar-kw.js":373,"./ar-ly":374,"./ar-ly.js":374,"./ar-ma":375,"./ar-ma.js":375,"./ar-sa":376,"./ar-sa.js":376,"./ar-tn":377,"./ar-tn.js":377,"./ar.js":371,"./az":378,"./az.js":378,"./be":379,"./be.js":379,"./bg":380,"./bg.js":380,"./bm":381,"./bm.js":381,"./bn":382,"./bn-bd":383,"./bn-bd.js":383,"./bn.js":382,"./bo":384,"./bo.js":384,"./br":385,"./br.js":385,"./bs":386,"./bs.js":386,"./ca":387,"./ca.js":387,"./cs":388,"./cs.js":388,"./cv":389,"./cv.js":389,"./cy":390,"./cy.js":390,"./da":391,"./da.js":391,"./de":392,"./de-at":393,"./de-at.js":393,"./de-ch":394,"./de-ch.js":394,"./de.js":392,"./dv":395,"./dv.js":395,"./el":396,"./el.js":396,"./en-au":397,"./en-au.js":397,"./en-ca":398,"./en-ca.js":398,"./en-gb":399,"./en-gb.js":399,"./en-ie":400,"./en-ie.js":400,"./en-il":401,"./en-il.js":401,"./en-in":402,"./en-in.js":402,"./en-nz":403,"./en-nz.js":403,"./en-sg":404,"./en-sg.js":404,"./eo":405,"./eo.js":405,"./es":406,"./es-do":407,"./es-do.js":407,"./es-mx":408,"./es-mx.js":408,"./es-us":409,"./es-us.js":409,"./es.js":406,"./et":410,"./et.js":410,"./eu":411,"./eu.js":411,"./fa":412,"./fa.js":412,"./fi":413,"./fi.js":413,"./fil":414,"./fil.js":414,"./fo":415,"./fo.js":415,"./fr":416,"./fr-ca":417,"./fr-ca.js":417,"./fr-ch":418,"./fr-ch.js":418,"./fr.js":416,"./fy":419,"./fy.js":419,"./ga":420,"./ga.js":420,"./gd":421,"./gd.js":421,"./gl":422,"./gl.js":422,"./gom-deva":423,"./gom-deva.js":423,"./gom-latn":424,"./gom-latn.js":424,"./gu":425,"./gu.js":425,"./he":426,"./he.js":426,"./hi":427,"./hi.js":427,"./hr":428,"./hr.js":428,"./hu":429,"./hu.js":429,"./hy-am":430,"./hy-am.js":430,"./id":431,"./id.js":431,"./is":432,"./is.js":432,"./it":433,"./it-ch":434,"./it-ch.js":434,"./it.js":433,"./ja":435,"./ja.js":435,"./jv":436,"./jv.js":436,"./ka":437,"./ka.js":437,"./kk":438,"./kk.js":438,"./km":439,"./km.js":439,"./kn":440,"./kn.js":440,"./ko":441,"./ko.js":441,"./ku":442,"./ku.js":442,"./ky":443,"./ky.js":443,"./lb":444,"./lb.js":444,"./lo":445,"./lo.js":445,"./lt":446,"./lt.js":446,"./lv":447,"./lv.js":447,"./me":448,"./me.js":448,"./mi":449,"./mi.js":449,"./mk":450,"./mk.js":450,"./ml":451,"./ml.js":451,"./mn":452,"./mn.js":452,"./mr":453,"./mr.js":453,"./ms":454,"./ms-my":455,"./ms-my.js":455,"./ms.js":454,"./mt":456,"./mt.js":456,"./my":457,"./my.js":457,"./nb":458,"./nb.js":458,"./ne":459,"./ne.js":459,"./nl":460,"./nl-be":461,"./nl-be.js":461,"./nl.js":460,"./nn":462,"./nn.js":462,"./oc-lnc":463,"./oc-lnc.js":463,"./pa-in":464,"./pa-in.js":464,"./pl":465,"./pl.js":465,"./pt":466,"./pt-br":467,"./pt-br.js":467,"./pt.js":466,"./ro":468,"./ro.js":468,"./ru":469,"./ru.js":469,"./sd":470,"./sd.js":470,"./se":471,"./se.js":471,"./si":472,"./si.js":472,"./sk":473,"./sk.js":473,"./sl":474,"./sl.js":474,"./sq":475,"./sq.js":475,"./sr":476,"./sr-cyrl":477,"./sr-cyrl.js":477,"./sr.js":476,"./ss":478,"./ss.js":478,"./sv":479,"./sv.js":479,"./sw":480,"./sw.js":480,"./ta":481,"./ta.js":481,"./te":482,"./te.js":482,"./tet":483,"./tet.js":483,"./tg":484,"./tg.js":484,"./th":485,"./th.js":485,"./tk":486,"./tk.js":486,"./tl-ph":487,"./tl-ph.js":487,"./tlh":488,"./tlh.js":488,"./tr":489,"./tr.js":489,"./tzl":490,"./tzl.js":490,"./tzm":491,"./tzm-latn":492,"./tzm-latn.js":492,"./tzm.js":491,"./ug-cn":493,"./ug-cn.js":493,"./uk":494,"./uk.js":494,"./ur":495,"./ur.js":495,"./uz":496,"./uz-latn":497,"./uz-latn.js":497,"./uz.js":496,"./vi":498,"./vi.js":498,"./x-pseudo":499,"./x-pseudo.js":499,"./yo":500,"./yo.js":500,"./zh-cn":501,"./zh-cn.js":501,"./zh-hk":502,"./zh-hk.js":502,"./zh-mo":503,"./zh-mo.js":503,"./zh-tw":504,"./zh-tw.js":504};function a(e){var t=o(e);return n(t)}function o(e){if(!n.o(r,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return r[e]}a.keys=function(){return Object.keys(r)},a.resolve=o,e.exports=a,a.id=840}});