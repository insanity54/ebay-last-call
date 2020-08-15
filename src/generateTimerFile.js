#!/usr/bin/env node

let path = require('path');
process.env.NODE_CONFIG_DIR = path.join(__dirname, '..', 'config');
let util = require('util');
let Liquid = require('liquid');
let fsp = require('fs').promises;
let engine = new Liquid.Engine();
let child_process = require('child_process');
let execFile = util.promisify(child_process.execFile);
let config = require('config');

const templatePath = path.join(__dirname, 'ebay-last-call.timer.j2');
const calendar = config.ebayShippingTime;

(async () => {
  let whichNode = await execFile('which', ['node'], { stdio: 'pipe' });
  let nodePath = whichNode.stdout.replace(/\r?\n|\r/g, '');  
  let template = await fsp.readFile(templatePath, { encoding: 'utf-8' });
  let parsed = await engine.parse(template);
  let result = await parsed.render({ 
   calendar: calendar, 
  })
  console.log(result);
})()
 
