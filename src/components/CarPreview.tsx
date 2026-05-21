import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createCarModel } from '../game/CarGenerator';

interface CarPreviewProps {
    color: number | string;
    carType?: 'cruiser' | 'sprinter' | 'tank';
    className?: string;
    autoRotate?: boolean;
}

export const CarPreview: React.FC<CarPreviewProps> = ({ color, carType = 'cruiser', className = '', autoRotate = true }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Key light (sun)
        const dirLight = new THREE.DirectionalLight(0xfff0dd, 1.5);
        dirLight.position.set(5, 10, -5);
        scene.add(dirLight);

        // Rim light (cool reflection)
        const rimLight = new THREE.DirectionalLight(0xa4e2f7, 2.0);
        rimLight.position.set(-5, 5, -10);
        scene.add(rimLight);
        
        // Fill light (warm)
        const fillLight = new THREE.DirectionalLight(0xffadbc, 0.8);
        fillLight.position.set(5, 0, 5);
        scene.add(fillLight);

        // Car model
        let colorHex = 0xffadbc;
        if (typeof color === 'string') {
            colorHex = parseInt(color.replace('#', '0x'), 16);
        } else if (typeof color === 'number') {
            colorHex = color;
        }

        const car = createCarModel(colorHex, carType as 'cruiser' | 'sprinter' | 'tank');
        
        // Center vertically so origin is balanced
        const box = new THREE.Box3().setFromObject(car);
        const center = box.getCenter(new THREE.Vector3());
        car.position.sub(center);
        
        // Add an inner group for centering and outer group for rotating
        const pivotGroup = new THREE.Group();
        pivotGroup.add(car);
        scene.add(pivotGroup);

        // Position camera
        camera.position.set(8, 4, 8);
        camera.lookAt(0, 0, 0);

        // Animation loop
        let animationId: number;
        
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            if (autoRotate) {
                pivotGroup.rotation.y += 0.01;
            } else {
                pivotGroup.rotation.y = -Math.PI / 4; // Static angled view
            }
            renderer.render(scene, camera);
        };
        
        animate();

        // Handle resize
        const handleResize = () => {
            if (!mountRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [color, autoRotate, carType]);

    return <div ref={mountRef} className={className} />;
};
