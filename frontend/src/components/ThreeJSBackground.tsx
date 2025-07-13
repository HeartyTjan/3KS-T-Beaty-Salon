import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeJSBackgroundProps {
  className?: string;
}

const ThreeJSBackground = ({ className = "" }: ThreeJSBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 50;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
  

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x22c55e,
      transparent: true,
      opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating geometric shapes
    const createFloatingShape = (geometry: THREE.BufferGeometry, color: number, position: THREE.Vector3) => {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      return mesh;
    };

    // Add some floating shapes
    const shapes = [
      createFloatingShape(new THREE.SphereGeometry(0.5), 0x22c55e, new THREE.Vector3(-3, 2, 0)),
      createFloatingShape(new THREE.BoxGeometry(0.3), 0x3b82f6, new THREE.Vector3(3, -2, 0)),
      createFloatingShape(new THREE.ConeGeometry(0.2, 0.4), 0x8b5cf6, new THREE.Vector3(0, 3, 0)),
    ];

    shapes.forEach(shape => scene.add(shape));

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.002;

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 * (index + 1);
        shape.rotation.y += 0.01 * (index + 1);
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.3 }}
    />
  );
};

export default ThreeJSBackground; 