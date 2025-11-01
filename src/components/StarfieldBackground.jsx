import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const StarfieldBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const starGroupsRef = useRef([]);
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });

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
      2000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011, 0.1); // Transparent with slight dark tint
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create star groups
    const createStars = (count, size, opacity) => {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      const radius = 1000;

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 2 * radius;
        const y = (Math.random() - 0.5) * 2 * radius;
        const z = (Math.random() - 0.5) * 2 * radius;
        vertices.push(x, y, z);
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      const material = new THREE.PointsMaterial({
        size: size,
        color: 0xffffff,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      const group = new THREE.Group();
      group.add(points);
      return group;
    };

    // Add star groups
    const starGroups = [
      createStars(5000, 1.0, 0.8),
      createStars(5000, 1.5, 1.0),
      createStars(3000, 2.0, 1.0),
    ];
    starGroupsRef.current = starGroups;

    starGroups.forEach((group) => scene.add(group));

    // Mouse move handler
    const onMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      targetRotationRef.current.x = mouseY * 0.2;
      targetRotationRef.current.y = mouseX * 0.2;
    };

    // Window resize handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Event listeners
    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onWindowResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.0001;

      // Animate star groups
      starGroups[0].rotation.y = time * 0.1;
      starGroups[0].rotation.x = time * 0.05;
      starGroups[1].rotation.y = time * 0.05;
      starGroups[1].rotation.x = time * 0.02;
      starGroups[2].rotation.y = time * 0.02;
      starGroups[2].rotation.x = time * 0.01;

      // Smooth camera rotation
      rotationRef.current.x +=
        (targetRotationRef.current.x - rotationRef.current.x) * 0.05;
      rotationRef.current.y +=
        (targetRotationRef.current.y - rotationRef.current.y) * 0.05;

      camera.rotation.x = rotationRef.current.x;
      camera.rotation.y = rotationRef.current.y;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    const mount = mountRef.current;
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default StarfieldBackground;
