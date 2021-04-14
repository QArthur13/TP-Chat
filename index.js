const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const client = new MongoClient(url);

client.connect(function(err) {

    console.log('Serveur connecter!');
  
    const db = client.db(dbName);

    /* function insertDocuments(db, msg, callback) {
        // Get the documents collection
        // On récupére le nom du table, si elle n'existe pas Mongo le créer.
        const collection = db.collection('documents');
        // On insère quelque documents
        collection.insertMany([{ pseudo: "Arthur",  message: msg}, { pseudo: "Erosse", message: msg }], function(err, result) {
          console.log('Insertion des messages!');
          callback(result);
        });
    }; */

    function insertDocument(db, pseudo, msg, callback) {
        
        const collection = db.collection('documents');

        collection.insertOne({ pseudo: pseudo, message: msg}, function (err, result) {
            
            console.log('Insertion du message!');
            callback(result);
        });
    };

    /* insertDocuments(db, function (toto) {

        console.log(toto);
    }); */
  
    app.get('/', (req, res) => {
    
        res.sendFile(__dirname + '/index.html');
    });
    
    io.on('connection', (socket) => {
    
        console.log('Un utilisateur c_est connecter!');
    
        /**
         * Lorsque qu'un message est envoyé, on l'insère à notre BDD.
         */
        socket.on('chat message', msg => {
    
            io.emit('chat message', msg);

            /* insertDocuments(db, msg, function (chat) {
                
                //On regarde si l'acion c'est bien effectué.
                console.log(chat)
            }) */

            insertDocument(db, )
        });
    
        socket.on('disconnect', () => {
    
            console.log('Un utilisateur c_est deconnecter!');
        });
    });
    
    http.listen(3000, () => {
    
        console.log('Ecoute sur le port *:3000');
  });
});
