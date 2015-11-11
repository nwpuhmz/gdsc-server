/**
 * Created by scuhmz on 11/11/15.
 */

var fs = require('fs');
exports.uploadImg = function (req, res, next) {

    var file = req.files.file,
        filePath = file.path,
        lastIndex = filePath.lastIndexOf("/"),
        tmpfileName = filePath.substr(lastIndex+1);

        console.log(req.body);
    console.log(req.files.file);
    res.send('ook');
}