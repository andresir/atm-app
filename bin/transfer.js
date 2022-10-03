#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const { capitalize } = require('../helper/capitalize');

const transfer = yargs
.command(
  'transfer [target] [amount]',
)
.help()
.argv

let greeting, balance, userBalance, owed = {}, arrOwedFrom = [], newDataTemp = {};
if(transfer._.length > 0) {
  let target = transfer._[0].toLowerCase();
  let amount = transfer._[1];

  newDataTemp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));

  if(newDataTemp[target]) {
    for(let userName in newDataTemp) {
      if(newDataTemp[userName].login === true) {
        if(Number(amount) < newDataTemp[userName].balance) {
          if(Object.keys(newDataTemp[userName].owed_from).length > 0) {
            let arrTargetOwedFrom = Object.keys(newDataTemp[userName].owed_from);
            for(let i=0; i<arrTargetOwedFrom.length; i++) {
              newDataTemp[target].owed[Object.keys(newDataTemp[target].owed)[i]] = Object.values(newDataTemp[target].owed)[i] -= Number(amount);
              newDataTemp[userName].owed_from[Object.keys(newDataTemp[userName].owed_from)[i]] = Object.values(newDataTemp[userName].owed_from)[i] -= Number(amount);

              if(Object.keys(newDataTemp[userName].owed_from).length > 0) {
                let arrTargetOwedFrom = Object.keys(newDataTemp[userName].owed_from);
                for(let i=0; i<arrTargetOwedFrom.length; i++) {
                  arrOwedFrom.push(`Owed $${Object.values(newDataTemp[userName].owed_from)[i]} from ${arrTargetOwedFrom[i]}`);
                }
              }

              newDataTemp = Object.assign(newDataTemp);
              fs.writeFileSync('temp.json', JSON.stringify(newDataTemp, null, 2));
            }
          } else {
            newDataTemp[target].balance += Number(amount);
            newDataTemp[userName].balance -= Number(amount);
          }
          userBalance = newDataTemp[userName].balance;
        } else if (newDataTemp[userName].balance > 0) {
          newDataTemp[target].balance += Number(newDataTemp[userName].balance);
          owed[target] = Number(amount) - Number(newDataTemp[userName].balance);
          newDataTemp[userName].owed = owed;
          console.log(`Transferred $${newDataTemp[userName].balance} to ${capitalize(transfer._[0].toLowerCase())}`);
          let sisaBalance = Number(newDataTemp[userName].balance) - Number(newDataTemp[userName].balance);
          newDataTemp[userName].balance = sisaBalance;
          newDataTemp = Object.assign(newDataTemp);
          fs.writeFileSync('temp.json', JSON.stringify(newDataTemp, null, 2));
          console.log(`Your balance is $${sisaBalance}`);
          console.log(`Owed $${owed[target]} to ${capitalize(transfer._[0].toLowerCase())}`);
          return;
        }
      }
    }
  } else {
    return console.log(`Your target transfer ${target} not found!`);
  }

  newDataTemp = Object.assign(newDataTemp);
  fs.writeFileSync('temp.json', JSON.stringify(newDataTemp, null, 2));

  greeting = `Transferred $${transfer._[1]} to ${capitalize(transfer._[0].toLowerCase())}`;
  balance = `Your balance is $${userBalance}`;

  if(arrOwedFrom.length > 0) {
    console.log(balance);
    for(let j=0; j<arrOwedFrom.length; j++) {
      console.log(`${arrOwedFrom[j]}`);
    }
  } else {
    console.log(greeting);
    console.log(balance);
    owed > 0?console.log(owed):'';
  }
} else {
  let useCommand = `use command: "transfer [target] [amount]"`;
  console.log(useCommand);
}
