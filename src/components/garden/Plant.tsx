import { motion } from "framer-motion";

export type GrowthStage = "seed" | "rooted" | "sprouting" | "growing" | "blooming";

interface PlantProps {
  stage: GrowthStage;
  name?: string;
}

export const Plant = ({ stage, name }: PlantProps) => {
  const getPlantContent = () => {
    switch (stage) {
      case "seed":
        return <SeedStage />;
      case "rooted":
        return <RootedStage />;
      case "sprouting":
        return <SproutingStage />;
      case "growing":
        return <GrowingStage />;
      case "blooming":
        return <BloomingStage />;
      default:
        return <SeedStage />;
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {getPlantContent()}
      {name && (
        <motion.p
          className="absolute -bottom-8 text-xs font-medium text-foreground/70 bg-card/60 px-3 py-1 rounded-full backdrop-blur-sm"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {name}
        </motion.p>
      )}
    </div>
  );
};

// Breathing animation for natural feel
const breatheAnimation = {
  scale: [1, 1.02, 1],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

const SeedStage = () => (
  <motion.svg
    width="100"
    height="120"
    viewBox="0 0 100 120"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Soil base - grounded */}
    <motion.ellipse 
      cx="50" cy="90" rx="45" ry="18" 
      fill="hsl(25 45% 25%)"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.ellipse 
      cx="50" cy="88" rx="40" ry="15" 
      fill="hsl(30 50% 30%)"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    />
    
    {/* Soil details */}
    <motion.ellipse cx="35" cy="85" rx="4" ry="2" fill="hsl(30 45% 35%)" 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
    <motion.ellipse cx="65" cy="87" rx="3" ry="1.5" fill="hsl(30 45% 35%)" 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
    
    {/* Seed mound */}
    <motion.path
      d="M35 88 Q50 72 65 88"
      fill="hsl(30 50% 32%)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    />
    
    {/* Seed visible */}
    <motion.ellipse
      cx="50"
      cy="80"
      rx="8"
      ry="6"
      fill="hsl(35 55% 42%)"
      animate={{ 
        scale: [1, 1.08, 1],
        y: [0, -1, 0],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Tiny crack/sprout hint */}
    <motion.path
      d="M50 75 Q52 72 50 69"
      stroke="hsl(120 55% 45%)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: [0, 1, 0.8, 1] }}
      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
    />

    {/* Subtle glow around seed */}
    <motion.ellipse
      cx="50"
      cy="80"
      rx="12"
      ry="10"
      fill="none"
      stroke="hsl(50 80% 70%)"
      strokeWidth="1"
      opacity="0.3"
      animate={{ 
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.1, 0.3],
      }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

const RootedStage = () => (
  <motion.svg
    width="100"
    height="140"
    viewBox="0 0 100 140"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Underground section */}
    <motion.rect
      x="0" y="100" width="100" height="40"
      fill="hsl(25 40% 22%)"
      opacity="0.6"
    />
    
    {/* Animated roots */}
    <motion.path
      d="M50 108 Q38 118 28 130"
      stroke="hsl(30 35% 45%)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    />
    <motion.path
      d="M50 108 Q62 120 72 132"
      stroke="hsl(30 35% 45%)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
    />
    <motion.path
      d="M50 108 Q50 120 50 135"
      stroke="hsl(30 35% 42%)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.5 }}
    />
    
    {/* Soil surface */}
    <motion.ellipse 
      cx="50" cy="100" rx="45" ry="16" 
      fill="hsl(25 45% 25%)"
    />
    <motion.ellipse 
      cx="50" cy="98" rx="40" ry="14" 
      fill="hsl(30 50% 30%)"
    />
    
    {/* Small mound */}
    <motion.path
      d="M32 98 Q50 82 68 98"
      fill="hsl(30 50% 32%)"
    />
    
    {/* Sprout stem */}
    <motion.path
      d="M50 96 L50 72"
      stroke="hsl(125 55% 38%)"
      strokeWidth="5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
    />
    
    {/* First leaves - animated */}
    <motion.g
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "50px 75px" }}
    >
      <motion.ellipse
        cx="42"
        cy="75"
        rx="10"
        ry="5"
        fill="hsl(130 55% 45%)"
        transform="rotate(-35 42 75)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      />
      <motion.ellipse
        cx="58"
        cy="73"
        rx="11"
        ry="5.5"
        fill="hsl(128 52% 42%)"
        transform="rotate(30 58 73)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.7, type: "spring" }}
      />
    </motion.g>
  </motion.svg>
);

