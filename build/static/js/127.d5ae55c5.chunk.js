"use strict";(self.webpackChunkcircle=self.webpackChunkcircle||[]).push([[127],{4966:function(e,n,r){r.d(n,{Z:function(){return o}});var s=r(2791),a="index_headerWrap__7KmC+",i=r(184),t=function(e){var n=e.children,r=e.style,s=void 0===r?{}:r;return(0,i.jsx)("div",{className:a,style:s,children:n})},o=(0,s.memo)(t)},384:function(e,n,r){r.r(n),r.d(n,{default:function(){return Ve}});var s=r(1413),a=r(4165),i=r(5861),t=r(2791),o="index_channelWrap__2Cl0G",l="index_contentWrap__-dE+q",c="index_messageWrap__X7yBX",d="index_iptWrap__1Oivy",u="index_main__vuf9Z",h="index_side__2dEpe",v="index_drawerWrap__vPCX7",p="index_drawerBody__SoY4n",f="index_icon__VK19H",m="index_drawerHeader__6Q1tE",x="index_channelMember__Ik9ff",_="index_iconCon__90kXp",I="index_invite__b2bry",g="index_close__GD7QC",j=r(9439),C={name:"index_name__Dg-KW",base:"index_base__261L6",private:"index_private__lIo5s",optWrap:"index_optWrap__euZay",icon:"index_icon__n77Kx",popover:"index_popover__Q5UbL",iconCon:"index_iconCon__1dXWd"},Z=r(4966),b=r(1091),y=r(3020),M=r(6573),N=r(6014),T=r(7196),k=r(3433),S="index_layout__xZ0mN",w="index_headerThread__yiUwL",L="index_headerTitle__vlJ89",U="index_HeaderIcon__W7gCL",z="index_list__HzFPb",W="index_defaultTips__BSNZV",O="index_tips1__nyPx8",V="index_item__kIqm6",R="index_itemCon__KAERQ",P="index_itemName__DvFdE",H="index_itemBottom__KLB-C",E="index_noMessage__RO9tL",X="index_leftCon__E7YW7",F="index_avatar__pLH7v",A="index_ownerName__XOymd",D="index_message__Q7e4O",B="index_itemOwner__PVvVq",K="index_itemMsg__2HJcD",J="index_itemTime__4XDAS",Q=r(8687),Y=r(8406),$=r(6871),G=r(7411),q=r(2718),ee=r(4771),ne=r(8967),re=r(184),se="threadListScrollId",ae=function(e){if(0===e.length)return(0,re.jsx)("div",{className:W,children:(0,re.jsxs)("div",{className:O,children:[(0,re.jsx)("span",{className:"tlp-tips1-img"}),"\u5f53\u524d\u6ca1\u6709\u5b50\u533a"]})})},ie=(0,t.memo)((0,Q.$j)((function(e){var n=e.app;return{serverRole:n.serverRole,appUserInfo:n.appUserInfo}}),(function(e){return{handleThreadPanel:function(n){return e({type:"thread/setThreadPanelStatus",payload:n})},setThreadInfo:function(n){return e({type:"thread/setThreadInfo"})}}}))((function(e){var n=e.serverRole,r=e.appUserInfo,s=e.onHandleOperation,a=e.onClose,i=e.visibleThread,o=(0,$.UO)(),l=o.serverId,c=o.channelId,d=n[l],u=(0,t.useState)([]),h=(0,j.Z)(u,2),v=h[0],p=h[1];(0,t.useEffect)((function(){i?b(d):Z("")}),[d,i]);var f=(0,t.useState)(!0),m=(0,j.Z)(f,2),x=m[0],_=m[1],I=(0,t.useState)(null),g=(0,j.Z)(I,2),C=g[0],Z=g[1],b=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",r="user"!==e?"getChatThreads":"getJoinedChatThreads",s={parentId:c,pageSize:20,cursor:n};G.Z.conn[r](s).then((function(e){var n=e.entities;if(0!==n.length){20===n.length?_(!0):_(!1),Z(e.properties.cursor);var r=n.map((function(e){return e.id}));G.Z.conn.getChatThreadLastMessage({chatThreadIds:r}).then((function(e){var r=e.entities;n.forEach((function(e){var n=r.find((function(n){return e.id===n.chatThreadId}));e.lastMessage=n&&n.lastMessage?n.lastMessage:{}})),p(""===C?n:[].concat((0,k.Z)(v),(0,k.Z)(n)))})).catch((function(){p(""===C?n:[].concat((0,k.Z)(v),(0,k.Z)(n)))}))}else s.isScroll||p(n)}))},y=function(e){switch(e.type){case"txt":return e.msg;case"file":return"\u6587\u4ef6";case"img":return"\u56fe\u7247";default:return""}};return(0,re.jsxs)("div",{className:S,children:[(0,re.jsxs)("div",{className:w,children:[(0,re.jsx)("span",{className:L,children:"\u5b50\u533a\u5217\u8868"}),(0,re.jsx)("div",{className:U,onClick:function(){return a()},children:(0,re.jsx)(ne.Z,{})})]}),(0,re.jsxs)("ul",{id:se,className:z,children:[ae(v),(0,re.jsx)(ee.Z,{dataLength:v.length||0,next:function(){b(d,C)},hasMore:x,loader:(0,re.jsx)(re.Fragment,{}),endMessage:(0,re.jsx)(re.Fragment,{}),scrollableTarget:se,children:v.length>0&&v.map((function(e,n){var i,t,o,l,c;return(0,re.jsx)("li",{className:V,onClick:function(n){return function(e){s("openThreadPanel",!0,e,"threadList"),a()}(e)},children:(0,re.jsxs)("div",{className:R,children:[(0,re.jsx)("div",{className:P,children:e.name}),e.lastMessage&&"{}"!==JSON.stringify(e.lastMessage)?(0,re.jsxs)("div",{className:H,children:[(0,re.jsxs)("div",{className:X,children:[(0,re.jsx)("div",{className:F,children:(0,re.jsx)(q.Z,{size:16,src:null===(i=r[null===(t=e.lastMessage)||void 0===t?void 0:t.from])||void 0===i?void 0:i.avatarurl})}),(0,re.jsx)("div",{className:A,children:(0,re.jsx)("span",{className:B,children:(null===(o=r[null===(l=e.lastMessage)||void 0===l?void 0:l.from])||void 0===o?void 0:o.nickname)||e.lastMessage.from})}),e.lastMessage&&(0,re.jsx)("div",{className:D,children:(0,re.jsx)("span",{className:K,children:(0,Y.BV)(y(e.lastMessage))})})]}),(0,re.jsx)("span",{className:J,children:(0,Y.og)(null===(c=e.lastMessage)||void 0===c?void 0:c.time)})]}):(0,re.jsx)("div",{className:H,children:(0,re.jsx)("span",{className:E,children:"\u6700\u65b0\u6d88\u606f\u88ab\u64a4\u56de"})})]})},n)}))})]})]})}))),te=function(e){var n=e.onHandleOperation,r=e.channelId,s=e.serverId,a=e.setChannelInfo,i=e.channelInfo,o=e.serverRole,l=e.joinedServerInfo,c=e.channelMemberVisible,d=(0,t.useState)(!1),u=(0,j.Z)(d,2),h=u[0],v=u[1],p=o[s];(0,t.useEffect)((function(){!function(e){var n=e.serverId,r=e.channelId;G.Z.conn.getChannelDetail({serverId:n,channelId:r}).then((function(e){a(e.data)}))}({serverId:s,channelId:r})}),[r,s]);var f=(0,$.s0)();return(0,re.jsxs)(Z.Z,{children:[(0,re.jsx)("span",{className:"".concat(C.name," ").concat(null!==i&&void 0!==i&&i.isPublic?"".concat(C.channelNameWrap," ").concat(C.base," "):"".concat(C.channelNameWrap," ").concat(C.private)),children:null===i||void 0===i?void 0:i.name}),(0,re.jsxs)("div",{className:C.optWrap,children:[(0,re.jsx)(y.Z,{placement:"bottomRight",content:(0,re.jsx)(ie,{onClose:function(){v(!1)},onHandleOperation:n,visibleThread:h}),trigger:"click",visible:h,onVisibleChange:function(e){v(e)},overlayClassName:C.popover,children:(0,re.jsx)(M.Z,{title:"\u5b50\u533a\u5217\u8868",overlayClassName:"toolTip",children:(0,re.jsx)("span",{children:(0,re.jsx)(b.Z,{iconClass:C.icon,size:"24px",name:"message_on_message"})})})}),(0,re.jsx)(M.Z,{title:c?"\u9690\u85cf\u6210\u5458\u540d\u5355":"\u663e\u793a\u6210\u5458\u540d\u5355",overlayClassName:"toolTip",children:(0,re.jsx)("div",{onClick:function(){n("showMember")},children:(0,re.jsx)(b.Z,{iconClass:C.icon,size:"24px",name:"person_2"})})}),p&&p!==T.N1.user&&(0,re.jsx)(M.Z,{title:"\u9891\u9053\u8bbe\u7f6e",overlayClassName:"toolTip",children:(0,re.jsx)("div",{onClick:function(){n("setting")},children:(0,re.jsx)(b.Z,{iconClass:C.icon,size:"24px",name:"gear"})})}),0===i.defaultChannel&&p&&p===T.N1.owner&&(0,re.jsx)(N.Z,{onClick:function(e){"deleteChannel"===e.key&&G.Z.conn.destroyChannel({serverId:s,channelId:r}).then((function(){(0,Y.Qv)(s,r,!0);var e=l.list||[],n=e.findIndex((function(e){return e.id===s}));if(n>-1){var a=e[n].defaultChannelId;f("/main/channel/".concat(s,"/").concat(a))}}))},style:{padding:0},theme:"dark",selectable:!1,triggerSubMenuAction:"click",mode:"horizontal",items:oe()})]})]})},oe=function(){return[{label:(0,re.jsx)("div",{className:C.iconCon,children:(0,re.jsx)(b.Z,{iconClass:C.icon,name:"ellipsis",size:"24px"})}),key:"SubMenu",children:[{label:(0,re.jsxs)("div",{className:C.menuWrap,children:[(0,re.jsx)(b.Z,{name:"trash",size:"22px"}),(0,re.jsx)("span",{children:"\u5220\u9664\u9891\u9053"})]}),key:"deleteChannel"}]}]},le=(0,Q.$j)((function(e){var n=e.app,r=e.server,s=e.channel;return{channelInfo:n.currentChannelInfo,serverRole:n.serverRole,joinedServerInfo:r.joinedServerInfo,channelMemberVisible:s.channelMemberVisible}}),(function(e){return{setChannelInfo:function(n){return e({type:"app/setCurrentChannelInfo",payload:n})}}}))((0,t.memo)(te)),ce={name:"index_name__hXwKm",person:"index_person__kNyXs",base:"index_base__n-ZGI",scrollWrap:"index_scrollWrap__2mPer",iptWrap:"index_iptWrap__9eMt2"},de="index_modalWrap__eUYS6",ue=r(5873),he=function(e){var n=e.visible,r=e.onCancel,s=e.children,a=e.title;return(0,re.jsx)("div",{className:de,children:(0,re.jsx)(ue.Z,{width:"100%",style:{top:0},getContainer:!1,title:a,visible:n,mask:!1,footer:!1,destroyOnClose:!0,onCancel:function(){r()},closeIcon:(0,re.jsx)(ne.Z,{}),children:s})})},ve=(0,t.memo)(he),pe=r(149),fe=r(3695),me="index_role__Qz-D+",xe="index_creator__YZX+t",_e="index_admin__6TdNg",Ie="index_optWrap__nX24z",ge="index_iconWrap__+3sYB",je=(0,t.memo)((0,Q.$j)(null,(function(e){return{setSelected:function(n){return e({type:"app/setSelectedTab",payload:n})}}}))((function(e){var n=e.role,r=e.uid,s=e.serverId,a=e.isShowChat,i=void 0===a||a,t=e.menuItems,o=void 0===t?[]:t,l=e.showOpIcon,c=e.setSelected,d=e.isServer,u=e.onMenuClick,h=void 0===u?function(){}:u,v=(0,$.s0)(),p=n===T.N1.owner;return(0,re.jsxs)("div",{className:Ie,children:[n!==T.N1.user&&(0,re.jsx)("div",{className:"".concat(me," ").concat(p?xe:_e," "),style:{marginRight:d?"12px":"8px"},children:n===T.N1.owner?"\u521b\u5efa\u8005":"\u7ba1\u7406\u5458"}),i&&(0,re.jsx)("div",{className:"".concat(d?"opBg":ge),style:{marginRight:d?"12px":"8px"},onClick:function(){c("contacts"),v("/main/contacts/chat/".concat(r))},children:(0,re.jsx)(b.Z,{iconClass:"opIcon",name:"message_retangle"})}),l&&(0,re.jsx)("div",{className:"".concat(d?"opBg":ge),children:(0,re.jsx)(N.Z,{onClick:function(e){h(e,{uid:r,serverId:s})},style:{padding:0},theme:"dark",selectable:!1,triggerSubMenuAction:"click",mode:"horizontal",items:o})})]})}))),Ce="memberScrollWrap",Ze=function(){return(0,re.jsx)(Z.Z,{style:{position:"unset",width:"100%"},children:(0,re.jsxs)("span",{className:"".concat(ce.name," ").concat(ce.public),children:[(0,re.jsx)("span",{className:ce.person,children:(0,re.jsx)(b.Z,{name:"person_2",color:"#fff",size:"26px"})}),"\u793e\u533a\u6210\u5458"]})})},be=function(e,n,r){var s=[];if(n===T.N1.owner||e===T.N1.user)return s;if(e===T.N1.owner){var a={};n===T.N1.user?a={label:(0,re.jsxs)("div",{children:[(0,re.jsx)(b.Z,{name:"person_nut",size:"24px"}),(0,re.jsx)("span",{children:"\u8bbe\u4e3a\u7ba1\u7406\u5458"})]}),key:"setAdmin"}:n===T.N1.moderator&&(a={label:(0,re.jsxs)("div",{children:[(0,re.jsx)(b.Z,{name:"person_normal",size:"22px"}),(0,re.jsx)("span",{children:"\u53d6\u6d88\u7ba1\u7406\u5458"})]}),key:"removeAdmin"}),s.push(a)}return(null===r||void 0===r?void 0:r.uid)!==G.Z.conn.user&&s.push({label:(0,re.jsxs)("div",{children:[(0,re.jsx)(b.Z,{name:"minus_in_circle",size:"16px"}),(0,re.jsx)("span",{children:"\u8e22\u51fa\u793e\u533a"})]}),key:"kick"}),s},ye=function(e,n){return[{label:(0,re.jsx)(b.Z,{iconClass:"opIcon",name:"ellipsis"}),key:"SubMenu",children:be(e,n)}]},Me=(0,t.memo)((0,Q.$j)((function(e){var n=e.channel,r=e.app,s=e.server;return{visible:n.memberVisible,appUserInfo:r.appUserInfo,serverUserMap:s.serverUserMap,serverRole:r.serverRole}}),(function(e){return{setVisible:function(n){return e({type:"channel/setVisible",payload:n})},setServerUserMap:function(n){return e({type:"server/setServerUserMap",payload:n})}}}))((function(e){var n,r,a=e.visible,i=e.setVisible,o=e.appUserInfo,l=e.setServerUserMap,c=e.serverUserMap,d=e.serverRole,u=(0,$.UO)(),h=u.serverId,v=(u.channelId,d&&d[h]),p=(0,t.useMemo)((function(){return c.get(h)||{}}),[h,c]),f=function(e){var n,r=null===p||void 0===p||null===(n=p.list)||void 0===n?void 0:n.filter((function(n){return n.uid!==e}));l({serverId:h,userListInfo:(0,s.Z)((0,s.Z)({},c.get(h)),{},{list:r})})},m=function(e,n,r){var a=(0,k.Z)(null===p||void 0===p?void 0:p.list)||[],i=a.findIndex((function(e){return e.uid===n}));if(i>-1){var t=(0,s.Z)({},a[i]);t.role=r,a.splice(i,1,t),l({serverId:e,userListInfo:(0,s.Z)((0,s.Z)({},c.get(e)),{},{list:a})})}},x=function(e,n){var r=n.uid,s=n.serverId;if("kick"===e.key)G.Z.conn.removeServerMember({serverId:s,userId:r}).then((function(){f(r),fe.ZP.success("\u8e22\u51fa\u6210\u529f")}));else if("setAdmin"===e.key){var a={serverId:s,userId:r};G.Z.conn.setServerAdmin(a).then((function(){m(s,r,T.N1.moderator)}))}else if("removeAdmin"===e.key){var i={serverId:s,userId:r};G.Z.conn.removeServerAdmin(i).then((function(){m(s,r,"user")}))}},_=function(e){var n=e.cursor,r=void 0===n?"":n;G.Z.conn.getServerMembers({serverId:h,pageSize:20,cursor:r}).then((function(e){var n=e.data.list.map((function(e){return e.userId})),s=e.data.list.map((function(e){return{role:e.role,uid:e.userId}})),a=[];(0,Y.mZ)(n),a=""!==r?[].concat((0,k.Z)(p.list),(0,k.Z)(s)):s,l({serverId:h,userListInfo:{list:a,cursor:e.data.cursor,loadCount:e.data.list.length}})}))};return(0,t.useEffect)((function(){a&&_({cursor:""})}),[a]),(0,re.jsx)(ve,{title:(0,re.jsx)(Ze,{}),visible:a,onCancel:function(){i(!1)},children:(0,re.jsx)("div",{id:Ce,className:ce.scrollWrap,children:(0,re.jsx)(ee.Z,{dataLength:(null===p||void 0===p||null===(n=p.list)||void 0===n?void 0:n.length)||0,next:function(){_({cursor:p.cursor})},hasMore:20===p.loadCount,loader:(0,re.jsx)(re.Fragment,{}),endMessage:(0,re.jsx)(re.Fragment,{}),scrollableTarget:Ce,children:null===p||void 0===p||null===(r=p.list)||void 0===r?void 0:r.map((function(e){return(0,re.jsx)(pe.Z,{style:{padding:0},info:o[e.uid],uid:e.uid,operationReactNode:(0,re.jsx)(je,(0,s.Z)((0,s.Z)({isServer:!0,serverId:h},e),{},{onMenuClick:x,menuItems:ye(v,e.role),isShowChat:e.uid!==G.Z.conn.user,showOpIcon:be(v,e.role,e).length>0,selfRole:v}))},e.uid)}))})})})}))),Ne=r(7115),Te=r(4760),ke=r(1982),Se=r(7083),we={contactsItem:"index_contactsItem__lzFd6",mainInfo:"index_mainInfo__7X7N6",avatar:"index_avatar__kEaZt",basicInfo:"index_basicInfo__eGYGv",operation:"index_operation__HXDKF",scrollWrap:"index_scrollWrap__kxK+a",ellipsis:"index_ellipsis__oTGzT",name:"index_name__5taw-",muteIcon:"index_muteIcon__Iap+y"},Le=r(1269),Ue=(0,t.memo)((0,Q.$j)(null,(function(e){return{setSelected:function(n){return e({type:"app/setSelectedTab",payload:n})}}}))((function(e){var n=(0,$.s0)(),r=(0,$.UO)(),a=r.serverId,i=r.channelId,o=e.info,l=e.uid,c=e.basicShowOnline,d=e.role,u=e.serverRole,h=e.channelMemberInfo,v=e.setChannelUserMap,p=e.muteList,f=void 0===p?[]:p,m=e.channelInfo,x=e.setSelected,_=u&&u[a],I=f.map((function(e){return e.userId})).includes(l),g=(0,t.useMemo)((function(){var e=[];return G.Z.conn.user!==l&&e.push(T.J2),(_===T.N1.owner&&d!==T.N1.owner||_===T.N1.moderator&&d===T.N1.user)&&(I?e.push(T.SY):e.push(T.Q2),1!==m.defaultChannel&&e.push(T.Ry)),e}),[l,_,d,I,m.defaultChannel]),j=[{label:(0,re.jsx)(b.Z,{iconClass:we.icon,name:"ellipsis"}),key:"SubMenu",children:g}];return(0,re.jsxs)("div",{className:we.contactsItem,children:[(0,re.jsx)("div",{className:we.avatar,children:(0,re.jsx)(q.Z,{size:36,name:(null===o||void 0===o?void 0:o.nickname)||l,src:null===o||void 0===o?void 0:o.avatarurl,online:null===o||void 0===o?void 0:o.online})}),(0,re.jsxs)("div",{className:we.mainInfo,children:[(0,re.jsx)("div",{className:we.basicInfo,children:(0,re.jsx)(Le.Z,{name:(0,re.jsxs)("div",{className:we.ellipsis,children:[(0,re.jsx)("span",{className:we.name,children:(null===o||void 0===o?void 0:o.nickname)||l}),I&&(0,re.jsx)("span",{className:we.muteIcon,children:(0,re.jsx)(b.Z,{style:{marginLeft:"4px"},size:"16px",name:"person_wave_slash"})})]}),icon:null===o||void 0===o?void 0:o.avatar,online:null===o||void 0===o?void 0:o.online,showOnline:c})}),(0,re.jsx)("div",{className:we.operation,children:(0,re.jsx)(je,{serverId:a,isShowChat:!1,showOpIcon:g.length>0,uid:l,role:d,onMenuClick:function(e,r){var t=r.uid;switch(e.key){case"chat":x("contacts"),n("/main/contacts/chat/".concat(t));break;case"mute":!function(e){G.Z.conn.muteChannelMember({serverId:a,channelId:i,userId:e,duration:-1}).then((function(){v({channelId:i,userListInfo:(0,s.Z)((0,s.Z)({},h),{},{muteList:f.length?[].concat((0,k.Z)(f),[{userId:e}]):[{userId:e}]})})})).catch((function(e){17===e.type&&"User is not in server."===JSON.parse(e.data).error_description&&fe.ZP.warn({content:"\u7528\u6237\u5df2\u9000\u51fa\u793e\u533a"})}))}(t);break;case"unmute":!function(e){G.Z.conn.unmuteChannelMember({serverId:a,channelId:i,userId:e}).then((function(){var n=[];if(null!==f&&void 0!==f&&f.length){var r=(n=f).findIndex((function(n){return n.userId===e}));n.splice(r,1)}v({channelId:i,userListInfo:(0,s.Z)((0,s.Z)({},h),{},{muteList:n})})})).catch((function(e){17===e.type&&"User is not in server."===JSON.parse(e.data).error_description&&fe.ZP.warn({content:"\u7528\u6237\u5df2\u9000\u51fa\u793e\u533a"})}))}(t);break;case"kick":!function(e){G.Z.conn.removeChannelMember({serverId:a,channelId:i,userId:e}).then((function(){var n=(0,k.Z)(h.list),r=n.findIndex((function(n){return e===n.uid}));r>-1&&(n.splice(r,1),v({channelId:i,userListInfo:(0,s.Z)((0,s.Z)({},h),{},{list:n})}))})).catch((function(e){17===e.type&&"User is not in server."===JSON.parse(e.data).error_description&&fe.ZP.warn({content:"\u7528\u6237\u5df2\u9000\u51fa\u793e\u533a"})}))}(t)}},menuItems:j})})]})]})}))),ze="channelMemberScrollWrap",We=(0,t.memo)((0,Q.$j)((function(e){var n=e.app,r=e.channel;return{appUserInfo:n.appUserInfo,channelUserMap:r.channelUserMap,serverRole:n.serverRole,channelInfo:n.currentChannelInfo}}),(function(e){return{setChannelUserMap:function(n){return e({type:"channel/setChannelUserMap",payload:n})}}}))((function(e){var n,r,a=e.appUserInfo,i=e.channelUserMap,o=e.setChannelUserMap,l=e.serverRole,c=e.channelInfo,d=(0,$.UO)(),u=d.serverId,h=d.channelId,v=(0,t.useMemo)((function(){return i.get(h)||{}}),[h,i]),p=l&&l[u],f=function(e){var n=e.cursor,r=void 0===n?"":n,a=e.muteList,i=void 0===a?null:a;G.Z.conn.getChannelMembers({serverId:u,channelId:h,pageSize:50,cursor:r}).then((function(e){var n=e.data.list.map((function(e){return e.userId})),a=e.data.list.map((function(e){return{role:e.role,uid:e.userId}})),t=[];(0,Y.mZ)(n),t=v.list&&""!==r?[].concat((0,k.Z)(v.list),(0,k.Z)(a)):a,o({channelId:h,userListInfo:(0,s.Z)((0,s.Z)({muteList:i},v),{},{list:t,cursor:e.data.cursor,loadCount:e.data.list.length})})}))};return(0,t.useEffect)((function(){"user"!==p?G.Z.conn.getChannelMutelist({serverId:u,channelId:h}).then((function(e){f({cursor:"",muteList:e.data.list})})):f({cursor:""})}),[u,h,p]),(0,re.jsx)("div",{className:we.scrollWrap,id:ze,children:(0,re.jsx)(ee.Z,{scrollableTarget:ze,dataLength:(null===v||void 0===v||null===(n=v.list)||void 0===n?void 0:n.length)||0,next:function(){f({cursor:null===v||void 0===v?void 0:v.cursor})},hasMore:50===v.loadCount,loader:(0,re.jsx)(re.Fragment,{}),endMessage:(0,re.jsx)(re.Fragment,{}),children:null===v||void 0===v||null===(r=v.list)||void 0===r?void 0:r.map((function(e){return(0,re.jsx)(Ue,{style:{padding:0},info:a[e.uid],uid:e.uid,role:e.role,serverRole:l,channelMemberInfo:v,setChannelUserMap:o,muteList:(null===v||void 0===v?void 0:v.muteList)||[],channelInfo:c},e.uid)}))})})}))),Oe=function(e){var n=e.onClose,r=void 0===n?function(){}:n,s=e.onInvite,a=e.channelInfo;return(0,re.jsxs)("div",{className:m,children:[(0,re.jsx)("span",{className:x,children:"\u9891\u9053\u6210\u5458"}),(0,re.jsxs)("div",{className:_,children:[!(null!==a&&void 0!==a&&a.defaultChannel)&&(0,re.jsx)("span",{className:I,children:(0,re.jsx)(b.Z,{iconClass:f,onClick:function(){s(T.ET.inviteChannel)},name:"person_plus",size:"24px"})}),(0,re.jsx)("span",{className:g,children:(0,re.jsx)(b.Z,{iconClass:f,onClick:r,name:"xmark",size:"18px"})})]})]})},Ve=(0,t.memo)((0,Q.$j)((function(e){var n=e.channel,r=e.app,s=e.thread,a=e.server;return{appUserInfo:r.appUserInfo,chatMap:r.chatMap,showThreadPanel:s.showThreadPanel,currentChannelInfo:r.currentChannelInfo,channelMemberVisible:n.channelMemberVisible,joinedServerInfo:a.joinedServerInfo,currentThreadInfo:s.currentThreadInfo}}),(function(e){return{setVisible:function(n){return e({type:"channel/setVisible",payload:n})},pushChatMessage:function(n){return e({type:"app/pushChatMessage",payload:n})},handleThreadPanel:function(n){return e({type:"thread/setThreadPanelStatus",payload:n})},setIsCreatingThread:function(n){return e({type:"thread/setIsCreatingThread",payload:n})},setThreadInfo:function(n){return e({type:"thread/setThreadInfo",payload:n})},setMsgReaction:function(n){return e({type:"app/setMsgReaction",payload:n})},setThreadHasHistory:function(n){return e({type:"thread/setThreadHasHistory",payload:n})},setChannelMemberVisible:function(n){return e({type:"channel/setChannelMemberVisible",payload:n})},setChannelFormVisible:function(n){return e({type:"channel/setChannelVisible",payload:n})},setInviteVisible:function(n){return e({type:"channel/setInviteVisible",payload:n})},insertChatMessage:function(n){return e({type:"app/insertChatMessage",payload:n})},setThreadMap:function(n){return e({type:"channel/setThreadMap",payload:n})}}}))((function(e){var n,r,f=e.setVisible,m=e.chatMap,x=e.showThreadPanel,_=e.pushChatMessage,I=e.handleThreadPanel,g=e.setIsCreatingThread,j=e.channelMemberVisible,C=e.setChannelMemberVisible,Z=e.currentChannelInfo,b=e.setThreadInfo,y=e.setMsgReaction,M=e.setThreadHasHistory,N=e.setChannelFormVisible,k=e.setInviteVisible,S=e.insertChatMessage,w=e.joinedServerInfo,L=e.currentThreadInfo,U=e.setThreadMap,z=(0,$.UO)(),W=z.serverId,O=z.channelId,V=(0,t.useRef)(),R=(0,t.useMemo)((function(){return m[T.zi.groupChat].get(O)||{}}),[O,m]),P=(0,t.useCallback)(function(){var e=(0,i.Z)((0,a.Z)().mark((function e(n){var r,s,i,t;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.channelId,s=n.cursor,i=void 0===s?"":s,e.prev=1,e.next=4,G.Z.conn.getChatThreads({parentId:r,pageSize:T.LI,cursor:i});case 4:t=e.sent,U({channelId:r,threadInfo:{list:t.entities,cursor:t.properties.cursor,loadCount:t.entities.length}}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),console.log(e.t0);case 11:case"end":return e.stop()}}),e,null,[[1,8]])})));return function(n){return e.apply(this,arguments)}}(),[U]),H=(0,t.useCallback)((function(){W&&O&&G.Z.conn.isInChannel({serverId:W,channelId:O}).then((function(e){e.data.result||G.Z.conn.joinChannel({serverId:W,channelId:O}).then((function(e){P({channelId:O});var n=(0,Y.bD)({chatType:T.zi.groupChat,type:"custom",to:O,customEvent:T.qm.acceptInviteChannel,customExts:{server_name:A.name,channel_name:e.data.name}});(0,Y.j5)(n).then((function(){S({chatType:n.chatType,fromId:n.to,messageInfo:{list:[(0,s.Z)((0,s.Z)({},n),{},{from:G.Z.conn.user})]}})}))}))}))}),[W,O]),E=function(e){var n=e.cursor,r=void 0===n?"":n;G.Z.conn.getHistoryMessages({targetId:O,pageSize:20,chatType:"groupChat",cursor:r}).then((function(e){e.messages.forEach((function(e){y({msgId:e.id,reactions:e.reactions})})),_({chatType:"groupChat",fromId:O,messageInfo:{list:e.messages,cursor:e.cursor,loadCount:e.messages.length},reset:!r})}))};(0,t.useEffect)((function(){I(!1),b({}),E({cursor:""})}),[O]);var X=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=arguments.length>2?arguments[2]:void 0,s=arguments.length>3?arguments[3]:void 0;switch(e){case"createThread":C(!1),g(!0),b({parentMessage:r}),I(!0),M(!1);break;case"openThreadPanel":var a="threadList"===s?r.id:r.chatThreadOverview.id;if(a===L.id)return;G.Z.conn.joinChatThread({chatThreadId:a}).then((function(e){C(!1),F(r,s)})).catch((function(e){1301===e.type?(C(!1),F(r,s)):1300===e.type&&fe.ZP.warn({content:"\u8be5\u5b50\u533a\u5df2\u7ecf\u88ab\u9500\u6bc1"})}));break;case"showMember":b({}),I(!1),C(!j);break;case"setting":N("edit");break;case"recall":(0,Y.pe)(r,n)}},F=function(e,n){g(!1);var r="threadList"===n?e.id:e.chatThreadOverview.id;G.Z.conn.getChatThreadDetail({chatThreadId:r}).then((function(r){var a="threadList"===n?(0,Y.rS)(e.parentId,e.messageId):e,i=a?(0,s.Z)((0,s.Z)({},a),{},{chatThreadOverview:{}}):{};b((0,s.Z)((0,s.Z)({},r.data),{},{parentMessage:i})),I(!0)}))};(0,t.useEffect)((function(){return function(){f(!1)}}),[W]),(0,t.useEffect)((function(){H(),f(!1)}),[O]);var A=(0,t.useMemo)((function(){return function(e){var n=e.serverId,r=void 0===n?"":n,s=e.serverList,a=(void 0===s?[]:s).filter((function(e){return e.id===r}));return a.length?a[0]:{}}({serverId:W,serverList:w.list})}),[W,w]);return(0,re.jsxs)("div",{ref:V,className:o,children:[(0,re.jsxs)("div",{className:u,children:[(0,re.jsx)(le,{serverId:W,channelId:O,onHandleOperation:X}),(0,re.jsxs)("div",{className:l,children:[(0,re.jsx)("div",{id:T.jZ,className:c,children:(0,re.jsx)(ee.Z,{inverse:!0,dataLength:(null===R||void 0===R||null===(n=R.list)||void 0===n?void 0:n.length)||0,next:function(){E({cursor:null===R||void 0===R?void 0:R.cursor})},hasMore:(null===R||void 0===R?void 0:R.loadCount)>=20,style:{display:"flex",flexDirection:"column-reverse",minHeight:"435px"},loader:(0,re.jsx)(Se.Z,{}),endMessage:(0,re.jsx)("div",{style:{textAlign:"center"},children:"\u6ca1\u6709\u66f4\u591a\u6d88\u606f\u5566\uff5e"}),scrollableTarget:T.jZ,children:null===R||void 0===R||null===(r=R.list)||void 0===r?void 0:r.map((function(e){return(0,re.jsx)("div",{children:(0,re.jsx)(Ne.Z,{parentId:O,message:e,onHandleOperation:X,source:T.Z5.groupChat})},e.id)}))})}),(0,re.jsx)("div",{className:d,children:(0,re.jsx)(Te.Z,{chatType:T.zi.groupChat,fromId:O})})]})]}),(0,re.jsx)(Me,{}),x&&(0,re.jsx)("div",{className:h,children:(0,re.jsx)(ke.default,{})}),j&&(0,re.jsxs)("div",{className:v,children:[(0,re.jsx)(Oe,{channelInfo:Z,onInvite:k,onClose:function(){C(!1)}}),(0,re.jsx)("div",{className:p,children:(0,re.jsx)(We,{})})]})]})})))}}]);
//# sourceMappingURL=127.d5ae55c5.chunk.js.map