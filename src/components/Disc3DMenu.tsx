import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box, Torus, Cylinder, Tetrahedron } from '@react-three/drei'
import { Mesh, MeshStandardMaterial, Group } from 'three';

type ElementType = 'box' | 'torus' | 'cylinder' | 'tetrahedron';

type ElementProps = {
  type: ElementType,
  currentPos: [number, number, number],
  targetPosition: [number, number, number]
}

const Element: React.FC<ElementProps> = ({ type, currentPos, targetPosition }) => {
  const ref = useRef<Mesh>(null)
  const color = type === 'box' ? 'orange' : type === 'torus' ? 'blue' : type === 'cylinder' ? 'green' : 'red';

  const components = {
    box: <Box args={[1, 1, 1]} rotation={[45, 0, 0]} material={new MeshStandardMaterial({ color })} position={targetPosition} />,
    torus: <Torus args={[1, 0.4, 16, 100]} material={new MeshStandardMaterial({ color })} position={targetPosition} rotation={[1.4, 0, 0]} scale={.5} />,
    cylinder: <Cylinder args={[0.5, 0.5, 0.01, 32]} material={new MeshStandardMaterial({ color })} position={targetPosition} />,
    tetrahedron: <Tetrahedron args={[1, 0]} material={new MeshStandardMaterial({ color })} position={targetPosition} />,
  };

  return (
    <mesh ref={ref} position={currentPos}>
      {components[type]}
    </mesh>
  )
}

type MenuProps = {
  rotation: number,
}

const Menu: React.FC<MenuProps> = ({ rotation }) => {
  const ref = useRef<Group>(null);
  const offScreenPosition: [number, number, number] = [10, 0, 10]; // Adjust this as per your requirements

  const elements: { type: ElementType, position: [number, number, number] }[] = [
    { type: 'box', position: [2.5, 0, 2.5] },
    { type: 'torus', position: [-2.5, 0, 2.5] },
    { type: 'cylinder', position: [-2.5, 0, -2.5] },
    { type: 'tetrahedron', position: [2.5, 0, -2.5] },
  ]

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y += (rotation - ref.current.rotation.y) * 0.01;
    }
  });

  return (
    <group ref={ref}>
      {elements.map((props, i) => (
        <Element key={i} type={props.type} currentPos={[0, 0, 0]} targetPosition={props.position} />
      ))}
    </group>
  )
}

export default function Disc3DMenu() {
  const [rotation, setRotation] = useState(0)

  const rotate = () => {
    setRotation((prevRotation) => prevRotation + Math.PI / 2)
  }

  const rotateBackwards = () => {
    setRotation((prevRotation) => prevRotation - Math.PI / 2)
  }

  return (
    <>
      <button onClick={rotate}>Rotate Backwards</button>
      <button onClick={rotateBackwards}>Rotate Forward</button>
      <Canvas className="fade-in rotated-canvas" camera={{ fov: 10, position: [0, 50, 0] }}>
        <ambientLight intensity={.1} />
        <pointLight position={[10, 10, 10]} />
        <Menu rotation={rotation} />
      </Canvas>
    </>
  )
}
