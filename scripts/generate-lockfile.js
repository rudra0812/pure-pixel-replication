import { execSync } from 'child_process';

console.log('Generating fresh package-lock.json...');
try {
  execSync('cd /vercel/share/v0-project && npm install --package-lock-only', { stdio: 'inherit' });
  console.log('package-lock.json generated successfully!');
} catch (error) {
  console.error('Error generating lockfile:', error.message);
  process.exit(1);
}
