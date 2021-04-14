const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
const client = new MongoClient(url);

//On se connecte à MongoDB.
client.connect(function(err) {

    //On vérifie qu'on c'est bien connecter!
    console.log('Serveur connecter!');
  
    //On récupère le nom de notre BDD
    const db = client.db(dbName);

    //Puis on insère les données.
    function insertDocument(db, pseudo, msg, callback) {
        
        //On récupère la table de la BDD.
        const collection = db.collection('documents');

        //Insertion des données.
        collection.insertOne({ pseudo: pseudo, message: msg}, function (err, result) {
            
            //On vérifie si on a bien envoyé les messages.
            console.log('Insertion du message!');
            callback(result);
        });
    };
  
    app.get('/', (req, res) => {
    
        res.sendFile(__dirname + '/index.html');
    });
    
    //Quand une personne se connecte.
    io.on('connection', (socket) => {
    
        console.log('Un utilisateur c_est connecter!');
    
        /**
         * Lorsque qu'un message est envoyé, on l'insère à notre BDD.
         */
        socket.on('chat message', (pseudo, msg) => {
    
            //On émets les pseudo et les messages, puis on les insères.
            io.emit('chat message', pseudo, msg);

            insertDocument(db, pseudo, msg, function (chat) {
                
                console.log(chat);
            });
        });
    
        //Quand une personne se déconnecte.
        socket.on('disconnect', () => {
    
            console.log('Un utilisateur c_est deconnecter!');
        });
    });
    
    http.listen(3000, () => {
    
        console.log('Ecoute sur le port *:3000');
  });
});
