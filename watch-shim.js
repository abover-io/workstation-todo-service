'use strict';

const fs = require('fs');

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
  fs.writeFileSync('./dist/main.js', '');
}
