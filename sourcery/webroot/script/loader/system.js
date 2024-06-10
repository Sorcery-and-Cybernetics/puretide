if (typeof global == "undefined") {
    _ = _ || {}
    var isserver = false

} else {
    global._ = global._ || {} 
    _ = global._
    var isserver = true
}

_.ambient = _.ambient || {}


; (function(_) {
    _.isserver  =  isserver
    _.loader = { system: _.ambient }

    _.modules = {}
    _.worlds = {}

    _.currentpath = ""
    _.rootmodule = null    

    _.rootmodule = function(name) {
        var module = _.modules[_.currentpath]

        if (!module || (module.name() != name)) {
            throw new Error("Module " + path + " doesn't exist.")
        }

        module.isloaded(true)

        return module
    }
        
    _.module = function (name, source) {
        var module = _.modules[_.currentpath]

        if (!module || (module.name() != name)) {
            throw new Error("Root module " + path + " doesn't exist.")
        }

        if (source) { module.source(source) }
        module.isloaded(true)
        return module
    }

    _.start = function(config) {
        _.config = _.loadconfig(config)
        _.modules._root = _.make.rootmodule(_, "", "")

        _.createworld("test", {}, function() {
            _.debug("world created")
        })

        return _
    }

    _.createworld = function(name, config, next) {
        _.make.god(_, name, config)
            .onfinished(function() {
                next()
            })
            .start()
    }



            // //this goes to creating worlds
            
            // foreach(_.config.role, function (rolename) {
            //     if (rolename) { me.addrole(rolename) }
            // })
            
            // //Add roles for each local harborroute
            // foreach(scope.config.harbor, function (value, name) {
            //     if (!value.ocean) {
            //         me.addrole(name)
            //     }
            // })
            
            // scope.isserver = config.isserver || scope.isserver
            // scope.debugmode = config.debugmode
            // scope.devmode = config.devmode
            
            // //load source modules
            // if (scope.isserver) {
            //     this.path = ""
            //     this.updatestate()
            // } else {
            //     this.path = ""
            //     this.updatestate()
            // }    
    

}) (_.ambient)

