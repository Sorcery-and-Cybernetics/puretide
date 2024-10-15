_.ambient.module("model")
 .source(function (_) {
    _.define.object("model", function(supermodel) {
        return {
            modelname: null
            , modeldef: null

            , create: function (modelname, modeldef) { 
                this.modelname = modelname
                this.modeldef = modeldef
            }

            , make: function() {

            }

            , asmodule: function(definerdef) {
                _.define[this.modelname](this.name, definerdef)
                return this                
            }
            
        }
    })    

    //overwrite define function to a function that returns a definer
    var makedefiner = function (defname, superdef) {
        var definer = function (name, modeldef) {
            var modeldef = _.define[this.modeldef](modelname, definerdef)
            var model = makeprototype(name, supermodel, modeldef)

            _.model[name] = model
            makemaker(name, model)
            makedefiner(name, model)
        }

        _.define[supername] = definer
    }

    _.define.model = function() {
        _.god.addmodeldef()
    }
 })