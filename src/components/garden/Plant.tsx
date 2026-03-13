import { motion } from "framer-motion";
import { getSeedTheme, SeedTheme } from "./seedThemes";

export type GrowthStage = "seed" | "rooted" | "sprouting" | "growing" | "blooming";

interface PlantProps {
  stage: GrowthStage;
  name?: string;
  seedType?: string;
}

export const Plant = ({ stage, name, seedType = "hope" }: PlantProps) => {
  const theme = getSeedTheme(seedType);

  const getPlantContent = () => {
    switch (stage) {
      case "seed":
        return <SeedStage theme={theme} />;
      case "rooted":
        return <RootedStage theme={theme} />;
      case "sprouting":
        return <SproutingStage theme={theme} />;
      case "growing":
        return <GrowingStage theme={theme} />;
      case "blooming":
        return <BloomingStage theme={theme} />;
      default:
        return <SeedStage theme={theme} />;
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {getPlantContent()}
    </div>
  );
};

interface StageProps {
  theme: SeedTheme;
}

// Helper to get leaf path based on style
const getLeafTransform = (style: string, cx: number, cy: number, rx: number, ry: number, rot: number) => {
  switch (style) {
    case "pointed":
      return { rx: rx * 0.7, ry: ry * 1.4 };
    case "broad":
      return { rx: rx * 1.3, ry: ry * 0.9 };
    case "feathery":
      return { rx: rx * 0.85, ry: ry * 1.2 };
    default: // rounded
      return { rx, ry };
  }
};

const SeedStage = ({ theme }: StageProps) => (
  <motion.svg
    width="120" height="130" viewBox="0 0 120 130"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Soil */}
    <motion.ellipse cx="60" cy="100" rx="50" ry="20" fill="hsl(25 45% 25%)"
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }} />
    <motion.ellipse cx="60" cy="98" rx="45" ry="17" fill="hsl(30 50% 30%)"
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.1 }} />
    <motion.ellipse cx="40" cy="95" rx="5" ry="2" fill="hsl(30 45% 35%)" opacity="0.6" />
    <motion.ellipse cx="75" cy="97" rx="4" ry="1.5" fill="hsl(30 45% 35%)" opacity="0.5" />
    
    {/* Mound */}
    <motion.path d="M35 98 Q60 78 85 98" fill="hsl(30 50% 32%)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
    
    {/* Tiny stem */}
    <motion.path d="M60 88 Q60 78 58 68" stroke={theme.stemColor} strokeWidth="3.5"
      fill="none" strokeLinecap="round"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} />
    
    {/* Two tiny leaves */}
    <motion.g
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "58px 70px" }}
    >
      {(() => {
        const l1 = getLeafTransform(theme.leafStyle, 52, 70, 7, 4, -40);
        const l2 = getLeafTransform(theme.leafStyle, 64, 68, 8, 4.5, 35);
        return (
          <>
            <motion.ellipse cx="52" cy="70" rx={l1.rx} ry={l1.ry} fill={theme.leafColors[0]} transform="rotate(-40 52 70)"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: "spring" }} />
            <motion.ellipse cx="64" cy="68" rx={l2.rx} ry={l2.ry} fill={theme.leafColors[1]} transform="rotate(35 64 68)"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }} />
          </>
        );
      })()}
    </motion.g>

    {/* Warm glow */}
    <motion.ellipse cx="60" cy="75" rx="18" ry="15" fill="none" stroke={theme.sparkleColor} strokeWidth="1.5" opacity="0.2"
      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.08, 0.2] }}
      transition={{ duration: 3, repeat: Infinity }} />
    
    {/* Sparkles */}
    {[0, 1, 2].map((i) => (
      <motion.circle key={i} cx={52 + i * 8} cy={62 + (i % 2) * 6} r="1.5" fill={theme.sparkleColor}
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }} />
    ))}
  </motion.svg>
);

