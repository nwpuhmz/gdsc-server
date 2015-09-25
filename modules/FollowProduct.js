/**
 * Created by scuhmz on 9/25/15.
 */
var mongoose = require('mongoose');

Schema = mongoose.Schema;
var FollowProductSchema = new Schema({
    product_id:{type: ObjectId},
    user_id:{type: ObjectId},
    create_at:{type: Date,default: Date.now},
    update_at:{type: Date,default: Date.now}
});

var FollowProduct = mongoose.model('FollowProduct',FollowProductSchema);