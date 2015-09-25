/**
 * Created by scuhmz on 9/25/15.
 */
var mongoose = require('mongoose');

Schema = mongoose.Schema;
var ReplySchema = new Schema({
    content:{type: String},
    product_id:{type: ObjectId,index: true},
    author_id:{type: ObjectId},
    create_at:{type: Date,default: Date.now},
    update_at:{type: Date,default: Date.now}
});

var Reply = mongoose.model('Reply',ReplySchema);
