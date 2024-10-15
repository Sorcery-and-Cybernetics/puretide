_.ambient.module("modeldefiner")
 .source(function (_) {
    _.define.object("modeldefiner", function(supermodel) {
        return {
            name: null
            , proto: null

            , create: function (name, proto) { 
                this.name = name
                this.proto = proto
            }

            , make: function() {

            }

            , asmodule: function(definitiondef) {
                var definer = _.define[this.name]
                definer(this.name, definitiondef)
                return this                
            }            
        }
    })    
 })