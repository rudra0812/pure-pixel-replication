import { motion } from "framer-motion";

interface GardenBackgroundProps {
  weatherMood: "sunny" | "cloudy" | "rainy" | "clearing";
}

export const GardenBackground = ({ weatherMood }: GardenBackgroundProps) => {
  const getSkyGradient = () => {
    switch (weatherMood) {
      case "sunny":
        return "linear-gradient(180deg, hsl(200 85% 65%) 0%, hsl(195 80% 75%) 40%, hsl(45 85% 85%) 100%)";
      case "cloudy":
        return "linear-gradient(180deg, hsl(215 30% 70%) 0%, hsl(210 25% 80%) 50%, hsl(200 35% 85%) 100%)";
      case "rainy":
        return "linear-gradient(180deg, hsl(220 30% 50%) 0%, hsl(215 35% 65%) 50%, hsl(210 30% 75%) 100%)";
      case "clearing":
        return "linear-gradient(180deg, hsl(210 50% 65%) 0%, hsl(200 60% 75%) 40%, hsl(45 75% 80%) 100%)";
      default:
        return "linear-gradient(180deg, hsl(200 85% 65%) 0%, hsl(195 80% 75%) 40%, hsl(45 85% 85%) 100%)";
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky with smooth transition */}
      <motion.div
        className="absolute inset-0"
        style={{ background: getSkyGradient() }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Sun with rays */}
      {(weatherMood === "sunny" || weatherMood === "clearing") && (
        <motion.div
          className="absolute top-8 right-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: weatherMood === "clearing" ? [0.3, 1] : 1, 
            scale: 1,
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 2,
            rotate: { duration: 120, repeat: Infinity, ease: "linear" }
          }}
        >
          {/* Sun rays */}
          <svg width="100" height="100" viewBox="0 0 100 100">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.line
                key={i}
                x1="50"
                y1="10"
                x2="50"
                y2="20"
                stroke="hsl(45 100% 70%)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
                transform={`rotate(${i * 30} 50 50)`}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="hsl(45 100% 68%)"
              filter="url(#sunGlow)"
            />
            <defs>
              <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </motion.div>
      )}

      {/* Animated fluffy clouds */}
      <Cloud 
        className="absolute top-12 -left-8" 
        size={140} 
        speed={35} 
        opacity={weatherMood === "sunny" ? 0.7 : 0.9}
        delay={0}
      />
      <Cloud 
        className="absolute top-6 left-1/4" 
        size={100} 
        speed={45} 
        opacity={weatherMood === "sunny" ? 0.5 : 0.85}
        delay={2}
      />
      <Cloud 
        className="absolute top-20 right-1/4" 
        size={120} 
        speed={40} 
        opacity={weatherMood === "sunny" ? 0.6 : 0.9}
        delay={5}
      />
      <Cloud 
        className="absolute top-8 -right-10" 
        size={130} 
        speed={50} 
        opacity={weatherMood === "sunny" ? 0.5 : 0.85}
        delay={8}
      />

      {/* Distant mountains */}
      <div className="absolute bottom-28 left-0 right-0 h-32 pointer-events-none">
        <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Far mountain range */}
          <motion.path
            d="M-20 100 L40 45 L80 70 L130 30 L180 65 L230 25 L280 55 L340 35 L400 60 L420 100 Z"
            fill="hsl(220 30% 75%)"
            opacity="0.5"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Mid mountain range */}
          <motion.path
            d="M-20 100 L30 55 L70 75 L120 40 L170 70 L220 35 L270 60 L330 45 L380 70 L420 100 Z"
            fill="hsl(200 25% 65%)"
            opacity="0.6"
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          {/* Near mountain range */}
          <motion.path
            d="M-20 100 L20 70 L60 85 L100 55 L150 78 L200 50 L250 72 L300 58 L350 75 L400 65 L420 100 Z"
            fill="hsl(180 20% 55%)"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Rolling hills with trees */}
      <div className="absolute bottom-20 left-0 right-0 h-20 pointer-events-none">
        <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
          {/* Hill 1 */}
          <path
            d="M0 60 Q50 20 100 40 T200 25 T300 38 T400 30 L400 60 Z"
            fill="hsl(140 38% 48%)"
          />
          {/* Hill 2 */}
          <path
            d="M0 60 Q80 35 150 45 T280 35 T400 42 L400 60 Z"
            fill="hsl(135 42% 42%)"
          />
        </svg>
      </div>

      {/* Background trees - left side */}
      <BackgroundTree x={8} bottom={115} height={60} delay={0} />
      <BackgroundTree x={18} bottom={110} height={50} delay={0.5} variant="pine" />
      <BackgroundTree x={28} bottom={112} height={55} delay={1} />
      
      {/* Background trees - right side */}
      <BackgroundTree x={72} bottom={112} height={55} delay={0.3} variant="pine" />
      <BackgroundTree x={82} bottom={108} height={48} delay={0.8} />
      <BackgroundTree x={92} bottom={115} height={58} delay={1.2} variant="pine" />

      {/* Ground - Grass layers */}
      <div className="absolute bottom-0 left-0 right-0 h-28">
        {/* Base ground */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsl(125 50% 42%) 0%, hsl(120 45% 38%) 30%, hsl(115 40% 32%) 50%, hsl(30 50% 28%) 70%, hsl(25 45% 22%) 100%)",
          }}
        />
        
        {/* Grass texture layer */}
        <svg viewBox="0 0 400 50" className="absolute top-0 left-0 w-full h-14" preserveAspectRatio="none">
          {/* Multiple grass blade layers for depth */}
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M${i * 6.8 + Math.random() * 3} 50 Q${i * 6.8 + 3} ${20 + Math.random() * 15} ${i * 6.8 + 5} 50`}
              fill="none"
              stroke={`hsl(${120 + Math.random() * 15} ${45 + Math.random() * 15}% ${32 + Math.random() * 10}%)`}
              strokeWidth={1.5 + Math.random()}
              animate={{ 
                d: [
                  `M${i * 6.8 + Math.random() * 3} 50 Q${i * 6.8 + 3} ${20 + Math.random() * 15} ${i * 6.8 + 5} 50`,
                  `M${i * 6.8 + Math.random() * 3} 50 Q${i * 6.8 + 5} ${18 + Math.random() * 15} ${i * 6.8 + 5} 50`,
                  `M${i * 6.8 + Math.random() * 3} 50 Q${i * 6.8 + 3} ${20 + Math.random() * 15} ${i * 6.8 + 5} 50`,
                ]
              }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>

        {/* Small flowers in grass */}
        <SmallFlower x={12} y={18} color="hsl(340 70% 75%)" delay={0} />
        <SmallFlower x={25} y={20} color="hsl(45 80% 70%)" delay={0.5} />
        <SmallFlower x={75} y={16} color="hsl(280 60% 75%)" delay={1} />
        <SmallFlower x={88} y={22} color="hsl(20 80% 75%)" delay={1.5} />
      </div>

      {/* Foreground decorative plants - left */}
      <ForegroundPlant x={5} type="bush" />
      <ForegroundPlant x={15} type="fern" />
      
      {/* Foreground decorative plants - right */}
      <ForegroundPlant x={85} type="fern" />
      <ForegroundPlant x={95} type="bush" />

      {/* Rain drops */}
      {weatherMood === "rainy" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-6 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                background: "linear-gradient(180deg, transparent, hsl(200 70% 75% / 0.7))",
              }}
              initial={{ top: "-8%", opacity: 0 }}
              animate={{ 
                top: "105%", 
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 1.2 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Floating particles / pollen */}
      {weatherMood === "sunny" && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${20 + Math.random() * 50}%`,
                background: "hsl(50 90% 80%)",
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Fluffy cloud component
const Cloud = ({ className, size, speed, opacity, delay }: { 
  className?: string; 
  size: number; 
  speed: number;
  opacity: number;
  delay: number;
}) => (
  <motion.div
    className={className}
    style={{ width: size, height: size * 0.4 }}
    animate={{ x: [0, 30, 0] }}
    transition={{ duration: speed, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <motion.ellipse cx="25" cy="28" rx="20" ry="12" fill={`hsl(0 0% 98% / ${opacity})`} 
        animate={{ cy: [28, 26, 28] }} transition={{ duration: 3, repeat: Infinity, delay: delay * 0.1 }} />
      <motion.ellipse cx="45" cy="22" rx="25" ry="15" fill={`hsl(0 0% 100% / ${opacity})`}
        animate={{ cy: [22, 20, 22] }} transition={{ duration: 3.5, repeat: Infinity, delay: delay * 0.2 }} />
      <motion.ellipse cx="70" cy="25" rx="22" ry="14" fill={`hsl(0 0% 97% / ${opacity})`}
        animate={{ cy: [25, 23, 25] }} transition={{ duration: 4, repeat: Infinity, delay: delay * 0.3 }} />
      <motion.ellipse cx="50" cy="32" rx="30" ry="10" fill={`hsl(0 0% 99% / ${opacity})`} />
    </svg>
  </motion.div>
);

// Background tree silhouettes
const BackgroundTree = ({ x, bottom, height, delay, variant = "round" }: {
  x: number;
  bottom: number;
  height: number;
  delay: number;
  variant?: "round" | "pine";
}) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, bottom, height }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <motion.svg
      viewBox="0 0 30 50"
      className="h-full"
      style={{ width: height * 0.6 }}
      animate={{ rotate: [-1, 1, -1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {variant === "round" ? (
        <>
          <rect x="13" y="35" width="4" height="15" fill="hsl(25 40% 35%)" />
          <ellipse cx="15" cy="22" rx="13" ry="18" fill="hsl(130 35% 38%)" />
          <ellipse cx="12" cy="18" rx="8" ry="10" fill="hsl(135 38% 42%)" opacity="0.7" />
        </>
      ) : (
        <>
          <rect x="13" y="38" width="4" height="12" fill="hsl(25 40% 32%)" />
          <polygon points="15,5 3,42 27,42" fill="hsl(140 40% 32%)" />
          <polygon points="15,12 6,38 24,38" fill="hsl(135 35% 38%)" opacity="0.8" />
        </>
      )}
    </motion.svg>
  </motion.div>
);

// Small flowers in grass
const SmallFlower = ({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: y }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay, type: "spring" }}
  >
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={i}
          cx="6"
          cy="3"
          rx="2"
          ry="3"
          fill={color}
          transform={`rotate(${angle} 6 6)`}
        />
      ))}
      <circle cx="6" cy="6" r="2" fill="hsl(45 90% 60%)" />
    </motion.svg>
  </motion.div>
);

