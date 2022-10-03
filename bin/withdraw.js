#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');

const withdraw = yargs
.command(
  'withdraw [amount]',
)
.help()
.argv

let greeting, balance, userBalance, newDataTemp = {};
if(withdraw._.length > 0) {

  newDataTemp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
  for(let userName in newDataTemp) {
    if(newDataTemp[userName].login === true) {
      newDataTemp[userName].balance -= Number(withdraw._[0]);
      userBalance = newDataTemp[userName].balance;
    }
  }

  newDataTemp = Object.assign(newDataTemp);
  fs.writeFileSync('temp.json', JSON.stringify(newDataTemp, null, 2));
  balance = `Your balance is ${userBalance}`;
  console.log(balance);
} else {
  greeting = `use command: "withdraw [amount]"`;
  console.log(greeting);
}
