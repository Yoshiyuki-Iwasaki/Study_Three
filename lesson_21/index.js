"use strict";function init(){const e=window.innerWidth,t=window.innerHeight,i=new THREE.WebGLRenderer({canvas:document.querySelector("#myCanvas")});i.setPixelRatio(window.devicePixelRatio),i.setSize(e,t);const n=new THREE.Scene,o=new THREE.PerspectiveCamera(60,e/t,1,1e3);o.position.z=1,o.rotation.x=Math.PI/2;const r=new THREE.BufferGeometry,a=new Float32Array([-1,-1,1,1,-1,1,1,1,1,1,1,1,-1,1,1,-1,-1,1]);r.setAttribute("position",new THREE.BufferAttribute(a,3));const s=new THREE.MeshBasicMaterial({color:16711680}),c=new THREE.Mesh(r,s),E=new THREE.DirectionalLight(16777215);E.position.set(1,1,1),n.add(E),function e(){starGeo.vertices.forEach(e=>{e.velocity+=e.acceleration,e.y-=e.velocity,e.y<-200&&(e.y=200,e.velocity=0)}),starGeo.verticesNeedUpdate=!0,c.rotation.y+=.002,i.render(n,o),requestAnimationFrame(e)}()}window.addEventListener("DOMContentLoaded",init);
//# sourceMappingURL=index.js.map