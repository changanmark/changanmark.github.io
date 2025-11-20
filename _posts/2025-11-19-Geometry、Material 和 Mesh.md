---
title: Geometry、Material 和 Mesh
date: 2025-11-19 00:00:00 +0800 # YYYY-MM-DD HH:MM:SS +/-TTTT 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: ["编程"]
tags: ["three.js"] # TAG names should always be lowercase

media_subpath: "/assets/img/posts/2025-11-19-Geometry&Material&Mesh"

math: true
mermaid: true
---

<canvas id="c" style="display: block;width: 100%; height: 500px"></canvas>

## Geometry
geometry 在 threejs 中代表几何顶点位置、索引、法线、颜色、UV纹理和自定义属性等信息，threejs 内置的几何命名规则是XXXGeometry,基本都是扩展自`BufferGeometry`。

BufferGeometry类似于一个 Map 容器，通过属性 position,index,normal,uv 等key映射具体的类型数组数据。具体的类型数组数据由`BufferAttribute`类表示。

其中顶点位置属性必须设置 
```js
const geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2
	 1.0,  1.0,  1.0, // v3
	-1.0,  1.0,  1.0, // v4
	-1.0, -1.0,  1.0  // v5
] );
// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
```

除了设置 position，还可以设置顶点索引 index，法线 normal, 贴图 uv 或者自定义属性。
可以通过任意一个几何体的 attributes 属性查看具有哪些属性，知道了这些属性，就可以自己设置属性来构造自定义的 Geometry 了。

## Material
material 在 threejs 中代表材质，材质决定了可渲染 3D 对象的外观。threejs 中内置的材质命名规则是 XXXMaterial，基本都是扩展自`Material`抽象类。

MeshBasicMaterial 不受光照影响

MeshLambertMaterial 漫反射效果

MeshPhongMaterial  高光反射效果

MeshPhysicalMaterial、MeshStandardMaterial这两种是物理材质

## Mesh
mesh 在 threejs 中代表网格对象，是 geometry 和 material 的结合体。geometry 中有顶点，顶点连接索引，material 中有渲染的外观信息，mesh 表示通过顶点连接成三角形网格后外表贴上材质对应外观的物体。

<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.181.1/examples/jsm/"
    }
  }
</script>

<script type="module">
  import * as THREE from "three";
  import {meshes} from "/assets/utils/2025-11-19-Geometry&Material&Mesh/index.js"
  // 获取 Canvas
  const canvas = document.getElementById("c");
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true,canvas: canvas });

  // 设置背景色
  renderer.setClearColor(new THREE.Color('#c1c1c1'))

  // 创建场景
  const scene = new THREE.Scene();

  // meshes
  const meshesClone = [...meshes]
  for(let y=2; y>=-2; y--) {
    for (let x= -2; x<=2; x++) {
      const m = meshesClone.shift()
      if(m) {
        m.position.x = x * 40;
        m.position.y = y * 25;
        scene.add(m)
      }
    }
  }

  // 创建灯光
  {
    const light = new THREE.DirectionalLight(0xffffff); // 平行光
    light.intensity = 3
    light.position.set(15, 5, 30)
    scene.add(light);
  }

  {
    const light = new THREE.DirectionalLight(0xffffff); // 平行光
    light.intensity = 3
    light.position.set(-15, -5, -30)
    scene.add(light);
  }
  

  canvas.clientWidth/canvas.clientHeight
  // 创建一个相机
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth/canvas.clientHeight, 1, 1000);
  // 设置相机位置
  camera.position.set(0, 0, 150);
  // 相机镜头方向
  camera.lookAt(0, 0, 0);
  
  function render(time) {
      if (resizeRendererToDisplaySize()) {
          camera.aspect = canvas.clientWidth/canvas.clientHeight;
          camera.updateProjectionMatrix();
      }


      time *= 0.001;
      for(const m of meshes) {
          const speed = 0.5;
          const rot = time * speed;
          m.rotation.x = rot;
          m.rotation.y = rot;
      }
      
      renderer.render(scene, camera);
      requestAnimationFrame(render);
  }

  function resizeRendererToDisplaySize() {
      const width = canvas.clientWidth * window.devicePixelRatio;
      const height = canvas.clientHeight * window.devicePixelRatio;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
          renderer.setSize(width, height, false);
      }
      return needResize;
  }

  requestAnimationFrame(render)
</script>
