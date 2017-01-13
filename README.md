# Node Js Test débutant

Dans ce test, le candidat devra implémenter les fonctions generateClients(nb) et getMaxScore().

La fonction generateClients(nb) doit renvoyer un tableau contenant 'nb' objets. Chaque objet contient un attribut id et un attribut commande qui contient un tableau de trois objets "nourriture", une entrée, un plat et un dessert.

Exemple d'output : 

[
  {
    "id":4,
    "commande":
      [
        {"id":3,"label":"Coca","type":"boisson"},
        {"id":5,"label":"Pizza","type":"plat"},
        {"id":7,"label":"Panacotta","type":"dessert"}
      ]
  }
]

Exemple de correction generateClients(nb): 

```
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
```

La fonction getMaxScore doit renvoyer le meilleur score (stocké dans le fichier score.json sous la forme {maxScore: maxScore}), si ce fichier n'existe pas la fonction revoie 0.

Exemple de correction getMaxScore(callback) : 

```
function getMaxScore(callback){
  fs.readFile(path.join(__dirname, scoreFile), function(err, content){
    if (err){
      return callback(err, 0);
    }
    let parsedData = JSON.parse(content);
    return callback(err, parsedData && parsedData.maxScore || 0);
  });
}
```
