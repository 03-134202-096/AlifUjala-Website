const fs = require('fs');

const makeSVG = (c1, c2, e) => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#g)" />
  <circle cx="200" cy="150" r="90" fill="white" opacity="0.15" />
  <text x="50%" y="54%" font-size="120" text-anchor="middle" dominant-baseline="middle">${e}</text>
</svg>`;

const s = {
  'whackALetter.svg': makeSVG('#f97316', '#dc2626', '🔨'),
  'urduBalloonPop.svg': makeSVG('#ec4899', '#e11d48', '🎈'),
  'urduTrainPuzzle.svg': makeSVG('#3b82f6', '#0891b2', '🚂'),
  'urduGridFind.svg': makeSVG('#8b5cf6', '#4f46e5', '🔍'),
  'urduNuqtaSort.svg': makeSVG('#10b981', '#059669', '⚖️'),
  'urduTileTap.svg': makeSVG('#f59e0b', '#d97706', '🎹')
};

fs.mkdirSync('public/images/games', { recursive: true });
for (let f in s) {
  fs.writeFileSync('public/images/games/' + f, s[f].trim());
}
console.log('Done generating SVGs');
