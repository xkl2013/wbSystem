/**
 *@author   zhangwenshuai
 *@date     2019-07-23 15:43
 **/
const childProcess = require('child_process');
const path = require('path');

childProcess.execSync('npm run build:dev');
console.log('webpack finish');
childProcess.execSync(`scp -r ${path.join(__dirname, '../dist/*')} root@192.168.8.108:/home/projects/web/sd_node_temp/web/admin_web`);
console.log('publish finish');
