const fs = require('fs');

// Читаем файл
let content = fs.readFileSync('src/components/PaywallPage.tsx', 'utf8');

// Замены для 4-Week плана
content = content.replace(/\$38\.95/g, '₽699');
content = content.replace(/\$6\.99/g, '₽499');
content = content.replace(/\$1\.30/g, '₽25');
content = content.replace(/\$0\.99/g, '₽18');

// Замены для 8-Week плана  
content = content.replace(/\$15\.99/g, '₽999');
content = content.replace(/\$0\.53/g, '₽35');

// Замены для 12-Week плана
content = content.replace(/\$66\.65/g, '₽2599');
content = content.replace(/\$25\.99/g, '₽1499');
content = content.replace(/\$0\.29/g, '₽18');

// Записываем обратно
fs.writeFileSync('src/components/PaywallPage.tsx', content);

console.log('✅ Цены обновлены на рубли!');