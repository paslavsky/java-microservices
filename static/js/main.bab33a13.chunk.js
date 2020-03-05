(this["webpackJsonpjava-microservices-view"]=this["webpackJsonpjava-microservices-view"]||[]).push([[0],{103:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(18),i=a.n(c),o=(a(62),a(63),a(64),a(65),a(66),a(67),a(13)),s=a(14),l=a(16),m=a(15),u=a(17),p=a(8),d=a(21),h=a.n(d),f=a(31),b=a(32),v=a.n(b),g=function(e){return function(){var t=Object(f.a)(h.a.mark((function t(a){var n;return h.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,v.a.get("https://cors-anywhere.herokuapp.com/".concat(e));case 2:n=t.sent,a({type:"LOAD_METRICS",payload:n.data});case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},y=a(29),E=a(11),O=a(48),j=a(20),w=a(25),M=a(12),k=a.n(M),T=a(24),x=a(49),C=a(50),S=a(51),R=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(s.a)(t,[{key:"shouldComponentUpdate",value:function(e,t,a){return this.changeType=!1,this.props.chartType!==e.chartType?(this.changeType=!0,!0):k.a.isEqual(this.props.data,e.data)?!k.a.isEqual(this.props,e):(this.chart.refresh(),!0)}},{key:"setChartRef",value:function(e){this.changeType&&e&&e.reinit(),this.chart=e}},{key:"render",value:function(){var e=this.props,t=e.first,a=e.title,n=e.chartType,c=e.data;return r.a.createElement(T.Card,{title:a,style:{marginTop:t?"0":"3em"}},r.a.createElement(S.Chart,{type:n||"bar",data:c,ref:this.setChartRef.bind(this)}))}}]),t}(r.a.Component),_=Object(p.b)((function(e){var t=function(e){return e.reduce((function(e,t){return e+t}),0)/e.length},a=function(e){return[t(e),Math.max.apply(Math,Object(j.a)(e)),Math.min.apply(Math,Object(j.a)(e))]},n=k.a.zipObject(e.metrics.map((function(e){return e.name})),e.metrics.map((function(){return"#"+(16777216+16777215*Math.random()).toString(16).substr(1,6)})));return{samples:k.a.zipObject(e.metrics.map((function(e){return e.name})),e.metrics.map((function(e){return e.tags}))),uptime:{labels:["Avg","Max","Min"],datasets:e.metrics.map((function(e){return{label:e.name,backgroundColor:n[e.name],data:a(e.metrics.map((function(e){return e.uptime})))}}))},memoryOnStart:{labels:["Avg","Max","Min"],datasets:e.metrics.map((function(e){return{label:e.name,backgroundColor:n[e.name],data:a(e.metrics.map((function(e){return e.memoryOnStart/1024})))}}))},warmingUp:{labels:["Avg","Max","Min"],datasets:e.metrics.map((function(e){return{label:e.name,backgroundColor:n[e.name],data:a(e.metrics.map((function(e){return e.requestTime[0]})))}}))},requestTime:{labels:["Avg","Max","Min"],datasets:e.metrics.map((function(e){return{label:e.name,backgroundColor:n[e.name],data:a(e.metrics.flatMap((function(e){return k.a.tail(e.requestTime)})))}}))},memoryOnWork:{labels:["Avg","Max","Min"],datasets:e.metrics.map((function(e){return{label:e.name,backgroundColor:n[e.name],data:a(e.metrics.flatMap((function(e){return e.memory})).map((function(e){return e/1024})))}}))}}}))((function(e){var t=Object(n.useState)("bar"),a=Object(w.a)(t,2),c=a[0],i=a[1];return r.a.createElement("div",{className:"p-grid"},r.a.createElement("div",{className:"p-sm-12 p-md-12 p-lg-4 p-xl-3",style:{paddingTop:"5em"}},r.a.createElement("div",{className:"p-grid p-justify-around"},r.a.createElement(T.Card,{style:{width:"280px"}},r.a.createElement(C.SelectButton,{value:c,options:[{label:"Vertical Bar",value:"bar"},{label:"Horizontal Bar",value:"horizontalBar"}],onChange:function(e){return i(e.value)}})))),r.a.createElement("div",{className:"p-sm-12 p-md-12 p-lg-8 p-xl-6"},r.a.createElement(x.ScrollPanel,{style:{width:"100%",height:"calc(100vh - 5.1em)",paddingTop:"5em"}},r.a.createElement(R,{title:"Memory on start (Mb)",chartType:c,data:e.memoryOnStart,first:!0}),r.a.createElement(R,{title:"Working memory (Mb)",chartType:c,data:e.memoryOnWork}),r.a.createElement(R,{title:"Uptime (ms)",chartType:c,data:e.uptime}),r.a.createElement(R,{title:"Warming up (ms)",chartType:c,data:e.warmingUp}),r.a.createElement(R,{title:"Request time (ms)",chartType:c,data:e.requestTime}))))})),N=a(52),A=a(26),B=a(53),D=a(54),q=Object(p.b)((function(e){return{ghRelease:e.ghRelease,samples:e.metrics.map((function(e){return{name:e.name,version:e.version}}))}}))((function(e){var t=Object(n.useState)(!1),a=Object(w.a)(t,2),c=a[0],i=a[1],o=Object(E.f)(),s=function(e){return function(){o.push(e)}},l=[{label:"Dashboard",icon:"mdi pi-fw mdi-view-dashboard",command:s("/")}].concat(Object(j.a)(e.samples.map((function(e){return{label:"".concat(e.name," v").concat(e.version),command:s("/".concat(e.name)),icon:"pi pi-fw pi-angle-right"}}))));return r.a.createElement(r.a.Fragment,null,r.a.createElement(N.Toolbar,{style:{position:"fixed",top:1,width:"calc(100% - 2px)",left:1,zIndex:1e3}},r.a.createElement("div",{className:"p-toolbar-group-left"},r.a.createElement(A.Button,{icon:"mdi mdi-24 mdi-menu",className:"p-button-secondary",style:{marginRight:".25em"},onClick:function(e){return i(!0)}})),r.a.createElement("div",{className:"p-toolbar-group-right"},r.a.createElement(A.Button,{icon:"mdi mdi-24 mdi-help",className:"p-button-secondary",style:{marginRight:".25em"}}),r.a.createElement(A.Button,{icon:"mdi mdi-24 mdi-github-circle",className:"p-button-secondary"}))),r.a.createElement(B.Sidebar,{visible:c,onHide:function(e){return i(!1)},showCloseIcon:!1},r.a.createElement(D.Menu,{style:{width:"100%",border:"none"},model:l})))})),L=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.props.sample||this.props.history.push("/404")}},{key:"render",value:function(){return r.a.createElement("h1",{style:{paddingTop:"1em"}},"Sample ",this.props.match.params.sample)}}]),t}(n.Component),H=Object(p.b)((function(e,t){return{sample:e.metrics.find((function(e){return e.name===t.match.params.sample}))}}))(L);var I=function(){return r.a.createElement("h1",{className:"app404"},r.a.createElement("span",{className:"mdi mdi-power-plug-off"}),"Not found")},W=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){this.props.fetchGitHubRelease()}},{key:"render",value:function(){return this.props.loaded?r.a.createElement(y.a,null,r.a.createElement(q,null),r.a.createElement(E.c,null,r.a.createElement(E.a,{exact:!0,path:"/",component:_}),r.a.createElement(E.a,{exact:!0,path:"/404",component:I}),r.a.createElement(E.a,{exact:!0,path:"/:sample",component:H}))):r.a.createElement(O.ProgressSpinner,null)}}]),t}(r.a.Component),z=Object(p.b)((function(e){return{loaded:!!e.ghRelease&&!!e.metrics}}),{fetchGitHubRelease:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"latest";return(function(){var t=Object(f.a)(h.a.mark((function t(a){var n;return h.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,v.a.get("https://api.github.com/repos/paslavsky/java-microservices/releases/".concat(e));case 2:n=t.sent,a({type:"LOAD_GH_RELEASE",payload:n.data}),g(n.data.assets.find((function(e){return"metrics.json"===e.name})).browser_download_url)(a);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}})(W);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var U=a(10),G=a(56),P=Object(U.c)({ghRelease:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"LOAD_GH_RELEASE":return t.payload;default:return e}},metrics:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"LOAD_METRICS":return t.payload;default:return e}}}),J=window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||U.d,V=Object(U.e)(P,J(Object(U.a)(G.a)));i.a.render(r.a.createElement(p.a,{store:V},r.a.createElement(z,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},57:function(e,t,a){e.exports=a(103)},62:function(e,t,a){}},[[57,1,2]]]);
//# sourceMappingURL=main.bab33a13.chunk.js.map