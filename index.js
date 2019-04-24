const fs = require('fs')
const { join } = require('path')
const async = require('async')

const sourceDirectory = ''

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source =>
  fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)

let totalCount = 0

async.waterfall([
    function(callback) {//List directories in the sourceDirectory
        let directoryList = getDirectories(sourceDirectory)
        if(directoryList.length > 0) {
            callback(null, directoryList)
        } else {
            callback('No directories to count')
        }
    },
    function(directoryList, callback) {
        async.mapLimit(directoryList, 20, function(directoryName, callback) {
            fs.readdir(directoryName, (err, files) => {
                totalCount += files.length
                console.log(`${directoryName} has ${files.length} files`);
                callback(null, 'done')
            });
        }, function(error, results) {
            if(error) {
                callback(error)
            } else {
                callback();
            }
        })
    }
], function (error, success) {
    if (error) { alert('Something is wrong!'); }
    console.log(`Total Count of Files is: ${totalCount}`)
});


