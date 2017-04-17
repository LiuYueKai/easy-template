/**
 * Module : uba init module
 * Author : Kvkens(yueming@yonyou.com)
 * Date	  : 2016-12-29 08:54:51
 * Update : 2016-12-30 10:51:44
 */

const fs = require('fs');
const request = require('request');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const pathExists = require('path-exists');
const download = require('download-git-repo');
const spawn = require('cross-spawn');
const help = require('./help');

module.exports = () => {
    help.info("Available templates:");
    var repoNameData = [];
    request({
        url: 'https://api.github.com/users/easy-templates/repos',
        headers: {
            'User-Agent': 'easy templates'
        }
    }, function(err, res, body) {
        if (err) console.log(err);
        var requestBody = JSON.parse(body);
        if (Array.isArray(requestBody)) {
            requestBody.forEach(function(repo, index) {
                repoNameData.push(`${repo.name} - ${repo.description}`);
            });
            //TODO 人机交互
            inquirer.prompt([{
                type: 'list',
                name: 'selectRepo',
                message: 'Please select :',
                choices: repoNameData
            }]).then(function(answers) {
                var selectName = answers.selectRepo.split(' - ')[0];
                var questions = [{
                    type: 'input',
                    name: 'selectName',
                    message: 'boilerplate name :',
                    default: function() {
                        return 'base-repository';
                    }
                }];
                inquirer.prompt(questions).then(function(answers) {
                    var name = answers.selectName,
                        template = selectName;
                    var root = path.resolve(name);
                    if (!pathExists.sync(name)) {
                        fs.mkdirSync(root);
                    } else {
                        help.error(`directory ${name} already exists.`);
                        process.exit(0);
                    }
                    help.info(`Downloading ${template} please wait.`);
                    //TODO 开始下载
                    download('easy-templates\\' + template, `${name}`, function(err) {
                        if (!err) {
                            help.info(`Boilerplate ${name} done.`);
                            inquirer.prompt([{
                                type: 'confirm',
                                message: 'Automatically install NPM dependent packages?',
                                name: 'ok'
                            }]).then(function(res) {
                                var npmInstallChdir = path.resolve('.', name);
                                if (res.ok) {
                                    help.info(`Install NPM dependent packages,please wait.`);
                                    //TODO 选择自动安装
                                    process.chdir(npmInstallChdir);
                                    var args = ['install'].filter(function(e) {
                                        return e;
                                    });
                                    var proc = spawn('npm', args, {
                                        stdio: 'inherit'
                                    });
                                    proc.on('close', function(code) {
                                        if (code !== 0) {
                                            console.error('`npm ' + args.join(' ') + '` failed');
                                            return;
                                        }
                                        help.info(`NPM package installed.`);
                                    });

                                } else {
                                    help.info(`Cancel the installation of NPM dependent package.\nPlease run \'cd ${name} && npm install\' manually.`);
                                }

                            });
                        } else {
                            console.error(requestBody.message);
                        }
                    });
                });
            });



        }
    });
}
