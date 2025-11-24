import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.js';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });

renderer.setClearColor(new THREE.Color('#222222'));

const scene = new THREE.Scene();
const axes = new THREE.AxesHelper(50);
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

const meshes = [];

{
  const radius = 5;
  const widthSegments = 10;
  const heightSegments = 5;
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  const material = new THREE.MeshPhongMaterial({
    emissive: new THREE.Color('#fefd54'),
  });

  const sunMesh = new THREE.Mesh(geometry, material);
  sunMesh.scale.set(3.5, 3.5, 3.5);

  const sunGroup = new THREE.Group();
  sunGroup.add(sunMesh);
  scene.add(sunGroup);

  meshes.push(sunGroup);
  meshes.push(sunMesh);

  const earthGroupAxes = new THREE.AxesHelper(10);
  earthGroupAxes.material.depthTest = false;
  earthGroupAxes.renderOrder = 1;
  const earthGroup = new THREE.Group();
  earthGroup.add(earthGroupAxes);
  earthGroup.position.x = 45;
  sunGroup.add(earthGroup);
  meshes.push(earthGroup);

  const earthMaterial = new THREE.MeshPhongMaterial({
    emissive: new THREE.Color('#3543f5'),
  });
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  earthGroup.add(earthMesh);

  const monMaterial = new THREE.MeshPhongMaterial({
    emissive: new THREE.Color('#8d8d8d'),
  });

  const monMesh = new THREE.Mesh(geometry, monMaterial);
  monMesh.position.x = 10;
  monMesh.scale.set(0.5, 0.5, 0.5);
  earthGroup.add(monMesh);
  meshes.push(monMesh);

  const monAxes = new THREE.AxesHelper(8);
  monAxes.material.depthTest = false;
  monAxes.renderOrder = 1;
  monMesh.add(monAxes);
}

{
  const light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 1;
  light.position.set(55, 2, 30);
  scene.add(light);
}

{
  const light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 1;
  light.position.set(-55, -2, -30);
  scene.add(light);
}

canvas.clientWidth / canvas.clientHeight;
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.clientWidth / canvas.clientHeight,
  1,
  1000
);
camera.position.set(0, 0, 150);
camera.lookAt(0, 0, 0);

function render(time) {
  if (resizeRendererToDisplaySize()) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  time *= 0.001;
  for (const m of meshes) {
    const speed = 0.8;
    const rot = time * speed;
    m.rotation.z = rot;
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

requestAnimationFrame(render);
