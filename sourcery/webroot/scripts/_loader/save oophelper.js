//*************************************************************************************************
// oophelper
//*************************************************************************************************

//No we are not going to do the following, but to understand the code this comment section is still included
//Different methods to make an object:

//var obj = _.make.object()
//var obj = _.object.make()
//var obj = _.object().make()

//Inheritance
//var newdefinition = _.object()

//make: creates object
//load: give object name and attach object to parent
//function parent.make(name, index)
//   var object = _.make[objectname].create(arguments)
//   object.load(this, name, index)
//   return object


//Objects have 2 constructors
//create: sets initial settings of an object
//load: gives object a name, attaches to parent

//_[modelname] //definition within another object
//_.make[modelname]  //create object
//_.model[modelname]  //for inheritance checks
//_.define[modelname]  //for inheritance definition

//_.make.object(parent, name, index).load(1, 2, 3)
//_.object(1, 2, 3).create(parent, name, index)


(function (_) {
    _.helper.oop = {

        setfunctionpath: function (json, name, value) {
            var cursor = json
            var parts = name.split(".")

            for (var index = 0; index < parts.length; index++) {
                var namepart = parts[index]

                if (index < parts.length - 1) {
                    if (!cursor[namepart]) { cursor[namepart] = {} }
                    cursor = cursor[namepart]

                } else {
                    if (cursor[namepart]) {
                        if (_.isjson(cursor[namepart])) {
                            var currentcursor = cursor[cursorpart]

                            for (var key in currentcursor) {
                                value[key] = currentcursor[key]
                                delete currentcursor[key]
                            }
                        } else {
                            throw "error: " + name + " already exists"
                        }
                    }
                    cursor[namepart] = value
                }
            }
        }

        //, __load: function (parent, name, index) {
        //    this._name = name
        //    if (parent) {
        //        parent.loadchild(this, index)
        //    }
        //    this._lifestatus = _.enum.lifestatus.loaded
        //}

        
      
        , makemaker: function (name, model, iscoreobject) {
            var maker = function () {
                var object = new model()
                object.create.apply(object, arguments)
                return object
            }

            var loader = function (arguments) {
                var object = new model()
                object.load.apply(object, arguments)
                return object
            }

            _.helper.oop.setfunctionpath(_.make, name, maker)
            if (!iscoreobject) {
                _.helper.oop.setfunctionpath(_, name, loader)
            }
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
            if (!_.isfunction(prototype)) { throw "error: Invalid argument 'prototype' in _.oophelper.makeprototype definition for " + name + ". Expecting a function." }
           
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

            if (!fn.prototype.load) {
                fn.prototype.load = _.noop
            }
            
            fn.prototype._modelname = name

            return fn
        }
        
        
        , makedefiner: function (modulemodel, model) {
            var supermodel = model.supermodel
            var module = supermodel.module
            
            model.module = module

            var definer = function (path, source) {
                var module = module.make(_.loader, path, source)

                return module
            }
            
            _.helper.oop.setfunctionpath(_.define, name, definer)
        }
        
        
        , definemodel: function (name, supermodelname, source) {
            var supermodel = _.kind[supermodelname]
            var model = _.helper.oop.makeprototype(name, supermodel, source)
            
            _.helper.oop.makemaker(name, model)
            
            return model
        }
    }

}) (_)

