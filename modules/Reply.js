/**
 * Created by scuhmz on 9/25/15.
 */
var mongoose = require('mongoose');

var ObjectId = Schema.ObjectId;
Schema = mongoose.Schema;
var ReplySchema = new Schema({
    content:{type: String},
    product_id:{type: ObjectId,index: true},
    author_id:{type: ObjectId},
    create_at:{type: Date,default: Date.now},
    update_at:{type: Date,default: Date.now}
});

var Reply = mongoose.model('Reply',ReplySchema);


module.exports = {
    //create new reply
    add : function(req,res, restify){
        var new_reply = new Reply({
            content: req.params.content,
            product_id: req.params.product_id,
            author_id: req.params.author_id

        });

        new_reply.save(function(err, new_user){
                    if (err) res.send(new restify.InvalidArgumentError(JSON.stringify(err.errors)));
                    res.send(new_user);
                });

    },

    //get all replies by product id
    list: function (req, res, retify) {
        Reply.find({product_id:req.params.id},{},{sort:{create_at:-1}},function(err,replies){
            res.send(replies);
        });
    }

}