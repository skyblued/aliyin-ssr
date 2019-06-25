<template>
	<div class="preivew" id="preivew" ref="preivew">
		 <!-- <model-obj 
			:position="position"
			:rotation="rotation"
			@on-load="handleLoad"
			:width="size.width"
			:height="size.height"
			:lights='lights'
			:src="modelData.data.obj" 
			:mtl="modelData.data.mtl" 
			:backgroundAlpha="0"
			:cameraPosition="cameraPosition"
			:cameraRotation="cameraRotation"
			:cameraUp="cameraUp"
			:cameraLookAt="cameraLookAt"
		 ></model-obj> -->
		
		<div id="container" ref="container"></div>
	</div>
</template>


<script>
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols';
import {OBJLoader, MTLLoader, OBJMTLLoader} from "three-obj-mtl-loader";


export default {
	props: {
		modelData: {
			type: Object
		}
	},
	data () {
		return {
			size: { // 大小
				width: window.innerWidth,
				height: window.innerHeight
			},
			lights: [
                    {
						type: 'AmbientLight',
						color: 0xffffff,
						castShadow: true,
						intensity: 1.7
					},
                    {
						type: 'SpotLight',
						castShadow: true,
                        position: { x: 0, y: 50, z: 100 },
                        color: 'red',
                        intensity: 3
                    }
			],
			cameraPosition: { // 相机位置
				x: 0, y: 0, z: 50
			},
			cameraRotation: {
				x: 0, y: 0, z: 0
			},
			cameraUp: {
				x: 0, y: 1, z: 0
			},
			cameraLookAt: {
				x: 0, y: 0, z: 0
			},
			position: { // 位置
				x: 0, y: 0, z: 0
			},
			rotation: { // 各轴旋转
                x: 0,
                y: 0,
                z: 0
			},
			isRotation: 0, // 是否选转
			parentElem: null, // 父元素

			camera: null, // 相机
			scene: null,// 相机
			renderer: null,// 渲染器
			controls: null, // 控制器
			stats: null, // 性能
			mesh: null, // 物品
			reqId: null, // 渲染帧ID
			lightArr: [], //灯光
			modelObj: null,
		}
	},
	methods: {
		init: function() {
			
			let container = document.getElementById('container');
	
			this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
			// this.camera.position.y = 30;
			this.camera.position.z = 80;
			let loader = new THREE.TextureLoader(); // 贴图加载器
			// this.camera.lookAt(new THREE.Vector3(0, 0, 0));
			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color( 0xcce0ff );
			this.scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

			let geometry = new THREE.BoxGeometry(300, 150, 300);
			let boxTexture = loader.load(require('../../static/img/view/123.jpg'))
			let material = new THREE.MeshNormalMaterial();
    		var skyBoxMaterial = new THREE.MeshBasicMaterial( { map:boxTexture, side: THREE.DoubleSide } );
			this.mesh = new THREE.Mesh(geometry, skyBoxMaterial);
			this.mesh.castShadow = true;
			this.receiveShadow = true;
			this.mesh.position.y = 40;
			// this.scene.add(this.mesh);

			var geometry2 = new THREE.SphereGeometry( 100, 32, 32 );
			var material2 = new THREE.MeshBasicMaterial( {map: boxTexture, side: THREE.DoubleSide} );
			var sphere = new THREE.Mesh( geometry2, material2 );
			sphere.rotation.y = Math.PI ;
			sphere.position.y = 30;
			// this.scene.add( sphere );

			
			var groundTexture = loader.load(require('../../static/img/view/grasslight-big.jpg'));
				// console.log(groundTexture )
				groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
				groundTexture.repeat.set( 100, 100 );
				// groundTexture.anisotropy = 16;
			var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
			var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
			mesh.rotation.x = - Math.PI / 2;
			mesh.receiveShadow = true;
			// this.scene.add( mesh );

			var groundTexture2 = loader.load(require('../../static/img/view/123.jpg'));
				// console.log(groundTexture )
				groundTexture2.wrapS = groundTexture2.wrapT = THREE.RepeatWrapping;
				groundTexture2.repeat.set( 100, 100 );
				// groundTexture.anisotropy = 16;
			var groundMaterial2 = new THREE.MeshLambertMaterial( { map: groundTexture2 } );
			var mesh2 = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), groundMaterial2 );
			// mesh.rotation.x = - Math.PI / 2;
			mesh2.position.z = - 200;
			mesh2.scale.set(30,30,30)
			mesh2.receiveShadow = true;
			// this.scene.add( mesh2 );

			var groundTexture3 = loader.load(require('../../static/img/view/grasslight-big.jpg'));
				// console.log(groundTexture )
				groundTexture3.wrapS = groundTexture3.wrapT = THREE.RepeatWrapping;
				groundTexture3.repeat.set( 100, 100 );
				// groundTexture.anisotropy = 16;
			var groundMaterial3 = new THREE.MeshLambertMaterial( { map: groundTexture3 } );
			var mesh3 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial3 );
			mesh3.rotation.y =  Math.PI / 2;
			mesh3.position.x = -100;
			mesh3.receiveShadow = true;
			// this.scene.add( mesh3 );


			// 添加灯光
			this.addLights() 
			// this.setLights()

			// 加载mtl和obj文件
			let mtlLoader = new MTLLoader();
			mtlLoader.crossOrigin = 'anonymous';
			mtlLoader.load(this.modelData.data.mtl, materials => {
				// console.log(materials)
				materials.preload()
				
				let objLoader = new OBJLoader();
				objLoader.setMaterials(materials);
				objLoader.load(this.modelData.data.obj , obj => {
					console.log(obj)
					obj.receiveShadow = true;
					obj.castShadow = true;
					var box = new THREE.Box3();
					//通过传入的object3D对象来返回当前模型的最小大小，值可以使一个mesh也可以使group
					let boxSize = box.expandByObject(obj);
					var maxX = boxSize.max.x;
					var minX = boxSize.min.x;
					var maxY = boxSize.max.y;
					var minY = boxSize.min.y;
					var maxZ = boxSize.max.z;
					var minZ = boxSize.min.z;
					var maxDis = 120 / Math.sqrt(Math.pow(maxX - minX, 2)  + Math.pow(maxY - minY, 2)  + Math.pow(maxZ - minZ, 2)) / 2;
					// console.log( -(maxY + minY) / 3)
					
					obj.position.y = -(maxY + minY) / 3 * maxDis;//-20//
					obj.children.forEach(mesh => {
						// mesh.receiveShadow = true;
						mesh.castShadow = true;
					})

					mesh.position.y = -20;

					// console.log(boxSize, maxDis)
					obj.scale.multiplyScalar(maxDis)
					this.modelObj = obj
					this.scene.add(obj)
					this.$emit('handleLoad')
				}, undefined, (err) => this.$emit('handleError'))
			}, undefined, (err) => this.$emit('handleError'))
			// console.log(OBJLoader, MTLLoader)
			this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true}); // 加载渲染器,设置透明系数
			// console.log(this.renderer)
			this.renderer.shadowMap.enabled = true; // 设置可渲染阴影
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			container.appendChild(this.renderer.domElement);
			//启用控制器
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			
			// this.controls.autoRotate = true;
			this.controls.maxPolarAngle = Math.PI * 0.5; // 颠倒最大和最小角度
			// this.controls.minPolarAngle = Math.PI * 0.5; // 颠倒最大和最小角度
			
			// console.log(this.controls)
			window.addEventListener( 'resize', this.onWindowResize, false );
    	},
		animate: function() {
			this.reqId = requestAnimationFrame(this.animate);
			this.controls.update();
			this.renderer.render(this.scene, this.camera);
		},
		addLights: function() { // 设置灯光
			// var light = new THREE.AmbientLight( 0x404040 ); // soft white light
			var hemisphereLight =  new THREE.HemisphereLight(0xaaaaaa,0x000000, 1); // 半球光光源（HemisphereLight，可以为室内场景创建更加自然的光照效果，模拟反光面和光线微弱的天气）
			var ambientLight = new THREE.AmbientLight(0x404040); // 环境光 颜色会直接作用物体的当前颜色上 ,无处不在
			var spotLight = new THREE.SpotLight('0xffffff');     // 聚光灯  
				spotLight.position.set(5,50,0);
				spotLight.castShadow = true;
			var shadowLight =  new THREE.DirectionalLight(0xffffff, 1.2); // 定向光
				shadowLight.position.set(0, 10, 100);
				shadowLight.shadow.mapSize.width = 1000;
				shadowLight.shadow.mapSize.height = 1000;
				shadowLight.castShadow = true;
			var shadowLight2 =  new THREE.DirectionalLight(0xffffff, 1.2); // 定向光
				shadowLight2.position.set(0, 10, -100);
				shadowLight2.shadow.mapSize.width = 1000;
				shadowLight2.shadow.mapSize.height = 1000;
				shadowLight2.castShadow = true;
			
			

			
			this.scene.add(ambientLight);
			this.scene.add(hemisphereLight);  
			this.scene.add(shadowLight);
			this.scene.add(shadowLight2);
			// this.scene.add(spotLight);
		},
		setLights: function() {
			var spotLight = new THREE.SpotLight('0xffffff');     // 聚光灯  
			var spotLight2 = new THREE.SpotLight('0xffffff');     // 聚光灯  
			console.log(spotLight)
			
			spotLight.position.set(1,18,0);
			spotLight.castShadow = true;
			// spotLight.decay = 2
			// spotLight.penumbra = 0 // 边缘模糊 0-1



			spotLight2.position.set(0,10,-100);
			spotLight2.castShadow = true;
	
			var light = new THREE.AmbientLight(0xffffff, .3);   // 环境光源颜色
			// light.position.set(30, 30, 100);//光源位置

			this.lightArr.push(spotLight)
			// this.lightArr.push(spotLight2)
			this.scene.add(spotLight);
			// this.scene.add(spotLight2);

			this.scene.add(light);//光源添加到场景中
	
			this.camera.lookAt(this.scene.position)
		},
		onWindowResize: function () {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		},
		handleLoad() { // 加载完成
			this.$emit('handleLoad')
		},
		
	},
	mounted() {
		this.init()
		this.animate()
		

	},
	beforeDestroy() {
		cancelAnimationFrame( this.reqId );
		window.removeEventListener( 'resize', this.onWindowResize);
	}
}
</script>

<style lang="scss" scoped>
.preivew {
	position: relative;
	cursor: pointer;
}


</style>

