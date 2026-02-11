import { execSync } from "child_process";

try {
  // Generate a fresh package-lock.json in sync with package.json
  console.log("Running npm install to regenerate package-lock.json...");
  execSync("npm install --package-lock-only", {
    cwd: "/vercel/share/v0-project",
    stdio: "inherit",
  });
  console.log("package-lock.json regenerated successfully.");
} catch (err) {
  console.error("Failed to regenerate package-lock.json:", err.message);
  process.exit(1);
}