const SproutingStage = () => (
  <motion.svg
    width="120"
    height="170"
    viewBox="0 0 120 170"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Underground */}
    <motion.rect x="0" y="130" width="120" height="40" fill="hsl(25 40% 20%)" opacity="0.5" />
    
    {/* Roots - more developed */}
    <motion.path d="M60 138 Q42 150 25 165" stroke="hsl(30 35% 42%)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <motion.path d="M60 138 Q78 152 95 168" stroke="hsl(30 35% 42%)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <motion.path d="M60 138 Q55 155 52 170" stroke="hsl(30 35% 40%)" strokeWidth="2" fill="none" strokeLinecap="round" />
    <motion.path d="M60 138 Q65 155 68 170" stroke="hsl(30 35% 40%)" strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Soil */}
    <ellipse cx="60" cy="130" rx="50" ry="18" fill="hsl(25 45% 25%)" />
    <ellipse cx="60" cy="128" rx="45" ry="15" fill="hsl(30 50% 30%)" />
    
    {/* Main stem with sway animation */}
    <motion.path
      d="M60 128 Q57 95 60 55"
      stroke="hsl(125 50% 36%)"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
      animate={{ 
        d: [
          "M60 128 Q57 95 60 55",
          "M60 128 Q63 95 60 55",
          "M60 128 Q57 95 60 55",
        ]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Leaves with individual sway */}
    <motion.g
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "45px 100px" }}
    >
      <motion.ellipse
        cx="38"
        cy="95"
        rx="16"
        ry="8"
        fill="hsl(130 55% 45%)"
        transform="rotate(-40 38 95)"
      />
      {/* Leaf vein */}
      <motion.path d="M42 98 L32 90" stroke="hsl(130 45% 35%)" strokeWidth="1" opacity="0.5" />
    </motion.g>
    
    <motion.g
      animate={{ rotate: [3, -3, 3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "75px 85px" }}
    >
      <motion.ellipse
        cx="82"
        cy="82"
        rx="18"
        ry="9"
        fill="hsl(128 52% 42%)"
        transform="rotate(35 82 82)"
      />
      <motion.path d="M78 85 L90 78" stroke="hsl(128 42% 32%)" strokeWidth="1" opacity="0.5" />
    </motion.g>
    
    {/* Top leaves */}
    <motion.g
      animate={{ rotate: [-2, 2, -2], y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "60px 60px" }}
    >
      <motion.ellipse cx="48" cy="60" rx="12" ry="6" fill="hsl(132 58% 48%)" transform="rotate(-30 48 60)" />
      <motion.ellipse cx="72" cy="58" rx="13" ry="6.5" fill="hsl(130 55% 45%)" transform="rotate(28 72 58)" />
    </motion.g>
  </motion.svg>
);

const GrowingStage = () => (
  <motion.svg
    width="140"
    height="200"
    viewBox="0 0 140 200"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Underground */}
    <motion.rect x="0" y="160" width="140" height="40" fill="hsl(25 40% 18%)" opacity="0.4" />
    
    {/* Extended root system */}
    <motion.path d="M70 168 Q45 180 20 198" stroke="hsl(30 35% 40%)" strokeWidth="3" fill="none" />
    <motion.path d="M70 168 Q95 182 120 198" stroke="hsl(30 35% 40%)" strokeWidth="3" fill="none" />
    <motion.path d="M70 168 Q60 185 55 200" stroke="hsl(30 35% 38%)" strokeWidth="2" fill="none" />
    <motion.path d="M70 168 Q80 185 85 200" stroke="hsl(30 35% 38%)" strokeWidth="2" fill="none" />
    <motion.path d="M70 168 Q70 185 70 200" stroke="hsl(30 35% 36%)" strokeWidth="2.5" fill="none" />
    
    {/* Soil */}
    <ellipse cx="70" cy="160" rx="55" ry="20" fill="hsl(25 45% 25%)" />
    <ellipse cx="70" cy="158" rx="50" ry="17" fill="hsl(30 50% 30%)" />
    
    {/* Main stem - thicker, more established */}
    <motion.path
      d="M70 158 Q66 110 70 40"
      stroke="hsl(125 48% 33%)"
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
      animate={{ 
        d: [
          "M70 158 Q66 110 70 40",
          "M70 158 Q74 110 70 40",
          "M70 158 Q66 110 70 40",
        ]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Multiple leaf pairs */}
    {[
      { x: 45, y: 130, rx: 20, ry: 10, rot: -45, delay: 0 },
      { x: 95, y: 120, rx: 22, ry: 11, rot: 40, delay: 0.2 },
      { x: 42, y: 95, rx: 18, ry: 9, rot: -40, delay: 0.4 },
      { x: 98, y: 85, rx: 20, ry: 10, rot: 45, delay: 0.6 },
      { x: 48, y: 60, rx: 16, ry: 8, rot: -35, delay: 0.8 },
      { x: 92, y: 52, rx: 17, ry: 8.5, rot: 38, delay: 1 },
    ].map((leaf, i) => (
      <motion.g
        key={i}
        animate={{ 
          rotate: [leaf.rot, leaf.rot + (i % 2 === 0 ? 4 : -4), leaf.rot],
        }}
        transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
      >
        <motion.ellipse
          cx={leaf.x}
          cy={leaf.y}
          rx={leaf.rx}
          ry={leaf.ry}
          fill={`hsl(${128 + i * 2} ${52 + i}% ${42 + i * 2}%)`}
          transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: leaf.delay, type: "spring" }}
        />
      </motion.g>
    ))}
    
    {/* Bud at top */}
    <motion.ellipse
      cx="70"
      cy="35"
      rx="12"
      ry="15"
      fill="hsl(140 65% 48%)"
      animate={{ 
        scale: [1, 1.08, 1],
        y: [0, -2, 0],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Subtle glow */}
    <motion.circle
      cx="70"
      cy="35"
      r="20"
      fill="none"
      stroke="hsl(60 80% 70%)"
      strokeWidth="1"
      opacity="0.2"
      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  </motion.svg>
);

