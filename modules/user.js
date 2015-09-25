/**
 * Created by scuhmz on 9/22/15.
 */
var mongoose = require('mongoose');
var config = require('../config');
var jwt = require('jsonwebtoken');

    Schema = mongoose.Schema;
var UserSchema = new Schema({
    account:{type:String ,index: true},
    password:{type:String ,required:true},
    avatar :{type:String ,default:'http://img5.imgtn.bdimg.com/it/u=2946580806,2024059485&fm=11&gp=0.jpg'},
    nickName:{type:String ,default:'小瓜子'},
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    is_block: {type: Boolean, default: false}
});

var User = mongoose.model('User',UserSchema);

module.exports = {


    authenticate :function(req, res, restify){
        User.findOne({account: req.params.account},function(err,user){
            if(err)
                res.send(new restify.InvalidArgumentError(JSON.stringify(err.errors)));
            if(user){

                if(user.password != req.params.password)
                    res.send(new restify.InvalidCredentialsError('Authentication failed. Wrong password.'));
                else{
                    var token = jwt.sign(user,config.secret,{
                        expiresInMinutes: 1440 // expires in 24 hours
                    });
                    res.send(200,{token:token});
                }
            }

            else
                res.send(new restify.InvalidCredentialsError('Authentication failed. User not found.'));


        });
    },

    //listing all users
    list : function(req,res){
        console.log('login list');
        User.find(function(err,users){
           res.send(users);
        });
    },


    //searching  user by account
    listOne: function(req, res, restify){
        User.findOne({account: req.params.account},function(err,user){
            if(err)
                res.send(new restify.InvalidArgumentError(JSON.stringify(err.errors)));
            if(user)
                res.send(user);
            else
                res.send(new restify.ResourceNotFoundError('user not found!'));
        });
    },

    //create new user
    add : function(req,res,restify){
        var new_user = new User({
            account: req.params.account,
            password: req.params.password,
            nickName: req.params.nickName,
            avatar:req.params.avatar
        });
        //check if this account already exist
        User.findOne({account:req.params.account}, function(err,user){
            if(err)
                res.send(new restify.InvalidArgumentError(JSON.stringify(err.errors)));

            if(user){
                res.send(new restify.InvalidArgumentError('user already exist!'));
            } else {
                user.save(function(err, new_user){
                    if (err) res.send(new restify.InvalidArgumentError(JSON.stringify(err.errors)));

                    res.send(new_user);
                });
            }
        });

    },

    //put user
    put : function(req,res,restify){
        var new_user = new User({
            account: req.params.account,
            password: req.params.password,
            nickName: req.params.nickName,
            avatar:req.params.avatar

        });

        User.update({ _id: req.params.id },new_user, {
            multi: false
        }, function (error, new_user) {
            if (error) return res.send(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
            res.send();
        });

    },

    //delete user by id
    del : function(req,res,restify){
        User.remove({ _id: req.params.id }, function (error, user) {
            if (error) return res.send(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
            res.send();
    })}

};