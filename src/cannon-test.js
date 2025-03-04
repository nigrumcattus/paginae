import ReactDOM from 'react-dom'
import { useRef, useState ,useMemo ,Suspense} from 'react'
import { Canvas, useFrame ,useLoader } from '@react-three/fiber'
import { Physics, usePlane, useBox ,useParticle} from '@react-three/cannon'
import { Cloud, Sky ,OrbitControls } from '@react-three/drei'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import './cannon-styles.css'

const GltfModel = (props) => {
  const [ref] = useBox(() => ({ mass:1, position: props.position, rotation: [0, 1, 0]}))
  const gltf = useLoader(GLTFLoader, "./untitled.glb");
  return (
    <>
    <mesh
      ref={ref}
	  >
      <primitive object={gltf.scene} scale={0.5} />
    </mesh>
    </>
  );
};
const GltfModel2 = (props) => {
  const [ref] = useBox(() => ({ mass:1, position: props.position, rotation: [0, 1, 0]}))
  const gltf = useLoader(GLTFLoader, "./untitled2.glb");
  return (
    <>
    <mesh
      ref={ref}
	  >
      <primitive object={gltf.scene} scale={0.5} />
    </mesh>
    </>
  );
};

const BasicParticles = () => {
  // This reference gives us direct access to our points
  const points = useRef();

  // You can see that, like our mesh, points also takes a geometry and a material,
  // but a specific material => pointsMaterial
  return (
    <points ref={points}>
      <sphereGeometry args={[1, 48, 48]} />
      <pointsMaterial color="#5786F5" size={0.015} sizeAttenuation />
    </points>
  );
};

function TestMyBox(props) {
  const myMesh = useRef();
  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.position.x = a;
    myMesh.current.position.y = a;
    myMesh.current.position.z = a;
  });

  return (
    <mesh ref={myMesh} >
      <sphereBufferGeometr />
      <meshPhongMaterial color="royalblue" />
    </mesh>
  );
}


function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <shadowMaterial color="#171717" transparent opacity={0.4} />
    </mesh>
  )
}

function Cube(props) {
  //const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], rotation: [0.4, 0.2, 0.5], ...props }))
  const [ref] = useBox(() => ({ mass: 1, position: props.position, rotation: props.rotation}))
  return (
    <mesh 
	  onClick={props.onClick}
	  receiveShadow castShadow ref={ref} scale={props.scale} >
      <boxGeometry />
    <meshLambertMaterial color={props.color} /> </mesh>)
}

function MyBox(props) {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], rotation: [0.4, 0.2, 0.5], ...props }))
  // This reference gives us direct access to the THREE.Mesh object
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function App() {
  const [cameraposition, setCameraposition] = useState([-5, 5, 15]);

	/*
	<Suspense fallback={null}>
		<GltfModel />
	</Suspense>
	*/
  return (<>

	  <h1>CANNON TEST</h1>

      <Canvas>

    <color attach="background" args={['lightgrey']} />
    <ambientLight />
    <OrbitControls />
    <directionalLight position={[10, 10, 10]} castShadow shadow-mapSize={[2048, 2048]} />
    <Physics>
      <Plane position={[0, 0, 0]} />

      <Cube 
	  onClick={()=>alert("test")}
	  position={[10, 0.5, 0]} rotation={[0, 1.2, 0]} color={"pink"} scale={1} />

        <Suspense fallback={null}>
          <GltfModel position={[0,2,0]} />
          <GltfModel2 position={[0,5,1]} />


      <Cube position={[1.9, 10, 0.3]} rotation={[0, 0, 0]} color={"lightgrey"} scale={1} />
      <Cube position={[1.9, 5, 0.6]} rotation={[0, 0, 0]} color={"grey"} scale={1} />
      <Cube position={[0.3, 4, -0.9]} rotation={[0, 0, 0]} color={"grey"} scale={1} />

        </Suspense>

	  <Cloud position={[4, 2, 0]} speed={0.2} opacity={0.1} />
    </Physics>
      </Canvas>

	  {/*
  <Canvas shadows dpr={[1, 2]} gl={{ alpha: false }} camera={{ position: cameraposition, fov: 45 }}>
    <color attach="background" args={['lightgrey']} />
    <ambientLight />
    <OrbitControls />
    <directionalLight position={[10, 10, 10]} castShadow shadow-mapSize={[2048, 2048]} />
    <Physics>
      <Plane position={[0, 0, 0]} />

      <Cube 
	  onClick={()=>alert("test")}
	  position={[10, 0.5, 0]} rotation={[0, 1.2, 0]} color={"pink"} scale={1} />

      <Cube position={[1.9, 10, 0.3]} rotation={[0, 0, 0]} color={"lightgrey"} scale={1} />
      <Cube position={[1.9, 5, 0.6]} rotation={[0, 0, 0]} color={"grey"} scale={1} />
      <Cube position={[0.3, 4, -0.9]} rotation={[0, 0, 0]} color={"grey"} scale={1} />

	  <Cloud position={[4, 2, 0]} speed={0.2} opacity={0.1} />
    </Physics>
  </Canvas>
  */}


  </>)
}
