#!/usr/bin/env node


let path = require('path');
let util = require('util');
let Liquid = require('liquid');
let fsp = require('fs').promises;
let engine = new Liquid.Engine();
let child_process = require('child_process');
let execFile = util.promisify(child_process.execFile);

const templatePath = path.join(__dirname, 'ebay-last-call.service.j2');
const entrypoint = path.join(__dirname, '..', 'index.js');
const user = process.env.USER;

(async () => {
  let whichNode = await execFile('which', ['node'], { stdio: 'pipe' });
  let nodePath = whichNode.stdout.replace(/\r?\n|\r/g, '');
  let template = await fsp.readFile(templatePath, { encoding: 'utf-8' });
  let parsed = await engine.parse(template);
  let result = await parsed.render({ 
    node: nodePath, 
    entrypoint: entrypoint,
    user: user,
    group: user
   })
  console.log(result);
})()
 
