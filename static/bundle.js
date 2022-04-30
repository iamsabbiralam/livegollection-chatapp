(()=>{"use strict";class e{constructor(t){this.url=t,this.hasConnBeenOpened=!1,this.hasConnBeenClosed=!1,this.cachedReceivedUpdates=[],this.cachedUpdatesToSend=[],this.isOnCreateSet=!1,this.isOnUpdateSet=!1,this.isOnDeleteSet=!1,this.isOnOpenSet=!1,this.isOnCloseSet=!1,this.ws=new WebSocket(t),this.ws.onopen=()=>{this.hasConnBeenOpened=!0,this.isOnOpenSet&&this._onopen(),this.cachedUpdatesToSend.forEach((e=>this.ws.send(JSON.stringify(e)))),this.cachedUpdatesToSend=[]},this.ws.onmessage=t=>{const s=JSON.parse(t.data);(function(t){return"method"in t&&(t.method===e.createMethodString||t.method===e.updateMethodString||t.method===e.deleteMethodString)&&"id"in t&&"item"in t})(s)&&(this.isOnCreateSet&&this.isOnUpdateSet&&this.isOnDeleteSet?this.processUpdate(s):this.cachedReceivedUpdates.push(s))},this.ws.onclose=()=>{this.hasConnBeenClosed=!0,this.isOnCloseSet&&this._onclose()}}processUpdate(t){switch(t.method){case e.createMethodString:this._oncreate(t.item);break;case e.updateMethodString:this._onupdate(t.item);break;case e.deleteMethodString:this._ondelete(t.item)}}create(t){this.craftAndSendUpdateMessage(t,e.createMethodString)}update(t){this.craftAndSendUpdateMessage(t,e.updateMethodString)}delete(t){this.craftAndSendUpdateMessage(t,e.deleteMethodString)}craftAndSendUpdateMessage(e,t){let s={method:t,item:e};void 0!==e.id&&(s.id=e.id),this.hasConnBeenOpened?this.ws.send(JSON.stringify(s)):this.cachedUpdatesToSend.push(s)}set oncreate(e){this._oncreate=e,!this.isOnCreateSet&&this.isOnUpdateSet&&this.isOnDeleteSet&&(this.cachedReceivedUpdates.forEach((e=>this.processUpdate(e))),this.cachedReceivedUpdates=[]),this.isOnCreateSet=!0}set onupdate(e){this._onupdate=e,this.isOnCreateSet&&!this.isOnUpdateSet&&this.isOnDeleteSet&&(this.cachedReceivedUpdates.forEach((e=>this.processUpdate(e))),this.cachedReceivedUpdates=[]),this.isOnUpdateSet=!0}set ondelete(e){this._ondelete=e,this.isOnCreateSet&&this.isOnUpdateSet&&!this.isOnDeleteSet&&(this.cachedReceivedUpdates.forEach((e=>this.processUpdate(e))),this.cachedReceivedUpdates=[]),this.isOnDeleteSet=!0}set onopen(e){this._onopen=e,this.isOnOpenSet=!0,this.hasConnBeenOpened&&e()}set onclose(e){this._onclose=e,this.isOnCloseSet=!0,this.hasConnBeenClosed&&e()}}e.createMethodString="CREATE",e.updateMethodString="UPDATE",e.deleteMethodString="DELETE";const t=`Client#${Math.random().toString(36).substr(2,6)}`;function s(e){return`message-${e}`}let n=null,i=null;window.onload=()=>{i=new e("ws://localhost:8080/livegollection");const d=document.getElementById("message-text-input");document.getElementById("send-button").onclick=()=>{i.create({sender:t,sentTime:new Date,text:d.value})},n=document.getElementById("inbox-div"),i.oncreate=e=>{!function(e){const d=t==e.sender,a=document.createElement("div");if(a.id=s(e.id),a.className=d?"mine":"others",a.className+=" message",!d){const t=document.createElement("p");t.className="sender",t.innerHTML=e.sender,a.appendChild(t)}const h=document.createElement("input");if(h.type="text",h.value=e.text,a.appendChild(h),d){const t=document.createElement("input");t.type="button",t.value="Edit",t.onclick=()=>{e.text=h.value,i.update(e)},a.appendChild(t);const s=document.createElement("input");s.type="button",s.value="Delete",s.onclick=()=>{i.delete(e)},a.appendChild(s)}const o=document.createElement("p");o.className="time",o.innerHTML=new Date(e.sentTime).toLocaleTimeString(),a.appendChild(o),n.appendChild(a)}(e)},i.onupdate=e=>{document.getElementById(s(e.id)).getElementsByTagName("input")[0].value=e.text},i.ondelete=e=>{document.getElementById(s(e.id)).remove()}}})();