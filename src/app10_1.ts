//22FI029 小川麗
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cloud: THREE.Points;
    private particleVelocity: THREE.Vector3[];
    private particleCount: number;
    private clock: THREE.Clock;


    constructor() {
        this.particleCount = 50000;  // パーティクルの数を増やす
        this.clock = new THREE.Clock();
    }
    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.shadowMap.enabled = true;
    //カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 15);  // カメラの位置を調整
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
    // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
            this.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }
    // シーンの作成(全体で1回)
    private createScene = () => {
        this.scene = new THREE.Scene();
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('raindrop.png');

        let createParticles = () => {
            const geometry = new THREE.BufferGeometry();
            const material = new THREE.PointsMaterial({
                size: 0.1,
                map: texture,
                blending: THREE.AdditiveBlending,
                color: 0xffffff,
                depthWrite: false,
                transparent: true,
                opacity: 0.5
            });

            const positions = new Float32Array(this.particleCount * 3);
            this.particleVelocity = [];

            for (let i = 0; i < this.particleCount; i++) {
                positions[i * 3] = (Math.random() * 20) - 10; // x座標
                positions[i * 3 + 1] = Math.random() * 20;    // y座標
                positions[i * 3 + 2] = (Math.random() * 20) - 10; // z座標
                this.particleVelocity.push(new THREE.Vector3(0, -Math.random() * 0.2 - 0.1, 0));
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.cloud = new THREE.Points(geometry, material);
            this.scene.add(this.cloud);
        }
        createParticles();
        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }
    // 毎フレームのupdateを呼んで更新
    // reqestAnimationFrame により次フレームを呼ぶ
    private update = () => {
        const geom = <THREE.BufferGeometry>this.cloud.geometry;
        const positions = geom.getAttribute('position');
        const deltaTime = this.clock.getDelta();

        for (let i = 0; i < this.particleVelocity.length; i++) {
            let y = positions.getY(i) + this.particleVelocity[i].y* deltaTime;
            
            if (y < -10) {  // パーティクルが一定のy位置に到達したら上部に戻す
                y = 10;
            }
            positions.setY(i, y);
        }

        positions.needsUpdate = true;
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(800, 600, new THREE.Vector3(0, 0, 20));  // カメラのZ座標を調整
    document.body.appendChild(viewport);
}

