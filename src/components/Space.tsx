import * as THREE from 'three';
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useGLTF, useAnimations, Sparkles, OrbitControls } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import StarField from './shared/StarField'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing';

const START_TIME = 10;

type Animated3DProps = {
  children?: React.ReactNode;
  orbit?: boolean;
  pan?: boolean;
  zoom?: boolean;
};

type GLTFResult = GLTF & {
  nodes: {
    FlameGlassMesh: THREE.Mesh
    Rocket: THREE.Mesh
    Support: THREE.Mesh
    Cylinder004: THREE.Mesh
    Cylinder004_1: THREE.Mesh
    FlameMeshAnim: THREE.Mesh
  }
  materials: {
    FireGlass: THREE.MeshPhysicalMaterial
    rocket: THREE.MeshStandardMaterial
    Support: THREE.MeshStandardMaterial
    Glass: THREE.MeshStandardMaterial
    Fire: THREE.MeshStandardMaterial
  }
}

// type ActionName = 'FlameAction'
// type GLTFActions = Record<ActionName, THREE.AnimationAction>

const Rocket = (props: JSX.IntrinsicElements['group']) => {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials, animations } = useGLTF(require('../assets/3D/rocket.glb')) as GLTFResult
  const { actions, mixer } = useAnimations(animations, group)


  const [currentStartTime, setCurrentStartTime] = useState(START_TIME);
  const [velocity, setVelocity] = useState(0);
  const [ignitionStarted, setIgnitionStarted] = useState(false);
  const [flameColor, setFlameColor] = useState<THREE.Color>(new THREE.Color(0xff0000));
  const [sparkleCount, setSparkleCount] = useState(0);
  const flameAnim = useRef<THREE.Mesh>(null)
  const flameGlass = useRef<THREE.Mesh>(null)
  const sparkleRef = useRef(null)
  const [spark, show] = useReducer(() => true, false);

  useEffect(() => {
    setCurrentStartTime(START_TIME);
    const { Fire, rocket, Support, FireGlass } = materials;

    Fire.emissiveIntensity = 0;
    rocket.emissiveIntensity = 0;
    Support.emissiveIntensity = 0;
    setFlameColor(FireGlass.color);
    FireGlass.color = new THREE.Color('#ffffff');
    actions.animationClip = actions.FlameAction;
    setSparkleCount(120);
    flameAnim.current?.scale.set(0, 0, 0);
    flameGlass.current?.scale.set(0, 0, 0);
    return () => {
      mixer.stopAllAction();
    };
  }, []);

  useFrame((_, delta) => {
    mixer.update(delta);
    setCurrentStartTime((prevStartTime) => prevStartTime - delta);

    !ignitionStarted ? group.current?.rotateY(0.2 * delta) : group.current?.rotateY(1 * delta);
    actions.animationClip && !actions.animationClip.isRunning() && actions?.FlameAction?.play();

    if (currentStartTime <= START_TIME * 0.3 && !ignitionStarted) {
      const flameScale = flameAnim.current?.scale;
      const glassScale = flameGlass.current?.scale;

      if (flameScale && glassScale) {
        if (flameScale.x < 1 && glassScale.x < 1) {

          flameScale.x += 10 * delta;
          flameScale.y += 10 * delta;
          flameScale.z += 10 * delta;

          flameAnim.current.scale.copy(flameScale);

          glassScale.x += 10 * delta;
          glassScale.y += 10 * delta;
          glassScale.z += 10 * delta;
          flameGlass.current.scale.copy(glassScale);


        } else {
          show();
          flameAnim.current.scale.set(1, 1, 1);
          flameGlass.current.scale.set(1, 1, 1);
          sparkleCount > 0 ? setSparkleCount((prevCount) => prevCount - 1) : setIgnitionStarted(true);
        }

      }
    }

    if (ignitionStarted) {
      sparkleCount > 0 && setSparkleCount(0);
      if (velocity <= 1) setVelocity((prevVelocity) => prevVelocity + 0.2 * delta);
      Object.values(nodes).forEach((mesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>) => {
        const meshMaterial = mesh.material as THREE.MeshStandardMaterial;
        if (mesh.name === 'FlameMeshAnim' || mesh.name === 'Support') {
          if (meshMaterial.emissiveIntensity < 1) meshMaterial.emissiveIntensity += 1 * delta;
        }
        if (mesh.name === 'FlameGlassMesh') {
          if (meshMaterial.color !== flameColor) meshMaterial.color = flameColor;
        }
        if (mesh.name === 'Rocket') {
          if (meshMaterial.emissiveIntensity < 0.5) meshMaterial.emissiveIntensity += 0.1 * delta;
        }
      });
    }
  });

  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <mesh name="FlameGlassMesh" ref={flameGlass} geometry={nodes.FlameGlassMesh.geometry} material={materials.FireGlass} />
        <mesh name="Rocket" geometry={nodes.Rocket.geometry} material={materials.rocket} />
        <mesh name="Support" geometry={nodes.Support.geometry} material={materials.Support} />
        <group name="Window">
          <mesh name="Cylinder004" geometry={nodes.Cylinder004.geometry} material={materials.rocket} />
          <mesh name="Cylinder004_1" geometry={nodes.Cylinder004_1.geometry} material={materials.Glass} />
        </group>
        <mesh name="FlameMeshAnim" ref={flameAnim} geometry={nodes.FlameMeshAnim.geometry} material={materials.Fire} morphTargetDictionary={nodes.FlameMeshAnim.morphTargetDictionary} morphTargetInfluences={nodes.FlameMeshAnim.morphTargetInfluences} />
      </group>
      {spark && !ignitionStarted && <Sparkles size={3} ref={sparkleRef} count={sparkleCount} speed={0} color={"tomato"} position={[0, -1.5, 0]} />}
      <StarField numStars={5000} velocity={velocity} voidRadius={500} scale={1000} direction={[0, -1, 0]} />
      <ambientLight intensity={0.01} />
      <hemisphereLight intensity={0.3} color={'MediumSlateBlue'} />
    </>
  )
}

export const Space = ({ orbit = false, pan = false, zoom = false }: Animated3DProps) => {
  return (
    <div className='canvas-container'>
      <h1 style={{ color: 'white' }}>Engineer like a giant,
        launch like a start-up
      </h1>
      <Canvas className='fade-in' camera={{ position: [0, 0, 7.5], fov: 90 }}>
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={.1} intensity={1} />
        </EffectComposer>
        <Rocket />
        <fog attach="fog" color="black" near={100} far={600} />
        <OrbitControls enableRotate={orbit} enableZoom={zoom} enablePan={pan} />
      </Canvas >
    </div >
  );
};

useGLTF.preload(require('../assets/3D/rocket.glb'))
