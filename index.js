
const { execFile } = require('child_process');
const child = execFile('/usr/bin/cvlc', ["~/.local/share/ebay-last-call/airbus-chime.wav", 'vlc://quit'], { shell: true }, (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
