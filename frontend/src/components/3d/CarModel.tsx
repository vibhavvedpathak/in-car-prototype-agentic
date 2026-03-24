"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center, Stage } from "@react-three/drei";
import { Suspense } from "react";
import { useAppStore } from "@/store/useAppStore";

function Car() {
  const { scene } = useGLTF("/models/cyberpunk_car.glb");
  return <primitive object={scene} />;
}

export default function CarModel() {
  const { isDark } = useAppStore();

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [4, 2, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Stage
            adjustCamera={1.2}
            intensity={isDark ? 0.5 : 0.8}
            environment={isDark ? "night" : "city"}
          >
            <Center>
              <Car />
            </Center>
          </Stage>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 3.5}
        />
      </Canvas>
    </div>
  );
}
