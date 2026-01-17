import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

export type MoodType = "neutral" | "happy" | "sad" | "excited" | "anxious" | "calm";

interface Face3DProps {
  mood: MoodType;
  isAnalyzing?: boolean;
}

const moodColors: Record<MoodType, { glow: string; eyes: string }> = {
  neutral: { glow: "#00d4ff", eyes: "#00d4ff" },
  happy: { glow: "#4ade80", eyes: "#4ade80" },
  sad: { glow: "#60a5fa", eyes: "#60a5fa" },
  excited: { glow: "#fbbf24", eyes: "#fbbf24" },
  anxious: { glow: "#c084fc", eyes: "#c084fc" },
  calm: { glow: "#2dd4bf", eyes: "#2dd4bf" },
};

const moodLabels: Record<MoodType, string> = {
  neutral: "Neutral",
  happy: "Happy",
  sad: "Feeling Blue",
  excited: "Excited",
  anxious: "Anxious",
  calm: "Peaceful",
};

interface RobotFaceProps {
  mood: MoodType;
  mousePosition: { x: number; y: number };
  deviceOrientation: { beta: number; gamma: number } | null;
  isAnalyzing: boolean;
}

const RobotFace = ({ mood, mousePosition, deviceOrientation, isAnalyzing }: RobotFaceProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  const colors = moodColors[mood];

  useFrame((state) => {
    if (!groupRef.current) return;

    let lookX = 0;
    let lookY = 0;

    if (deviceOrientation) {
      // Gyroscope: gamma = left/right tilt (-90 to 90), beta = front/back tilt (0 to 180)
      // Invert gamma for correct side-eye behavior
      lookX = (-deviceOrientation.gamma / 45) * 0.4;
      // Invert beta for correct up/down behavior
      lookY = -((deviceOrientation.beta - 60) / 45) * 0.4;
    } else {
      // Desktop: Mouse tracking - FIXED: removed negative on Y for correct direction
      lookX = mousePosition.x * 0.4;
      lookY = mousePosition.y * 0.4;
    }

    // Clamp values
    lookX = Math.max(-0.5, Math.min(0.5, lookX));
    lookY = Math.max(-0.5, Math.min(0.5, lookY));

    if (!isAnalyzing) {
      // Smooth face rotation following look direction
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        lookX * 0.6,
        0.08
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -lookY * 0.4,
        0.08
      );
    } else {
      // Spin during analysis
      groupRef.current.rotation.y += 0.03;
    }

    // Move eyes to track
    const eyeOffset = { x: lookX * 0.12, y: lookY * 0.1 };
    
    if (leftEyeRef.current) {
      leftEyeRef.current.position.x = -0.35 + eyeOffset.x;
      leftEyeRef.current.position.y = 0.1 + eyeOffset.y;
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.position.x = 0.35 + eyeOffset.x;
      rightEyeRef.current.position.y = 0.1 + eyeOffset.y;
    }

    // Gentle floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
  });

  // Eye shape based on mood
  const getEyeScale = () => {
    switch (mood) {
      case "happy":
      case "excited":
        return { width: 0.22, height: 0.18 }; // Wider, shorter = happy squint
      case "sad":
        return { width: 0.18, height: 0.15 };
      case "anxious":
        return { width: 0.2, height: 0.25 }; // Taller = worried
      default:
        return { width: 0.2, height: 0.2 };
    }
  };

  // Mouth curve based on mood
  const getMouthCurve = () => {
    switch (mood) {
      case "happy":
      case "excited":
        return 0.15; // Smile curve
      case "sad":
        return -0.08; // Frown curve
      case "anxious":
        return 0; // Straight
      case "calm":
        return 0.08; // Gentle smile
      default:
        return 0.05; // Slight smile
    }
  };

  const eyeScale = getEyeScale();
  const mouthCurve = getMouthCurve();

  return (
    <group ref={groupRef}>
      {/* Main head - rounded rectangle like the reference robot */}
      <RoundedBox args={[2, 1.6, 1.2]} radius={0.4} smoothness={4}>
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.6}
        />
      </RoundedBox>

      {/* Outer frame/rim - silver/white like reference */}
      <RoundedBox args={[2.1, 1.7, 1.1]} radius={0.45} smoothness={4} position={[0, 0, -0.05]}>
        <meshStandardMaterial
          color="#e8e8e8"
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Inner screen area */}
      <RoundedBox args={[1.8, 1.4, 0.1]} radius={0.35} smoothness={4} position={[0, 0, 0.56]}>
        <meshStandardMaterial
          color="#0a0a15"
          roughness={0.1}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Left Eye - glowing rounded square */}
      <mesh ref={leftEyeRef} position={[-0.35, 0.1, 0.65]}>
        <boxGeometry args={[eyeScale.width, eyeScale.height, 0.02]} />
        <meshStandardMaterial
          color={colors.eyes}
          emissive={colors.eyes}
          emissiveIntensity={isAnalyzing ? 2 : 0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Right Eye - glowing rounded square */}
      <mesh ref={rightEyeRef} position={[0.35, 0.1, 0.65]}>
        <boxGeometry args={[eyeScale.width, eyeScale.height, 0.02]} />
        <meshStandardMaterial
          color={colors.eyes}
          emissive={colors.eyes}
          emissiveIntensity={isAnalyzing ? 2 : 0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Mouth - curved line */}
      <mesh position={[0, -0.35, 0.62]} rotation={[0, 0, 0]}>
        <tubeGeometry 
          args={[
            new THREE.QuadraticBezierCurve3(
              new THREE.Vector3(-0.35, 0, 0),
              new THREE.Vector3(0, mouthCurve, 0),
              new THREE.Vector3(0.35, 0, 0)
            ),
            20,
            0.03,
            8,
            false
          ]} 
        />
        <meshStandardMaterial
          color={colors.eyes}
          emissive={colors.eyes}
          emissiveIntensity={isAnalyzing ? 1.5 : 0.6}
          roughness={0.1}
        />
      </mesh>

      {/* Camera/sensor dot on top */}
      <mesh position={[0, 0.65, 0.4]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Headphones band */}
      <mesh position={[0, 0.85, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.2, 0.08, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#4a4a6a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Left headphone */}
      <group position={[-1.15, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#4a4a6a" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
          <meshStandardMaterial 
            color={colors.glow} 
            emissive={colors.glow}
            emissiveIntensity={0.3}
            roughness={0.2} 
          />
        </mesh>
      </group>

      {/* Right headphone */}
      <group position={[1.15, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#4a4a6a" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
          <meshStandardMaterial 
            color={colors.glow} 
            emissive={colors.glow}
            emissiveIntensity={0.3}
            roughness={0.2} 
          />
        </mesh>
      </group>
    </group>
  );
};

export const Face3D = ({ mood, isAnalyzing = false }: Face3DProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [deviceOrientation, setDeviceOrientation] = useState<{ beta: number; gamma: number } | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);
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
    const requestGyroscopePermission = async () => {
      if (typeof DeviceOrientationEvent !== "undefined" && 
          typeof (DeviceOrientationEvent as any).requestPermission === "function") {
        try {
          const response = await (DeviceOrientationEvent as any).requestPermission();
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } catch (e) {
          console.log("Gyroscope permission error:", e);
        }
      } else {
        // Non-iOS devices
        window.addEventListener("deviceorientation", handleOrientation);
      }
      setPermissionRequested(true);
    };

    // Auto-request on component mount
    if (!permissionRequested) {
      requestGyroscopePermission();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [permissionRequested]);

  // Request permission on touch for iOS
  const handleTouchStart = async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && 
        typeof (DeviceOrientationEvent as any).requestPermission === "function" &&
        !deviceOrientation) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === "granted") {
          window.addEventListener("deviceorientation", (e: DeviceOrientationEvent) => {
            if (e.beta !== null && e.gamma !== null) {
              setDeviceOrientation({ beta: e.beta, gamma: e.gamma });
            }
          });
        }
      } catch (e) {
        console.log("Permission request error:", e);
      }
    }
  };

  const colors = moodColors[mood];

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        ref={containerRef}
        className="relative"
        style={{ width: 280, height: 240 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onTouchStart={handleTouchStart}
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 40 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 5, 5]} intensity={0.4} />
          <pointLight position={[0, 2, 3]} intensity={0.5} color={colors.glow} />
          
          <RobotFace
            mood={mood}
            mousePosition={mousePosition}
            deviceOrientation={deviceOrientation}
            isAnalyzing={isAnalyzing}
          />
        </Canvas>

        {/* Glow effect behind the face */}
        <div 
          className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-40"
          style={{ backgroundColor: colors.glow }}
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
            backgroundColor: `${colors.glow}20`,
            color: colors.glow,
          }}
          animate={{ 
            backgroundColor: `${colors.glow}20`, 
            color: colors.glow 
          }}
          transition={{ duration: 0.5 }}
        >
          {moodLabels[mood]}
        </motion.span>
      </motion.div>
    </div>
  );
};