const BloomingStage = () => (
  <motion.svg
    width="160"
    height="220"
    viewBox="0 0 160 220"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Underground */}
    <motion.rect x="0" y="180" width="160" height="40" fill="hsl(25 40% 18%)" opacity="0.35" />
    
    {/* Extensive root system */}
    <motion.path d="M80 188 Q50 200 15 218" stroke="hsl(30 35% 38%)" strokeWidth="3" fill="none" />
    <motion.path d="M80 188 Q110 202 145 218" stroke="hsl(30 35% 38%)" strokeWidth="3" fill="none" />
    <motion.path d="M80 188 Q65 205 55 220" stroke="hsl(30 35% 36%)" strokeWidth="2.5" fill="none" />
    <motion.path d="M80 188 Q95 205 105 220" stroke="hsl(30 35% 36%)" strokeWidth="2.5" fill="none" />
    <motion.path d="M80 188 Q80 205 80 220" stroke="hsl(30 35% 34%)" strokeWidth="3" fill="none" />
    
    {/* Soil */}
    <ellipse cx="80" cy="180" rx="60" ry="22" fill="hsl(25 45% 25%)" />
    <ellipse cx="80" cy="178" rx="55" ry="19" fill="hsl(30 50% 30%)" />
    
    {/* Main stem */}
    <motion.path
      d="M80 178 Q76 120 80 45"
      stroke="hsl(125 48% 32%)"
      strokeWidth="9"
      fill="none"
      strokeLinecap="round"
      animate={{ 
        d: [
          "M80 178 Q76 120 80 45",
          "M80 178 Q84 120 80 45",
          "M80 178 Q76 120 80 45",
        ]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Leaves */}
    {[
      { x: 52, y: 150, rx: 22, ry: 11, rot: -48, color: "hsl(130 55% 42%)" },
      { x: 108, y: 140, rx: 24, ry: 12, rot: 45, color: "hsl(128 52% 40%)" },
      { x: 48, y: 110, rx: 20, ry: 10, rot: -42, color: "hsl(132 54% 44%)" },
      { x: 112, y: 100, rx: 22, ry: 11, rot: 48, color: "hsl(130 50% 42%)" },
      { x: 55, y: 72, rx: 18, ry: 9, rot: -38, color: "hsl(135 56% 46%)" },
      { x: 105, y: 65, rx: 19, ry: 9.5, rot: 42, color: "hsl(132 52% 44%)" },
    ].map((leaf, i) => (
      <motion.g
        key={i}
        animate={{ rotate: [leaf.rot, leaf.rot + (i % 2 === 0 ? 5 : -5), leaf.rot] }}
        transition={{ duration: 3.5 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
      >
        <motion.ellipse
          cx={leaf.x}
          cy={leaf.y}
          rx={leaf.rx}
          ry={leaf.ry}
          fill={leaf.color}
          transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
        />
      </motion.g>
    ))}
    
    {/* Flower petals - animated bloom */}
    {[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map((angle, i) => (
      <motion.ellipse
        key={i}
        cx="80"
        cy="22"
        rx="14"
        ry="25"
        fill={i % 2 === 0 ? "hsl(340 75% 72%)" : "hsl(350 70% 78%)"}
        style={{ 
          transformOrigin: "80px 42px",
          transform: `rotate(${angle}deg)`,
        }}
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
      />
    ))}
    
    {/* Flower center */}
    <motion.circle
      cx="80"
      cy="42"
      r="12"
      fill="hsl(45 95% 60%)"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    
    {/* Inner detail */}
    <motion.circle
      cx="80"
      cy="42"
      r="6"
      fill="hsl(35 90% 50%)"
    />
    
    {/* Sparkle particles around flower */}
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.circle
        key={i}
        cx={80 + Math.cos(i * Math.PI / 3) * 35}
        cy={42 + Math.sin(i * Math.PI / 3) * 35}
        r="2"
        fill="hsl(50 100% 75%)"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}
  </motion.svg>
);
