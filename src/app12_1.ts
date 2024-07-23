//22FI029 小川麗

import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() { }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; // シャドウマップを有効にする

        // カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで、render
        // requestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
            TWEEN.update(time); // TWEENの更新
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

        const redCube = this.createCube(0xFF0000);
        const greenCube = this.createCube(0x00FF00);

        redCube.position.set(-1, 0, 0);
        greenCube.position.set(1, 0, 0);

        this.scene.add(redCube);
        this.scene.add(greenCube);

        // Tweenでコントロールする変数の定義
        const redCubeTweenInfo = { x: -1, y: 0 };
        const greenCubeTweenInfo = { x: 1, y: 0 };

        // 赤い立方体のアニメーション
        const redCubeTween1 = new TWEEN.Tween(redCubeTweenInfo)
            .to({ x: 0, y: 2 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                redCube.position.set(redCubeTweenInfo.x, redCubeTweenInfo.y, 0);
            });

        const redCubeTween2 = new TWEEN.Tween(redCubeTweenInfo)
            .to({ x: 2, y: 0 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                redCube.position.set(redCubeTweenInfo.x, redCubeTweenInfo.y, 0);
            });

        const redCubeTween3 = new TWEEN.Tween(redCubeTweenInfo)
            .to({ x: 0, y: -2 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                redCube.position.set(redCubeTweenInfo.x, redCubeTweenInfo.y, 0);
            });

        const redCubeTween4 = new TWEEN.Tween(redCubeTweenInfo)
            .to({ x: -2, y: 0 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                redCube.position.set(redCubeTweenInfo.x, redCubeTweenInfo.y, 0);
            });

        // 緑の立方体のアニメーション
        const greenCubeTween1 = new TWEEN.Tween(greenCubeTweenInfo)
            .to({ x: 0, y: -2 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                greenCube.position.set(greenCubeTweenInfo.x, greenCubeTweenInfo.y, 0);
            });

        const greenCubeTween2 = new TWEEN.Tween(greenCubeTweenInfo)
            .to({ x: -2, y: 0 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                greenCube.position.set(greenCubeTweenInfo.x, greenCubeTweenInfo.y, 0);
            });

        const greenCubeTween3 = new TWEEN.Tween(greenCubeTweenInfo)
            .to({ x: 0, y: 2 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                greenCube.position.set(greenCubeTweenInfo.x, greenCubeTweenInfo.y, 0);
            });

        const greenCubeTween4 = new TWEEN.Tween(greenCubeTweenInfo)
            .to({ x: 2, y: 0 }, 1000)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(() => {
                greenCube.position.set(greenCubeTweenInfo.x, greenCubeTweenInfo.y, 0);
            });

        // アニメーションの連結
        redCubeTween1.chain(redCubeTween2);
        redCubeTween2.chain(redCubeTween3);
        redCubeTween3.chain(redCubeTween4);
        redCubeTween4.chain(redCubeTween1);

        greenCubeTween1.chain(greenCubeTween2);
        greenCubeTween2.chain(greenCubeTween3);
        greenCubeTween3.chain(greenCubeTween4);
        greenCubeTween4.chain(greenCubeTween1);

        redCubeTween1.start();
        greenCubeTween1.start();

        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }

    private createCube(color: number): THREE.Mesh {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: color });
        const cube = new THREE.Mesh(geometry, material);
        return cube;
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 10));
    document.body.appendChild(viewport);
}
