!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.SlVueTree=t():e.SlVueTree=t()}(window,function(){return function(e){var t={};function i(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},i.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=0)}([function(e,t,i){"use strict";i.r(t);var n={name:"sl-vue-tree",props:{value:{type:Array,default:function(){return[]}},edgeSize:{type:Number,default:3},showBranches:{type:Boolean,default:!1},level:{type:Number,default:0},parentInd:{type:Number},allowMultiselect:{type:Boolean,default:!0},multiselectKey:{type:[String,Array],default:function(){return["ctrlKey","metaKey"]},validator:function(e){var t=["ctrlKey","metaKey","altKey"],i=Array.isArray(e)?e:[e];return!!(i=i.filter(function(e){return-1!==t.indexOf(e)})).length}},scrollAreaHeight:{type:Number,default:70},maxScrollSpeed:{type:Number,default:20}},data:function(){return{rootCursorPosition:null,scrollIntervalId:0,scrollSpeed:0,lastSelectedNode:null,mouseIsDown:!1,isDragging:!1,lastMousePos:{x:0,y:0},preventDrag:!1,currentValue:this.value}},mounted:function(){this.isRoot&&document.addEventListener("mouseup",this.onDocumentMouseupHandler)},beforeDestroy:function(){document.removeEventListener("mouseup",this.onDocumentMouseupHandler)},watch:{value:function(e){this.currentValue=e}},computed:{cursorPosition:function(){return this.isRoot?this.rootCursorPosition:this.getParent().cursorPosition},nodes:function(){if(this.isRoot){var e=this.copy(this.currentValue);return this.getNodes(e)}return this.getParent().nodes[this.parentInd].children},gaps:function(){var e=[],t=this.level-1;for(this.showBranches||t++;t-- >0;)e.push(t);return e},isRoot:function(){return!this.level},selectionSize:function(){return this.getSelected().length},dragSize:function(){return this.getDraggable().length}},methods:{setCursorPosition:function(e){this.isRoot?this.rootCursorPosition=e:this.getParent().setCursorPosition(e)},getNodes:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return e.map(function(o,r){var s=i.concat(r);return t.getNode(s,o,e,n)})},getNode:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,o=e.slice(-1)[0];if(i=i||this.getNodeSiblings(this.currentValue,e),t=t||i&&i[o]||null,null==n&&(n=this.isVisible(e)),!t)return null;var r=void 0==t.isExpanded||!!t.isExpanded,s=void 0==t.isDraggable||!!t.isDraggable,l=void 0==t.isSelectable||!!t.isSelectable;return{title:t.title,isLeaf:!!t.isLeaf,children:t.children?this.getNodes(t.children,e,r):[],isSelected:!!t.isSelected,isExpanded:r,isVisible:n,isDraggable:s,isSelectable:l,data:void 0!==t.data?t.data:{},path:e,pathStr:JSON.stringify(e),level:e.length,ind:o,isFirstChild:0==o,isLastChild:o===i.length-1}},isVisible:function(e){if(e.length<2)return!0;for(var t=this.currentValue,i=0;i<e.length-1;i++){var n=t[e[i]];if(!(void 0==n.isExpanded||!!n.isExpanded))return!1;t=n.children}return!0},emitInput:function(e){this.currentValue=e,this.getRoot().$emit("input",e)},emitSelect:function(e,t){this.getRoot().$emit("select",e,t)},emitDrop:function(e,t,i){this.getRoot().$emit("drop",e,t,i)},emitToggle:function(e,t){this.getRoot().$emit("toggle",e,t)},emitNodeClick:function(e,t){this.getRoot().$emit("nodeclick",e,t)},emitNodeDblclick:function(e,t){this.getRoot().$emit("nodedblclick",e,t)},emitNodeContextmenu:function(e,t){this.getRoot().$emit("nodecontextmenu",e,t)},onExternalDragoverHandler:function(e,t){t.preventDefault();var i=this.getRoot(),n=i.getCursorPositionFromCoords(t.clientX,t.clientY);i.setCursorPosition(n),i.$emit("externaldragover",n,t)},onExternalDropHandler:function(e,t){var i=this.getRoot(),n=i.getCursorPositionFromCoords(t.clientX,t.clientY);i.$emit("externaldrop",n,t),this.setCursorPosition(null)},select:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,o=Array.isArray(this.multiselectKey)?this.multiselectKey:[this.multiselectKey],r=n&&!!o.find(function(e){return n[e]});i=(r||i)&&this.allowMultiselect;var s=this.getNode(e);if(!s)return null;var l=this.copy(this.currentValue),a=this.allowMultiselect&&n&&n.shiftKey&&this.lastSelectedNode,u=[],c=!1;return this.traverse(function(e,n){a?(e.pathStr!==s.pathStr&&e.pathStr!==t.lastSelectedNode.pathStr||(n.isSelected=e.isSelectable,c=!c),c&&(n.isSelected=e.isSelectable)):e.pathStr===s.pathStr?n.isSelected=e.isSelectable:i||n.isSelected&&(n.isSelected=!1),n.isSelected&&u.push(e)},l),this.lastSelectedNode=s,this.emitInput(l),this.emitSelect(u,n),s},onMousemoveHandler:function(e){if(this.isRoot){if(!this.preventDrag){var t=this.isDragging,i=this.isDragging||this.mouseIsDown&&(this.lastMousePos.x!==e.clientX||this.lastMousePos.y!==e.clientY),n=!1===t&&!0===i;if(this.lastMousePos={x:e.clientX,y:e.clientY},i){var o=this.getRoot().$el,r=o.getBoundingClientRect(),s=this.$refs.dragInfo,l=e.clientY-r.top+o.scrollTop-(0|s.style.marginBottom),a=e.clientX-r.left;s.style.top=l+"px",s.style.left=a+"px";var u=this.getCursorPositionFromCoords(e.clientX,e.clientY),c=u.node,d=u.placement;if(n&&!c.isSelected&&this.select(c.path,!1,e),this.getDraggable().length){this.isDragging=i,this.setCursorPosition({node:c,placement:d});var h=r.bottom-this.scrollAreaHeight,f=(e.clientY-h)/(r.bottom-h),g=r.top+this.scrollAreaHeight,v=(g-e.clientY)/(g-r.top);f>0?this.startScroll(f):v>0?this.startScroll(-v):this.stopScroll()}else this.preventDrag=!0}}}else this.getRoot().onMousemoveHandler(e)},getCursorPositionFromCoords:function(e,t){var i,n,o=document.elementFromPoint(e,t),r=o.getAttribute("path")?o:this.getClosetElementWithPath(o);if(r){if(!r)return;i=this.getNode(JSON.parse(r.getAttribute("path")));var s=r.offsetHeight,l=this.edgeSize,a=t-r.getBoundingClientRect().top;n=i.isLeaf?a>=s/2?"after":"before":a<=l?"before":a>=s-l?"after":"inside"}else{var u=this.getRoot().$el.getBoundingClientRect();t>u.top+u.height/2?(n="after",i=this.getLastNode()):(n="before",i=this.getFirstNode())}return{node:i,placement:n}},getClosetElementWithPath:function(e){return e?e.getAttribute("path")?e:this.getClosetElementWithPath(e.parentElement):null},onMouseleaveHandler:function(e){if(this.isRoot&&this.isDragging){var t=this.getRoot().$el.getBoundingClientRect();e.clientY>=t.bottom?this.setCursorPosition({node:this.nodes.slice(-1)[0],placement:"after"}):e.clientY<t.top&&this.setCursorPosition({node:this.getFirstNode(),placement:"before"})}},getNodeEl:function(e){this.getRoot().$el.querySelector('[path="'.concat(JSON.stringify(e),'"]'))},getLastNode:function(){var e=null;return this.traverse(function(t){e=t}),e},getFirstNode:function(){return this.getNode([0])},getNextNode:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=null;return this.traverse(function(o){if(!(t.comparePaths(o.path,e)<1))return!i||i(o)?(n=o,!1):void 0}),n},getPrevNode:function(e,t){var i=this,n=[];this.traverse(function(t){if(i.comparePaths(t.path,e)>=0)return!1;n.push(t)});for(var o=n.length;o--;){var r=n[o];if(!t||t(r))return r}return null},comparePaths:function(e,t){for(var i=0;i<e.length;i++){if(void 0==t[i])return 1;if(e[i]>t[i])return 1;if(e[i]<t[i])return-1}return void 0==t[e.length]?0:-1},onNodeMousedownHandler:function(e,t){0===e.button&&(this.isRoot?this.mouseIsDown=!0:this.getRoot().onNodeMousedownHandler(e,t))},startScroll:function(e){var t=this,i=this.getRoot().$el;this.scrollSpeed!==e&&(this.scrollIntervalId&&this.stopScroll(),this.scrollSpeed=e,this.scrollIntervalId=setInterval(function(){i.scrollTop+=t.maxScrollSpeed*e},20))},stopScroll:function(){clearInterval(this.scrollIntervalId),this.scrollIntervalId=0,this.scrollSpeed=0},onDocumentMouseupHandler:function(e){this.isDragging&&this.onNodeMouseupHandler(e)},onNodeMouseupHandler:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(0===e.button)if(this.isRoot)if(this.mouseIsDown=!1,this.isDragging||!t||this.preventDrag||this.select(t.path,!1,e),this.preventDrag=!1,this.cursorPosition){var i=this.getDraggable(),n=!0,o=!1,r=void 0;try{for(var s,l=i[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var a=s.value;if(a.pathStr==this.cursorPosition.node.pathStr)return void this.stopDrag();if(this.checkNodeIsParent(a,this.cursorPosition.node))return void this.stopDrag()}}catch(e){o=!0,r=e}finally{try{n||null==l.return||l.return()}finally{if(o)throw r}}var u=this.copy(this.currentValue),c=[],d=!0,h=!1,f=void 0;try{for(var g,v=i[Symbol.iterator]();!(d=(g=v.next()).done);d=!0){var p=g.value,m=this.getNodeSiblings(u,p.path)[p.ind];c.push(this.copy(m)),m._markToDelete=!0}}catch(e){h=!0,f=e}finally{try{d||null==v.return||v.return()}finally{if(h)throw f}}var S=this.cursorPosition.node,y=this.getNodeSiblings(u,S.path),_=y[S.ind];if("inside"===this.cursorPosition.placement){var b;_.children=_.children||[],(b=_.children).unshift.apply(b,c)}else{var C="before"===this.cursorPosition.placement?S.ind:S.ind+1;y.splice.apply(y,[C,0].concat(c))}this.traverseModels(function(e,t,i){e._markToDelete&&t.splice(i,1)},u),this.lastSelectedNode=null,this.emitInput(u),this.emitDrop(i,this.cursorPosition,e),this.stopDrag()}else this.stopDrag();else this.getRoot().onNodeMouseupHandler(e,t)},onToggleHandler:function(e,t){this.updateNode(t.path,{isExpanded:!t.isExpanded}),this.emitToggle(t,e),e.stopPropagation()},stopDrag:function(){this.isDragging=!1,this.mouseIsDown=!1,this.setCursorPosition(null),this.stopScroll()},getParent:function(){return this.$parent},getRoot:function(){return this.isRoot?this:this.getParent().getRoot()},getNodeSiblings:function(e,t){return 1===t.length?e:this.getNodeSiblings(e[t[0]].children,t.slice(1))},updateNode:function(e,t){if(this.isRoot){var i=JSON.stringify(e),n=this.copy(this.currentValue);this.traverse(function(e,n){e.pathStr===i&&Object.assign(n,t)},n),this.emitInput(n)}else this.getParent().updateNode(e,t)},getSelected:function(){var e=[];return this.traverse(function(t){t.isSelected&&e.push(t)}),e},getDraggable:function(){var e=[];return this.traverse(function(t){t.isSelected&&t.isDraggable&&e.push(t)}),e},traverse:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];t||(t=this.currentValue);for(var n=!1,o=[],r=0;r<t.length;r++){var s=t[r],l=i.concat(r),a=this.getNode(l,s,t);if(n=!1===e(a,s,t),o.push(a),n)break;if(s.children&&(n=!1===this.traverse(e,s.children,l)))break}return!n&&o},traverseModels:function(e,t){for(var i=t.length;i--;){var n=t[i];n.children&&this.traverseModels(e,n.children),e(n,t,i)}return t},remove:function(e){var t=e.map(function(e){return JSON.stringify(e)}),i=this.copy(this.currentValue);this.traverse(function(e,i,n){var o=!0,r=!1,s=void 0;try{for(var l,a=t[Symbol.iterator]();!(o=(l=a.next()).done);o=!0){var u=l.value;e.pathStr===u&&(i._markToDelete=!0)}}catch(e){r=!0,s=e}finally{try{o||null==a.return||a.return()}finally{if(r)throw s}}},i),this.traverseModels(function(e,t,i){e._markToDelete&&t.splice(i,1)},i),this.emitInput(i)},checkNodeIsParent:function(e,t){var i=t.path;return JSON.stringify(i.slice(0,e.path.length))==e.pathStr},copy:function(e){return JSON.parse(JSON.stringify(e))}}},o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"sl-vue-tree",class:{"sl-vue-tree-root":e.isRoot},on:{mousemove:e.onMousemoveHandler,mouseleave:e.onMouseleaveHandler,dragend:function(t){e.onDragendHandler(null,t)}}},[i("div",{ref:"nodes",staticClass:"sl-vue-tree-nodes-list"},[e._l(e.nodes,function(t,n){return i("div",{staticClass:"sl-vue-tree-node",class:{"sl-vue-tree-selected":t.isSelected}},[i("div",{staticClass:"sl-vue-tree-cursor sl-vue-tree-cursor_before",style:{visibility:e.cursorPosition&&e.cursorPosition.node.pathStr===t.pathStr&&"before"===e.cursorPosition.placement?"visible":"hidden"},on:{dragover:function(e){e.preventDefault()}}}),e._v(" "),i("div",{staticClass:"sl-vue-tree-node-item",class:{"sl-vue-tree-cursor-hover":e.cursorPosition&&e.cursorPosition.node.pathStr===t.pathStr,"sl-vue-tree-cursor-inside":e.cursorPosition&&"inside"===e.cursorPosition.placement&&e.cursorPosition.node.pathStr===t.pathStr,"sl-vue-tree-node-is-leaf":t.isLeaf,"sl-vue-tree-node-is-folder":!t.isLeaf},attrs:{path:t.pathStr},on:{mousedown:function(i){e.onNodeMousedownHandler(i,t)},mouseup:function(i){e.onNodeMouseupHandler(i,t)},contextmenu:function(i){e.emitNodeContextmenu(t,i)},dblclick:function(i){e.emitNodeDblclick(t,i)},click:function(i){e.emitNodeClick(t,i)},dragover:function(i){e.onExternalDragoverHandler(t,i)},drop:function(i){e.onExternalDropHandler(t,i)}}},[e._l(e.gaps,function(e){return i("div",{staticClass:"sl-vue-tree-gap"})}),e._v(" "),e.level&&e.showBranches?i("div",{staticClass:"sl-vue-tree-branch"},[e._t("branch",[t.isLastChild?e._e():i("span",[e._v("\n            "+e._s(String.fromCharCode(9500))+e._s(String.fromCharCode(9472))+" \n          ")]),e._v(" "),t.isLastChild?i("span",[e._v("\n            "+e._s(String.fromCharCode(9492))+e._s(String.fromCharCode(9472))+" \n          ")]):e._e()],{node:t})],2):e._e(),e._v(" "),i("div",{staticClass:"sl-vue-tree-title"},[t.isLeaf?e._e():i("span",{staticClass:"sl-vue-tree-toggle",on:{click:function(i){e.onToggleHandler(i,t)}}},[e._t("toggle",[i("span",[e._v("\n             "+e._s(t.isLeaf?"":t.isExpanded?"-":"+")+"\n            ")])],{node:t})],2),e._v(" "),e._t("title",[e._v(e._s(t.title))],{node:t}),e._v(" "),!t.isLeaf&&0==t.children.length&&t.isExpanded?e._t("empty-node",null,{node:t}):e._e()],2),e._v(" "),i("div",{staticClass:"sl-vue-tree-sidebar"},[e._t("sidebar",null,{node:t})],2)],2),e._v(" "),t.children&&t.children.length&&t.isExpanded?i("sl-vue-tree",{attrs:{value:t.children,level:t.level,parentInd:n,allowMultiselect:e.allowMultiselect,edgeSize:e.edgeSize,showBranches:e.showBranches},on:{dragover:function(e){e.preventDefault()}},scopedSlots:e._u([{key:"title",fn:function(t){var i=t.node;return[e._t("title",[e._v(e._s(i.title))],{node:i})]}},{key:"toggle",fn:function(t){var n=t.node;return[e._t("toggle",[i("span",[e._v("\n             "+e._s(n.isLeaf?"":n.isExpanded?"-":"+")+"\n          ")])],{node:n})]}},{key:"sidebar",fn:function(t){var i=t.node;return[e._t("sidebar",null,{node:i})]}},{key:"empty-node",fn:function(t){var i=t.node;return[!i.isLeaf&&0==i.children.length&&i.isExpanded?e._t("empty-node",null,{node:i}):e._e()]}}])}):e._e(),e._v(" "),i("div",{staticClass:"sl-vue-tree-cursor sl-vue-tree-cursor_after",style:{visibility:e.cursorPosition&&e.cursorPosition.node.pathStr===t.pathStr&&"after"===e.cursorPosition.placement?"visible":"hidden"},on:{dragover:function(e){e.preventDefault()}}})],1)}),e._v(" "),e.isRoot?i("div",{directives:[{name:"show",rawName:"v-show",value:e.isDragging,expression:"isDragging"}],ref:"dragInfo",staticClass:"sl-vue-tree-drag-info"},[e._t("draginfo",[e._v("\n        Items: "+e._s(e.selectionSize)+"\n      ")])],2):e._e()],2)])};o._withStripped=!0;var r=function(e,t,i,n,o,r,s,l){var a=typeof(e=e||{}).default;"object"!==a&&"function"!==a||(e=e.default);var u,c="function"==typeof e?e.options:e;if(t&&(c.render=t,c.staticRenderFns=i,c._compiled=!0),n&&(c.functional=!0),r&&(c._scopeId=r),s?(u=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),o&&o.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(s)},c._ssrRegister=u):o&&(u=l?function(){o.call(this,this.$root.$options.shadowRoot)}:o),u)if(c.functional){c._injectStyles=u;var d=c.render;c.render=function(e,t){return u.call(t),d(e,t)}}else{var h=c.beforeCreate;c.beforeCreate=h?[].concat(h,u):[u]}return{exports:e,options:c}}(n,o,[],!1,null,null,null);r.options.__file="src\\sl-vue-tree.vue";t.default=r.exports}]).default});
//# sourceMappingURL=sl-vue-tree.js.map