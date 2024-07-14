global._ = global._ || {}
_ = global._


var normalizepath = function (path) {
    return (path || "").replace(/\\/g, "/")
}

var productpath = normalizepath(process.cwd()) + "/"

var config = {
    isserver: true
    
    , productpath: productpath
    , webroot: productpath + "../../"
}

require(config.webroot + "lib/loader/_root.js")

  _.ambient
      .start(config)

//_.loader
//    .make()
//    .start(config)
//    .onload(function () {
//        _.servermain()
//    })


