const express = require('express');
const fs = require('fs');
const path = require('path');

let app = express();
let scoreFile = 'score.json';
let port = 8080;

let curClientId = 0;

let tabBoisson = [{id: 1, label: 'Eau gazeuse', type: 'boisson'}, {id: 2, label: 'Bière', type: 'boisson'}, {id: 3, label: 'Coca', type: 'boisson'}];
let tabPlat = [{id: 4, label: 'Cheese burger', type: 'plat'}, {id: 5, label: 'Pizza', type: 'plat'}, {id: 6, label: 'Sushi', type: 'plat'}];
let tabDessert = [{id: 7, label: 'Panacotta', type: 'dessert'}, {id: 8, label: 'Banane', type: 'dessert'}, {id: 9, label: 'Yaourt', type: 'dessert'}];


function getClientId(){
  curClientId++;
  return  curClientId;
}

function generateCommande(){
  let commande = [];
  commande.push(tabBoisson[Math.floor(Math.random()*100) % tabBoisson.length]);
  commande.push(tabPlat[Math.floor(Math.random()*100) % tabPlat.length]);
  commande.push(tabDessert[Math.floor(Math.random()*100) % tabDessert.length]);
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
  if (typeof numClients === 'undefined'){
    return res.status(400).send({error: 'Bad request. Example : ?numClients=10'});
  }
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
  if (typeof score === 'undefined'){
    return res.status(400).send({error: 'Bad request. Example : ?score=50.'});
  }
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
