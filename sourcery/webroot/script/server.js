global._ = global._ || {}
_ = global._


var normalizepath = function (path) {
    return (path || "").replace(/\\/g, "/")
}

var config = {
    isserver: true
    
    , basepath: {
        product: normalizepath(process.cwd()) + "/"
        , script: normalizepath(__dirname) + "/" 
    }    
}



require("./loader/_root.js")

  _.ambient
      .start(config)

//_.loader
//    .make()
//    .start(config)
//    .onload(function () {
//        _.servermain()
//    })


