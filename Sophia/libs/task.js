const task = {}
var tasks = []
var callback;
var count = 0;
task.add = function (timeout) {
    count++
    tasks.push(new Promise(function(res){
        setTimeout(function(){
            res(true)
        },timeout)
    }))
    let length = count
    Promise.all(tasks).then(function(){
        if(length == tasks.length){
            tasks = []
            count = 0
            callback()
        }
      
    }).catch(function(){})
}

task.onFinish = function (func) {
    callback = func;
}


module.exports = exports = task;