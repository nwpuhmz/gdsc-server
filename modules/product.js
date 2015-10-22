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
    author:{type: ObjectId,
            ref:'User'},
    comments:[
                {   content:{type: String},
                    author:{type: ObjectId,
                        ref:'User'},
                    create_at:{type: Date,default: Date.now},
                    update_at:{type: Date,default: Date.now}
                }
            ],
    star_count:{type: Number,default: 0}, //关注数
    reply_count:{type: Number,default: 0},//回复数
    create_at:{type: Date,default: Date.now},
    update_at:{type: Date,default: Date.now}
});

var Product = mongoose.model('Product',ProductSchema);

//Methods:
Product.add = function (req,res,restify) {
        var new_product = new Product({
            title: req.params.title,
            category: req.params.category,
            content: req.params.content,
            current_price: req.params.current_price,
            old_price: req.params.old_price,
            author: req.params.author_id,
            comments: [],
            star_count: req.params.star_count,
            reply_count: req.params.reply_count
        });

          new_product.save(function(err, new_product){
            if (err) res.send(new restify.InternalServerError(JSON.stringify(err.errors)));

            res.send(new_product);
        });
    };

Product.list =function(req,res,restify){

        Product.find({},{},{limit:req.query.per_page,skip:req.query.page*req.query.per_page,sort:{update_at:-1}})
            .populate({
                path: 'author',
                select: '-password' //不显示 password
            })
            .populate({
                path: 'comments.author',
                select: '-password' //不显示 password
            })
            .exec(function(err,products){
                if(err)
                    res.send(new restify.InternalServerError(JSON.stringify(err.errors)));
                res.send(products);
            });
    };

Product.listOne =function(req, res, restify){

    Product.findOne({_id: req.params.id})
        .populate({
            path: 'author',
            select: '-password' //不显示 password
        })
        .populate({
            path: 'comments.author',
            select: '-password' //不显示 password
        })
        .exec(function (err,product) {
            if(err)
                res.send(new restify.InternalServerError(JSON.stringify(err.errors)));
            res.send(product);
        });
    };
/**
 * add a commnet
 * @param req
 * @param res
 * @param restify
 */
Product.addComment = function (req,res,restify) {
    var comment = {};
    comment.content = req.params.content;
    comment.author = req.params.author_id;
        Product.findById(req.params.id, function (err,product_find) {
            if(err)
                res.send(new restify.InternalServerError(JSON.stringify(err.errors)));
            product_find.comments.push(comment);
            product_find.save(function (err) {
                if(err)
                    res.send(new restify.InternalServerError(JSON.stringify(err.errors)));
                Product.findById(req.params.id)
                    .populate({
                        path: 'author',
                        select: '-password' //不显示 password
                    })
                    .populate({
                        path: 'comments.author',
                        select: '-password' //不显示 password
                    })
                    .exec(function (err,product) {
                        if(err)
                            res.send(new restify.InternalServerError(JSON.stringify(err.errors)));
                        res.send(product);
                    });
            });
        });
}
module.exports = Product;
