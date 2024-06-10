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

    _.updatestate = function() {
        if (_.rootmodule.updatestate()) {
            //done
            _.debug("done")
        }
    }

    _.loadscript = function (path) {
        _.file.loadscript(path, function (err, script) {
            if (err) {
                throw "Error loading script: " + path
            } else {
                _.debug("Loaded script: " + path)
                _.updatestate()
            }
        })
    }

    _.definemodule = function(name, source) {
        path = _.currentpath + name

        //module should be same as current module
        var module = _.modules[path]
        if (!module) {
            //module = _.make.module(_.currentmodule, path, source)
            throw new Error("Module " + path + " doesn't exist.")
        } else {
            module.isloaded(true)
            if (source) { module.source(source) }
        }

        return module
    }

    _.definerootmodule = function(name) {
        path = _.currentpath + name

        //module should be same as current module
        var module = _.modules[path]
       
        if (!module) {
            //module = _.make.rootmodule(_.currentmodule, path, source)
            throw new Error("Module " + path + " doesn't exist.")
        }  

        return module
    }

    _.start = function(config) {
        _.currentpath = config.basepath.script + "last/"
        _.rootmodule = _.make.rootmodule(_, "/", "")
        _.updatestate()

        return _
    }

}) (_.ambient.loader)