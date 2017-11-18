var scene, camera, renderer, mesh, clock;
var meshFloor, ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;

var temp = 0;

var loadingScreen = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500),
	box: new THREE.Mesh(
		new THREE.BoxGeometry(0.5,0.5,0.5),
		new THREE.MeshBasicMaterial({ color:0x4444ff })
	)
};
var loadingManager = null;
var RESOURCES_LOADED = false;

// Models index
var models = {
	fanblade: {
		obj:"models/SP120_Fanblade.obj",
		mtl:"models/SP120_Fanblade.mtl",
		mesh: null
	},
	fanframe: {
		obj:"models/120_Fan_Frame.obj",
		mtl:"models/120_Fan_Frame.mtl",
		mesh: null
	},
	table: {
		obj:"models/table_fan_hole.obj",
		mtl:"models/table_fan_hole.mtl",
		mesh: null
	}
};

// Meshes index
var meshes = {};


function init(){
	scene = new THREE.Scene();
	camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
	clock = new THREE.Clock();
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor(0xdddddd);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	
	loadingScreen.box.position.set(0,0,5);
	loadingScreen.camera.lookAt(loadingScreen.box.position);
	loadingScreen.scene.add(loadingScreen.box);
	
    /*add controls*/
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', renderer );
	
	/*Camera*/
    camera.position.x = 15;
    camera.position.y = 120;
    camera.position.z = 10;
    camera.lookAt(scene.position);
	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onProgress = function(item, loaded, total){
		console.log(item, loaded, total);
	};
	loadingManager.onLoad = function(){
		console.log("loaded all resources");
		RESOURCES_LOADED = true;
		onResourcesLoaded();
	};
	
	
	// mesh = new THREE.Mesh(
		// new THREE.BoxGeometry(1,1,1),
		// new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
	// );
	// mesh.position.y += 1;
	// mesh.receiveShadow = true;
	// mesh.castShadow = true;
	// scene.add(mesh);

	
	/*Lights*/
	var ambient = new THREE.AmbientLight( 0x505050 );
	scene.add( ambient );
	spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 10, 120, -50 );
	spotLight.castShadow = true;
	spotLight.shadowCameraNear = 8;
	spotLight.shadowCameraFar = 30;
	spotLight.shadowDarkness = 0.5;
	spotLight.shadowCameraVisible = false;
	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;
	spotLight.name = 'Spot Light';
	scene.add( spotLight );
	
	
	tableLight1 = new THREE.SpotLight( 0xffffff );
	tableLight1.position.set( 0, 18, 30 );
	tableLight1.castShadow = true;
	tableLight1.shadowCameraNear = 8;
	tableLight1.shadowCameraFar = 15;
	tableLight1.shadowDarkness = 0.2;
	tableLight1.angle = -Math.PI;
	tableLight1.intensity = 10;
	tableLight1.distance = 50;
	tableLight1.shadowCameraVisible = false;
	tableLight1.shadowMapWidth = 1024;
	tableLight1.shadowMapHeight = 1024;
	tableLight1.name = 'Spot Light';
	scene.add( tableLight1 );
	
	
	/*CONTROLS*/
	
	/*Led Controls*/
	guiControls_LED = new function(){
		this.ledRed = 0;
		this.ledGreen = 0;
		this.ledBlue = 0;
		this.ledWhite = 0;
	}
	datGUI_LED = new dat.GUI();
		
	datGUI_LED.add(guiControls_LED, 'ledRed',0,255);
	datGUI_LED.add(guiControls_LED, 'ledGreen',0,255);	
	datGUI_LED.add(guiControls_LED, 'ledBlue',0,255);
	datGUI_LED.add(guiControls_LED, 'ledWhite',0,255);
	
	for( var _key in models ){
		(function(key){
			
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(loadingManager);
				
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							if('castShadow' in models[key])
								node.castShadow = models[key].castShadow;
							else
								node.castShadow = true;
							
							if('receiveShadow' in models[key])
								node.receiveShadow = models[key].receiveShadow;
							else
								node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
		})(_key);
	}
	

	
	document.body.appendChild(renderer.domElement);
	
	animate();
}

// Runs when all resources are loaded
function onResourcesLoaded(){
	
	// Clone models into meshes.
	meshes["fanblade1"] = models.fanblade.mesh.clone();
	meshes["fanblade2"] = models.fanblade.mesh.clone();
	meshes["fanframe1"] = models.fanframe.mesh.clone();
	meshes["fanframe2"] = models.fanframe.mesh.clone();
	meshes["table"] = models.table.mesh.clone();
	
	// Reposition individual meshes, then add meshes to scene
	
	meshes["fanblade1"].position.set(-67, 9, -36);
	//meshes["fanblade1"].scale.set(10,10,10);
	meshes["fanblade1"].rotation.set(0, Math.PI, 0);
	scene.add(meshes["fanblade1"]);
	
	meshes["fanblade2"].position.set(67, 9, -36);
	//meshes["fanblade2"].scale.set(10,10,10);
	meshes["fanblade2"].rotation.set(0, Math.PI, 0);
	scene.add(meshes["fanblade2"]);
	
	meshes["fanframe1"].position.set(-5, 6, 4);
	//meshes["fanframe1"].scale.set(10,10,10);
	meshes["fanframe1"].rotation.set(0, 0, 0);
	//scene.add(meshes["fanframe1"]);
	
	
	meshes["fanframe2"].position.set(10, 6, 4);
	//meshes["fanframe2"].scale.set(10,10,10);
	meshes["fanframe2"].rotation.set(0, 0, 0);
	//scene.add(meshes["fanframe2"]);
	
	meshes["table"].position.set(0, 10, 0);
	//meshes["table"].scale.set(10,10,10);
	meshes["table"].rotation.set(Math.PI/2, Math.PI, -Math.PI/2);
	scene.add(meshes["table"]);
	
	
/* 	// player weapon
	meshes["playerweapon"] = models.uzi.mesh.clone();
	meshes["playerweapon"].position.set(0,2,0);
	meshes["playerweapon"].scale.set(10,10,10);
	scene.add(meshes["playerweapon"]); */
}

function animate(){

	// Play the loading screen until resources are loaded.
	if( RESOURCES_LOADED == false ){
		requestAnimationFrame(animate);
		
		loadingScreen.box.position.x -= 0.05;
		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
		
		renderer.render(loadingScreen.scene, loadingScreen.camera);
		return;
	}

	requestAnimationFrame(animate);
	
	var time = Date.now() * 0.0005;
	var delta = clock.getDelta();
	
	// mesh.rotation.x += 0.01;
	// mesh.rotation.y += 0.02;
	
	meshes["fanblade2"].rotation.z += 0.01;
	meshes["fanblade1"].rotation.z += temp;
	temp += 0.01;
	
	tableLight1.color.setHex( (guiControls_LED.ledRed << 16) + (guiControls_LED.ledGreen << 8) + (guiControls_LED.ledBlue ));
	
	renderer.render(scene, camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;

