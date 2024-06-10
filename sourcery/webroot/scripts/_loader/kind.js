//_.define.kind = function (name, _super, prototype) {   
//    prototype = prototype || {}
    
//    if (value.constructor == Function) {
//         //Get intellisense to work
//        var clone = function () { }
//        if (_super) { clone.prototype = _super.prototype }
//        clone = new clone()
//        prototype = prototype.call(null, clone) || {}
//    }

//    //flatten behaviors into prototype
//    for (var protokey in prototype) {
//        var trait = prototype[protokey]

//        if (trait) {
//            switch (trait._modelname) {
//                case "behavior":
//                    delete prototype[protokey]
                    
//                    for (var behaviorkey in trait) {
//                        if (behaviorkey != "_modelname") {
//                            if (prototype[behaviorkey]) { throw "error: duplicate trait in kind: " + name + ", behavior: " + protokey + ", trait: " + behaviorkey }
//                            prototype[behaviorkey] = trait[behaviorkey]
//                        }
//                    }
//            }
//        }
//    }

    
//    if (!prototype.create && !clone) { prototype.create = _.noop }
//    fn = function () { }
    
//    //Get instanceof working
//    if (_super) {
//        function __() { }
//        __.prototype = _super.prototype
//        fn.prototype = new __()
//    }
    
//    prototype._modelname = name
//    _.oophelper.extend(fn.prototype, prototype)
    
//    return fn
//}

//var make = function (name, supermodelname, source) {
//    var supermodel = _.kind[supermodelname]
//    var model = _.oophelper.makeprototype(name, supermodel, source)
    
//    _.oophelper.appendvalue(_.kind, name, model)
//    _.oophelper.createmaker(name, model)
    
//    //if (name != "kind") {
//    //    _.oophelper.createdefextender(name, model)
//    //}
    
//    return model
//}

//var appendvalue = function (json, name, value) {
//    var cursor = json
//    var parts = name.split(".")
    
//    if (parts.length == 1) {
//        json[name] = value

//    } else {
//        for (var index = 0; index < parts.length; index++) {
//            var namepart = parts[index]
            
//            if (index < parts.length - 1) {
//                if (!cursor[namepart]) {
//                    cursor[namepart] = {}
//                }
//                cursor = cursor[namepart]

//            } else {
//                cursor[namepart] = value
//                if (json[name]) { throw "error" }
//                json[name] = value //@andrew: does this work for the "chat.overview" ? andrew: ja
//            }
//        }
//    }
//}
