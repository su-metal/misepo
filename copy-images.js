const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\tossy\\.gemini\\antigravity\\brain\\f5ad7f97-e991-4659-ac05-cdb69432eda7';
const publicDir = 'f:\\App_dev\\misepo\\public\\assets\\landing';

const files = [
  { src: 'clay_monster_ai_robot_1768616539021.png', dest: 'clay_monster_ai.png' },
  { src: 'clay_monster_sns_blobs_1768616552558.png', dest: 'clay_monster_sns.png' },
  { src: 'clay_monster_sparkle_star_1768616566819.png', dest: 'clay_monster_sparkle.png' }
];

files.forEach(file => {
  const srcPath = path.join(brainDir, file.src);
  const destPath = path.join(publicDir, file.dest);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${file.src} to ${file.dest}`);
  } catch (err) {
    console.error(`Error copying ${file.src}:`, err.message);
  }
});
