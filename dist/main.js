/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var THREE = __importStar(__webpack_require__(/*! three */ "./node_modules/three/build/three.module.js"));
var OrbitControls_1 = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
var ThreeJSContainer = /** @class */ (function () {
    function ThreeJSContainer() {
        var _this = this;
        this.hands = [];
        // 画面部分の作成(表示する枠ごとに)
        this.createRendererDOM = function (width, height, cameraPos) {
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height);
            renderer.setClearColor(new THREE.Color(0x87CEEB));
            renderer.shadowMap.enabled = true; // シャドウマップを有効にする
            // カメラの設定
            var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.copy(cameraPos);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            var orbitControls = new OrbitControls_1.OrbitControls(camera, renderer.domElement);
            _this.createScene();
            // 毎フレームのupdateを呼んで，render
            // reqestAnimationFrame により次フレームを呼ぶ
            var render = function (time) {
                orbitControls.update();
                _this.updateHands();
                renderer.render(_this.scene, camera);
                requestAnimationFrame(render);
            };
            requestAnimationFrame(render);
            renderer.domElement.style.cssFloat = "left";
            renderer.domElement.style.margin = "10px";
            return renderer.domElement;
        };
        // シーンの作成(全体で1回)
        this.createScene = function () {
            // グリッド表示
            var gridHelper = new THREE.GridHelper(10);
            _this.scene.add(gridHelper);
            // 軸表示
            var axesHelper = new THREE.AxesHelper(5);
            _this.scene.add(axesHelper);
            // ライトの設定
            _this.light = new THREE.DirectionalLight(0xffffff);
            var lvec = new THREE.Vector3(1, 1, 1).clone().normalize();
            _this.light.position.set(lvec.x, lvec.y, lvec.z);
            _this.scene.add(_this.light);
            // 時計の作成
            var clockRadius = 4;
            var clockThickness = 0.5;
            var clockGeometry = new THREE.CylinderGeometry(clockRadius, clockRadius, clockThickness, 64);
            var clockMaterial = new THREE.MeshStandardMaterial({ color: 0xfff8dc });
            var clockMesh = new THREE.Mesh(clockGeometry, clockMaterial);
            clockMesh.rotation.x = Math.PI / 2;
            clockMesh.receiveShadow = true;
            _this.scene.add(clockMesh);
            // 枠の作成
            var frameGeometry = new THREE.TorusGeometry(clockRadius + 0.3, 0.2, 16, 100);
            var frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            var frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
            frameMesh.rotation.x = 0; // 角度の修正
            frameMesh.position.z = 0; // 時計の基盤に沿うように設定
            _this.scene.add(frameMesh);
            // 目盛りの作成
            var createMarker = function (size, position, color) {
                var markerGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                var markerMaterial = new THREE.MeshStandardMaterial({ color: color });
                var markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);
                markerMesh.position.copy(position);
                markerMesh.castShadow = true;
                return markerMesh;
            };
            for (var i = 0; i < 12; i++) {
                var angle = (i / 12) * Math.PI * 2;
                var x = clockRadius * Math.cos(angle);
                var y = clockRadius * Math.sin(angle);
                var markerSize = i % 3 === 0 ? new THREE.Vector3(0.2, 0.4, 0.2) : new THREE.Vector3(0.1, 0.2, 0.1);
                var markerPosition = new THREE.Vector3(x, y, clockThickness / 2 + 0.1);
                var marker = createMarker(markerSize, markerPosition, 0x8b4513);
                marker.lookAt(0, 0, clockThickness / 2 + 0.1);
                _this.scene.add(marker);
            }
            // 針の作成
            var createHand = function (length, color, width, height) {
                var handGeometry = new THREE.BoxGeometry(width, length, height);
                var handMaterial = new THREE.MeshStandardMaterial({ color: color });
                var handMesh = new THREE.Mesh(handGeometry, handMaterial);
                handMesh.position.set(0, 0, clockThickness / 2 + 0.1);
                handMesh.castShadow = true;
                return handMesh;
            };
            var hourHand = createHand(2.5, 0x000000, 0.1, 0.1);
            var minuteHand = createHand(3.5, 0x000000, 0.1, 0.1);
            var secondHand = createHand(4, 0xff0000, 0.05, 0.05);
            _this.scene.add(hourHand);
            _this.scene.add(minuteHand);
            _this.scene.add(secondHand);
            _this.hands.push(hourHand);
            _this.hands.push(minuteHand);
            _this.hands.push(secondHand);
            // 数字の作成
            var loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
                var createText = function (text, position, rotation, size) {
                    var textGeometry = new THREE.TextGeometry(text, {
                        font: font,
                        size: size,
                        height: 0.1,
                    });
                    var textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
                    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
                    textMesh.position.copy(position);
                    textMesh.rotation.copy(rotation);
                    textMesh.castShadow = true;
                    return textMesh;
                };
                for (var i = 1; i <= 12; i++) {
                    var angle = (i / 12) * Math.PI * 2 + Math.PI / 2; // 逆向きに45度回転
                    var x = (clockRadius - 1) * Math.cos(angle); // 内側に寄せるために -1
                    var y = (clockRadius - 1) * Math.sin(angle); // 内側に寄せるために -1
                    var textPosition = new THREE.Vector3(x, y, clockThickness / 2 + 0.2);
                    var textRotation = new THREE.Euler(0, 0, -angle + Math.PI / 2);
                    var textSize = 0.3 + Math.random() * 0.5; // ランダムなサイズを生成
                    var textMesh = createText(i.toString(), textPosition, textRotation, textSize);
                    _this.scene.add(textMesh);
                }
            });
            var update = function (time) {
                requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        };
        // 針の更新
        this.updateHands = function () {
            var now = new Date();
            var seconds = now.getSeconds();
            var minutes = now.getMinutes();
            var hours = now.getHours();
            _this.hands[0].rotation.z = -hours * 30 * Math.PI / 180;
            _this.hands[1].rotation.z = -minutes * 6 * Math.PI / 180;
            _this.hands[2].rotation.z = -seconds * 6 * Math.PI / 180;
        };
        this.scene = new THREE.Scene();
        this.light = new THREE.DirectionalLight(0xffffff);
        this.scene.add(this.light);
    }
    return ThreeJSContainer;
}());
window.addEventListener("DOMContentLoaded", init);
function init() {
    var container = new ThreeJSContainer();
    var viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 10, 20));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufSk7XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBUSFJFRSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwidGhyZWVcIikpO1xyXG52YXIgT3JiaXRDb250cm9sc18xID0gcmVxdWlyZShcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCIpO1xyXG52YXIgVGhyZWVKU0NvbnRhaW5lciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFRocmVlSlNDb250YWluZXIoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmhhbmRzID0gW107XHJcbiAgICAgICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqylcclxuICAgICAgICB0aGlzLmNyZWF0ZVJlbmRlcmVyRE9NID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGNhbWVyYVBvcykge1xyXG4gICAgICAgICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDg3Q0VFQikpO1xyXG4gICAgICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8vIOOCt+ODo+ODieOCpuODnuODg+ODl+OCkuacieWKueOBq+OBmeOCi1xyXG4gICAgICAgICAgICAvLyDjgqvjg6Hjg6njga7oqK3lrppcclxuICAgICAgICAgICAgdmFyIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2lkdGggLyBoZWlnaHQsIDAuMSwgMTAwMCk7XHJcbiAgICAgICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XHJcbiAgICAgICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xyXG4gICAgICAgICAgICB2YXIgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzXzEuT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xyXG4gICAgICAgICAgICBfdGhpcy5jcmVhdGVTY2VuZSgpO1xyXG4gICAgICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIxyZW5kZXJcclxuICAgICAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XHJcbiAgICAgICAgICAgIHZhciByZW5kZXIgPSBmdW5jdGlvbiAodGltZSkge1xyXG4gICAgICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZUhhbmRzKCk7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJlci5yZW5kZXIoX3RoaXMuc2NlbmUsIGNhbWVyYSk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcclxuICAgICAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcclxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyDjgrDjg6rjg4Pjg4nooajnpLpcclxuICAgICAgICAgICAgdmFyIGdyaWRIZWxwZXIgPSBuZXcgVEhSRUUuR3JpZEhlbHBlcigxMCk7XHJcbiAgICAgICAgICAgIF90aGlzLnNjZW5lLmFkZChncmlkSGVscGVyKTtcclxuICAgICAgICAgICAgLy8g6Lu46KGo56S6XHJcbiAgICAgICAgICAgIHZhciBheGVzSGVscGVyID0gbmV3IFRIUkVFLkF4ZXNIZWxwZXIoNSk7XHJcbiAgICAgICAgICAgIF90aGlzLnNjZW5lLmFkZChheGVzSGVscGVyKTtcclxuICAgICAgICAgICAgLy8g44Op44Kk44OI44Gu6Kit5a6aXHJcbiAgICAgICAgICAgIF90aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgICAgICB2YXIgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLmNsb25lKCkubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIF90aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcclxuICAgICAgICAgICAgX3RoaXMuc2NlbmUuYWRkKF90aGlzLmxpZ2h0KTtcclxuICAgICAgICAgICAgLy8g5pmC6KiI44Gu5L2c5oiQXHJcbiAgICAgICAgICAgIHZhciBjbG9ja1JhZGl1cyA9IDQ7XHJcbiAgICAgICAgICAgIHZhciBjbG9ja1RoaWNrbmVzcyA9IDAuNTtcclxuICAgICAgICAgICAgdmFyIGNsb2NrR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeShjbG9ja1JhZGl1cywgY2xvY2tSYWRpdXMsIGNsb2NrVGhpY2tuZXNzLCA2NCk7XHJcbiAgICAgICAgICAgIHZhciBjbG9ja01hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4ZmZmOGRjIH0pO1xyXG4gICAgICAgICAgICB2YXIgY2xvY2tNZXNoID0gbmV3IFRIUkVFLk1lc2goY2xvY2tHZW9tZXRyeSwgY2xvY2tNYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIGNsb2NrTWVzaC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDI7XHJcbiAgICAgICAgICAgIGNsb2NrTWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgX3RoaXMuc2NlbmUuYWRkKGNsb2NrTWVzaCk7XHJcbiAgICAgICAgICAgIC8vIOaeoOOBruS9nOaIkFxyXG4gICAgICAgICAgICB2YXIgZnJhbWVHZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0dlb21ldHJ5KGNsb2NrUmFkaXVzICsgMC4zLCAwLjIsIDE2LCAxMDApO1xyXG4gICAgICAgICAgICB2YXIgZnJhbWVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDhiNDUxMyB9KTtcclxuICAgICAgICAgICAgdmFyIGZyYW1lTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGZyYW1lR2VvbWV0cnksIGZyYW1lTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBmcmFtZU1lc2gucm90YXRpb24ueCA9IDA7IC8vIOinkuW6puOBruS/ruato1xyXG4gICAgICAgICAgICBmcmFtZU1lc2gucG9zaXRpb24ueiA9IDA7IC8vIOaZguioiOOBruWfuuebpOOBq+ayv+OBhuOCiOOBhuOBq+ioreWumlxyXG4gICAgICAgICAgICBfdGhpcy5zY2VuZS5hZGQoZnJhbWVNZXNoKTtcclxuICAgICAgICAgICAgLy8g55uu55ub44KK44Gu5L2c5oiQXHJcbiAgICAgICAgICAgIHZhciBjcmVhdGVNYXJrZXIgPSBmdW5jdGlvbiAoc2l6ZSwgcG9zaXRpb24sIGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoc2l6ZS54LCBzaXplLnksIHNpemUueik7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogY29sb3IgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyTWVzaCA9IG5ldyBUSFJFRS5NZXNoKG1hcmtlckdlb21ldHJ5LCBtYXJrZXJNYXRlcmlhbCk7XHJcbiAgICAgICAgICAgICAgICBtYXJrZXJNZXNoLnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgbWFya2VyTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXJrZXJNZXNoO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBhbmdsZSA9IChpIC8gMTIpICogTWF0aC5QSSAqIDI7XHJcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGNsb2NrUmFkaXVzICogTWF0aC5jb3MoYW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHkgPSBjbG9ja1JhZGl1cyAqIE1hdGguc2luKGFuZ2xlKTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXJTaXplID0gaSAlIDMgPT09IDAgPyBuZXcgVEhSRUUuVmVjdG9yMygwLjIsIDAuNCwgMC4yKSA6IG5ldyBUSFJFRS5WZWN0b3IzKDAuMSwgMC4yLCAwLjEpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlclBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoeCwgeSwgY2xvY2tUaGlja25lc3MgLyAyICsgMC4xKTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBjcmVhdGVNYXJrZXIobWFya2VyU2l6ZSwgbWFya2VyUG9zaXRpb24sIDB4OGI0NTEzKTtcclxuICAgICAgICAgICAgICAgIG1hcmtlci5sb29rQXQoMCwgMCwgY2xvY2tUaGlja25lc3MgLyAyICsgMC4xKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNjZW5lLmFkZChtYXJrZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOmHneOBruS9nOaIkFxyXG4gICAgICAgICAgICB2YXIgY3JlYXRlSGFuZCA9IGZ1bmN0aW9uIChsZW5ndGgsIGNvbG9yLCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHdpZHRoLCBsZW5ndGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IGNvbG9yIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRNZXNoID0gbmV3IFRIUkVFLk1lc2goaGFuZEdlb21ldHJ5LCBoYW5kTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgaGFuZE1lc2gucG9zaXRpb24uc2V0KDAsIDAsIGNsb2NrVGhpY2tuZXNzIC8gMiArIDAuMSk7XHJcbiAgICAgICAgICAgICAgICBoYW5kTWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kTWVzaDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIGhvdXJIYW5kID0gY3JlYXRlSGFuZCgyLjUsIDB4MDAwMDAwLCAwLjEsIDAuMSk7XHJcbiAgICAgICAgICAgIHZhciBtaW51dGVIYW5kID0gY3JlYXRlSGFuZCgzLjUsIDB4MDAwMDAwLCAwLjEsIDAuMSk7XHJcbiAgICAgICAgICAgIHZhciBzZWNvbmRIYW5kID0gY3JlYXRlSGFuZCg0LCAweGZmMDAwMCwgMC4wNSwgMC4wNSk7XHJcbiAgICAgICAgICAgIF90aGlzLnNjZW5lLmFkZChob3VySGFuZCk7XHJcbiAgICAgICAgICAgIF90aGlzLnNjZW5lLmFkZChtaW51dGVIYW5kKTtcclxuICAgICAgICAgICAgX3RoaXMuc2NlbmUuYWRkKHNlY29uZEhhbmQpO1xyXG4gICAgICAgICAgICBfdGhpcy5oYW5kcy5wdXNoKGhvdXJIYW5kKTtcclxuICAgICAgICAgICAgX3RoaXMuaGFuZHMucHVzaChtaW51dGVIYW5kKTtcclxuICAgICAgICAgICAgX3RoaXMuaGFuZHMucHVzaChzZWNvbmRIYW5kKTtcclxuICAgICAgICAgICAgLy8g5pWw5a2X44Gu5L2c5oiQXHJcbiAgICAgICAgICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xyXG4gICAgICAgICAgICBsb2FkZXIubG9hZCgnaHR0cHM6Ly90aHJlZWpzLm9yZy9leGFtcGxlcy9mb250cy9oZWx2ZXRpa2VyX2JvbGQudHlwZWZhY2UuanNvbicsIGZ1bmN0aW9uIChmb250KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3JlYXRlVGV4dCA9IGZ1bmN0aW9uICh0ZXh0LCBwb3NpdGlvbiwgcm90YXRpb24sIHNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dEdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQ6IGZvbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IHNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMC4xLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0TWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwMDAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHRNZXNoID0gbmV3IFRIUkVFLk1lc2godGV4dEdlb21ldHJ5LCB0ZXh0TWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRNZXNoLnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRNZXNoLnJvdGF0aW9uLmNvcHkocm90YXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRNZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0TWVzaDtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAxMjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuZ2xlID0gKGkgLyAxMikgKiBNYXRoLlBJICogMiArIE1hdGguUEkgLyAyOyAvLyDpgIblkJHjgY3jgas0NeW6puWbnui7olxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB4ID0gKGNsb2NrUmFkaXVzIC0gMSkgKiBNYXRoLmNvcyhhbmdsZSk7IC8vIOWGheWBtOOBq+WvhOOBm+OCi+OBn+OCgeOBqyAtMVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB5ID0gKGNsb2NrUmFkaXVzIC0gMSkgKiBNYXRoLnNpbihhbmdsZSk7IC8vIOWGheWBtOOBq+WvhOOBm+OCi+OBn+OCgeOBqyAtMVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0UG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyh4LCB5LCBjbG9ja1RoaWNrbmVzcyAvIDIgKyAwLjIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0Um90YXRpb24gPSBuZXcgVEhSRUUuRXVsZXIoMCwgMCwgLWFuZ2xlICsgTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0U2l6ZSA9IDAuMyArIE1hdGgucmFuZG9tKCkgKiAwLjU7IC8vIOODqeODs+ODgOODoOOBquOCteOCpOOCuuOCkueUn+aIkFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0TWVzaCA9IGNyZWF0ZVRleHQoaS50b1N0cmluZygpLCB0ZXh0UG9zaXRpb24sIHRleHRSb3RhdGlvbiwgdGV4dFNpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNjZW5lLmFkZCh0ZXh0TWVzaCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gKHRpbWUpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIOmHneOBruabtOaWsFxyXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgc2Vjb25kcyA9IG5vdy5nZXRTZWNvbmRzKCk7XHJcbiAgICAgICAgICAgIHZhciBtaW51dGVzID0gbm93LmdldE1pbnV0ZXMoKTtcclxuICAgICAgICAgICAgdmFyIGhvdXJzID0gbm93LmdldEhvdXJzKCk7XHJcbiAgICAgICAgICAgIF90aGlzLmhhbmRzWzBdLnJvdGF0aW9uLnogPSAtaG91cnMgKiAzMCAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgICAgICAgIF90aGlzLmhhbmRzWzFdLnJvdGF0aW9uLnogPSAtbWludXRlcyAqIDYgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICAgICAgICBfdGhpcy5oYW5kc1syXS5yb3RhdGlvbi56ID0gLXNlY29uZHMgKiA2ICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICB0aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFRocmVlSlNDb250YWluZXI7XHJcbn0oKSk7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHZhciBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xyXG4gICAgdmFyIHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKDY0MCwgNDgwLCBuZXcgVEhSRUUuVmVjdG9yMygwLCAxMCwgMjApKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyb2xzX09yYml0Q29udHJvbHNfanNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=