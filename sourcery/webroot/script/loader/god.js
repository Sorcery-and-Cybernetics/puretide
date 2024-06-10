; (function (_) {
    _.define.object("god", function () {
        return {
            system: null
            , config: null
            , name: ""

            , create: function(system, name, config) {
                this.system = system
                this.name = name
                this.config = config || null
            }

            , start: function () {
                this.loadmodules()
            }

            , loadmodules: function() {
                var result = _.modules._root.load(this)
                if (!result) { return }

                _.debug("All necessary modules are loaded")
                var world = _.make.world(this)

                _.foreach(result, function(modulename) {
                    var module = _.modules[modulename]
                    var source = module.source()
                    source(world)
                })

                this.onfinished()
            }
            
            , loadmodule: function (module) {
                var me = this

                var path = module.fullpath()
                _.debug("Loading: " + path)        

                _.currentpath = path
        
                _.file.loadscript(_.scriptpath + path + ".js", function (err, script) {
                    if (err) {
                        throw "Error loading script: " + path
                    } else {
                        me.loadmodules()
                    }
                })
            }            

            , onfinished: function(next) {
                if (_.isfunction(next)) {
                    this._onfinished = next
                    return this
                }
                
                if (this._onfinished) {
                    var next = this._onfinished
                    this._onfinished = null
                    next.call(this)
                }
                
            }

        }
    })
}) (_.ambient)