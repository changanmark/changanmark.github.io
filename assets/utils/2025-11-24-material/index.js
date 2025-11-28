import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.181.1/build/three.module.js';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });

renderer.setClearColor(new THREE.Color('#c1c1c1'));

const scene = new THREE.Scene();

const meshes = [];

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
