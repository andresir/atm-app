#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const { capitalize } = require('../helper/capitalize');

const login = yargs
.command(
  'login [name]',
)
.help()
.argv

let greeting, balance, arrOwedFrom = [], dataTemp = {}, newDataTemp = {};
if(login._.length > 0) {
  let name = login._[0].toLowerCase();
  let temp = {};
  temp[name] = {
    'balance': 0,
    'owed': {},
    'owed_from': {},
    'login': true
  };

  if(!fs.existsSync('temp.json')) {
    fs.writeFileSync('temp.json', JSON.stringify(temp));
    dataTemp.balance = 0;
    newDataTemp = temp;
  } else {
    newDataTemp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
    for(let userName in newDataTemp) {
      userName !== login._[0].toLowerCase() ? newDataTemp[userName].login=false : newDataTemp[userName].login=true;
      if(Object.keys(newDataTemp[userName].owed_from).length > 0 
      && Object.keys(newDataTemp[userName].owed).length === 0
      && userName === login._[0] 
      && newDataTemp[userName].login === true) {
        let arrTargetOwedFrom = Object.keys(newDataTemp[userName].owed_from);
        for(let i=0; i<arrTargetOwedFrom.length; i++) {
          arrOwedFrom.push(`Owed $${Object.values(newDataTemp[userName].owed_from)[i]} from ${arrTargetOwedFrom[i]}`);
        }
      } 
      if(Object.keys(newDataTemp[userName].owed_from).length === 0 
      && Object.keys(newDataTemp[userName].owed).length > 0
      && userName === login._[0] 
      && newDataTemp[userName].login === true) {
        let arrTargetOwedFrom = Object.keys(newDataTemp[userName].owed);
        for(let i=0; i<arrTargetOwedFrom.length; i++) {
          arrOwedFrom.push(`Owed $${Object.values(newDataTemp[userName].owed)[i]} to ${arrTargetOwedFrom[i]}`);
        }
      }
    }
    newDataTemp = Object.assign(temp, newDataTemp);
    fs.writeFileSync('temp.json', JSON.stringify(newDataTemp, null, 2));
  }

  greeting = `Hello, ${capitalize(login._[0].toLowerCase())}!`;
  balance = `Your balance is $${newDataTemp[name].balance}`;
} else {
  greeting = `use command: "login [name]"`;
}

console.log(greeting);
balance?console.log(balance):'';

if(arrOwedFrom.length > 0) {
  for(let j=0; j<arrOwedFrom.length; j++) {
    console.log(`${arrOwedFrom[j]}`);
  }
}
