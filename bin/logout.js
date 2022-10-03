#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const { capitalize } = require('../helper/capitalize');

const logout = yargs
.command(
  'logout',
)
.help()
.argv

let greeting, newDataTemp = {};
if(logout._.length === 0) {
  newDataTemp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
  for(let userName in newDataTemp) {
    if(newDataTemp[userName].login === true) {
      newDataTemp[userName].login = false;
      greeting = `Goodbay, ${capitalize(userName.toLowerCase())}!`;
    } 
  }
  newDataTemp = Object.assign(newDataTemp);
  fs.writeFileSync('temp.json', JSON.stringify(newDataTemp, null, 2));
}

greeting?console.log(greeting):console.log('No user login!');
