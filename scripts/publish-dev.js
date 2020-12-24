/**
 *@author   zhangwenshuai
 *@date     2019-07-23 15:43
 **/
const childProcess = require('child_process');
const path = require('path');

childProcess.execSync('npm run build:dev');
console.log('webpack finish');
childProcess.execSync(`scp -r ${path.join(__dirname, '../dist/*')} root@39.97.184.2:/root/package/web/sd_node/web/admin_web`);
console.log('publish finish');
