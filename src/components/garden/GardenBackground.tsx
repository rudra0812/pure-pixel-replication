import { motion } from "framer-motion";

interface GardenBackgroundProps {
  weatherMood: "sunny" | "cloudy" | "rainy" | "clearing";
}

export const GardenBackground = ({ weatherMood }: GardenBackgroundProps) => {
  const getSkyGradient = () => {
    switch (weatherMood) {
      case "sunny":
        return "linear-gradient(180deg, hsl(200 80% 70%) 0%, hsl(45 90% 85%) 100%)";
      case "cloudy":
        return "linear-gradient(180deg, hsl(210 20% 75%) 0%, hsl(200 30% 85%) 100%)";
      case "rainy":
        return "linear-gradient(180deg, hsl(215 25% 60%) 0%, hsl(210 30% 75%) 100%)";
      case "clearing":
        return "linear-gradient(180deg, hsl(205 40% 70%) 0%, hsl(40 70% 80%) 100%)";
      default:
        return "linear-gradient(180deg, hsl(200 80% 70%) 0%, hsl(45 90% 85%) 100%)";
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky */}
      <motion.div
        className="absolute inset-0"
        style={{ background: getSkyGradient() }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Sun */}
      {(weatherMood === "sunny" || weatherMood === "clearing") && (
        <motion.div
          className="absolute top-12 right-12 w-20 h-20 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(45 100% 70%) 0%, hsl(40 100% 60% / 0.3) 60%, transparent 70%)",
            boxShadow: "0 0 60px 20px hsl(45 100% 70% / 0.4)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: weatherMood === "clearing" ? [0.3, 1] : 1, 
            scale: 1,
          }}
          transition={{ duration: 2 }}
        />
      )}

      {/* Clouds */}
      {(weatherMood === "cloudy" || weatherMood === "rainy" || weatherMood === "clearing") && (
        <>
          <motion.div
            className="absolute top-16 left-4 w-32 h-12 rounded-full opacity-80"
            style={{ background: "hsl(0 0% 95% / 0.9)" }}
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-8 left-24 w-24 h-10 rounded-full opacity-70"
            style={{ background: "hsl(0 0% 92% / 0.85)" }}
            animate={{ x: [0, -15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-20 right-8 w-28 h-10 rounded-full opacity-75"
            style={{ background: "hsl(0 0% 90% / 0.9)" }}
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Distant hills/greenery */}
      <div className="absolute bottom-32 left-0 right-0 h-24">
        <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0 60 Q50 20 100 40 T200 30 T300 45 T400 35 L400 60 Z"
            fill="hsl(140 35% 55%)"
            opacity="0.6"
          />
          <path
            d="M0 60 Q80 35 150 50 T280 40 T400 50 L400 60 Z"
            fill="hsl(135 40% 45%)"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Ground - Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsl(120 45% 40%) 0%, hsl(115 40% 35%) 40%, hsl(30 50% 30%) 60%, hsl(25 45% 25%) 100%)",
          }}
        />
        {/* Grass blades */}
        <svg viewBox="0 0 400 40" className="absolute top-0 left-0 w-full h-10" preserveAspectRatio="none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M${i * 10 + 2} 40 Q${i * 10 + 5} ${15 + Math.random() * 10} ${i * 10 + 8} 40`}
              fill="none"
              stroke="hsl(125 50% 35%)"
              strokeWidth="2"
              animate={{ 
                d: [
                  `M${i * 10 + 2} 40 Q${i * 10 + 5} ${15 + Math.random() * 10} ${i * 10 + 8} 40`,
                  `M${i * 10 + 2} 40 Q${i * 10 + 6} ${12 + Math.random() * 10} ${i * 10 + 8} 40`,
                  `M${i * 10 + 2} 40 Q${i * 10 + 5} ${15 + Math.random() * 10} ${i * 10 + 8} 40`,
                ]
              }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </div>

      {/* Rain drops */}
      {weatherMood === "rainy" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-4 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                background: "linear-gradient(180deg, transparent, hsl(200 60% 70% / 0.6))",
              }}
              initial={{ top: "-5%", opacity: 0 }}
              animate={{ 
                top: "100%", 
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
