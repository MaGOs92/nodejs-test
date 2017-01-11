const express = require('express');
const fs = require('fs');
const path = require('path');

let app = express();
let scoreFile = 'score.json';
let port = 8080;

let curClientId = 0;

let tabBoisson = [{id: 1, label: 'Eau gazeuse'}, {id: 2, label: 'Bière'}, {id: 3, label: 'Coca'}];
let tabPlat = [{id: 4, label: 'Cheese burger'}, {id: 5, label: 'Pizza'}, {id: 6, label: 'Sushi'}];
let tabDessert = [{id: 7, label: 'Panacotta'}, {id: 8, label: 'Banane'}, {id: 9, label: 'Yaourt'}];


function getClientId(){
  curClientId++;
  return  curClientId;
}

function generateCommande(){
  let commande = [];
  commande.push(tabBoisson[Math.floor(Math.random()*100) % tabBoisson.length].id);
  commande.push(tabPlat[Math.floor(Math.random()*100) % tabPlat.length].id);
  commande.push(tabDessert[Math.floor(Math.random()*100) % tabDessert.length].id);
  return commande;
}

function generateClients(numClients){
  let tabClients = [];
  for (let i=0; i<numClients; i++){
    let curClient = {
      id: getClientId(),
      commande: generateCommande()
    };
    tabClients.push(curClient);
  }
  return tabClients;
}

function getMaxScore(callback){
  fs.readFile(path.join(__dirname, scoreFile), function(err, content){
    if (err){
      return callback(err, 0);
    }
    let parsedData = JSON.parse(content);
    return callback(err, parsedData && parsedData.maxScore || 0);
  });
}

app.get('/clients', function(req, res){
  let numClients = req.query.numClients;
  res.send(generateClients(numClients));
});

app.get('/food', function(req, res){
  let food = {
    boisson: tabBoisson,
    plat: tabPlat,
    dessert: tabDessert
  }
  res.send(food);
});

app.get('/score', function(req, res){
  let score = req.query.score;
  console.log(score);
  getMaxScore(function(err, maxScore){
    let dataToSend = (score > maxScore) ? {newRecord: true, maxScore: score} : {newRecord: false, maxScore: maxScore};
    res.send(dataToSend);
    if (dataToSend.newRecord){
      fs.writeFile(path.join(__dirname, scoreFile), JSON.stringify(dataToSend), function(err){
        if (err) {
          return console.log(err);
        }
      });
    }
  });
});

app.listen(port);
