//22FI029 小川麗
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;
    private cloud1: THREE.Points;
    private cloud2: THREE.Points;
    private cloud3: THREE.Points;
    private clock: THREE.Clock;

    constructor() {
        this.clock = new THREE.Clock();
    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; // シャドウマップを有効にする
        renderer.setClearColor(new THREE.Color(0x000000)); // 黒色の背景

        // カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
            const deltaTime = this.clock.getDelta();
            this.update(deltaTime);

            orbitControls.update();
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

        const createPoints = (geom: THREE.TorusGeometry, color1: string, color2: string, color3: string, color4: string) => {
            const material = new THREE.PointsMaterial({
                map: this.generateSprite(color1, color2, color3, color4),
                color: 0xffffff,
                size: 0.3,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            return new THREE.Points(geom, material);
        }




        this.cloud1 = createPoints(new THREE.TorusGeometry(5, 1.5,30, 8), 'rgba(255,255,255,1)', 'rgba(0,0,255,1)', 'rgba(0, 0,64,1)', 'rgba(0,0,0,1)');
        this.cloud1.position.set(0, 0, 0);
        this.scene.add(this.cloud1);


        this.cloud2 = createPoints(new THREE.TorusGeometry(5, 1.5, 30, 8), 'rgba(255,255,255,1)', 'rgba(255,0,0,1)', 'rgba(64, 0, 0,1)', 'rgba(0,0,0,1)');
        this.cloud2.position.set(0, 0, 0);
        this.scene.add(this.cloud2);

        this.cloud3 = createPoints(new THREE.TorusGeometry(5, 1.5, 30, 8), 'rgba(255,255,255,1)', 'rgba(0,255,0,1)', 'rgba(0, 64, 0,1)', 'rgba(0,0,0,1)');
        this.cloud3.position.set(0, 0, 0);
        this.scene.add(this.cloud3);

        

        // ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    }

    private generateSprite = (color1: string, color2: string, color3: string, color4: string) => {
        // 新しいキャンバスの作成
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;

        // 円形のグラデーションの作成
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(0.2, color2);
        gradient.addColorStop(0.4, color3);
        gradient.addColorStop(1, color4);

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // テクスチャの生成
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    // 毎フレームのupdateを呼んで，更新
    private update = (deltaTime: number) => {
        const speed = 1.5;
        this.cloud1.rotation.z += speed * deltaTime*1.5;
        this.cloud2.rotation.z += speed * deltaTime*2.0;
        this.cloud3.rotation.z += speed * deltaTime;
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 10));
    document.body.appendChild(viewport);
}
