/**
 * Created by scuhmz on 9/25/15.
 */
var mongoose = require('mongoose');

Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;
var ProductSchema = new Schema({
    title:{type: String},
    category:{type:Number},
    content:{type: String},
    current_price:{type:Number,default: 0},
    old_price:{type:Number,default: 0},
    //product_img_url:{type:Array,default:[]},
    product_img_url:{type:String},
    author_id:{type: ObjectId},
    star_count:{type: Number,default: 0}, //关注数
    reply_count:{type: Number,default: 0},//回复数
    create_at:{type: Date,default: Date.now},
    update_at:{type: Date,default: Date.now}
});

var Product = mongoose.model('Product',ProductSchema);

module.exports = {

    add : function (req,res,restify) {
        var new_product = new Product({
            title: req.params.title,
            category: req.params.category,
            content: req.params.content,
            current_price: req.params.current_price,
            old_price: req.params.old_price,
            author_id: req.params.author_id,
            star_count: req.params.star_count,
            reply_count: req.params.reply_count
        });

          new_product.save(function(err, new_product){
            if (err) res.send(new restify.InvalidArgumentError(JSON.stringify(err.errors)));

            res.send(new_product);
        });
    },

    //listing all products
    list : function(req,res){
        Product.find({},{},{limit:req.query.per_page,skip:req.query.page*req.query.per_page,sort:{update_at:-1}},function(err,products){
            res.send(products);
        });
    },


    //searching  product by id
    listOne: function(req, res, restify){
        Product.findOne({_id: req.params.id},function(err,product){
            if(err)
                res.send(new restify.InvalidArgumentError(JSON.stringify(err.errors)));
            if(product)
                res.send(product);
            else
                res.send(new restify.ResourceNotFoundError('product not found!'));
        });
    }


}
