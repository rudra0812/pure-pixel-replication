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

const SeedStage = () => (
  <motion.svg
    width="80"
    height="100"
    viewBox="0 0 80 100"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Soil mound */}
    <ellipse cx="40" cy="75" rx="35" ry="12" fill="hsl(25 45% 28%)" />
    <ellipse cx="40" cy="73" rx="30" ry="10" fill="hsl(30 50% 32%)" />
    
    {/* Seed underground */}
    <motion.ellipse
      cx="40"
      cy="68"
      rx="8"
      ry="6"
      fill="hsl(35 60% 45%)"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    
    {/* Small crack showing life */}
    <motion.path
      d="M40 62 Q42 60 40 58"
      stroke="hsl(120 50% 40%)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 1 }}
    />
  </motion.svg>
);

const RootedStage = () => (
  <motion.svg
    width="80"
    height="120"
    viewBox="0 0 80 120"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Roots underground */}
    <motion.path
      d="M40 100 Q35 110 30 118"
      stroke="hsl(30 40% 40%)"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5 }}
    />
    <motion.path
      d="M40 100 Q45 112 50 120"
      stroke="hsl(30 40% 40%)"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
    />
    
    {/* Soil mound */}
    <ellipse cx="40" cy="95" rx="35" ry="12" fill="hsl(25 45% 28%)" />
    <ellipse cx="40" cy="93" rx="30" ry="10" fill="hsl(30 50% 32%)" />
    
    {/* Small sprout emerging */}
    <motion.path
      d="M40 93 L40 82"
      stroke="hsl(125 50% 40%)"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    />
    
    {/* Tiny leaf */}
    <motion.ellipse
      cx="44"
      cy="80"
      rx="6"
      ry="4"
      fill="hsl(130 55% 45%)"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    />
  </motion.svg>
);

