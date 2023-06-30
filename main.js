import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
import gsap from "gsap";

//Scene
const scene = new Three.Scene();

//Geometry of sphere
const geometry = new Three.SphereGeometry(3, 64, 64);
const material = new Three.MeshStandardMaterial({
  color: "#00ff83",
});

const mesh = new Three.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Light
const light = new Three.PointLight("0xffffff", 1, 100);
light.position.set(0, 10, 10);
scene.add(light);

//Camera
const camera = new Three.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
); // cant see beyond 100 and closer 0.1
camera.position.z = 20;
scene.add(camera);

//rendering
const canvas = document.querySelector(".webgl");
const renderer = new Three.WebGL1Renderer({ canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

window.addEventListener("resize", () => {
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
  camera.updateProjectionMatrix();
});

const loop = () => {
  light.rotation.x += 0.2;
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(loop);
};

const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
tl.fromTo(".nav", { x: "-100%", y: "-100%" }, { x: "0%", y: "0%" });

let mouseDown = false;
window.addEventListener("mousedown", () => {
  mouseDown = true;
});

window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let r = Math.round((e.pageY / sizes.height) * 255);
    let g = Math.round((e.pageX / sizes.width) * 255);
    let b = 120;
    let color = new Three.Color(`rgb(${r}, ${g}, ${b})`);

    gsap.to(mesh.material.color, { r: color.r, g: color.g, b: color.b });
  }
});

loop();
