import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private hands: THREE.Mesh[] = [];

    constructor() {
        this.scene = new THREE.Scene();
        this.light = new THREE.DirectionalLight(0xffffff);
        this.scene.add(this.light);
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x87CEEB));
        renderer.shadowMap.enabled = true; // シャドウマップを有効にする

        // カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
            this.updateHands();
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
        // グリッド表示
        const gridHelper = new THREE.GridHelper(10);
        this.scene.add(gridHelper);

        // 軸表示
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        // 時計の作成
        const clockRadius = 4;
        const clockThickness = 0.5;
        const clockGeometry = new THREE.CylinderGeometry(clockRadius, clockRadius, clockThickness, 64);
        const clockMaterial = new THREE.MeshStandardMaterial({ color: 0xfff8dc });
        const clockMesh = new THREE.Mesh(clockGeometry, clockMaterial);
        clockMesh.rotation.x = Math.PI / 2;
        clockMesh.receiveShadow = true;
        this.scene.add(clockMesh);

        // 枠の作成
        const frameGeometry = new THREE.TorusGeometry(clockRadius + 0.3, 0.2, 16, 100);
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
        frameMesh.rotation.x = 0; // 角度の修正
        frameMesh.position.z = 0; // 時計の基盤に沿うように設定
        this.scene.add(frameMesh);

        // 目盛りの作成
        const createMarker = (size: THREE.Vector3, position: THREE.Vector3, color: number) => {
            const markerGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
            const markerMaterial = new THREE.MeshStandardMaterial({ color: color });
            const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
            markerMesh.position.copy(position);
            markerMesh.castShadow = true;
            return markerMesh;
        }

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const x = clockRadius * Math.cos(angle);
            const y = clockRadius * Math.sin(angle);
            const markerSize = i % 3 === 0 ? new THREE.Vector3(0.2, 0.4, 0.2) : new THREE.Vector3(0.1, 0.2, 0.1);
            const markerPosition = new THREE.Vector3(x, y, clockThickness / 2 + 0.1);
            const marker = createMarker(markerSize, markerPosition, 0x8b4513);
            marker.lookAt(0, 0, clockThickness / 2 + 0.1);
            this.scene.add(marker);
        }

        // 針の作成
        const createHand = (length: number, color: number, width: number, height: number) => {
            const handGeometry = new THREE.BoxGeometry(width, length, height);
            const handMaterial = new THREE.MeshStandardMaterial({ color: color });
            const handMesh = new THREE.Mesh(handGeometry, handMaterial);
            handMesh.position.set(0, 0, clockThickness / 2 + 0.1);
            handMesh.castShadow = true;
            return handMesh;
        }

        const hourHand = createHand(2.5, 0x000000, 0.1, 0.1);
        const minuteHand = createHand(3.5, 0x000000, 0.1, 0.1);
        const secondHand = createHand(4, 0xff0000, 0.05, 0.05);

        this.scene.add(hourHand);
        this.scene.add(minuteHand);
        this.scene.add(secondHand);

        this.hands.push(hourHand);
        this.hands.push(minuteHand);
        this.hands.push(secondHand);

        // 数字の作成
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
            const createText = (text: string, position: THREE.Vector3, rotation: THREE.Euler, size: number) => {
                const textGeometry = new THREE.TextGeometry(text, {
                    font: font,
                    size: size,
                    height: 0.1,
                });
                const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.copy(position);
                textMesh.rotation.copy(rotation);
                textMesh.castShadow = true;
                return textMesh;
            }

            for (let i = 1; i <= 12; i++) {
                const angle = (i / 12) * Math.PI * 2 + Math.PI / 2; // 逆向きに45度回転
                const x = (clockRadius - 1) * Math.cos(angle); // 内側に寄せるために -1
                const y = (clockRadius - 1) * Math.sin(angle); // 内側に寄せるために -1
                const textPosition = new THREE.Vector3(x, y, clockThickness / 2 + 0.2);
                const textRotation = new THREE.Euler(0, 0, -angle + Math.PI / 2);
                const textSize = 0.3 + Math.random() * 0.5; // ランダムなサイズを生成
                const textMesh = createText(i.toString(), textPosition, textRotation, textSize);
                this.scene.add(textMesh);
            }
        });

        let update: FrameRequestCallback = (time) => {
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // 針の更新
    private updateHands = () => {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();

        this.hands[0].rotation.z = -hours * 30 * Math.PI / 180;
        this.hands[1].rotation.z = -minutes * 6 * Math.PI / 180;
        this.hands[2].rotation.z = -seconds * 6 * Math.PI / 180;
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 10, 20));
    document.body.appendChild(viewport);
}
