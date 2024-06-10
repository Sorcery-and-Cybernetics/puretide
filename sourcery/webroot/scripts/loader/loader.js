//*************************************************************************************************
// loader
//*************************************************************************************************

//stateless checking.
//List of rules (includes are sort of a rule) -> different syntax?
//start with root module, loop through all till things are satisfied

//load module / rootmodule based on rule or/and include
//all childmodules of a rootmodule should also be loaded

//we make a module first, then load the script

; (function (_) {
    _.modules = {}
    _.currentmodule = null

    _.currentpath = ""
    _.rootmodule = null
    _.scriptpath = ""

    _.updatestate = function() {
        var result = _.rootmodule.updatestate()
        if (!result) { return }

        _.debug("done")
    }

    _.loadscript = function (path) {
        _.debug("Loading: " + path)        
//        _.file.loadscript(_.system.basepath.script + path, function (err, script) {
        _.currentpath = path

        _.file.loadscript(_.scriptpath + path + ".js", function (err, script) {
            if (err) {
                throw "Error loading script: " + path
            } else {
                _.updatestate()
            }
        })
    }

    _.definemodule = function(name, source) {
//        path = _.currentpath + name

        //module should be same as current module
        var module = _.modules[_.currentpath]

        if (!module || (module.name() != name)) {
            //module = _.make.module(_.currentmodule, path, source)
            throw new Error("Module " + path + " doesn't exist.")
        }

        module.isloaded(true)
        if (source) { module.source(source) }

        return module
    }

    _.definerootmodule = function(name) {
//        path = _.currentpath + name

        //module should be same as current module
        //var module = _.modules[name]

        var module = _.modules[_.currentpath]
       
        if (!module|| (module.name() != name)) {
            //module = _.make.rootmodule(_.currentmodule, path, source)
            throw new Error("Module " + path + " doesn't exist.")
        } 
        
        module.isloaded(true)

        return module
    }

    _.start = function(config) {
        _.scriptpath = config.basepath.script
        _.rootmodule = _.make.rootmodule(_, "", "")
        _.updatestate()

        return _
    }

}) (_.ambient)