"use strict";(self.webpackChunkcircle=self.webpackChunkcircle||[]).push([[610],{8967:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(2791),a=t(1091),i="index_close__A4OxI",o=t(184),c=function(){return(0,o.jsx)("span",{className:i,children:(0,o.jsx)(a.Z,{name:"xmark",color:"#C7C7C7",size:"18px"})})},s=(0,r.memo)(c)},2711:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),a="index_number__Kwgx1",i=t(2791),o=t(184),c=function(e){var n=e.number,t=e.style,i=void 0===t?{}:t;return(0,o.jsx)("span",{className:a,style:(0,r.Z)({},i),children:n<100?n:"99+"})},s=(0,i.memo)(c)},5610:function(e,n,t){t.r(n),t.d(n,{default:function(){return Ze}});var r=t(4942),a=t(1413),i=t(2791),o=t(586),c=t(3433),s="index_menuNav__hBJHo",l="index_bgHover__VAdNy",u="index_square__PiGPd",d="index_createServer__CXsbN",f="index_selected__+ZlN4",v="index_squareIcon__o9NeA",h="index_basis__i3KLG",m="index_avatarInfo__blxUV",p="index_divider__XVUXZ",x="index_contacts__0bGpg",g="index_contactsBg__9+OCU",I="index_number__vewB+",Z="index_servers__NUyD3",_="index_serversList__C9Ymx",j="index_plus__KYnQe",C="index_more__UWPoU",y="index_squareCon__EgfQ2",b=t(8687),S=t(2718),N=t(7411),E=t(6871),k=t(1091),w=t(7196),P=t(2711),F=t(8406),U=t(4771),T=t(184),R=(0,i.memo)((0,b.$j)((function(e){var n=e.app,t=e.server,r=e.contact,a=e.thread;return{loginSuccess:n.loginSuccess,userInfo:n.userInfo,appUserInfo:n.appUserInfo,serverRole:n.serverRole,chatMap:n.chatMap,conversationData:r.conversationList,joinedServerInfo:t.joinedServerInfo,serverMultiDeviceEvent:t.serverMultiDeviceEvent,deleteThreadEvent:a.deleteThreadEvent,channelEvent:t.channelEvent,applyNum:r.applyInfo.length,serverUserMap:t.serverUserMap,selected:n.selectedTab}}),(function(e){return{setJoinedServerInfo:function(n){return e({type:"server/setJoinedServerInfo",payload:n})},setServerFormVisible:function(n){return e({type:"app/setVisible",payload:n})},setServerRole:function(n){return e({type:"app/setServerRole",payload:n})},setCurrentChatInfo:function(n){return e({type:"app/setCurrentChatInfo",payload:n})},setUnReadNumber:function(n){return e({type:"app/setUnReadNumber",payload:n})},handleThreadPanel:function(n){return e({type:"thread/setThreadPanelStatus",payload:n})},setThreadInfo:function(n){return e({type:"thread/setThreadInfo",payload:n})},setServerUserMap:function(n){return e({type:"server/setServerUserMap",payload:n})},setSelected:function(n){return e({type:"app/setSelectedTab",payload:n})}}}))((function(e){var n,t,r=e.userInfo,o=e.setServerFormVisible,b=e.serverRole,R=e.setServerRole,M=e.setCurrentChatInfo,L=e.setUnReadNumber,z=e.chatMap,O=e.conversationData,V=e.joinedServerInfo,A=e.setJoinedServerInfo,D=e.serverMultiDeviceEvent,J=e.deleteThreadEvent,q=e.handleThreadPanel,B=e.setThreadInfo,W=e.channelEvent,H=e.applyNum,G=e.serverUserMap,Y=e.setServerUserMap,$=e.selected,K=e.setSelected,X=e.appUserInfo,Q="serverScrollWrapId",ee=(0,E.TH)(),ne=(0,E.UO)(),te=ne.serverId,re=ne.channelId,ae=ne.userId,ie=ne.threadId,oe=function(e){var n=e.cursor,t=void 0===n?"":n;N.Z.conn.getJoinedServers({pageSize:20,cursor:t}).then((function(e){var n,t=e.data,r=t.list,a=t.cursor;if(""===a&&r.length>0&&te){var i=r[0],o=i.id,s=i.defaultChannelId;ce("/main/channel/".concat(o,"/").concat(s))}var l=[];if(null!==V&&void 0!==V&&null!==(n=V.list)&&void 0!==n&&n.length){var u=(0,F.cm)(V.list,r,"id");l=[].concat((0,c.Z)(null===V||void 0===V?void 0:V.list),(0,c.Z)(u))}else l=r;if(A({list:l,cursor:a,loadCount:r.length}),!a&&e.data.list.length>0&&te){var d=e.data.list[0],f=d.id,v=d.defaultChannelId;ce("/main/channel/".concat(f,"/").concat(v))}}))};(0,i.useEffect)((function(){te&&!b[te]&&N.Z.conn.getServerRole({serverId:te}).then((function(e){R({serverId:te,role:e.data.role})})),te&&K(te)}),[te]),(0,i.useEffect)((function(){if(re)M({chatType:w.zi.groupChat,id:re}),L({chatType:w.zi.groupChat,fromId:re,number:0});else if(ae){M({chatType:w.zi.single,id:ae});var e=(0,F.bD)({chatType:w.zi.single,type:"channel",to:ae});(0,F.j5)(e).then((function(){L({chatType:w.zi.single,fromId:ae,number:0})}))}else M({chatType:void 0,id:void 0})}),[re,ae]),(0,i.useEffect)((function(){oe({cursor:""})}),[]),(0,i.useEffect)((function(){var e;e=ee.pathname,te?K(te):e.indexOf("/main/user")>-1?K("userInfo"):e.indexOf("/main/server")>-1?K("serverSquare"):K("contacts")}),[ee]);var ce=(0,E.s0)(),se=function(){var e=0,n=z[w.zi.single];return O.forEach((function(t){var r;null!==(r=n.get(t))&&void 0!==r&&r.unReadNum&&n.get(t).unReadNum>0&&(e+=n.get(t).unReadNum)})),e+=H},le=(0,i.useMemo)((function(){return G.get(te)||{}}),[te,G]);(0,i.useEffect)((function(){!function(){switch(D.event){case w.JE.serverCreate:N.Z.conn.getServerDetail({serverId:D.data.serverId}).then((function(e){(0,F.fY)(e.data)}));break;case w.JE.serverDestroy:de(D);break;case w.JE.serverRemoved:D.data.userId===N.Z.conn.user?de(D):fe(D);break;case w.JE.serverJoin:N.Z.conn.getServerDetail({serverId:D.data.serverId}).then((function(e){(0,F.fY)(e.data)}));break;case w.JE.serverLeave:de(D);break;case w.JE.serverRemoveMember:fe(D)}}()}),[D]);var ue=function(e){var n=e.data,t=n.serverInfo,r=void 0===t?{}:t,a=n.id,i=void 0===a?"":a;if(r.id===te&&i===re){var o=V.list||[],c=o.findIndex((function(e){return e.id===te}));if(c>-1){var s=o[c].defaultChannelId;ce("/main/channel/".concat(te,"/").concat(s))}}},de=function(e){(0,F.Af)(e.data.serverId).then((function(n){if(te===e.data.serverId)if(n.length>0){var t=n[0],r=t.id,a=t.defaultChannelId;ce("/main/channel/".concat(r,"/").concat(a))}else ce("/main/contacts/index")}))},fe=function(e){var n,t=null===le||void 0===le||null===(n=le.list)||void 0===n?void 0:n.filter((function(n){return n.uid!==e.data.userId}));Y({serverId:te,userListInfo:(0,a.Z)((0,a.Z)({},G.get(te)),{},{list:t})})};return(0,i.useEffect)((function(){!function(){switch(W.event){case"removed":case"destroy":ue(W)}}()}),[W]),(0,i.useEffect)((function(){J.event&&""!==J.event&&(0,F.Ns)(J.parentId,J.threadId).then((function(){ie&&ie===J.threadId&&(B({}),q(!1),ce("/main/channel/".concat(te,"/").concat(re)))}))}),[J]),(0,T.jsxs)("div",{className:s,children:[(0,T.jsxs)("div",{className:h,children:[(0,T.jsx)("div",{className:"".concat(l," ").concat(m," ").concat("userInfo"===$?f:""),onClick:function(){K("userInfo"),ce("/main/user")},children:(0,T.jsx)(S.Z,{size:48,online:X[r.username].online,src:r.avatarurl})}),(0,T.jsx)("div",{className:"".concat(l," ").concat("contacts"===$?f:""),onClick:function(){K("contacts"),ce("/main/contacts/index")},children:(0,T.jsxs)("div",{className:x,children:[(0,T.jsx)("div",{className:g}),se()>0&&(0,T.jsx)("div",{className:I,children:(0,T.jsx)(P.Z,{style:{height:"16px",border:"2px solid #181818",lineHeight:"12px"},number:se()})})]})}),(0,T.jsx)("div",{className:p})]}),(0,T.jsx)("div",{className:Z,children:(0,T.jsxs)("div",{id:Q,className:_,children:[(0,T.jsx)(U.Z,{dataLength:(null===V||void 0===V||null===(n=V.list)||void 0===n?void 0:n.length)||0,next:function(){oe({cursor:null===V||void 0===V?void 0:V.cursor})},hasMore:20===(null===V||void 0===V?void 0:V.loadCount),loader:(0,T.jsx)(T.Fragment,{}),endMessage:(0,T.jsx)(T.Fragment,{}),scrollableTarget:Q,children:null===V||void 0===V||null===(t=V.list)||void 0===t?void 0:t.map((function(e,n){return(0,T.jsx)("div",{className:"".concat(l," ").concat($===e.id?f:""),onClick:function(){K(e.id),ce("/main/channel/".concat(e.id,"/").concat(e.defaultChannelId))},children:(0,T.jsx)(S.Z,{size:48,src:e.icon,isServer:!0})},n)}))}),(0,T.jsx)("div",{className:"".concat(l," ").concat("createServer"===$?f:""),onClick:function(){o(!0)},children:(0,T.jsx)("div",{className:d,children:(0,T.jsx)(k.Z,{name:"plus",size:"24px",iconClass:j})})})]})}),(0,T.jsx)("div",{className:C,children:(0,T.jsx)("div",{className:"".concat(l," ").concat(y," ").concat("serverSquare"===$?f:""),onClick:function(){K("serverSquare"),ce("/main/server")},children:(0,T.jsx)("div",{className:u,children:(0,T.jsx)(k.Z,{name:"square_4",size:"28px",iconClass:v})})})})]})}))),M=t(9439),L={serverFormModal:"index_serverFormModal__3KsY0",serverForm:"index_serverForm__vEqSr",avatar:"index_avatar__cEuwK",cover:"index_cover__etiWr",selectAvatar:"index_selectAvatar__eJx1n",tip:"index_tip__Fuv3j",icon:"index_icon__vYOrW",tagFormItem:"index_tagFormItem__nL6Ix",tagItemWrap:"index_tagItemWrap__E8mh5",iptGroup:"index_iptGroup__xNwYw",tagItem:"index_tagItem__FkAd4",createBtn:"index_createBtn__UOXeq"},z=t(1095),O=t(3695),V=t(8678),A=t(4165),D=t(5861),J=t(9553),q=t(7309),B=t(6658),W=t(7106),H=t(1102),G=t.n(H),Y="index_confirmBtn__w+-yG",$=function(){return(0,T.jsx)("div",{className:"circleBtn ".concat(Y),children:"\u786e\u8ba4"})},K=function(e){var n=e.onChange,t=e.value,r=e.autoUpload,o=void 0===r||r,c=e.accept,s=e.amount,l=e.size,u=e.otherProps,d=e.extra,f=e.children,v=(0,i.useState)(!1),h=(0,M.Z)(v,2),m=h[0],p=h[1],x=function(e){return new Promise((function(n,r){var a,i=(null!==(a=null===t||void 0===t?void 0:t.length)&&void 0!==a?a:0)+e.length;s&&i>s?r(Error()):n()})).then((function(){return!0}),(function(){return O.ZP.error("\u8d85\u8fc7\u6700\u5927\u4e0a\u4f20\u6570\u91cf".concat(s,"\u4e2a\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\uff01")),Promise.reject(Error("\u8d85\u8fc7\u6700\u5927\u4e0a\u4f20\u6570\u91cf"))}))},g=function(e){return new Promise((function(n,t){l&&e.size>Window.Math.pow(1024,2)*l?t(Error()):n()})).then((function(){return!0}),(function(){return O.ZP.error("\u8d85\u8fc7\u5927\u5c0f\u9650\u5236".concat(l,"M\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\uff01")),Promise.reject(Error("\u8d85\u8fc7\u5927\u5c0f\u9650\u5236"))}))},I=function(e){return new Promise((function(n,t){c&&null!==e&&void 0!==e&&e.type&&-1===c.indexOf(null===e||void 0===e?void 0:e.type)?(O.ZP.error({title:"\u6587\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\uff01"}),t(Error("\u6587\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\uff01"))):n()})).then((function(){return!0}),(function(){return O.ZP.error("\u6587\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\uff01"),Promise.reject(Error("\u6587\u4ef6\u683c\u5f0f\u4e0d\u6b63\u786e\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\uff01"))}))},Z=(0,a.Z)((0,a.Z)({name:"file"},u),{},{fileList:t,accept:c,showUploadList:!1,beforeUpload:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];if(u.isCrop)return new Promise(function(){var t=(0,D.Z)((0,A.Z)().mark((function t(r){var a;return(0,A.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,I(e);case 3:return t.next=5,x(n);case 5:return t.next=7,g(e);case 7:return t.next=9,G()(e);case 9:a=t.sent,r(a.file),t.next=16;break;case 13:throw t.prev=13,t.t0=t.catch(0),Error(t.t0);case 16:case"end":return t.stop()}}),t,null,[[0,13]])})));return function(e){return t.apply(this,arguments)}}());var t=function(){var t=(0,D.Z)((0,A.Z)().mark((function t(){return(0,A.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,I(e);case 3:return t.next=5,x(n);case 5:return t.next=7,g(e);case 7:return t.abrupt("return",!0);case 10:throw t.prev=10,t.t0=t.catch(0),Error(t.t0);case 13:case"end":return t.stop()}}),t,null,[[0,10]])})));return function(){return t.apply(this,arguments)}}(),r=t().then((function(e){return e}));return!!o&&r},onChange:function(e){var t=e.file,r=e.fileList;"error"===t.status&&O.ZP.error("\u4e0a\u4f20\u51fa\u9519\uff01"),"uploading"===t.status&&p(!0),"done"===t.status&&p(!1),n&&n(null===r||void 0===r?void 0:r.map((function(e){return(0,a.Z)((0,a.Z)({},e),{},{status:"done"})})))},action:"".concat(N.Z.conn.apiUrl,"/").concat(N.Z.conn.orgName,"/").concat(N.Z.conn.appName,"/chatfiles"),onPreview:function(){}});return(0,T.jsx)(T.Fragment,{children:null!==u&&void 0!==u&&u.isCrop?(0,T.jsxs)(B.Z,{modalTitle:"\u4e0a\u4f20\u5934\u50cf",modalWidth:960,modalHeight:572,modalCancel:"\u53d6\u6d88",modalOk:(0,T.jsx)($,{}),quality:1,children:[(0,T.jsx)(J.Z,(0,a.Z)((0,a.Z)({},Z),{},{children:m?(0,T.jsxs)("div",{style:{width:"100px",height:"100px",borderRadius:"50%",border:"1px solid #3a3a3a",lineHeight:"100px"},children:["\u4e0a\u4f20\u4e2d",(0,T.jsx)(W.Z,{})]}):f||(0,T.jsx)(q.Z,{type:"primary",children:"\u9009\u62e9\u6587\u4ef6"})})),d&&(0,T.jsx)("div",{style:{color:"#999"},children:d})]}):(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(J.Z,(0,a.Z)((0,a.Z)({customRequest:function(){}},Z),{},{children:f||(0,T.jsx)(q.Z,{type:"primary",children:"\u9009\u62e9\u6587\u4ef6"})})),d&&(0,T.jsx)("div",{style:{color:"#999"},children:d})]})})},X=i.memo(K),Q=t(5987),ee=["tagRef"],ne=function(e){var n=e.item,t=e.onRemove;return(0,T.jsxs)("div",{className:L.tagItem,children:[n.tagName,(0,T.jsx)(k.Z,{name:"xmark_in_circle",style:{marginLeft:"2px"},onClick:function(){t(n.tagId)}})]},n.tagId)},te=(0,b.$j)(null,(function(e){return{setTags:function(n){return e({type:"server/setCurrentServerTag",payload:n})}}}))((function(e){var n=e.tagRef,t=(0,Q.Z)(e,ee).setTags,r=(0,i.useState)([]),a=(0,M.Z)(r,2),o=a[0],s=a[1],l=(0,i.useState)(""),u=(0,M.Z)(l,2),d=u[0],f=u[1],v=(0,E.UO)();(0,i.useImperativeHandle)(n,(function(){return{setTagList:function(e){s(e)}}}));return(0,i.useEffect)((function(){N.Z.conn.getServerTags({serverId:v.serverId}).then((function(e){s(e.data.tags)}))}),[]),(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("div",{className:L.tagItemWrap,children:o.map((function(e){return(0,T.jsx)(ne,{item:e,onRemove:function(e){var n;n=e,N.Z.conn.removeServerTags({serverId:v.serverId,tagIds:[n]}).then((function(){var e=o.filter((function(e){return e.tagId!==n}));s(e),N.Z.conn.getServerTags({serverId:v.serverId}).then((function(e){t(e.data.tags)})),O.ZP.info("\u5220\u9664\u6210\u529f")}))}},e.tagId)}))}),(0,T.jsxs)(V.Z.Group,{className:L.iptGroup,children:[(0,T.jsx)(V.Z,{autoComplete:"off",showCount:{formatter:F.xe},maxLength:16,value:d,onChange:function(e){f(e.target.value)},placeholder:"\u5728\u6b64\u8f93\u5165\u793e\u533a\u6807\u7b7e"}),(0,T.jsx)(k.Z,{iconClass:L.icon,name:"add_in_circle",onClick:function(){d?o.find((function(e){return e.tagName===d}))?O.ZP.info("\u793e\u533a\u6807\u7b7e\u5df2\u5b58\u5728"):N.Z.conn.addServerTags({serverId:v.serverId,tags:[d]}).then((function(e){s([].concat((0,c.Z)(o),(0,c.Z)(e.data.tags))),f(""),N.Z.conn.getServerTags({serverId:v.serverId}).then((function(e){t(e.data.tags)})),O.ZP.info("\u6dfb\u52a0\u6210\u529f")})):O.ZP.info("\u8bf7\u8f93\u5165\u6807\u7b7e\u540d\u79f0")},size:"16px"})]})]})})),re=(0,i.memo)((0,i.forwardRef)((function(e,n){return(0,T.jsx)(te,(0,a.Z)((0,a.Z)({},e),{},{myForwardedRef:n}))}))),ae=(0,i.forwardRef)((function(e,n){var t=e.isEdit,r=void 0!==t&&t,a=e.onchange,o=(0,i.useState)(""),c=(0,M.Z)(o,2),s=c[0],l=c[1],u=z.Z.useForm(),d=(0,M.Z)(u,1)[0],f=(0,E.UO)(),v=(0,i.useRef)(),h=(0,E.s0)(),m=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};d.validateFields().then((function(){var t,a=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=a.name,o=a.description,c=a.icon,l=void 0===c?[]:c,u=l.length?null===(t=l[0])||void 0===t?void 0:t.response:{},d=u.uri,v=u.entities;i?r?N.Z.conn.updateServer({name:i,icon:d?"".concat(d,"/").concat(v[0].uuid):s,description:o,serverId:f.serverId}).then((function(n){O.ZP.success("\u7f16\u8f91\u793e\u533a\u6210\u529f"),(0,F.Ox)("edit",n.data),e()})).catch((function(){O.ZP.error("\u7f16\u8f91\u793e\u533a")})):N.Z.conn.createServer({name:i,description:o,icon:d?"".concat(d,"/").concat(v[0].uuid):s}).then((function(n){p(n.data.id),e()})).catch((function(e){n(),O.ZP.error("\u521b\u5efa\u793e\u533a\u5931\u8d25")})):O.ZP.info("\u8bf7\u8f93\u5165\u793e\u533a\u540d\u79f0!")})).catch((function(e){n()}))},p=(0,i.useCallback)((function(e){N.Z.conn.getServerDetail({serverId:e}).then((function(e){var n=e.data,t=n.name,a=n.icon,i=n.description,o=n.defaultChannelId,c=n.id,s=n.tags;r?(d.setFieldsValue({name:t,icon:[],description:i}),l(a),v.current.setTagList(s)):(0,F.fY)(e.data).then((function(){h("/main/channel/".concat(c,"/").concat(o))}))})).catch((function(e){}))}),[d,r,h]);return(0,i.useImperativeHandle)(n,(function(){return{submit:m}})),(0,i.useEffect)((function(){r&&p(f.serverId)}),[]),(0,T.jsxs)(z.Z,{ref:n,className:"".concat(L.serverForm," customForm"),form:d,layout:"vertical",onFieldsChange:function(){a();var e=d.getFieldValue("icon");if(e&&e.length>0){var n=new FileReader;n.readAsDataURL(e[0].originFileObj),n.onload=function(){l(n.result)}}},children:[(0,T.jsx)(z.Z.Item,{className:"customFormItem ".concat(L.avatarFormItem),name:"icon",children:(0,T.jsxs)(X,{otherProps:{isCrop:!0,maxCount:1},children:[(0,T.jsxs)("div",{className:L.avatar,style:s?{backgroundImage:"url(".concat(s,")"),backgroundSize:"cover",backgroundPosition:"center"}:{},children:[(0,T.jsx)("div",{className:L.cover}),(0,T.jsx)("div",{className:L.selectAvatar,children:(0,T.jsx)(k.Z,{name:"pencil",color:"#fff",size:"32px"})})]}),(0,T.jsx)("div",{className:L.tip,children:s?"\u7f16\u8f91\u793e\u533a\u5934\u50cf":"\u4e0a\u4f20\u793e\u533a\u5934\u50cf"})]})}),(0,T.jsx)(z.Z.Item,{label:r?"\u793e\u533a\u540d\u79f0":"",name:"name",children:(0,T.jsx)(V.Z,{autoComplete:"off",showCount:{formatter:F.xe},maxLength:16,placeholder:"\u793e\u533a\u540d\u79f0\uff08\u5fc5\u586b\u9879\uff09"})}),(0,T.jsx)(z.Z.Item,{label:r?"\u793e\u533a\u7b80\u4ecb":"",name:"description",children:(0,T.jsx)(V.Z.TextArea,{rows:5,placeholder:"\u793e\u533a\u7b80\u4ecb",maxLength:120,showCount:{formatter:F.xe}})}),r&&(0,T.jsx)(z.Z.Item,{label:r?"\u793e\u533a\u6807\u7b7e":"",className:L.tagFormItem,children:(0,T.jsx)(re,{tagRef:v})})]})})),ie=(0,i.memo)(ae),oe=t(5873),ce=t(8967),se=function(e){var n=e.onClick,t=e.isEdit,r=e.hasEdit;return(0,T.jsx)(q.Z,{className:"".concat(L.createBtn," circleBtn ").concat(r?null:"disable"),onClick:n,children:t?"\u4fdd\u5b58":"\u521b\u5efa"})},le=(0,i.memo)((0,b.$j)((function(e){return{visible:e.app.serverFormVisible}}),(function(e){return{setVisible:function(n){return e({type:"app/setVisible",payload:n})}}}))((function(e){var n=e.visible,t=e.setVisible,r=(0,i.useState)(!1),a=(0,M.Z)(r,2),o=a[0],c=a[1],s=n===w.nz.edit,l=(0,i.useRef)();return(0,T.jsx)(oe.Z,{width:544,title:s?"\u7f16\u8f91\u793e\u533a":"\u65b0\u5efa\u793e\u533a",visible:n,centered:!0,destroyOnClose:!0,footer:(0,T.jsx)(se,{isEdit:s,onClick:function(){o&&(null===l||void 0===l||l.current.submit((function(){t(!1)}),(function(){t(!1)})))},hasEdit:o}),closeIcon:(0,T.jsx)(ce.Z,{}),onCancel:function(){t(!1)},className:L.serverFormModal,children:(0,T.jsx)(ie,{isEdit:s,ref:l,onchange:function(){c(!0)}})})}))),ue="index_privateWrap__5N8lh",de="index_createBtn__2q3qC",fe="index_isPrivate__sIukf",ve="index_channelFormModal__PO9WQ",he=t(5581),me=(0,i.forwardRef)((function(e,n){var t=e.isEdit,r=void 0!==t&&t,o=z.Z.useForm(),c=(0,M.Z)(o,1)[0],s=(0,E.UO)(),l=s.serverId,u=s.channelId,d=(0,i.useState)(!1),f=(0,M.Z)(d,2),v=f[0],h=f[1],m=(0,E.s0)(),p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};c.validateFields().then((function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(t.name)if(t.description||delete t.description,r)N.Z.conn.updateChannel((0,a.Z)({serverId:l,channelId:u},t)).then((function(){O.ZP.success("\u7f16\u8f91\u9891\u9053\u6210\u529f"),(0,F.iR)("edit",l,(0,a.Z)((0,a.Z)({},t),{},{id:u})),e()})).catch((function(e){O.ZP.error("\u7f16\u8f91\u9891\u9053\u5931\u8d25"),n()}));else{var i=(0,a.Z)({serverId:l,isPublic:!v},t);N.Z.conn.createChannel(i).then((function(n){O.ZP.success("\u521b\u5efa\u9891\u9053\u6210\u529f"),x(l,n.data.channelId),e()})).catch((function(){O.ZP.error("\u521b\u5efa\u9891\u9053\u5931\u8d25"),n()}))}else O.ZP.info("\u8bf7\u8f93\u5165\u9891\u9053\u540d\u79f0!")})).catch((function(e){console.log(e),n()}))},x=function(e,n){N.Z.conn.getChannelDetail({serverId:e,channelId:n}).then((function(t){var a=t.data,i=a.name,o=a.description,s=a.isPublic;r?(c.setFieldsValue({name:i,description:o}),h(!s)):((0,F.MD)(e,n,t.data),m("/main/channel/".concat(e,"/").concat(n)))})).catch((function(e){}))};return(0,i.useImperativeHandle)(n,(function(){return{submit:p}})),(0,i.useEffect)((function(){r&&x(l,u)}),[]),(0,T.jsxs)(z.Z,{ref:n,className:"customForm",form:c,layout:"vertical",children:[(0,T.jsx)(z.Z.Item,{label:"\u9891\u9053\u540d\u79f0",name:"name",children:(0,T.jsx)(V.Z,{showCount:{formatter:F.xe},maxLength:16,placeholder:"\u8bf7\u8f93\u5165\u9891\u9053\u540d\u79f0",autoComplete:"off"})}),(0,T.jsx)(z.Z.Item,{label:"\u9891\u9053\u7b80\u4ecb",name:"description",children:(0,T.jsx)(V.Z.TextArea,{rows:5,placeholder:"\u8bf7\u8f93\u5165\u9891\u9053\u7b80\u4ecb",maxLength:120,showCount:{formatter:F.xe}})}),(0,T.jsx)(z.Z.Item,{className:"customFormItem",children:(0,T.jsxs)("div",{className:ue,children:[(0,T.jsx)("span",{className:fe,style:r?{color:"#545454"}:{},children:"\u79c1\u5bc6\u9891\u9053"}),(0,T.jsx)(he.Z,{disabled:!!r,checked:v,onChange:function(e){h(e)}})]})})]})})),pe=(0,i.memo)((0,b.$j)((function(e){var n=e.server;e.app;return{channelMap:n.channelMap}}),(function(e){return{setServerChannelMap:function(n){return e({type:"server/setChannelMap",payload:n})}}}),null,{forwardRef:!0})(me)),xe=function(e){var n=e.onClick,t=e.isEdit;return(0,T.jsx)("div",{className:"".concat(de," circleBtn"),onClick:n,children:t?"\u7f16\u8f91":"\u521b\u5efa"})},ge=(0,i.memo)((0,b.$j)((function(e){return{visible:e.channel.channelVisible}}),(function(e){return{setVisible:function(n){return e({type:"channel/setChannelVisible",payload:n})}}}))((function(e){var n=e.visible,t=e.setVisible,r=(0,i.useRef)(),a="edit"===n;return(0,T.jsx)(oe.Z,{width:544,title:a?"\u7f16\u8f91\u9891\u9053":"\u521b\u5efa\u9891\u9053",visible:n,destroyOnClose:!0,closeIcon:(0,T.jsx)(k.Z,{name:"xmark",color:"#c7c7c7",size:"16px"}),footer:(0,T.jsx)(xe,{onClick:function(){null===r||void 0===r||r.current.submit((function(){t(!1)}),(function(){t(!1)}))},isEdit:a}),onCancel:function(){t(!1)},className:ve,children:(0,T.jsx)(pe,{ref:r,isEdit:a})})}))),Ie=o.Z.Sider,Ze=(0,i.memo)((0,b.$j)((function(e){var n=e.app;return{userInfo:n.userInfo,loginSuccess:n.loginSuccess,appUserInfo:n.appUserInfo}}),(function(e){return{setLoginStatus:function(n){return e({type:"app/setLoginStatus",payload:n})},setUserInfo:function(n){return e({type:"app/setUserInfo",payload:n})},setAppUserInfo:function(n){return e({type:"app/setAppUserInfo",payload:n})}}}))((function(e){var n=e.loginSuccess,t=e.setUserInfo,c=e.setLoginStatus,s=e.appUserInfo,l=e.setAppUserInfo,u=(0,E.s0)();return(0,i.useEffect)((function(){var e=JSON.parse(localStorage.getItem("userInfo"));n||""===e.accessToken||(c(!0),N.Z.conn.open({user:e.username,accessToken:e.accessToken}).then((function(n){c(!1),t(e);var i={nickname:e.nickname,avatarurl:e.avatarurl,uid:e.username};l((0,a.Z)((0,a.Z)({},s),{},(0,r.Z)({},e.username,i)))})).catch((function(e){c(!1),u("/login")})))}),[]),(0,T.jsx)(o.Z,{style:{background:"#202124"},children:n&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(Ie,{style:{height:"100vh",boxSizing:"border-box"},width:72,children:(0,T.jsx)(R,{})}),(0,T.jsx)(E.j3,{}),(0,T.jsx)(le,{}),(0,T.jsx)(ge,{})]})})})))}}]);
//# sourceMappingURL=610.003950bc.chunk.js.map