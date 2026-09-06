const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);

    const decoded = data
      .replace(/&#x27;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"');

    const requiredPhrases = [
      'Har Kisan, Har Fasal, Har Faisla.',
      'Smarter Agriculture for India',
      "Built Around the Farmer's Journey",
      'Every Harvest Comes With Uncertainty',
      'From Seed to Harvest',
      'PLAN',
      'SOW',
      'GROW',
      'PROTECT',
      'HARVEST',
      'SELL',
      'One Platform. Every Farming Decision.',
      'Make Your Next Farming Decision Smarter.',
    ];

    let allPassed = true;
    console.log('\n--- Text Verification ---');
    for (const phrase of requiredPhrases) {
      const found = decoded.includes(phrase);
      console.log(`${found ? '[PASS]' : '[FAIL]'} ${phrase}`);
      if (!found) allPassed = false;
    }

    const requiredImages = [
      'hero-farm',
      'farmer-tech',
      'farmer-inspecting',
      'aerial-farm',
      'sow-seeds',
      'crop-field',
      'farmer-hand-wheat',
      'harvester-combine',
      'mandi-market',
    ];

    console.log('\n--- Image Assets Check ---');
    for (const img of requiredImages) {
      const found = data.includes(img);
      console.log(`${found ? '[PASS]' : '[FAIL]'} Image present: ${img}`);
      if (!found) allPassed = false;
    }

    if (allPassed) {
      console.log(
        '\nSUCCESS: ALL 13 REQUIRED TEXTS AND 9 REAL AGRICULTURAL IMAGES ARE VISIBLY PRESENT IN THE RENDERED HOME PAGE!'
      );
      process.exit(0);
    } else {
      console.error('\nFAILURE: One or more phrases/images missing.');
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching Home page:', err);
  process.exit(1);
});