// Foreground decorative plants
const ForegroundPlant = ({ x, type }: { x: number; type: "bush" | "fern" }) => (
  <motion.div
    className="absolute bottom-20 z-10"
    style={{ left: `${x}%` }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    {type === "bush" ? (
      <motion.svg
        width="50"
        height="40"
        viewBox="0 0 50 40"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="15" cy="28" rx="14" ry="12" fill="hsl(130 45% 35%)" />
        <ellipse cx="35" cy="30" rx="12" ry="10" fill="hsl(125 40% 38%)" />
        <ellipse cx="25" cy="22" rx="16" ry="14" fill="hsl(135 48% 40%)" />
        {/* Small berries */}
        <circle cx="20" cy="18" r="2" fill="hsl(350 70% 55%)" />
        <circle cx="30" cy="20" r="1.5" fill="hsl(350 70% 55%)" />
      </motion.svg>
    ) : (
      <motion.svg
        width="40"
        height="45"
        viewBox="0 0 40 45"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Fern fronds */}
        {[-25, -12, 0, 12, 25].map((angle, i) => (
          <motion.path
            key={i}
            d={`M20 45 Q${20 + angle * 0.5} 25 ${20 + angle} ${5 + Math.abs(angle) * 0.3}`}
            stroke={`hsl(${130 + i * 3} ${45 + i * 2}% ${35 + i * 3}%)`}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={{ 
              d: [
                `M20 45 Q${20 + angle * 0.5} 25 ${20 + angle} ${5 + Math.abs(angle) * 0.3}`,
                `M20 45 Q${20 + angle * 0.6} 24 ${20 + angle * 1.1} ${4 + Math.abs(angle) * 0.3}`,
                `M20 45 Q${20 + angle * 0.5} 25 ${20 + angle} ${5 + Math.abs(angle) * 0.3}`,
              ]
            }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.svg>
    )}
  </motion.div>
);
