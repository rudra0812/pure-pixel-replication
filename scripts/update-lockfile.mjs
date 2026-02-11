import { execSync } from 'child_process';

try {
  console.log('Running npm install to update package-lock.json...');
  execSync('cd /vercel/share/v0-project && npm install', { stdio: 'inherit' });
  console.log('package-lock.json updated successfully!');
} catch (error) {
  console.error('Error updating lock file:', error.message);
  process.exit(1);
}
