//*************************************************************************************************
// object definition
//*************************************************************************************************
; (function () {
    _.define.object("objectdefinition", function () {
        return {
            
            _trait: null
            , _traitgroup: null
            
            , create: function (model) {
                this._model = model
                
                this._trait = {}
                this._traitgroup = {}
            }
            
            , fortraittype: function (typename, next) {
                _.foreach(group._traitgroup, next)
                return this
            }
            
            , fortraitgroup: function (groupname, next) {
                _.foreach(group._trait, next)
                return this
            }
            
            , addtrait: function () { }
            , addmethod: function () { }
            
            , addsignal: function () { }
            , addstate: function () { }
            
            , maker: function () { }
            
            , extendproto: function () { }
            
            , source: function () { }
            
            , onload: function () { }

    //todo: overwrite existing classes
    //todo: 
        }
    })
})()

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


