import{R as st,Q as Xe,P as ye,V as _,O as xe,S as _e,a as I,M as q,T as $,b as Tt,c as jt,I as Dt,F as Ke,d as Ae,e as Q,W as Ct,B as Pe,f as at,g as rt,U as qe,h as $e,i as zt,j as J,k as Ut,l as It,L as Rt,r as y,u as Y,C as lt,_ as Me,m as Le,A as Nt,n as b,o as Bt,p as Ht}from"./index-YNS83T_e.js";const ct=parseInt(st.replace(/\D+/g,"")),dt=ct>=125?"uv1":"uv2";var Ft=Object.defineProperty,kt=(d,n,o)=>n in d?Ft(d,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):d[n]=o,Wt=(d,n,o)=>(kt(d,n+"",o),o);class Gt{constructor(){Wt(this,"_listeners")}addEventListener(n,o){this._listeners===void 0&&(this._listeners={});const e=this._listeners;e[n]===void 0&&(e[n]=[]),e[n].indexOf(o)===-1&&e[n].push(o)}hasEventListener(n,o){if(this._listeners===void 0)return!1;const e=this._listeners;return e[n]!==void 0&&e[n].indexOf(o)!==-1}removeEventListener(n,o){if(this._listeners===void 0)return;const s=this._listeners[n];if(s!==void 0){const i=s.indexOf(o);i!==-1&&s.splice(i,1)}}dispatchEvent(n){if(this._listeners===void 0)return;const e=this._listeners[n.type];if(e!==void 0){n.target=this;const s=e.slice(0);for(let i=0,c=s.length;i<c;i++)s[i].call(this,n);n.target=null}}}var Yt=Object.defineProperty,Vt=(d,n,o)=>n in d?Yt(d,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):d[n]=o,u=(d,n,o)=>(Vt(d,typeof n!="symbol"?n+"":n,o),o);const le=new Tt,Qe=new jt,Zt=Math.cos(70*(Math.PI/180)),Je=(d,n)=>(d%n+n)%n;let Xt=class extends Gt{constructor(n,o){super(),u(this,"object"),u(this,"domElement"),u(this,"enabled",!0),u(this,"target",new _),u(this,"minDistance",0),u(this,"maxDistance",1/0),u(this,"minZoom",0),u(this,"maxZoom",1/0),u(this,"minPolarAngle",0),u(this,"maxPolarAngle",Math.PI),u(this,"minAzimuthAngle",-1/0),u(this,"maxAzimuthAngle",1/0),u(this,"enableDamping",!1),u(this,"dampingFactor",.05),u(this,"enableZoom",!0),u(this,"zoomSpeed",1),u(this,"enableRotate",!0),u(this,"rotateSpeed",1),u(this,"enablePan",!0),u(this,"panSpeed",1),u(this,"screenSpacePanning",!0),u(this,"keyPanSpeed",7),u(this,"zoomToCursor",!1),u(this,"autoRotate",!1),u(this,"autoRotateSpeed",2),u(this,"reverseOrbit",!1),u(this,"reverseHorizontalOrbit",!1),u(this,"reverseVerticalOrbit",!1),u(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),u(this,"mouseButtons",{LEFT:q.ROTATE,MIDDLE:q.DOLLY,RIGHT:q.PAN}),u(this,"touches",{ONE:$.ROTATE,TWO:$.DOLLY_PAN}),u(this,"target0"),u(this,"position0"),u(this,"zoom0"),u(this,"_domElementKeyEvents",null),u(this,"getPolarAngle"),u(this,"getAzimuthalAngle"),u(this,"setPolarAngle"),u(this,"setAzimuthalAngle"),u(this,"getDistance"),u(this,"getZoomScale"),u(this,"listenToKeyEvents"),u(this,"stopListenToKeyEvents"),u(this,"saveState"),u(this,"reset"),u(this,"update"),u(this,"connect"),u(this,"dispose"),u(this,"dollyIn"),u(this,"dollyOut"),u(this,"getScale"),u(this,"setScale"),this.object=n,this.domElement=o,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>p.phi,this.getAzimuthalAngle=()=>p.theta,this.setPolarAngle=t=>{let r=Je(t,2*Math.PI),f=p.phi;f<0&&(f+=2*Math.PI),r<0&&(r+=2*Math.PI);let g=Math.abs(r-f);2*Math.PI-g<g&&(r<f?r+=2*Math.PI:f+=2*Math.PI),m.phi=r-f,e.update()},this.setAzimuthalAngle=t=>{let r=Je(t,2*Math.PI),f=p.theta;f<0&&(f+=2*Math.PI),r<0&&(r+=2*Math.PI);let g=Math.abs(r-f);2*Math.PI-g<g&&(r<f?r+=2*Math.PI:f+=2*Math.PI),m.theta=r-f,e.update()},this.getDistance=()=>e.object.position.distanceTo(e.target),this.listenToKeyEvents=t=>{t.addEventListener("keydown",be),this._domElementKeyEvents=t},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",be),this._domElementKeyEvents=null},this.saveState=()=>{e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=()=>{e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(s),e.update(),l=a.NONE},this.update=(()=>{const t=new _,r=new _(0,1,0),f=new Xe().setFromUnitVectors(n.up,r),g=f.clone().invert(),j=new _,k=new Xe,V=2*Math.PI;return function(){const Ze=e.object.position;f.setFromUnitVectors(n.up,r),g.copy(f).invert(),t.copy(Ze).sub(e.target),t.applyQuaternion(f),p.setFromVector3(t),e.autoRotate&&l===a.NONE&&fe(pt()),e.enableDamping?(p.theta+=m.theta*e.dampingFactor,p.phi+=m.phi*e.dampingFactor):(p.theta+=m.theta,p.phi+=m.phi);let W=e.minAzimuthAngle,G=e.maxAzimuthAngle;isFinite(W)&&isFinite(G)&&(W<-Math.PI?W+=V:W>Math.PI&&(W-=V),G<-Math.PI?G+=V:G>Math.PI&&(G-=V),W<=G?p.theta=Math.max(W,Math.min(G,p.theta)):p.theta=p.theta>(W+G)/2?Math.max(W,p.theta):Math.min(G,p.theta)),p.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,p.phi)),p.makeSafe(),e.enableDamping===!0?e.target.addScaledVector(L,e.dampingFactor):e.target.add(L),e.zoomToCursor&&N||e.object.isOrthographicCamera?p.radius=me(p.radius):p.radius=me(p.radius*E),t.setFromSpherical(p),t.applyQuaternion(g),Ze.copy(e.target).add(t),e.object.matrixAutoUpdate||e.object.updateMatrix(),e.object.lookAt(e.target),e.enableDamping===!0?(m.theta*=1-e.dampingFactor,m.phi*=1-e.dampingFactor,L.multiplyScalar(1-e.dampingFactor)):(m.set(0,0,0),L.set(0,0,0));let ne=!1;if(e.zoomToCursor&&N){let oe=null;if(e.object instanceof ye&&e.object.isPerspectiveCamera){const ie=t.length();oe=me(ie*E);const re=ie-oe;e.object.position.addScaledVector(ee,re),e.object.updateMatrixWorld()}else if(e.object.isOrthographicCamera){const ie=new _(R.x,R.y,0);ie.unproject(e.object),e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/E)),e.object.updateProjectionMatrix(),ne=!0;const re=new _(R.x,R.y,0);re.unproject(e.object),e.object.position.sub(re).add(ie),e.object.updateMatrixWorld(),oe=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),e.zoomToCursor=!1;oe!==null&&(e.screenSpacePanning?e.target.set(0,0,-1).transformDirection(e.object.matrix).multiplyScalar(oe).add(e.object.position):(le.origin.copy(e.object.position),le.direction.set(0,0,-1).transformDirection(e.object.matrix),Math.abs(e.object.up.dot(le.direction))<Zt?n.lookAt(e.target):(Qe.setFromNormalAndCoplanarPoint(e.object.up,e.target),le.intersectPlane(Qe,e.target))))}else e.object instanceof xe&&e.object.isOrthographicCamera&&(ne=E!==1,ne&&(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/E)),e.object.updateProjectionMatrix()));return E=1,N=!1,ne||j.distanceToSquared(e.object.position)>P||8*(1-k.dot(e.object.quaternion))>P?(e.dispatchEvent(s),j.copy(e.object.position),k.copy(e.object.quaternion),ne=!1,!0):!1}})(),this.connect=t=>{e.domElement=t,e.domElement.style.touchAction="none",e.domElement.addEventListener("contextmenu",Ye),e.domElement.addEventListener("pointerdown",We),e.domElement.addEventListener("pointercancel",te),e.domElement.addEventListener("wheel",Ge)},this.dispose=()=>{var t,r,f,g,j,k;e.domElement&&(e.domElement.style.touchAction="auto"),(t=e.domElement)==null||t.removeEventListener("contextmenu",Ye),(r=e.domElement)==null||r.removeEventListener("pointerdown",We),(f=e.domElement)==null||f.removeEventListener("pointercancel",te),(g=e.domElement)==null||g.removeEventListener("wheel",Ge),(j=e.domElement)==null||j.ownerDocument.removeEventListener("pointermove",ge),(k=e.domElement)==null||k.ownerDocument.removeEventListener("pointerup",te),e._domElementKeyEvents!==null&&e._domElementKeyEvents.removeEventListener("keydown",be)};const e=this,s={type:"change"},i={type:"start"},c={type:"end"},a={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let l=a.NONE;const P=1e-6,p=new _e,m=new _e;let E=1;const L=new _,O=new I,T=new I,A=new I,M=new I,U=new I,h=new I,w=new I,S=new I,x=new I,ee=new _,R=new I;let N=!1;const v=[],se={};function pt(){return 2*Math.PI/60/60*e.autoRotateSpeed}function Z(){return Math.pow(.95,e.zoomSpeed)}function fe(t){e.reverseOrbit||e.reverseHorizontalOrbit?m.theta+=t:m.theta-=t}function je(t){e.reverseOrbit||e.reverseVerticalOrbit?m.phi+=t:m.phi-=t}const De=(()=>{const t=new _;return function(f,g){t.setFromMatrixColumn(g,0),t.multiplyScalar(-f),L.add(t)}})(),Ce=(()=>{const t=new _;return function(f,g){e.screenSpacePanning===!0?t.setFromMatrixColumn(g,1):(t.setFromMatrixColumn(g,0),t.crossVectors(e.object.up,t)),t.multiplyScalar(f),L.add(t)}})(),K=(()=>{const t=new _;return function(f,g){const j=e.domElement;if(j&&e.object instanceof ye&&e.object.isPerspectiveCamera){const k=e.object.position;t.copy(k).sub(e.target);let V=t.length();V*=Math.tan(e.object.fov/2*Math.PI/180),De(2*f*V/j.clientHeight,e.object.matrix),Ce(2*g*V/j.clientHeight,e.object.matrix)}else j&&e.object instanceof xe&&e.object.isOrthographicCamera?(De(f*(e.object.right-e.object.left)/e.object.zoom/j.clientWidth,e.object.matrix),Ce(g*(e.object.top-e.object.bottom)/e.object.zoom/j.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}})();function pe(t){e.object instanceof ye&&e.object.isPerspectiveCamera||e.object instanceof xe&&e.object.isOrthographicCamera?E=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function ae(t){pe(E/t)}function he(t){pe(E*t)}function ze(t){if(!e.zoomToCursor||!e.domElement)return;N=!0;const r=e.domElement.getBoundingClientRect(),f=t.clientX-r.left,g=t.clientY-r.top,j=r.width,k=r.height;R.x=f/j*2-1,R.y=-(g/k)*2+1,ee.set(R.x,R.y,1).unproject(e.object).sub(e.object.position).normalize()}function me(t){return Math.max(e.minDistance,Math.min(e.maxDistance,t))}function Ue(t){O.set(t.clientX,t.clientY)}function ht(t){ze(t),w.set(t.clientX,t.clientY)}function Ie(t){M.set(t.clientX,t.clientY)}function mt(t){T.set(t.clientX,t.clientY),A.subVectors(T,O).multiplyScalar(e.rotateSpeed);const r=e.domElement;r&&(fe(2*Math.PI*A.x/r.clientHeight),je(2*Math.PI*A.y/r.clientHeight)),O.copy(T),e.update()}function gt(t){S.set(t.clientX,t.clientY),x.subVectors(S,w),x.y>0?ae(Z()):x.y<0&&he(Z()),w.copy(S),e.update()}function bt(t){U.set(t.clientX,t.clientY),h.subVectors(U,M).multiplyScalar(e.panSpeed),K(h.x,h.y),M.copy(U),e.update()}function vt(t){ze(t),t.deltaY<0?he(Z()):t.deltaY>0&&ae(Z()),e.update()}function yt(t){let r=!1;switch(t.code){case e.keys.UP:K(0,e.keyPanSpeed),r=!0;break;case e.keys.BOTTOM:K(0,-e.keyPanSpeed),r=!0;break;case e.keys.LEFT:K(e.keyPanSpeed,0),r=!0;break;case e.keys.RIGHT:K(-e.keyPanSpeed,0),r=!0;break}r&&(t.preventDefault(),e.update())}function Re(){if(v.length==1)O.set(v[0].pageX,v[0].pageY);else{const t=.5*(v[0].pageX+v[1].pageX),r=.5*(v[0].pageY+v[1].pageY);O.set(t,r)}}function Ne(){if(v.length==1)M.set(v[0].pageX,v[0].pageY);else{const t=.5*(v[0].pageX+v[1].pageX),r=.5*(v[0].pageY+v[1].pageY);M.set(t,r)}}function Be(){const t=v[0].pageX-v[1].pageX,r=v[0].pageY-v[1].pageY,f=Math.sqrt(t*t+r*r);w.set(0,f)}function xt(){e.enableZoom&&Be(),e.enablePan&&Ne()}function Et(){e.enableZoom&&Be(),e.enableRotate&&Re()}function He(t){if(v.length==1)T.set(t.pageX,t.pageY);else{const f=ve(t),g=.5*(t.pageX+f.x),j=.5*(t.pageY+f.y);T.set(g,j)}A.subVectors(T,O).multiplyScalar(e.rotateSpeed);const r=e.domElement;r&&(fe(2*Math.PI*A.x/r.clientHeight),je(2*Math.PI*A.y/r.clientHeight)),O.copy(T)}function Fe(t){if(v.length==1)U.set(t.pageX,t.pageY);else{const r=ve(t),f=.5*(t.pageX+r.x),g=.5*(t.pageY+r.y);U.set(f,g)}h.subVectors(U,M).multiplyScalar(e.panSpeed),K(h.x,h.y),M.copy(U)}function ke(t){const r=ve(t),f=t.pageX-r.x,g=t.pageY-r.y,j=Math.sqrt(f*f+g*g);S.set(0,j),x.set(0,Math.pow(S.y/w.y,e.zoomSpeed)),ae(x.y),w.copy(S)}function wt(t){e.enableZoom&&ke(t),e.enablePan&&Fe(t)}function St(t){e.enableZoom&&ke(t),e.enableRotate&&He(t)}function We(t){var r,f;e.enabled!==!1&&(v.length===0&&((r=e.domElement)==null||r.ownerDocument.addEventListener("pointermove",ge),(f=e.domElement)==null||f.ownerDocument.addEventListener("pointerup",te)),Lt(t),t.pointerType==="touch"?Mt(t):_t(t))}function ge(t){e.enabled!==!1&&(t.pointerType==="touch"?Pt(t):At(t))}function te(t){var r,f,g;Ot(t),v.length===0&&((r=e.domElement)==null||r.releasePointerCapture(t.pointerId),(f=e.domElement)==null||f.ownerDocument.removeEventListener("pointermove",ge),(g=e.domElement)==null||g.ownerDocument.removeEventListener("pointerup",te)),e.dispatchEvent(c),l=a.NONE}function _t(t){let r;switch(t.button){case 0:r=e.mouseButtons.LEFT;break;case 1:r=e.mouseButtons.MIDDLE;break;case 2:r=e.mouseButtons.RIGHT;break;default:r=-1}switch(r){case q.DOLLY:if(e.enableZoom===!1)return;ht(t),l=a.DOLLY;break;case q.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enablePan===!1)return;Ie(t),l=a.PAN}else{if(e.enableRotate===!1)return;Ue(t),l=a.ROTATE}break;case q.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enableRotate===!1)return;Ue(t),l=a.ROTATE}else{if(e.enablePan===!1)return;Ie(t),l=a.PAN}break;default:l=a.NONE}l!==a.NONE&&e.dispatchEvent(i)}function At(t){if(e.enabled!==!1)switch(l){case a.ROTATE:if(e.enableRotate===!1)return;mt(t);break;case a.DOLLY:if(e.enableZoom===!1)return;gt(t);break;case a.PAN:if(e.enablePan===!1)return;bt(t);break}}function Ge(t){e.enabled===!1||e.enableZoom===!1||l!==a.NONE&&l!==a.ROTATE||(t.preventDefault(),e.dispatchEvent(i),vt(t),e.dispatchEvent(c))}function be(t){e.enabled===!1||e.enablePan===!1||yt(t)}function Mt(t){switch(Ve(t),v.length){case 1:switch(e.touches.ONE){case $.ROTATE:if(e.enableRotate===!1)return;Re(),l=a.TOUCH_ROTATE;break;case $.PAN:if(e.enablePan===!1)return;Ne(),l=a.TOUCH_PAN;break;default:l=a.NONE}break;case 2:switch(e.touches.TWO){case $.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;xt(),l=a.TOUCH_DOLLY_PAN;break;case $.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;Et(),l=a.TOUCH_DOLLY_ROTATE;break;default:l=a.NONE}break;default:l=a.NONE}l!==a.NONE&&e.dispatchEvent(i)}function Pt(t){switch(Ve(t),l){case a.TOUCH_ROTATE:if(e.enableRotate===!1)return;He(t),e.update();break;case a.TOUCH_PAN:if(e.enablePan===!1)return;Fe(t),e.update();break;case a.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;wt(t),e.update();break;case a.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;St(t),e.update();break;default:l=a.NONE}}function Ye(t){e.enabled!==!1&&t.preventDefault()}function Lt(t){v.push(t)}function Ot(t){delete se[t.pointerId];for(let r=0;r<v.length;r++)if(v[r].pointerId==t.pointerId){v.splice(r,1);return}}function Ve(t){let r=se[t.pointerId];r===void 0&&(r=new I,se[t.pointerId]=r),r.set(t.pageX,t.pageY)}function ve(t){const r=t.pointerId===v[0].pointerId?v[1]:v[0];return se[r.pointerId]}this.dollyIn=(t=Z())=>{he(t),e.update()},this.dollyOut=(t=Z())=>{ae(t),e.update()},this.getScale=()=>E,this.setScale=t=>{pe(t),e.update()},this.getZoomScale=()=>Z(),o!==void 0&&this.connect(o),this.update()}};const et=new Pe,ce=new _;class Oe extends Dt{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const n=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],o=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],e=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(e),this.setAttribute("position",new Ke(n,3)),this.setAttribute("uv",new Ke(o,2))}applyMatrix4(n){const o=this.attributes.instanceStart,e=this.attributes.instanceEnd;return o!==void 0&&(o.applyMatrix4(n),e.applyMatrix4(n),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(n){let o;n instanceof Float32Array?o=n:Array.isArray(n)&&(o=new Float32Array(n));const e=new Ae(o,6,1);return this.setAttribute("instanceStart",new Q(e,3,0)),this.setAttribute("instanceEnd",new Q(e,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(n,o=3){let e;n instanceof Float32Array?e=n:Array.isArray(n)&&(e=new Float32Array(n));const s=new Ae(e,o*2,1);return this.setAttribute("instanceColorStart",new Q(s,o,0)),this.setAttribute("instanceColorEnd",new Q(s,o,o)),this}fromWireframeGeometry(n){return this.setPositions(n.attributes.position.array),this}fromEdgesGeometry(n){return this.setPositions(n.attributes.position.array),this}fromMesh(n){return this.fromWireframeGeometry(new Ct(n.geometry)),this}fromLineSegments(n){const o=n.geometry;return this.setPositions(o.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pe);const n=this.attributes.instanceStart,o=this.attributes.instanceEnd;n!==void 0&&o!==void 0&&(this.boundingBox.setFromBufferAttribute(n),et.setFromBufferAttribute(o),this.boundingBox.union(et))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new at),this.boundingBox===null&&this.computeBoundingBox();const n=this.attributes.instanceStart,o=this.attributes.instanceEnd;if(n!==void 0&&o!==void 0){const e=this.boundingSphere.center;this.boundingBox.getCenter(e);let s=0;for(let i=0,c=n.count;i<c;i++)ce.fromBufferAttribute(n,i),s=Math.max(s,e.distanceToSquared(ce)),ce.fromBufferAttribute(o,i),s=Math.max(s,e.distanceToSquared(ce));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(n){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(n)}}class ut extends Oe{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(n){const o=n.length-3,e=new Float32Array(2*o);for(let s=0;s<o;s+=3)e[2*s]=n[s],e[2*s+1]=n[s+1],e[2*s+2]=n[s+2],e[2*s+3]=n[s+3],e[2*s+4]=n[s+4],e[2*s+5]=n[s+5];return super.setPositions(e),this}setColors(n,o=3){const e=n.length-o,s=new Float32Array(2*e);if(o===3)for(let i=0;i<e;i+=o)s[2*i]=n[i],s[2*i+1]=n[i+1],s[2*i+2]=n[i+2],s[2*i+3]=n[i+3],s[2*i+4]=n[i+4],s[2*i+5]=n[i+5];else for(let i=0;i<e;i+=o)s[2*i]=n[i],s[2*i+1]=n[i+1],s[2*i+2]=n[i+2],s[2*i+3]=n[i+3],s[2*i+4]=n[i+4],s[2*i+5]=n[i+5],s[2*i+6]=n[i+6],s[2*i+7]=n[i+7];return super.setColors(s,o),this}fromLine(n){const o=n.geometry;return this.setPositions(o.attributes.position.array),this}}class Te extends rt{constructor(n){super({type:"LineMaterial",uniforms:qe.clone(qe.merge([$e.common,$e.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new I(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${ct>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(o){this.uniforms.diffuse.value=o}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(o){o===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(o){this.uniforms.linewidth.value=o}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(o){!!o!="USE_DASH"in this.defines&&(this.needsUpdate=!0),o===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(o){this.uniforms.dashScale.value=o}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(o){this.uniforms.dashSize.value=o}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(o){this.uniforms.dashOffset.value=o}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(o){this.uniforms.gapSize.value=o}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(o){this.uniforms.opacity.value=o}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(o){this.uniforms.resolution.value.copy(o)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(o){!!o!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),o===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(n)}}const Ee=new J,tt=new _,nt=new _,D=new J,C=new J,B=new J,we=new _,Se=new It,z=new Rt,ot=new _,de=new Pe,ue=new at,H=new J;let F,X;function it(d,n,o){return H.set(0,0,-n,1).applyMatrix4(d.projectionMatrix),H.multiplyScalar(1/H.w),H.x=X/o.width,H.y=X/o.height,H.applyMatrix4(d.projectionMatrixInverse),H.multiplyScalar(1/H.w),Math.abs(Math.max(H.x,H.y))}function Kt(d,n){const o=d.matrixWorld,e=d.geometry,s=e.attributes.instanceStart,i=e.attributes.instanceEnd,c=Math.min(e.instanceCount,s.count);for(let a=0,l=c;a<l;a++){z.start.fromBufferAttribute(s,a),z.end.fromBufferAttribute(i,a),z.applyMatrix4(o);const P=new _,p=new _;F.distanceSqToSegment(z.start,z.end,p,P),p.distanceTo(P)<X*.5&&n.push({point:p,pointOnLine:P,distance:F.origin.distanceTo(p),object:d,face:null,faceIndex:a,uv:null,[dt]:null})}}function qt(d,n,o){const e=n.projectionMatrix,i=d.material.resolution,c=d.matrixWorld,a=d.geometry,l=a.attributes.instanceStart,P=a.attributes.instanceEnd,p=Math.min(a.instanceCount,l.count),m=-n.near;F.at(1,B),B.w=1,B.applyMatrix4(n.matrixWorldInverse),B.applyMatrix4(e),B.multiplyScalar(1/B.w),B.x*=i.x/2,B.y*=i.y/2,B.z=0,we.copy(B),Se.multiplyMatrices(n.matrixWorldInverse,c);for(let E=0,L=p;E<L;E++){if(D.fromBufferAttribute(l,E),C.fromBufferAttribute(P,E),D.w=1,C.w=1,D.applyMatrix4(Se),C.applyMatrix4(Se),D.z>m&&C.z>m)continue;if(D.z>m){const h=D.z-C.z,w=(D.z-m)/h;D.lerp(C,w)}else if(C.z>m){const h=C.z-D.z,w=(C.z-m)/h;C.lerp(D,w)}D.applyMatrix4(e),C.applyMatrix4(e),D.multiplyScalar(1/D.w),C.multiplyScalar(1/C.w),D.x*=i.x/2,D.y*=i.y/2,C.x*=i.x/2,C.y*=i.y/2,z.start.copy(D),z.start.z=0,z.end.copy(C),z.end.z=0;const T=z.closestPointToPointParameter(we,!0);z.at(T,ot);const A=Ut.lerp(D.z,C.z,T),M=A>=-1&&A<=1,U=we.distanceTo(ot)<X*.5;if(M&&U){z.start.fromBufferAttribute(l,E),z.end.fromBufferAttribute(P,E),z.start.applyMatrix4(c),z.end.applyMatrix4(c);const h=new _,w=new _;F.distanceSqToSegment(z.start,z.end,w,h),o.push({point:w,pointOnLine:h,distance:F.origin.distanceTo(w),object:d,face:null,faceIndex:E,uv:null,[dt]:null})}}}class ft extends zt{constructor(n=new Oe,o=new Te({color:Math.random()*16777215})){super(n,o),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const n=this.geometry,o=n.attributes.instanceStart,e=n.attributes.instanceEnd,s=new Float32Array(2*o.count);for(let c=0,a=0,l=o.count;c<l;c++,a+=2)tt.fromBufferAttribute(o,c),nt.fromBufferAttribute(e,c),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+tt.distanceTo(nt);const i=new Ae(s,2,1);return n.setAttribute("instanceDistanceStart",new Q(i,1,0)),n.setAttribute("instanceDistanceEnd",new Q(i,1,1)),this}raycast(n,o){const e=this.material.worldUnits,s=n.camera;s===null&&!e&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const i=n.params.Line2!==void 0&&n.params.Line2.threshold||0;F=n.ray;const c=this.matrixWorld,a=this.geometry,l=this.material;X=l.linewidth+i,a.boundingSphere===null&&a.computeBoundingSphere(),ue.copy(a.boundingSphere).applyMatrix4(c);let P;if(e)P=X*.5;else{const m=Math.max(s.near,ue.distanceToPoint(F.origin));P=it(s,m,l.resolution)}if(ue.radius+=P,F.intersectsSphere(ue)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),de.copy(a.boundingBox).applyMatrix4(c);let p;if(e)p=X*.5;else{const m=Math.max(s.near,de.distanceToPoint(F.origin));p=it(s,m,l.resolution)}de.expandByScalar(p),F.intersectsBox(de)!==!1&&(e?Kt(this,o):qt(this,s,o))}onBeforeRender(n){const o=this.material.uniforms;o&&o.resolution&&(n.getViewport(Ee),this.material.uniforms.resolution.value.set(Ee.z,Ee.w))}}class $t extends ft{constructor(n=new ut,o=new Te({color:Math.random()*16777215})){super(n,o),this.isLine2=!0,this.type="Line2"}}const Qt=y.forwardRef(function({points:n,color:o=16777215,vertexColors:e,linewidth:s,lineWidth:i,segments:c,dashed:a,...l},P){var p,m;const E=Y(M=>M.size),L=y.useMemo(()=>c?new ft:new $t,[c]),[O]=y.useState(()=>new Te),T=(e==null||(p=e[0])==null?void 0:p.length)===4?4:3,A=y.useMemo(()=>{const M=c?new Oe:new ut,U=n.map(h=>{const w=Array.isArray(h);return h instanceof _||h instanceof J?[h.x,h.y,h.z]:h instanceof I?[h.x,h.y,0]:w&&h.length===3?[h[0],h[1],h[2]]:w&&h.length===2?[h[0],h[1],0]:h});if(M.setPositions(U.flat()),e){o=16777215;const h=e.map(w=>w instanceof lt?w.toArray():w);M.setColors(h.flat(),T)}return M},[n,c,e,T]);return y.useLayoutEffect(()=>{L.computeLineDistances()},[n,L]),y.useLayoutEffect(()=>{a?O.defines.USE_DASH="":delete O.defines.USE_DASH,O.needsUpdate=!0},[a,O]),y.useEffect(()=>()=>A.dispose(),[A]),y.createElement("primitive",Me({object:L,ref:P},l),y.createElement("primitive",{object:A,attach:"geometry"}),y.createElement("primitive",Me({object:O,attach:"material",color:o,vertexColors:!!e,resolution:[E.width,E.height],linewidth:(m=s??i)!==null&&m!==void 0?m:1,dashed:a,transparent:T===4},l)))}),Jt=()=>parseInt(st.replace(/\D+/g,"")),en=Jt(),tn=y.forwardRef(({makeDefault:d,camera:n,regress:o,domElement:e,enableDamping:s=!0,keyEvents:i=!1,onChange:c,onStart:a,onEnd:l,...P},p)=>{const m=Y(x=>x.invalidate),E=Y(x=>x.camera),L=Y(x=>x.gl),O=Y(x=>x.events),T=Y(x=>x.setEvents),A=Y(x=>x.set),M=Y(x=>x.get),U=Y(x=>x.performance),h=n||E,w=e||O.connected||L.domElement,S=y.useMemo(()=>new Xt(h),[h]);return Le(()=>{S.enabled&&S.update()},-1),y.useEffect(()=>(i&&S.connect(i===!0?w:i),S.connect(w),()=>void S.dispose()),[i,w,o,S,m]),y.useEffect(()=>{const x=N=>{m(),o&&U.regress(),c&&c(N)},ee=N=>{a&&a(N)},R=N=>{l&&l(N)};return S.addEventListener("change",x),S.addEventListener("start",ee),S.addEventListener("end",R),()=>{S.removeEventListener("start",ee),S.removeEventListener("end",R),S.removeEventListener("change",x)}},[c,a,l,S,m,T]),y.useEffect(()=>{if(d){const x=M().controls;return A({controls:S}),()=>A({controls:x})}},[d,S]),y.createElement("primitive",Me({ref:p,object:S,enableDamping:s},P))});class nn extends rt{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${en>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}const on=d=>new _().setFromSpherical(new _e(d,Math.acos(1-Math.random()*2),Math.random()*2*Math.PI)),sn=y.forwardRef(({radius:d=100,depth:n=50,count:o=5e3,saturation:e=0,factor:s=4,fade:i=!1,speed:c=1},a)=>{const l=y.useRef(),[P,p,m]=y.useMemo(()=>{const L=[],O=[],T=Array.from({length:o},()=>(.5+.5*Math.random())*s),A=new lt;let M=d+n;const U=n/o;for(let h=0;h<o;h++)M-=U*Math.random(),L.push(...on(M).toArray()),A.setHSL(h/o,e,.9),O.push(A.r,A.g,A.b);return[new Float32Array(L),new Float32Array(O),new Float32Array(T)]},[o,n,s,d,e]);Le(L=>l.current&&(l.current.uniforms.time.value=L.clock.getElapsedTime()*c));const[E]=y.useState(()=>new nn);return y.createElement("points",{ref:a},y.createElement("bufferGeometry",null,y.createElement("bufferAttribute",{attach:"attributes-position",args:[P,3]}),y.createElement("bufferAttribute",{attach:"attributes-color",args:[p,3]}),y.createElement("bufferAttribute",{attach:"attributes-size",args:[m,1]})),y.createElement("primitive",{ref:l,object:E,attach:"material",blending:Nt,"uniforms-fade-value":i,depthWrite:!1,transparent:!0,vertexColors:!0}))});function an(d,n,o){const e=(90-d)*(Math.PI/180),s=(n+180)*(Math.PI/180),i=-o*Math.sin(e)*Math.cos(s),c=o*Math.sin(e)*Math.sin(s),a=o*Math.cos(e);return new _(i,a,c)}function rn({a:d,b:n,color:o="#a78bfa"}){const e=d.clone().add(n).multiplyScalar(.5).normalize().multiplyScalar(d.length()*1.15),i=new Ht(d,e,n).getPoints(64);return b.jsx(Qt,{points:i,color:o,lineWidth:2,dashed:!0,dashSize:.2,gapSize:.1})}const ln=({markers:d,onSelect:n})=>{const e=y.useMemo(()=>d.map(c=>({...c,pos:an(c.lat,c.lon,1.81)})),[d]),[s,i]=y.useState(null);return Le(({gl:c})=>{c.setPixelRatio(Math.min(window.devicePixelRatio,2))}),b.jsxs("group",{children:[b.jsxs("mesh",{children:[b.jsx("sphereGeometry",{args:[1.8,64,64]}),b.jsx("meshStandardMaterial",{color:"#0a1523",metalness:.1,roughness:.9})]}),b.jsxs("mesh",{children:[b.jsx("sphereGeometry",{args:[1.8+.0015,64,64]}),b.jsx("meshBasicMaterial",{color:"#38bdf8",wireframe:!0,opacity:.25,transparent:!0})]}),e.length>1&&e.slice(1).map((c,a)=>b.jsx(rn,{a:e[0].pos,b:c.pos,color:"#22d3ee"},a)),e.map((c,a)=>b.jsxs("group",{position:c.pos,children:[b.jsxs("mesh",{onPointerOver:l=>{l.stopPropagation(),i(c.id||String(a))},onPointerOut:()=>i(l=>l===(c.id||String(a))?null:l),onClick:l=>{l.stopPropagation(),n==null||n(c)},children:[b.jsx("sphereGeometry",{args:[.04*(c.size||1),16,16]}),b.jsx("meshStandardMaterial",{color:c.color||"#f43f5e",emissive:c.color||"#f43f5e",emissiveIntensity:.9})]}),s===(c.id||String(a))&&b.jsxs("mesh",{children:[b.jsx("ringGeometry",{args:[.06,.08,32]}),b.jsx("meshBasicMaterial",{color:c.color||"#f43f5e",transparent:!0,opacity:.9})]})]},c.id||a))]})},fn=({markers:d,onSelect:n})=>{const[o,e]=y.useState(!0),s=y.useRef(null);return b.jsxs("div",{className:"h-[65vh] w-full bg-black/60 rounded-md border relative",children:[b.jsxs(Bt,{camera:{position:[0,0,5]},children:[b.jsx("ambientLight",{intensity:.5}),b.jsx("directionalLight",{position:[5,5,5],intensity:.6}),b.jsx(sn,{radius:50,depth:20,count:1800,factor:4,saturation:0,fade:!0,speed:.4}),b.jsx(ln,{markers:d,onSelect:n}),b.jsx(tn,{ref:s,enablePan:!1,autoRotate:o,autoRotateSpeed:.6})]}),b.jsxs("div",{className:"pointer-events-none absolute inset-0",children:[b.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_60%)]"}),b.jsx("div",{className:"absolute inset-6 border border-cyan-500/30 rounded-md"}),b.jsx("div",{className:"absolute left-4 top-4 text-xs text-cyan-300/80",children:"GLOBAL TRACKING GRID"})]}),b.jsxs("div",{className:"absolute right-4 bottom-4 flex gap-2 pointer-events-auto",children:[b.jsx("button",{className:"px-3 py-1.5 text-xs rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 hover:bg-cyan-500/30",onClick:()=>e(i=>!i),children:o?"Pause":"Rotate"}),b.jsx("button",{className:"px-3 py-1.5 text-xs rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40",onClick:()=>{var i,c,a,l;(c=(i=s.current)==null?void 0:i.zoomIn)==null||c.call(i),(l=(a=s.current)==null?void 0:a.update)==null||l.call(a)},children:"+"}),b.jsx("button",{className:"px-3 py-1.5 text-xs rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/40",onClick:()=>{var i,c,a,l;(c=(i=s.current)==null?void 0:i.zoomOut)==null||c.call(i),(l=(a=s.current)==null?void 0:a.update)==null||l.call(a)},children:"-"})]})]})};export{fn as default};
