const util = require('minecraft-server-util');
const axios = require('axios');
const express = require('express');
const app = express();
const options = new Map();

// log function setup
options.set("projname", "vanish_bypass")
const yellow = '\x1b[33m'
const reset = '\x1b[0m'


// options (YOU CAN EDIT THESE)
options.set('port', 8000) // server host port
options.set('default_ip', 'play.dwc.fund')
options.set('default_port', 25565)
options.set('On_Error_Assume_Player_Is_Online',false)
// dont edit below <3


function log() {
  console.log(`${yellow}[${new Date().toLocaleTimeString().split(' PM')[0]}][${gradientText(options.get("projname"),20)}${yellow}]${reset}`, Object.values(arguments).join(' '))
}
function gradientText(text, hue) {
  let ansi = ''
  for (let i = 0; i < text.length; i++) {
    ansi += '\x1b[38;5;' + (hue + i) + 'm' + text[i]
  }
  return ansi
}
app.get('/check/:player', (req, res) => {
    const player = req.params.player;
    log('Checking for player ' + player+ ` on ${req.query.ip}:${req.query.port} by ${req.query.author || 'unknown'}`)
    checkforplayer(player,req.query.ip, req.query.port, req.query.author || 'unknown').then((result) => {
        res.send(result); // send result to client
        log('Player ' + player + ' is ' + (result ? 'online' : 'offline')) // log result to console 
    }).catch((error) => {
        res.send(error);
        log('Error checking for player ' + player)
    });
})

const moptions = {
    timeout: 1000 * 5, // timeout ms
    enableSRV: true
};

function checkforplayer(player, ip, port, author) {
  author = author || 'unknown' // default to unknown if not provided
  ip = ip || options.get('default_ip') // default ip
  port = parseInt(port) || options.get('default_port') // default port
  return new Promise((resolve, reject) => {
    util.status(ip, port, moptions)
        .then((result) => {
            const players = []
            result.players.sample = result.players.sample || []
            for (let obj of result.players.sample) {
                players.push(obj.name) // add all players to array
            }
            if (players.includes(player)) {
                resolve(true) // player is online if they are in the array
            }
            else {
                resolve(false) // player is offline if they are not in the array
            }
        })
        .catch((error) => {
            resolve(options.get('On_Error_Assume_Player_Is_Online')) // server is offline if there is an error (or your ip is blocked / wrong port / wrong ip provided), thus assume player is offline
        });
    })
}

app.listen(options.get("port"), () => {
    log(`Server started on port ${options.get('port')}, check http://localhost:${options.get("port")}/check/Roll_Tide?ip=${options.get('default_ip')}&port=${options.get('default_port')}`)
})
