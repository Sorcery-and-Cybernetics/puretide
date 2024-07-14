//*************************************************************************************************
// oophelper
//*************************************************************************************************

//Different methods to make an object:
//var obj = _.make.object()
//var obj = _.object.make()
//var obj = _.object().make()

//Inheritance
//var newdefinition = _.object()

(function (_) {
    _.helper.oop = {

        setvalue: function (json, name, value) {
            var cursor = json
            var parts = name.split(".")

            if (json[name]) { throw "error: value already exists" }
            json[name] = value //@andrew: does this work for the "chat.overview" ? 

            if (parts.length > 1) {
                for (var index = 0; index < parts.length; index++) {
                    var namepart = parts[index]

                    if (index < parts.length - 1) {
                        cursor = cursor[namepart]
                        if (!cursor) { throw "error: path not found, cannot set value" }

                    } else {
                        if (cursor[namepart]) { throw "error: value already exists" }
                        cursor[namepart] = value
                    }
                }
            }
        }

        , makemaker: function (name, model) {
            model.make = function () {
                var x = model
                var object = new model()
                object.create.apply(object, arguments)
                return object
            }

            _.helper.oop.setvalue(_.make, name, model)

            _.helper.oop.setvalue(_, name, model)
            _.helper.oop.setvalue(_.kind, name, model)
        }

        //, flattenbehavior: function () {
        //    //flatten behaviors into prototype
        //    for (var protokey in prototype) {
        //        var trait = prototype[protokey]

        //        if (trait && (trait._modelname == "behavior")) {
        //            delete prototype[protokey]

        //            for (var behaviorkey in trait) {
        //                if (behaviorkey != "_modelname") {
        //                    if (prototype[behaviorkey]) { throw "error: duplicate trait in " + name + ", behavior: " + protokey + ", trait: " + behaviorkey }
        //                    prototype[behaviorkey] = trait[behaviorkey]
        //                }
        //            }
        //        }
        //    }
        //}

        , extendprototype: function (target, source, duplicatewarn, grouptag) {
            for (var key in source) {
                var traitdef = source[key]

                if (source.hasOwnProperty(key)) {
                    target[key] = traitdef
                }
            }
        }

        , makeprototype: function (name, _super, prototype) {
            if (!_.isfunction(prototype)) { throw "error: prototype for " + name + " should be given as a function" }

            var fn = function () {
                if (_ == this) {
                    //Inherit model
                    var model = new fn()
                    model.definemodel.apply(model, arguments)
                    return model
                }
            }

            //trick to get instanceof working
            if (_super) {
                var clone = function () { }
                clone.prototype = _super.prototype
                fn.prototype = new clone()

                prototype = prototype.call(null, fn.prototype)
            } else {
                prototype = prototype(null)
            }

            _.helper.oop.extendprototype(fn.prototype, prototype)

            if (!fn.prototype.create) {
                fn.prototype.create = _.noop
            }
            fn.prototype._modelname = name

            return fn
        }


        , definemodule: function (modulemodel, model) {
            var supermodel = model.supermodel
            var module = supermodel.module

            model.module = module

            var definer = function (path, source) {
                var module = module.make(_.loader, path, source)

                return module
            }

            _.helper.oop.setvalue(_.define, name, definer)
        }


        , definemodel: function (name, supermodelname, source) {
            var supermodel = _.kind[supermodelname]
            var model = _.helper.oop.makeprototype(name, supermodel, source)

            _.helper.oop.makemaker(name, model)

            return model
        }
    }

})(_)
