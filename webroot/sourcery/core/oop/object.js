_.ambient.module("object")
 .source(function (_) {
    _.define = _.define || {}
    _.make = _.make || {}
    _.model = _.model || {}

    _.model.object = function () { }
    _.model.object.prototype = {
        _modelname: "object"
        , modelname: function () { return this._modelname }
        , create: _.noop
    }    

    var makemaker = function (name, model) {
        var maker = function () {
            var object = new model()
            object.create.apply(object, arguments)
            return object
        }

        _.make[name] = maker
    }  
    
    var makeprototype = function (name, supermodel, modeldef) {
        if (!_.isfunction(modeldef)) { throw "modeldef should be defined as a function" }
        modeldef = modeldef(supermodel)
        
        if (modeldef == null) { throw "Modeldef for [" + name + "] cannot be null" } 
        
        if (!modeldef.create && !supermodel) {
            modeldef.create = _.noop
        } 
        
        var model = function () { }

        //trick to get instanceof working
        if (supermodel) {
            function clone() { }
            clone.prototype = supermodel.prototype
            model.prototype = new clone()
        }

        //extend the prototype
        _.extend(model.prototype, modeldef)
        model.prototype._modelname = name
        model.supermodel = supermodel

        return model
    }    

    var makedefiner = function (supername, supermodel) {
        var definer = function (name, modeldef) {
            var model = makeprototype(name, supermodel, modeldef)

            _.model[name] = model
            makemaker(name, model)
            makedefiner(name, model)
        }

        _.define[supername] = definer
    }

//    makemaker("object", _.model["object"])
    makedefiner("object", _.model["object"])
})