const SproutingStage = () => (
  <motion.svg
    width="100"
    height="150"
    viewBox="0 0 100 150"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Roots */}
    <path d="M50 125 Q40 135 32 145" stroke="hsl(30 40% 38%)" strokeWidth="2" fill="none" />
    <path d="M50 125 Q60 138 68 148" stroke="hsl(30 40% 38%)" strokeWidth="2" fill="none" />
    
    {/* Soil */}
    <ellipse cx="50" cy="118" rx="40" ry="14" fill="hsl(25 45% 28%)" />
    <ellipse cx="50" cy="116" rx="35" ry="12" fill="hsl(30 50% 32%)" />
    
    {/* Stem */}
    <motion.path
      d="M50 116 Q48 90 50 70"
      stroke="hsl(125 50% 38%)"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
      animate={{ d: ["M50 116 Q48 90 50 70", "M50 116 Q52 90 50 70", "M50 116 Q48 90 50 70"] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    
    {/* Leaves */}
    <motion.ellipse
      cx="38"
      cy="85"
      rx="12"
      ry="6"
      fill="hsl(130 55% 45%)"
      transform="rotate(-30 38 85)"
      animate={{ rotate: [-30, -28, -30] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.ellipse
      cx="62"
      cy="78"
      rx="14"
      ry="7"
      fill="hsl(125 50% 42%)"
      transform="rotate(25 62 78)"
      animate={{ rotate: [25, 28, 25] }}
      transition={{ duration: 3.5, repeat: Infinity }}
    />
  </motion.svg>
);

const GrowingStage = () => (
  <motion.svg
    width="120"
    height="180"
    viewBox="0 0 120 180"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Roots */}
    <path d="M60 150 Q45 165 35 178" stroke="hsl(30 40% 38%)" strokeWidth="2" fill="none" />
    <path d="M60 150 Q75 165 85 178" stroke="hsl(30 40% 38%)" strokeWidth="2" fill="none" />
    <path d="M60 150 Q60 165 60 180" stroke="hsl(30 40% 38%)" strokeWidth="2" fill="none" />
    
    {/* Soil */}
    <ellipse cx="60" cy="145" rx="45" ry="15" fill="hsl(25 45% 28%)" />
    <ellipse cx="60" cy="143" rx="40" ry="13" fill="hsl(30 50% 32%)" />
    
    {/* Main stem */}
    <motion.path
      d="M60 143 Q58 100 60 50"
      stroke="hsl(125 50% 35%)"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
      animate={{ d: ["M60 143 Q58 100 60 50", "M60 143 Q62 100 60 50", "M60 143 Q58 100 60 50"] }}
      transition={{ duration: 5, repeat: Infinity }}
    />
    
    {/* Multiple leaves */}
    <motion.ellipse cx="42" cy="110" rx="16" ry="8" fill="hsl(130 55% 45%)" transform="rotate(-40 42 110)" 
      animate={{ rotate: [-40, -38, -40] }} transition={{ duration: 3, repeat: Infinity }} />
    <motion.ellipse cx="78" cy="100" rx="18" ry="9" fill="hsl(125 50% 42%)" transform="rotate(35 78 100)"
      animate={{ rotate: [35, 38, 35] }} transition={{ duration: 3.5, repeat: Infinity }} />
    <motion.ellipse cx="38" cy="75" rx="14" ry="7" fill="hsl(128 52% 48%)" transform="rotate(-35 38 75)"
      animate={{ rotate: [-35, -32, -35] }} transition={{ duration: 4, repeat: Infinity }} />
    <motion.ellipse cx="82" cy="65" rx="16" ry="8" fill="hsl(130 48% 45%)" transform="rotate(40 82 65)"
      animate={{ rotate: [40, 43, 40] }} transition={{ duration: 3.8, repeat: Infinity }} />
    
    {/* Bud at top */}
    <motion.ellipse
      cx="60"
      cy="45"
      rx="10"
      ry="12"
      fill="hsl(140 60% 50%)"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

const BloomingStage = () => (
  <motion.svg
    width="140"
    height="200"
    viewBox="0 0 140 200"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Roots */}
    <path d="M70 170 Q50 185 40 198" stroke="hsl(30 40% 38%)" strokeWidth="2" fill="none" />
    <path d="M70 170 Q90 185 100 198" stroke="hsl(30 40% 38%)" strokeWidth="2" fill="none" />
    <path d="M70 170 Q70 185 70 200" stroke="hsl(30 40% 38%)" strokeWidth="2" fill="none" />
    
    {/* Soil */}
    <ellipse cx="70" cy="165" rx="50" ry="16" fill="hsl(25 45% 28%)" />
    <ellipse cx="70" cy="163" rx="45" ry="14" fill="hsl(30 50% 32%)" />
    
    {/* Main stem */}
    <motion.path
      d="M70 163 Q68 110 70 45"
      stroke="hsl(125 50% 35%)"
      strokeWidth="7"
      fill="none"
      strokeLinecap="round"
      animate={{ d: ["M70 163 Q68 110 70 45", "M70 163 Q72 110 70 45", "M70 163 Q68 110 70 45"] }}
      transition={{ duration: 5, repeat: Infinity }}
    />
    
    {/* Leaves */}
    <motion.ellipse cx="48" cy="130" rx="18" ry="9" fill="hsl(130 55% 45%)" transform="rotate(-45 48 130)"
      animate={{ rotate: [-45, -42, -45] }} transition={{ duration: 3, repeat: Infinity }} />
    <motion.ellipse cx="92" cy="120" rx="20" ry="10" fill="hsl(125 50% 42%)" transform="rotate(40 92 120)"
      animate={{ rotate: [40, 43, 40] }} transition={{ duration: 3.5, repeat: Infinity }} />
    <motion.ellipse cx="45" cy="90" rx="16" ry="8" fill="hsl(128 52% 48%)" transform="rotate(-40 45 90)"
      animate={{ rotate: [-40, -37, -40] }} transition={{ duration: 4, repeat: Infinity }} />
    <motion.ellipse cx="95" cy="80" rx="18" ry="9" fill="hsl(130 48% 45%)" transform="rotate(45 95 80)"
      animate={{ rotate: [45, 48, 45] }} transition={{ duration: 3.8, repeat: Infinity }} />
    
    {/* Flower petals */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <motion.ellipse
        key={i}
        cx="70"
        cy="25"
        rx="12"
        ry="22"
        fill={i % 2 === 0 ? "hsl(340 70% 70%)" : "hsl(350 65% 75%)"}
        transform={`rotate(${angle} 70 40)`}
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [angle, angle + 3, angle],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
        style={{ transformOrigin: "70px 40px" }}
      />
    ))}
    
    {/* Flower center */}
    <motion.circle
      cx="70"
      cy="40"
      r="10"
      fill="hsl(45 90% 60%)"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);
