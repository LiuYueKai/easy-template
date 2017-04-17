/**
 * Module : helper
 * Author : LiuYueKai(liuyuekainihao@163.com)
 * Date	  : 2017-04-17 14:38:42
 */

'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

module.exports = {
    help: () => {
        console.log(chalk.green('et help'));
        console.log(chalk.green('1. uba init                  Generate best practices'));
        console.log(chalk.green('2. uba -h	             Help'));
    },
    version: () => {
        console.log();
        console.log(chalk.green('Version : ' + require('../package.json').version));
        console.log();
        process.exit();
    },
    info: (msg) => {
        console.log(chalk.cyan("Info : " + msg));
    },
    error: (msg) => {
        console.log(chalk.red("Error : " + msg));
    }
}
