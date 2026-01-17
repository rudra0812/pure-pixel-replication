import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

export type MoodType = "neutral" | "happy" | "sad" | "excited" | "anxious" | "calm";

interface Face3DProps {
  mood: MoodType;
  isAnalyzing?: boolean;
}

const moodColors: Record<MoodType, { main: string; accent: string; emissive: string }> = {
  neutral: { main: "#FFE0B2", accent: "#FFCC80", emissive: "#FFA726" },
  happy: { main: "#C8E6C9", accent: "#A5D6A7", emissive: "#66BB6A" },
  sad: { main: "#BBDEFB", accent: "#90CAF9", emissive: "#42A5F5" },
  excited: { main: "#FFE082", accent: "#FFD54F", emissive: "#FFCA28" },
  anxious: { main: "#E1BEE7", accent: "#CE93D8", emissive: "#AB47BC" },
  calm: { main: "#B2DFDB", accent: "#80CBC4", emissive: "#26A69A" },
};

const moodLabels: Record<MoodType, string> = {
  neutral: "Neutral",
  happy: "Happy",
  sad: "Feeling Blue",
  excited: "Excited",
  anxious: "Anxious",
  calm: "Peaceful",
};

interface FaceProps {
  mood: MoodType;
  mousePosition: { x: number; y: number };
  deviceOrientation: { beta: number; gamma: number } | null;
  isAnalyzing: boolean;
}

