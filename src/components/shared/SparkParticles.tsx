// SparksParticles.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type SparksParticlesProps = {
  count: number;
  areaSize?: number;
  axis?: 'x' | 'y' | 'z' | 'xy' | 'yx' | 'xz' | 'zx' | 'yz' | 'zy' | 'xyz' | 'xzy' | 'yxz' | 'yzx' | 'zxy' | 'zyx';
  inverted?: boolean;
  speed?: number;
  isRunning: boolean;
};

const SparksParticles: React.FC<SparksParticlesProps> = ({ count, areaSize = 10, axis = 'y', inverted = false, speed = 5, isRunning }) => {
	const particlesRef = useRef<THREE.Points>(null);
	const [pausedVelocities, setPausedVelocities] = useState<Float32Array | null>(null);

	const particlesGeometry = new THREE.BufferGeometry();
	const positions = new Float32Array(count * 3);
	const velocities = new Float32Array(count * 3);
	const particleSpeed = speed / 1000;

	for (let i = 0; i < count * 3; i++) {
		positions[i] = (Math.random() - 0.5) * areaSize;
	}

	for (let i = 0; i < count * 3; i++) {
		velocities[i] = (Math.random() * particleSpeed) * (inverted ? -1 : 1);
	}

	particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

	useFrame(({ clock }) => {
		if (isRunning && particlesRef.current) {
			const positionAttribute = particlesGeometry.attributes.position as THREE.BufferAttribute;
			let velocityAttribute = particlesGeometry.attributes.velocity as THREE.BufferAttribute;

			if (pausedVelocities) {
				velocityAttribute = new THREE.BufferAttribute(pausedVelocities, 3);
				setPausedVelocities(null);
				particlesGeometry.setAttribute('velocity', velocityAttribute);
			}

			const timeDelta = clock.getDelta();

			for (let i = 0; i < positionAttribute.count; i++) {
				if (axis.includes('x')) {
					positionAttribute.setX(i, positionAttribute.getX(i) + velocityAttribute.getX(i) * timeDelta);
				}
				if (axis.includes('y')) {
					positionAttribute.setY(i, positionAttribute.getY(i) + velocityAttribute.getY(i) * timeDelta);
				}
				if (axis.includes('z')) {
					positionAttribute.setZ(i, positionAttribute.getZ(i) + velocityAttribute.getZ(i) * timeDelta);
				}

				// Reset particle position when it reaches the edge
				['x', 'y', 'z'].forEach((currentAxis) => {
					let currentPosition = 0;
					let setCurrentPosition: (index: number, value: number) => void = () => {};

					switch (currentAxis) {
					case 'x':
						currentPosition = positionAttribute.getX(i);
						setCurrentPosition = positionAttribute.setX.bind(positionAttribute);
						break;
					case 'y':
						currentPosition = positionAttribute.getY(i);
						setCurrentPosition = positionAttribute.setY.bind(positionAttribute);
						break;
					case 'z':
						currentPosition = positionAttribute.getZ(i);
						setCurrentPosition = positionAttribute.setZ.bind(positionAttribute);
						break;
					}

					if (currentPosition > areaSize / 2) {
						setCurrentPosition(i, -(areaSize / 2));
					} else if (currentPosition < -(areaSize / 2)) {
						setCurrentPosition(i, areaSize / 2);
					}
				});
			}

			positionAttribute.needsUpdate = true;
		} else if (!isRunning && particlesRef.current) {
			const velocityAttribute = particlesGeometry.attributes.velocity as THREE.BufferAttribute;
			setPausedVelocities(new Float32Array(velocityAttribute.array));
			particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
		}
	});

	useEffect(() => {
		if (pausedVelocities && isRunning && particlesRef.current) {
			particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(pausedVelocities, 3));
			setPausedVelocities(null);
		}
	}, [pausedVelocities, isRunning, particlesGeometry]);

	return (
		<points ref={particlesRef} geometry={particlesGeometry} position={[0, 0, 5]}>
			<pointsMaterial color={'white'} size={0.01} />
		</points>
	);
};

export default SparksParticles;