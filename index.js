
/**
 * index.js
 *
 * This is the file that gets called once per day by systemd.
 */
const path = require('path');
process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');
const weather = require('weather-js');
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const config = require('config');

if (typeof config.location === 'undefined') throw new Error('config.location was not defined. Was it configured in config/default.json?');
if (typeof config.degreeType === 'undefined') throw new Error('config.degreeType was not defined. Was it configured in config/default.json?');
if (typeof config.chimeSound === 'undefined') throw new Error('config.chimeSound was not defined. Was it configured in config/default.json?');
console.log(`config.location:${config.location}\nconfig.degreeType:${config.degreeType}\nconfig.chimeSound${config.chimeSound}`)

async function chime() {
  console.log(`chiming ${config.chimeSound}`);
  try {
    const { stdout, stderr } = await execFile('/usr/bin/cvlc', [config.chimeSound, 'vlc://quit'], { shell: true })
    console.log(stdout);
  }
  catch (e) {
    throw e;
  }
}

async function getWeather(location, degreeType) {
  return new Promise((resolve, reject) => {
    weather.find({ search: location, degreeType: degreeType }, (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  })
}

async function weatherReport() {
  let w;
  try {
    w = await getWeather(config.location, config.degreeType);
  } catch (e) {
    console.error(`call to getWeather failed with error ${e}`)
  }
  let loc = w[0].location;
  let cur = w[0].current;
  let dtt = `${loc.degreetype === 'F' ? 'Fahrenheit' : 'Celcius'}`
  let ph = `${cur.skytext}. `+
           `${cur.temperature} degrees ${dtt}. `+
           `wind ${cur.winddisplay}. `+
           `humidity ${cur.humidity}. `+
           `feels like ${cur.feelslike} degrees ${dtt}. `
  console.log(ph)
  await speak(ph);
}

async function speak(phrase) {
  try {
    const { stdout, stderr } = await execFile('/usr/bin/espeak', [`"${phrase}"`], { shell: true })
    console.log(stdout);
  }
  catch (e) {
    throw e;
  }
}

async function main() {
  await chime();
  await weatherReport();
};

main();