const Face = ({ mood, mousePosition, deviceOrientation, isAnalyzing }: FaceProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  
  const colors = moodColors[mood];

  useFrame((state) => {
    if (!groupRef.current) return;

    // Calculate look direction from device orientation or mouse
    let lookX = 0;
    let lookY = 0;

    if (deviceOrientation) {
      // Use device orientation (gyroscope)
      lookX = (deviceOrientation.gamma / 45) * 0.3; // gamma is left/right tilt
      lookY = ((deviceOrientation.beta - 45) / 45) * 0.3; // beta is front/back tilt
    } else {
      // Use mouse position for desktop
      lookX = mousePosition.x * 0.3;
      lookY = -mousePosition.y * 0.3;
    }

    // Clamp values
    lookX = Math.max(-0.4, Math.min(0.4, lookX));
    lookY = Math.max(-0.4, Math.min(0.4, lookY));

    // Smooth face rotation
    if (!isAnalyzing) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        lookX * 0.5,
        0.1
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        lookY * 0.3,
        0.1
      );
    } else {
      // Spin during analysis
      groupRef.current.rotation.y += 0.02;
    }

    // Move pupils to look at viewer
    const pupilOffset = { x: lookX * 0.08, y: -lookY * 0.08 };
    
    if (leftPupilRef.current) {
      leftPupilRef.current.position.x = -0.35 + pupilOffset.x;
      leftPupilRef.current.position.y = 0.2 + pupilOffset.y;
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x = 0.35 + pupilOffset.x;
      rightPupilRef.current.position.y = 0.2 + pupilOffset.y;
    }

    // Gentle floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  // Mouth shape based on mood
  const getMouthGeometry = () => {
    const shape = new THREE.Shape();
    
    switch (mood) {
      case "happy":
      case "excited":
        // Big smile
        shape.moveTo(-0.35, -0.25);
        shape.quadraticCurveTo(0, mood === "excited" ? -0.7 : -0.55, 0.35, -0.25);
        shape.quadraticCurveTo(0, -0.3, -0.35, -0.25);
        break;
      case "sad":
        // Frown
        shape.moveTo(-0.25, -0.35);
        shape.quadraticCurveTo(0, -0.2, 0.25, -0.35);
        shape.quadraticCurveTo(0, -0.4, -0.25, -0.35);
        break;
      case "anxious":
        // Wavy/uncertain
        shape.moveTo(-0.2, -0.35);
        shape.lineTo(0.2, -0.35);
        shape.lineTo(0.2, -0.32);
        shape.lineTo(-0.2, -0.32);
        break;
      case "calm":
        // Gentle smile
        shape.moveTo(-0.2, -0.3);
        shape.quadraticCurveTo(0, -0.42, 0.2, -0.3);
        shape.quadraticCurveTo(0, -0.35, -0.2, -0.3);
        break;
      default:
        // Neutral
        shape.moveTo(-0.2, -0.35);
        shape.quadraticCurveTo(0, -0.38, 0.2, -0.35);
        shape.quadraticCurveTo(0, -0.33, -0.2, -0.35);
    }
    
    return new THREE.ShapeGeometry(shape);
  };

  // Eye size based on mood
  const eyeScale = mood === "excited" ? 1.3 : mood === "sad" ? 0.85 : 1;

  // Eyebrow angle based on mood
  const getEyebrowRotation = (isLeft: boolean) => {
    switch (mood) {
      case "sad":
        return isLeft ? 0.3 : -0.3;
      case "anxious":
        return isLeft ? 0.4 : -0.4;
      case "excited":
        return isLeft ? -0.2 : 0.2;
      default:
        return 0;
    }
  };

  return (
    <group ref={groupRef}>
      {/* Main head - 3D sphere with distortion for gooey effect */}
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={colors.main}
          emissive={colors.emissive}
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.1}
          distort={isAnalyzing ? 0.3 : 0.1}
          speed={isAnalyzing ? 4 : 1.5}
        />
      </Sphere>

      {/* Highlight sphere for 3D effect */}
      <Sphere args={[0.98, 32, 32]} position={[0.2, 0.3, 0.3]}>
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.1}
        />
      </Sphere>

      {/* Left Eye White */}
      <mesh ref={leftEyeRef} position={[-0.35, 0.2, 0.85]} scale={[0.18 * eyeScale, 0.22 * eyeScale, 0.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {/* Left Pupil */}
      <mesh ref={leftPupilRef} position={[-0.35, 0.2, 0.95]} scale={[0.08, 0.1, 0.05]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#2d1810" roughness={0.2} />
      </mesh>

      {/* Left Eye Shine */}
      <mesh position={[-0.32, 0.24, 0.98]} scale={[0.025, 0.03, 0.02]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Right Eye White */}
      <mesh ref={rightEyeRef} position={[0.35, 0.2, 0.85]} scale={[0.18 * eyeScale, 0.22 * eyeScale, 0.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {/* Right Pupil */}
      <mesh ref={rightPupilRef} position={[0.35, 0.2, 0.95]} scale={[0.08, 0.1, 0.05]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#2d1810" roughness={0.2} />
      </mesh>

      {/* Right Eye Shine */}
      <mesh position={[0.38, 0.24, 0.98]} scale={[0.025, 0.03, 0.02]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Left Eyebrow */}
      <mesh 
        position={[-0.35, 0.48, 0.82]} 
        rotation={[0, 0, getEyebrowRotation(true)]}
        scale={[0.18, 0.03, 0.05]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#5D4037" roughness={0.5} />
      </mesh>

      {/* Right Eyebrow */}
      <mesh 
        position={[0.35, 0.48, 0.82]} 
        rotation={[0, 0, getEyebrowRotation(false)]}
        scale={[0.18, 0.03, 0.05]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#5D4037" roughness={0.5} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 0, 0.95]} rotation={[0, 0, 0]}>
        <primitive object={getMouthGeometry()} attach="geometry" />
        <meshStandardMaterial 
          color={mood === "excited" ? "#E57373" : "#5D4037"} 
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Blush spots for happy/excited */}
      {(mood === "happy" || mood === "excited") && (
        <>
          <mesh position={[-0.6, 0, 0.7]} scale={[0.15, 0.08, 0.05]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#FFAB91" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.6, 0, 0.7]} scale={[0.15, 0.08, 0.05]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#FFAB91" transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
};

export const Face3D = ({ mood, isAnalyzing = false }: Face3DProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [deviceOrientation, setDeviceOrientation] = useState<{ beta: number; gamma: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mouse tracking for desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setMousePosition({
          x: (e.clientX - centerX) / (window.innerWidth / 2),
          y: (e.clientY - centerY) / (window.innerHeight / 2),
        });
      }
    };

    // Device orientation for mobile
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        setDeviceOrientation({
          beta: e.beta,
          gamma: e.gamma,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Request permission for device orientation on iOS
    if (typeof DeviceOrientationEvent !== "undefined" && 
        typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const colors = moodColors[mood];

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        ref={containerRef}
        className="relative"
        style={{ width: 250, height: 250 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 5, 5]} intensity={0.4} />
          <pointLight position={[0, 2, 3]} intensity={0.3} color="#fff5e6" />
          
          <Face
            mood={mood}
            mousePosition={mousePosition}
            deviceOrientation={deviceOrientation}
            isAnalyzing={isAnalyzing}
          />
        </Canvas>

        {/* Glow effect behind the face */}
        <div 
          className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: colors.emissive }}
        />
      </motion.div>

      {/* Mood label */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.span
          className="px-6 py-2 rounded-full text-lg font-medium"
          style={{
            backgroundColor: `${colors.emissive}20`,
            color: colors.emissive,
          }}
          animate={{ 
            backgroundColor: `${colors.emissive}20`, 
            color: colors.emissive 
          }}
          transition={{ duration: 0.5 }}
        >
          {moodLabels[mood]}
        </motion.span>
      </motion.div>
    </div>
  );
};
