/**
 * Created by scuhmz on 9/22/15.
 */
var restify = require('restify'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    jwtRestify = require('restify-jwt');
    //paginate = require('restify-paginate');
var config = require('./config');

var server = restify.createServer({ name: 'gdsc-api' })


server.listen(7000, function () {
    console.log('%s listening at %s', server.name, server.url)
})

// Plugins to fix some issues on restify
server
    // Allow the use of POST
    .use(restify.fullResponse())
    // Maps req.body to req.params
    .use(restify.bodyParser())

    .use(restify.queryParser())
    ;

// CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();

});

//Json web token filter
//server.use(jwtRestify({ secret: config.secret}).unless({path:[
//    '/user',
//    '/user/authenticate'
//]}));

/*===================== DataBase ======================= */

mongoose.connect('mongodb://localhost/gdsc');

var  db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('Connected to  gdsc-MongoDB.');
});

/* ===================== Application ======================= */

var user = require('./modules/user.js');
var product = require('./modules/product.js');


/*======================user=========================*/
//Authenticate a user
server.post('/user/authenticate',function(req,res){
    user.authenticate(req,res,restify);

});

//Get all users
server.get('/user',function(req,res,next){

    user.list(req,res);
});

//Get user by account
server.get('/user/:account',function(req,res,next){
    user.listOne(req,res,restify);
});


//Create new user
server.post('/user',function(req,res,next){
    if(req.params.account.trim() === undefined||req.params.password.trim() === undefined){
        return next(new restify.InvalidArgumentError('Account or Password must be supplied'))
    }
    user.add(req,res,restify);
});

//Put user by account
server.put('/user/:id',function(req,res,next){
    if(req.params.account === undefined){
        return next(new restify.InvalidArgumentError('Account  must be supplied'))
    }
    user.put(req,res,restify);
});

//Delete user by id
server.del('/user/:id',function(req,res,next){

    user.del(req,res,restify);
});


/*======================product=========================*/

//Create new product
server.post('/product',function(req,res,next){
    if(req.params.title === undefined)
        return next(new restify.InvalidArgumentError('Product title must be supplied'));
    product.add(req,res,restify);
});

//Get all products
server.get('/product',function(req,res,next){
    if(req.query.page === undefined || req.query.per_page === undefined){
        req.query.page = 0;
        req.query.per_page = 20;
    }
    product.list(req,res);
});

//Get product by id
server.get('/product/:id',function(req,res,next){
    product.listOne(req,res,restify);
});

//Add a comment
server.post('/product/:id/replies', function(req,res,next) {
    product.addComment(req,res,restify);
});
