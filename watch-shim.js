'use strict';

const fs = require('fs');

if (!fs.existsSync('./dist')) {
  fs.mkdir('./dist');
  fs.writeFileSync('./dist/main.js', '');
}
