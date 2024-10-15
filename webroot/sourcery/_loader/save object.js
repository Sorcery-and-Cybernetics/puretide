//*************************************************************************************************
// object
//*************************************************************************************************
//_.behavior = function (proto) {
//    var behavior = _.normalize(proto)

//    behavior._modelname = "behavior"
//    return behavior
//}

/*
 * Object.define -> extend prototype + adds class definition to scope
 * module.define -> encapsulates an prototype.
 *                  Add internal class to scope when module.render is called
 *                  returns module definition. Inheritance through asmodule
*/

//var model = function () { return { } }

//_.helper.oop.definemodel("object", null, model)

//_.helper.oop.definemodule("objectmodule", null, module)
//_.helper.oop.definemodel("objectmodule", null, module)

//_.make = function () {
//}


//*************************************************************************************************
// Initial object
//*************************************************************************************************
_.ambient.define.module("object", function (_) {
    _.model = {}
    _.make = {}

    _.model.object = function () { }
    _.model.object.prototype = {
        _modelname: "object"
        , modelname: function () { return this._modelname }
        , construct: _.noop
        , create: _.noop
    }

    var makeprototype = function (name, supermodel, modeldef) {
        var model = function () {
            if (_ == this) {
                var obj = new fn()
            } else {
                obj = this
            }
            return obj.construct.apply(obj, arguments) || obj
        }

        //trick to get instanceof working
        supermodel = supermodel || _.model.object
        var clone = function () { }
        clone.prototype = supermodel.prototype
        model.prototype = new clone()

        if (modeldef) {
            if (_.isfunction(modeldef)) {
                modeldef = modeldef.call(null, model.prototype)
            }
        } else {
            modeldef = {}
        }

        //extend the prototype
        _.extend(fn.prototype, modeldef)
        model.prototype._modelname = name

        return model
    }

    //define objectdefiner
    var objectdefiner = makeprototype("objectdefiner", null, function (supermodel) {
        return {
            name: ""
            , modeldef: null
            , supermodelname: null
            , module: null

            , construct: function (name, supermodelname, modeldef) {
                this.name = name
                this.supermodelname = supermodelname
                this.modeldef = modeldef
            }

            , source: function (modelsource) { this.modelsource = modelsource }

            , make: function () {
                var supermodel = _.model[this.supermodelname]
                
                var model = makeprototype(this.name, (supermodel ? supermodel.prototype : null), this.prototype)
                _[this.name] = model
                _.model[this.name] = model
            }

            //            , require: function () { }

            , onmake: function (fn) { }
        }
    })

    var makedefinerfunction = function (definersupermodel, supermodelname) {
        var result = function (name, modeldef) {
            var objectdefiner = makeprototype(name, definersupermodel)
            _.moduledefs[name] = objectdefiner

            makedefinerfunction(objectdefiner, name)

            return objectdefiner.construct(name, supermodelname, modeldef)
        }

        return result
    }


    _.define.object = makedefinerfunction(objectdefiner, "object")

})