const RootedStage = ({ theme }: StageProps) => {
  const l1 = getLeafTransform(theme.leafStyle, 42, 60, 10, 5, -35);
  const l2 = getLeafTransform(theme.leafStyle, 58, 58, 11, 5.5, 30);
  
  return (
    <motion.svg width="100" height="100" viewBox="0 0 100 100"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.ellipse cx="50" cy="88" rx="45" ry="16" fill="hsl(25 45% 25%)" />
      <motion.ellipse cx="50" cy="86" rx="40" ry="14" fill="hsl(30 50% 30%)" />
      <motion.path d="M32 86 Q50 70 68 86" fill="hsl(30 50% 32%)" />
      
      <motion.path d="M50 84 L50 55" stroke={theme.stemColor} strokeWidth="5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
      
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 60px" }}
      >
        <motion.ellipse cx="42" cy="60" rx={l1.rx} ry={l1.ry} fill={theme.leafColors[0]}
          transform="rotate(-35 42 60)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring" }} />
        <motion.ellipse cx="58" cy="58" rx={l2.rx} ry={l2.ry} fill={theme.leafColors[1]}
          transform="rotate(30 58 58)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.7, type: "spring" }} />
        {/* Leaf veins */}
        <motion.path d="M45 62 L38 56" stroke={theme.stemColorDark} strokeWidth="0.8" opacity="0.4" />
        <motion.path d="M56 60 L62 54" stroke={theme.stemColorDark} strokeWidth="0.8" opacity="0.4" />
      </motion.g>
    </motion.svg>
  );
};

