//22FI029 小川麗

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private plane: THREE.Mesh;
    
    private group: THREE.Group;//グループを作る

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする

        //カメラの設定
        //new THREE.PerspectiveCamera(視野角, アスペクト比, カメラのどれくらい近くから描画するか, メラのどれくらい遠くまでを描画するか);
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));//カメラがどこを見るか

        //new THREE.OrthographicCamera(left, right, top, bottom, near, far)
        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
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
        this.group = new THREE.Group();//THREE.Groupのインスタンスを作成

         // テクスチャの読み込み
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load('texture1.jpg'); // 画像ファイルのパスを指定
        let texture1 = textureLoader.load('texture2.jpg'); // 画像ファイルのパスを指定




        //let geometry = new THREE.BoxGeometry(1, 1, 1);
        //let geometry = new THREE.SphereGeometry(0.7, 20, 20);//球

       // let material = new THREE.MeshStandardMaterial({ color: 0x55ff00 });

        //光沢
        // let material = new THREE.MeshPhongMaterial({color: 0x55ff00});

        
        //ポリゴン
        //let material  = new THREE.MeshBasicMaterial({ color: 0x55ff00 });

        //色の設定をしている
        //let material = new THREE.MeshBasicMaterial({ color: 0x000fff });

        //カメラに対して立方体の面が向いている方向に応じて色が変わっている
        //let material = new THREE.MeshNormalMaterial();

        //ワイヤーフレームで図形を作成
        //material.wireframe = true;

        //透明にする
        //material.opacity = 0.1;
        //material.transparent = true;


        /*let geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        let matArray = [];
　　　　 matArray.push(new THREE.MeshBasicMaterial({ color: 0x009e60 }));
　　　　 matArray.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));
　　　　 matArray.push(new THREE.MeshBasicMaterial({ color: 0xffd500 }));
　　　　 matArray.push(new THREE.MeshBasicMaterial({ color: 0xff5800 }));
　　　　 matArray.push(new THREE.MeshBasicMaterial({ color: 0xc41e3a }));
　　　　 matArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));
          */
    let geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    let matArray = [
    new THREE.MeshPhongMaterial({ color: 0xff0000}), // 光沢のあるマテリアル
    new THREE.MeshToonMaterial({ color: 0x00ff00 }), //トゥーンシェーディングのマテリアル
    new THREE.MeshStandardMaterial({ color: 0x0000ff}),// 金属のようなマテリアル
    new THREE.MeshDistanceMaterial(),//特殊なマテリアル
    new THREE.MeshBasicMaterial({ map: texture1 }),
    new THREE.MeshBasicMaterial({ map: texture }),
];


　　for (let x = 0; x < 3; x++) {
    　　for (let y = 0; y < 3; y++) {
        　　for (let z = 0; z < 3; z++) {
            const mesh = new THREE.Mesh(geometry, matArray);
            mesh.position.set(x*2-2,y*2-2,z*2-2);
            this.group.add(mesh);
　　　　　　 }
    　　}
　　}

this.scene.add(this.group);

    /*// オブジェクトを3x3に並べて生成
        for (let x = 0; x < 3; x++) {
            for (let z = 0; z < 3; z++) {
                // メッシュの生成
                let mesh = new THREE.Mesh(geometry, matArray);
                //let mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                // メッシュの位置を設定
                mesh.position.set(x * 2 - 2, 0, z * 2 - 2) ;
                // メッシュをシーンに追加
                this.scene.add(mesh);
            }
        }

     */
        

        // 平面の生成
        let planeGeometry = new THREE.PlaneGeometry(20, 20);
        let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.receiveShadow = true; //影を受けるようにする
        this.plane.position.y = -5;
        this.plane.rotation.x = -Math.PI / 2;
        this.scene.add(this.plane);

        //ライトの設定
        let light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.set(1, 1, 1);
        light.target = this.plane;
        light.castShadow = true;
        this.scene.add(light);

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
            this.group.rotateX(0.01); // 追加
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-3, 3, 3));
    document.body.appendChild(viewport);
}
