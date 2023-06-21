import React from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'

export const Computer = (props: any) => {
  const { nodes, materials }: any = useGLTF(require('../assets/3D/computer.glb'))
  return (
    <>
      <Perf />
      <OrbitControls enableRotate />
      <ambientLight intensity={.1} />
      <hemisphereLight intensity={1} color={'MediumSlateBlue'} />
      <group {...props} dispose={null}>
        <mesh geometry={nodes.mouse.geometry} material={materials['default']} position={[3.02, -0.87, 3.18]} scale={[1, 1, 1.07]} />
        <mesh geometry={nodes.ScrollWheel.geometry} material={materials.CuteWhiteSolid} position={[3.02, -0.72, 2.58]} rotation={[-1.19, 0.13, 0.84]} scale={[1.26, 1.12, 1]} />
        <mesh geometry={nodes.Plane.geometry} material={materials.Floor} position={[0.05, 0.24, 0.12]} rotation={[Math.PI, 0, Math.PI]} scale={[0.37, 1.26, 0.37]} />
        <mesh geometry={nodes.Cup.geometry} material={materials.CuteWhite} position={[-4.27, -0.04, -0.48]} rotation={[Math.PI, 0, Math.PI]}>
        </mesh>
        <mesh geometry={nodes.Lid.geometry} material={materials.CuteWhiteSolid} position={[-4.27, -0.04, -0.48]} rotation={[Math.PI, 0, Math.PI]}>
        </mesh>
        <mesh geometry={nodes.Liquid.geometry} material={materials.CuteRedLiquid} position={[-4.27, -0.04, -0.48]} rotation={[Math.PI, 0, Math.PI]}>
        </mesh>
        <mesh geometry={nodes.Straw.geometry} material={materials.CuteWhite} position={[-4.27, -0.04, -0.48]} rotation={[Math.PI, 0, Math.PI]} />
        <mesh geometry={nodes.Keyboard.geometry} material={materials['default']} position={[-0.99, -0.8, 2.46]} />
        <group position={[-0.99, -0.84, 2.56]} rotation={[-3.09, 0, -Math.PI]}>
          <mesh geometry={nodes.Cube004.geometry} material={materials.CuteWhiteSolid} />
          <mesh geometry={nodes.Cube004_1.geometry} material={materials.CuteGray} />
        </group>
        <group position={[0.05, -0.37, -3.89]} rotation={[Math.PI, 0, Math.PI]}>
          <mesh geometry={nodes.Cube005.geometry} material={materials.Display} />
          <mesh geometry={nodes.Cube005_1.geometry} material={materials['default']} />
        </group>
        <group position={[0.05, -0.91, -3.59]} rotation={[Math.PI, 0, Math.PI]}>
          <mesh geometry={nodes.Cylinder004.geometry} material={materials['default']} />
          <mesh geometry={nodes.Cylinder004_1.geometry} material={materials.GreenLight} />
        </group>
        <mesh geometry={nodes.MonitorSupport.geometry} material={materials['default']} position={[0.05, -0.02, 0.12]} rotation={[Math.PI, 0, Math.PI]} />
        <mesh geometry={nodes.PowerCord.geometry} material={nodes.PowerCord.material} position={[2.63, -0.98, -5.09]} />
        <mesh geometry={nodes.PadRight.geometry} material={materials['default']} position={[-0.24, -0.92, 1.55]} rotation={[-1.52, -0.25, Math.PI / 2]} />
      </group>
    </>
  )
}

useGLTF.preload(require('../assets/3D/computer.glb'))
