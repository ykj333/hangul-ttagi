import { spawnSync } from 'node:child_process';
process.loadEnvFile('.env.local');
for (const name of ['AUTH_SECRET','OPENAI_API_KEY','OPENAI_IMAGE_MODEL']) {
  if (!process.env[name]) throw new Error(`Missing ${name}`);
  for (const target of ['production','preview','development']) {
    const result = spawnSync('npx', ['--yes','vercel@latest','env','add',name,target,'--force','--scope','kujong-yoos-projects'], { shell: process.platform === 'win32', input: process.env[name], encoding: 'utf8', stdio: ['pipe','pipe','pipe'] });
    if (result.status !== 0) throw new Error(`Could not configure ${name} for ${target}`);
    console.log(`Configured ${name} for ${target}`);
  }
}
