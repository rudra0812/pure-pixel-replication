// Each seed type has a unique visual identity
export interface SeedTheme {
  id: string;
  // Stem colors
  stemColor: string;
  stemColorDark: string;
  // Leaf colors (multiple for variety)
  leafColors: string[];
  // Flower petal colors
  petalColors: string[];
  // Flower center
  centerColor: string;
  centerInnerColor: string;
  // Glow/aura
  glowColor: string;
  sparkleColor: string;
  // Leaf shape style
  leafStyle: "rounded" | "pointed" | "broad" | "feathery";
  // Flower style
  flowerStyle: "daisy" | "sunflower" | "lotus" | "rose";
}

export const seedThemes: Record<string, SeedTheme> = {
  hope: {
    id: "hope",
    stemColor: "hsl(125 55% 42%)",
    stemColorDark: "hsl(125 48% 33%)",
    leafColors: [
      "hsl(130 60% 50%)",
      "hsl(135 55% 46%)",
      "hsl(128 52% 42%)",
      "hsl(140 58% 48%)",
    ],
    petalColors: [
      "hsl(45 95% 68%)",
      "hsl(40 90% 72%)",
      "hsl(50 88% 65%)",
      "hsl(35 92% 70%)",
    ],
    centerColor: "hsl(25 85% 55%)",
    centerInnerColor: "hsl(20 80% 45%)",
    glowColor: "hsl(50 100% 70% / 0.15)",
    sparkleColor: "hsl(50 100% 75%)",
    leafStyle: "rounded",
    flowerStyle: "daisy",
  },
  peace: {
    id: "peace",
    stemColor: "hsl(160 45% 40%)",
    stemColorDark: "hsl(155 40% 32%)",
    leafColors: [
      "hsl(165 50% 45%)",
      "hsl(170 48% 42%)",
      "hsl(158 52% 48%)",
      "hsl(175 46% 44%)",
    ],
    petalColors: [
      "hsl(270 55% 78%)",
      "hsl(280 50% 82%)",
      "hsl(260 52% 75%)",
      "hsl(275 48% 85%)",
      "hsl(265 45% 80%)",
    ],
    centerColor: "hsl(55 70% 80%)",
    centerInnerColor: "hsl(50 65% 70%)",
    glowColor: "hsl(270 60% 75% / 0.15)",
    sparkleColor: "hsl(270 80% 85%)",
    leafStyle: "broad",
    flowerStyle: "lotus",
  },
  joy: {
    id: "joy",
    stemColor: "hsl(115 50% 38%)",
    stemColorDark: "hsl(110 45% 30%)",
    leafColors: [
      "hsl(120 55% 45%)",
      "hsl(115 52% 42%)",
      "hsl(125 58% 48%)",
      "hsl(118 50% 40%)",
    ],
    petalColors: [
      "hsl(40 95% 58%)",
      "hsl(30 90% 55%)",
      "hsl(45 92% 62%)",
      "hsl(25 88% 52%)",
      "hsl(35 94% 60%)",
    ],
    centerColor: "hsl(15 80% 40%)",
    centerInnerColor: "hsl(10 75% 32%)",
    glowColor: "hsl(40 100% 65% / 0.2)",
    sparkleColor: "hsl(45 100% 70%)",
    leafStyle: "pointed",
    flowerStyle: "sunflower",
  },
  growth: {
    id: "growth",
    stemColor: "hsl(140 42% 32%)",
    stemColorDark: "hsl(135 38% 25%)",
    leafColors: [
      "hsl(145 48% 38%)",
      "hsl(140 45% 35%)",
      "hsl(150 50% 40%)",
      "hsl(138 42% 32%)",
    ],
    petalColors: [
      "hsl(350 65% 58%)",
      "hsl(345 60% 52%)",
      "hsl(355 62% 62%)",
      "hsl(340 58% 55%)",
      "hsl(348 64% 60%)",
    ],
    centerColor: "hsl(0 70% 45%)",
    centerInnerColor: "hsl(355 65% 35%)",
    glowColor: "hsl(140 50% 50% / 0.15)",
    sparkleColor: "hsl(130 60% 65%)",
    leafStyle: "feathery",
    flowerStyle: "rose",
  },
};

export const getSeedTheme = (seedType: string): SeedTheme => {
  return seedThemes[seedType.toLowerCase()] || seedThemes.hope;
};
