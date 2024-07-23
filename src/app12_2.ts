// 22FI029 小川麗

import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cloud: THREE.Points;

    constructor() { }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.shadowMap.enabled = true;

        // カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで、render
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
            TWEEN.update(time);
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    


    // シーンの作成
    private createScene = () => {
        this.scene = new THREE.Scene();

        const particleNum = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleNum * 3);

        for (let i = 0; i < particleNum; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
        }



        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
        this.cloud = new THREE.Points(particles, material);


        this.scene.add(this.cloud);

        this.animateParticles(particles);
        
        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();


        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }

    private animateParticles = (geometry: THREE.BufferGeometry) => {
        const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
        const particleNum = positions.count;

        for (let i = 0; i < particleNum; i++) {
            const tweeninfo = { x: 0, y: 0, z: 0, index: i };

            const updatePosition = () => {
                positions.setX(tweeninfo.index, tweeninfo.x);
                positions.setY(tweeninfo.index, tweeninfo.y);
                positions.setZ(tweeninfo.index, tweeninfo.z);
                
                positions.needsUpdate = true;
            };

            const destination = this.randomSpherePoint(0, 0, 0, 5);

            const toSphere = new TWEEN.Tween(tweeninfo)
                .to({ x: destination.x, y: destination.y, z: destination.z }, 2000)
                .easing(TWEEN.Easing.Elastic.Out)
                .onUpdate(updatePosition);

            const toOrigin = new TWEEN.Tween(tweeninfo)
                .to({ x: 0, y: 0, z: 0 }, 2000)
                .easing(TWEEN.Easing.Elastic.Out)
                .onUpdate(updatePosition);

            toSphere.chain(toOrigin);
            toOrigin.chain(toSphere);

            toSphere.start();
        }
    }

    private randomSpherePoint = (x0: number, y0: number, z0: number, radius: number) => {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
        const y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
        const z = z0 + (radius * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 20));
    document.body.appendChild(viewport);
}