const SproutingStage = ({ theme }: StageProps) => (
  <motion.svg width="120" height="140" viewBox="0 0 120 140"
    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
    <ellipse cx="60" cy="128" rx="50" ry="18" fill="hsl(25 45% 25%)" />
    <ellipse cx="60" cy="126" rx="45" ry="15" fill="hsl(30 50% 30%)" />
    
    <motion.path d="M60 128 Q57 95 60 55" stroke={theme.stemColorDark} strokeWidth="6" fill="none" strokeLinecap="round"
      animate={{ d: ["M60 128 Q57 95 60 55", "M60 128 Q63 95 60 55", "M60 128 Q57 95 60 55"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
    
    {/* Lower leaves */}
    {[
      { cx: 38, cy: 95, rot: -40, idx: 0, origin: "45px 100px", dir: -3 },
      { cx: 82, cy: 82, rot: 35, idx: 1, origin: "75px 85px", dir: 3 },
    ].map((leaf) => {
      const dims = getLeafTransform(theme.leafStyle, leaf.cx, leaf.cy, 16 + leaf.idx * 2, 8 + leaf.idx, leaf.rot);
      return (
        <motion.g key={leaf.idx}
          animate={{ rotate: [leaf.dir, -leaf.dir, leaf.dir] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: leaf.origin }}
        >
          <motion.ellipse cx={leaf.cx} cy={leaf.cy} rx={dims.rx} ry={dims.ry}
            fill={theme.leafColors[leaf.idx]} transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`} />
          <motion.path d={`M${leaf.cx + 4} ${leaf.cy + 3} L${leaf.cx + (leaf.rot < 0 ? -10 : 12)} ${leaf.cy - 5}`}
            stroke={theme.stemColorDark} strokeWidth="1" opacity="0.5" />
        </motion.g>
      );
    })}
    
    {/* Top leaves */}
    <motion.g
      animate={{ rotate: [-2, 2, -2], y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "60px 60px" }}
    >
      {(() => {
        const tl1 = getLeafTransform(theme.leafStyle, 48, 60, 12, 6, -30);
        const tl2 = getLeafTransform(theme.leafStyle, 72, 58, 13, 6.5, 28);
        return (
          <>
            <motion.ellipse cx="48" cy="60" rx={tl1.rx} ry={tl1.ry} fill={theme.leafColors[2]} transform="rotate(-30 48 60)" />
            <motion.ellipse cx="72" cy="58" rx={tl2.rx} ry={tl2.ry} fill={theme.leafColors[3]} transform="rotate(28 72 58)" />
          </>
        );
      })()}
    </motion.g>
  </motion.svg>
);

const GrowingStage = ({ theme }: StageProps) => {
  const leaves = [
    { x: 45, y: 130, rx: 20, ry: 10, rot: -45, delay: 0 },
    { x: 95, y: 120, rx: 22, ry: 11, rot: 40, delay: 0.2 },
    { x: 42, y: 95, rx: 18, ry: 9, rot: -40, delay: 0.4 },
    { x: 98, y: 85, rx: 20, ry: 10, rot: 45, delay: 0.6 },
    { x: 48, y: 60, rx: 16, ry: 8, rot: -35, delay: 0.8 },
    { x: 92, y: 52, rx: 17, ry: 8.5, rot: 38, delay: 1 },
  ];

  return (
    <motion.svg width="140" height="170" viewBox="0 0 140 170"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
      <ellipse cx="70" cy="158" rx="55" ry="20" fill="hsl(25 45% 25%)" />
      <ellipse cx="70" cy="156" rx="50" ry="17" fill="hsl(30 50% 30%)" />
      
      <motion.path d="M70 158 Q66 110 70 40" stroke={theme.stemColorDark} strokeWidth="8" fill="none" strokeLinecap="round"
        animate={{ d: ["M70 158 Q66 110 70 40", "M70 158 Q74 110 70 40", "M70 158 Q66 110 70 40"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      
      {leaves.map((leaf, i) => {
        const dims = getLeafTransform(theme.leafStyle, leaf.x, leaf.y, leaf.rx, leaf.ry, leaf.rot);
        return (
          <motion.g key={i}
            animate={{ rotate: [leaf.rot, leaf.rot + (i % 2 === 0 ? 4 : -4), leaf.rot] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}>
            <motion.ellipse cx={leaf.x} cy={leaf.y} rx={dims.rx} ry={dims.ry}
              fill={theme.leafColors[i % theme.leafColors.length]}
              transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: leaf.delay, type: "spring" }} />
          </motion.g>
        );
      })}
      
      {/* Bud */}
      <motion.ellipse cx="70" cy="35" rx="12" ry="15" fill={theme.petalColors[0]}
        animate={{ scale: [1, 1.08, 1], y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      
      <motion.circle cx="70" cy="35" r="20" fill="none" stroke={theme.sparkleColor} strokeWidth="1" opacity="0.2"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }} />
    </motion.svg>
  );
};

const BloomingStage = ({ theme }: StageProps) => {
  const leaves = [
    { x: 52, y: 150, rx: 22, ry: 11, rot: -48 },
    { x: 108, y: 140, rx: 24, ry: 12, rot: 45 },
    { x: 48, y: 110, rx: 20, ry: 10, rot: -42 },
    { x: 112, y: 100, rx: 22, ry: 11, rot: 48 },
    { x: 55, y: 72, rx: 18, ry: 9, rot: -38 },
    { x: 105, y: 65, rx: 19, ry: 9.5, rot: 42 },
  ];

  const petalCount = theme.flowerStyle === "sunflower" ? 12 :
                     theme.flowerStyle === "lotus" ? 8 :
                     theme.flowerStyle === "rose" ? 10 : 7;

  const petalRx = theme.flowerStyle === "sunflower" ? 8 :
                  theme.flowerStyle === "lotus" ? 12 :
                  theme.flowerStyle === "rose" ? 10 : 14;

  const petalRy = theme.flowerStyle === "sunflower" ? 20 :
                  theme.flowerStyle === "lotus" ? 22 :
                  theme.flowerStyle === "rose" ? 18 : 25;

  return (
    <motion.svg width="160" height="190" viewBox="0 0 160 190"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
      <ellipse cx="80" cy="178" rx="60" ry="22" fill="hsl(25 45% 25%)" />
      <ellipse cx="80" cy="176" rx="55" ry="19" fill="hsl(30 50% 30%)" />
      
      <motion.path d="M80 178 Q76 120 80 45" stroke={theme.stemColorDark} strokeWidth="9" fill="none" strokeLinecap="round"
        animate={{ d: ["M80 178 Q76 120 80 45", "M80 178 Q84 120 80 45", "M80 178 Q76 120 80 45"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      
      {/* Leaves */}
      {leaves.map((leaf, i) => {
        const dims = getLeafTransform(theme.leafStyle, leaf.x, leaf.y, leaf.rx, leaf.ry, leaf.rot);
        return (
          <motion.g key={i}
            animate={{ rotate: [leaf.rot, leaf.rot + (i % 2 === 0 ? 5 : -5), leaf.rot] }}
            transition={{ duration: 3.5 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}>
            <motion.ellipse cx={leaf.x} cy={leaf.y} rx={dims.rx} ry={dims.ry}
              fill={theme.leafColors[i % theme.leafColors.length]}
              transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`} />
          </motion.g>
        );
      })}
      
      {/* Flower petals */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (360 / petalCount) * i;
        return (
          <motion.ellipse key={i} cx="80" cy={42 - petalRy + 4} rx={petalRx} ry={petalRy}
            fill={theme.petalColors[i % theme.petalColors.length]}
            style={{ transformOrigin: "80px 42px", transform: `rotate(${angle}deg)` }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }} />
        );
      })}
      
      {/* Flower center */}
      <motion.circle cx="80" cy="42" r="12" fill={theme.centerColor}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="80" cy="42" r="6" fill={theme.centerInnerColor} />
      
      {/* Sparkles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.circle key={i}
          cx={80 + Math.cos(i * Math.PI / 3) * 35}
          cy={42 + Math.sin(i * Math.PI / 3) * 35}
          r="2" fill={theme.sparkleColor}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
    </motion.svg>
  );
};
