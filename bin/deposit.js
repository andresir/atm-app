#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const { capitalize } = require('../helper/capitalize');

const deposit = yargs
.command(
  'deposit [amount]',
)
.help()
.argv

let greeting, balance, userBalance, balancing, sisaOwed = [], arrOwed = [], newDataTemp = {};
if(deposit._.length > 0) {
  newDataTemp = JSON.parse(fs.readFileSync('temp.json', 'utf8'));
  for(let userName in newDataTemp) {
    if(newDataTemp[userName].login === true) {
      if(Object.keys(newDataTemp[userName].owed).length > 0) {
        let arrTargetOwed = Object.keys(newDataTemp[userName].owed);
        for(let i=0; i<arrTargetOwed.length; i++) {
          if(newDataTemp[userName].owed[arrTargetOwed[i]])
          newDataTemp[arrTargetOwed[i]].balance += Number(deposit._[0]);

          if(newDataTemp[userName].owed[arrTargetOwed[i]] > Number(deposit._[0])) {
            sisaOwed.push(newDataTemp[userName].owed[arrTargetOwed[i]] - Number(deposit._[0]));
            balancing = 0;
          } else {
            sisaOwed.push((Number(deposit._[0]) - newDataTemp[userName].owed[arrTargetOwed[i]])>newDataTemp[userName].owed[arrTargetOwed[i]]?0:(Number(deposit._[0]) - newDataTemp[userName].owed[arrTargetOwed[i]]));
            balancing = Number(deposit._[0]) - newDataTemp[userName].owed[arrTargetOwed[i]]
          }
          
          newDataTemp[arrTargetOwed[i]].balance = newDataTemp[arrTargetOwed[i]].balance - Number(deposit._[0]) + Number(newDataTemp[userName].owed[arrTargetOwed[i]]) - sisaOwed[i];
          newDataTemp[userName].owed[arrTargetOwed[i]] = sisaOwed[i];

          if(balancing > 0) {
            console.log(`Transferred $${deposit._[0] - balancing} to ${capitalize(arrTargetOwed[i].toLowerCase())}`);
          } else {
            console.log(`Transferred $${deposit._[0]} to ${capitalize(arrTargetOwed[i].toLowerCase())}`);
          }

          newDataTemp[arrTargetOwed[i]].owed_from[userName] = sisaOwed[i];
          arrOwed.push(`Owed $${sisaOwed[i]} to ${arrTargetOwed[i]}`);
        }
        newDataTemp[userName].balance = balancing;
      } else {
        if(Number(balancing) > 0) {
          newDataTemp[userName].balance += (Number(deposit._[0]) - Number(balancing));
        } 
        else {
          newDataTemp[userName].balance += Number(deposit._[0]);
        }
      }
      userBalance = newDataTemp[userName].balance;
    } 
  }

  newDataTemp = Object.assign(newDataTemp);
  fs.writeFileSync('temp.json', JSON.stringify(newDataTemp, null, 2));
  balance = `Your balance is $${userBalance}`;
  console.log(balance);

  if(arrOwed.length) {
    for(let j=0; j<arrOwed.length; j++) {
      sisaOwed[j]>0 ? console.log(`${arrOwed[j]}`):'';
    }
  }
} else {
  greeting = `use command: "deposit [amount]"`;
  console.log(greeting);
}
