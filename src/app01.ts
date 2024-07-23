import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private hourHand: THREE.Mesh;
    private minuteHand: THREE.Mesh;
    private secondHand: THREE.Mesh;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            orbitControls.update();

            this.updateClockHands();

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

        // 時計の盤面を作成
        const clockFaceGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 64);
        const clockFaceMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
        const clockFace = new THREE.Mesh(clockFaceGeometry, clockFaceMaterial);
        clockFace.rotation.x = Math.PI / 2;
        this.scene.add(clockFace);

        // 目盛りの追加
        const createTick = (length: number, width: number, color: number) => {
            const geometry = new THREE.BoxGeometry(width, length, 0.1);
            const material = new THREE.MeshBasicMaterial({ color });
            return new THREE.Mesh(geometry, material);
        };

        for (let i = 0; i < 60; i++) {
            const tick = createTick(i % 5 === 0 ? 0.5 : 0.2, 0.05, 0x000000);
            tick.position.set(0, 5, 0);
            tick.rotation.z = i * (Math.PI / 30);
            this.scene.add(tick);
            tick.translateY(-4.8);
        }

        // 時計の針を作成
        const hourHandGeometry = new THREE.BoxGeometry(0.3, 2.5, 0.1);
        const minuteHandGeometry = new THREE.BoxGeometry(0.2, 3.5, 0.1);
        const secondHandGeometry = new THREE.BoxGeometry(0.1, 4.5, 0.1);

        const hourHandMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const minuteHandMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const secondHandMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        this.hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
        this.minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);
        this.secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);

        // 針の位置を中心に合わせる
        this.hourHand.position.y = 0.25;
        this.minuteHand.position.y = 0.25;
        this.secondHand.position.y = 0.25;

        this.scene.add(this.hourHand);
        this.scene.add(this.minuteHand);
        this.scene.add(this.secondHand);

        // ライトの設定
        let light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.set(1, 1, 1);
        light.castShadow = true;
        this.scene.add(light);

        let ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        // 平面の生成
        let planeGeometry = new THREE.PlaneGeometry(20, 20);
        let planeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true; //影を受けるようにする
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -5;
        this.scene.add(plane);
    }

    private updateClockHands = () => {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours() % 12;

        // 秒針の回転
        this.secondHand.rotation.z = -seconds * (Math.PI / 30);
        // 分針の回転
        this.minuteHand.rotation.z = -minutes * (Math.PI / 30) - seconds * (Math.PI / 1800);
        // 時針の回転
        this.hourHand.rotation.z = -hours * (Math.PI / 6) - minutes * (Math.PI / 360);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-10, 10, 10));
    document.body.appendChild(viewport);
}
