import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() {}

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render: FrameRequestCallback = (time) => {
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
        
        // メッシュの生成
        const geometry = new THREE.ConeGeometry(0.25, 1);
        const redMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        const blueMaterial =  new THREE.MeshPhongMaterial({ color: 0x0000FF });
        const redCone = new THREE.Mesh(geometry, redMaterial);
        const greenCone = new THREE.Mesh(geometry, greenMaterial);
        const blueCone = new THREE.Mesh(geometry, blueMaterial);

        //モデルの座標移動
        redCone.translateX(0.5);
        redCone.rotateZ(-Math.PI / 2);
        greenCone.translateY(0.5);
        blueCone.translateZ(0.5);
        blueCone.rotateX(Math.PI / 2);

        //グループにして一つのオブジェクトとして扱う
        const obj : THREE.Group = new THREE.Group();
        obj.add(redCone);
        obj.add(greenCone);
        obj.add(blueCone);
        this.scene.add(obj);

        // グリッド表示
        const gridHelper = new THREE.GridHelper( 10, );
        this.scene.add( gridHelper );  

        // 軸表示
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );

        // エルミート曲線の関数
        let hermite = (p0: THREE.Vector3, v0: THREE.Vector3,
            p1: THREE.Vector3, v1: THREE.Vector3, t: number) : THREE.Vector3 => {
            const result =
                p0.clone().multiplyScalar((2 * t + 1) * (1 - t) * (1 - t))
                    .add(v0.clone().multiplyScalar(t * (1 - t) * (1 - t)))
                    .add(p1.clone().multiplyScalar(t * t * (3 - 2 * t)))
                    .add(v1.clone().multiplyScalar(-t * t * (1 - t))); //エルミート曲線を実装する
            return result;
        }

        //ライトの設定
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        const clock = new THREE.Clock();
        let t = 0;
        let seg = 0;

        const pointsAndVelocities: THREE.Vector3[] = [
            new THREE.Vector3(0, 0, -4),
            new THREE.Vector3(0, 0, 3),
            new THREE.Vector3(0, 0, 2),
            new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(2, 0, 2),
            new THREE.Vector3(-2, 2, -2),
            new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(-4, 0, 0),
            new THREE.Vector3(-4, 2, 0),
            new THREE.Vector3(0, -2, 0)
        ];

        const update: FrameRequestCallback = (time) => {
            t += clock.getDelta();
            if (t > 1.0) {
                seg += 2;
                if (seg >= pointsAndVelocities.length - 2) {
                    seg = 0;
                }
                t -= 1.0;
            }

            const pos = hermite(
                pointsAndVelocities[seg],
                pointsAndVelocities[seg + 1],
                pointsAndVelocities[(seg + 2) % pointsAndVelocities.length],
                pointsAndVelocities[(seg + 3) % pointsAndVelocities.length],
                t
            );
            obj.position.copy(pos);
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(5, 7, 5));
    document.body.appendChild(viewport);
}
