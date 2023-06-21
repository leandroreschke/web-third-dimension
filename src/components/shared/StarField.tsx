// StarField.tsx
import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

interface StarFieldProps {
  numStars: number;
  velocity: number;
  voidRadius: number;
  scale: number;
  direction: [x: number, y: number, z: number];
}

const StarField: React.FC<StarFieldProps> = ({
  numStars,
  velocity,
  voidRadius,
  scale,
  direction,
}) => {
  const geometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const positions = useMemo(() => {
    const posArray = new Float32Array(numStars * 3);
    for (let i = 0; i < numStars * 3; i += 3) {
      const radius = Math.random() * (scale - voidRadius) + voidRadius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      posArray[i] = x;
      posArray[i + 1] = y;
      posArray[i + 2] = z;
    }
    return posArray;
  }, [numStars, voidRadius, scale]);

  useEffect(() => {
    if (geometry.current) {
      geometry.current.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, [positions]);

  useFrame(() => {
    if (geometry.current) {
      const positionAttribute = geometry.current.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      if (positionAttribute?.array) {
        const positionArray = positionAttribute.array as Float32Array;
        const [x, y, z] = direction;
        for (let i = 0; i < positionArray.length; i += 3) {
          positionArray[i] += velocity * x;
          positionArray[i + 1] += velocity * y;
          positionArray[i + 2] += velocity * z;

          if (
            positionArray[i] < -scale / 2 ||
            positionArray[i] > scale / 2 ||
            positionArray[i + 1] < -scale / 2 ||
            positionArray[i + 1] > scale / 2 ||
            positionArray[i + 2] < -scale / 2 ||
            positionArray[i + 2] > scale / 2
          ) {
            const radius = Math.random() * (scale - voidRadius) + voidRadius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positionArray[i] = radius * Math.sin(phi) * Math.cos(theta);
            positionArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positionArray[i + 2] = radius * Math.cos(phi);
          }
        }
        positionAttribute.needsUpdate = true;
      }
    }
  });

  return (
    <points>
      <bufferGeometry ref={geometry} />
      <pointsMaterial size={.8} sizeAttenuation color="#f0f0f0" />
    </points>
  );
};

export default StarField;

