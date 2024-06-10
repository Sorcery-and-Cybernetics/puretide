//*************************************************************************************************
// rootmodule
//*************************************************************************************************
; (function (_) {
    _.define.object("rootmodule", function () {
        return {
            _parent: null
            , _name: ""
            , _loader: null
            , _rule: ""
            , _isloaded: false

            , _modules: null                 
            
            , create: function (parent, name, rule) {
                this._parent = parent._loader? parent: null
                this._loader = parent._loader? parent._loader: parent
                this._modules = []

                this._name = name
                this._rule = rule

                this._loader.modules[this.fullpath()] = this
                if (this._parent) {
                    this._parent._modules.push(this)
                }
            }

            , parent: function () { return this._parent }
            , loader: function () { return this._loader }
            , isrootmodule: function () { return true }
            , istop: function () { return this._parent? false: true }
            , rule: function () { return this._rule }

            , name: function () { return this._name }            
            , path: function () { return (this._parent ? this._parent.path() : "") + this._name }
            , fullpath: function () { return (this._parent ? this._parent.path() : "") + this._name + "_root"}

            , isloaded: function (value) { 
                if (value === undefined) { return this._isloaded }

                this._isloaded = value
                return this
            }


            // , find: function(path) {
            //     var parts = _.split$(path, "/", 2)
            //     var part = parts[0]

            //     if (!part) { return null }
            //     return this._modules[part].find(part[1])
            // }

            , include: function (name, rule) {
                if (_.file.isdir$(name)) {
                    var module = _.make.rootmodule(this, name, rule)
                } else {
                    var module = _.make.module(this, name, rule)
                }

                return this
            }

            , require: function () {
                //todo:
                return this
            }            

            , foreachmodule: function (callback) {
                for (var key in this._modules) {
                    var module = this._modules[key]
                    var result = callback(module, key)

                    if (result) { return result }
                }
            }

            , load: function (god) {
                if (!this.isloaded()) {
                    if (god) { 
                        god.loadmodule(this)
                    } else {
                        this._loader.loadscript(this.fullpath())
                    }
                    return false
                }

                var paths = []

                for (var key in this._modules) {
                    var module = this._modules[key]
                    var subpaths = module.load(god)

                    if (!subpaths) { return false }
                    if (_.isstring(subpaths)) { 
                        paths.push(subpaths)
                    } else {
                        paths = paths.concat(subpaths)
                    }
                }
                return paths
            }

        }
    })   

}) (_.ambient) 

