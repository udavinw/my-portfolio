import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Cylinder = () => {
    const meshRef = useRef();

    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 4096; // 4K resolution for sharpness
        canvas.height = 4096;
        const ctx = canvas.getContext('2d');

        // Transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Text configuration
        ctx.fillStyle = 'white';
        ctx.font = 'bold 600px Arial'; // Massive font
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw text centered
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillText('UDAVIN', 0, 0);

        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }, []);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.015; // Smooth spin speed
        }
    });

    return (
        <mesh ref={meshRef} rotation={[0, 0, -Math.PI * 0.5]}>
            {/* Significantly larger cylinder */}
            <cylinderGeometry args={[2.5, 2.5, 8, 64, 64, 1]} />
            <meshStandardMaterial
                map={texture}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

const ThreePreloader = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
                {/* Adjusted camera position to fit the larger object */}
                <Canvas camera={{ position: [0, 0, 12] }}>
                    <pointLight position={[0, 2, 5]} intensity={3} distance={20} color={0xffffff} />
                    <ambientLight intensity={0.8} />
                    <React.Suspense fallback={null}>
                        <Cylinder />
                    </React.Suspense>
                </Canvas>
            </div>
        </div>
    );
};

export default ThreePreloader;
