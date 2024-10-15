
_.makeloader = function (scope, proto) {
    //*************************************************************************************************
    // Base functions
    //*************************************************************************************************
    var isstring = function (value) {
        return !!(value && (value.constructor == String))
    }
    
    var isarray = function (value) {
        return !!(value && (value.constructor == Array))
    }
    
    var cval = function (value, arg) {
        return isfunction(value) ? value(arg) : value
    }
    
    var isdir = function (path) {
        return (path.substr(path.length - 1) == "/")
    }
    
    var cstr = function (str) {
        return str == null ? "" : str.toString()
    }
    
    var foreach = function (items, next) {
        if (isarray(items)) {
            for (var index = 0; index < items.length; index++) {
                next(items[index], index)
            }
        } else {
            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    next(items[key], key)
                }
            }
        }
    }
    
    var trim$ = function (str) {
        return cstr(str).replace(/^\s+/, "").replace(/\s+$/, "")
    }
    
    var split$ = function (str, delimiter) {
        return str == null ? [] : str.toString().split(delimiter)
    }
    

    
    var normalizepath = function (path) {
        var path = (path || "").replace(/\\/g, "/")
        
        var splitted = path.split("/")
        var result = []
        
        while (splitted.length) {
            segment = splitted.shift()
            
            switch (segment) {
                case ".":
                    break
                case "..":
                    if (!result.length) {
                        result.push(segment)
                    } else {
                        var lastsegment = result[result.length - 1]
                        
                        switch (lastsegment) {
                            case "":
                            case "..":
                            case ".":
                                result.push(segment)
                                break

                            default:
                                result.pop()
                        }
                    }
                    break
                default:
                    result.push(segment)
            }
        }
        
        return result.join("/")
    }
    
    var extend = function (target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                var value = source[key]
                
                if (isobject(value)) {
                    if (!target[key]) { target[key] = {} }
                    if (!isobject(target[key])) { throw "error" }
                    extend(target[key], value)
                } else {
                    target[key] = value
                }
            }
        }
    }
    
    var merge = function (target, source) {
        var result = {}
        extend(result, target)
        extend(result, source)
        
        return result
    }
    
    var cut$ = function (str, left, right) {
        var posb = str.indexOf(left)
        if (posb < 0) { return "" }
        
        var pose = str.indexOf(right)
        if (pose < 0) { return "" }
        
        return str.substring(posb + 1, pose)
    }
    
    var makeobject = function (protobase, protoextend) {
        protobase = cval(protobase)
        protoextend = cval(protoextend, protobase)
        var proto = merge(protobase, protoextend)
        
        if (isfunction(proto.create)) {
            var result = function () {
                proto.create.apply(this, arguments)
            }
        } else {
            var result = function () { }
        }
        result.prototype = proto
        
        return result
    }
    
    
    //*************************************************************************************************
    // Scope
    //*************************************************************************************************
    
    extend(scope, {
        config: {
            debugmode: false
            , ismobile: false
            , langcode: "en"
            
            //, productcode: ""
            //            , appstamp: _.now()
            , screenlocks: 0
            , keepalivemixtimeout: 45000
            , responsetimeout: 3000
            , location: "" + (_.isserver? "": window.location)
            
            , basepath: {
                product: ""
                , shared: ""
                , serverroot: ""
                //, scriptroot: ""
            }
            
            , path: {
                webroot: ""
                , productscript: ""
                , script: ""
                
                , media: "media/"
                , i18n: "interface/i18n/"
                , data: "data/"
                , cert: "cert/"
            }
            
            , language: {}
            
            , ui: {}
        }
        
        , system: {}
        
        //refactormarker        , location: {}
        , routes: {}   //refactormarker 
        , harbor: {}
        
        , "helper": {}
        , "enum": {}
        , "define": {}
        , "kind": {}
        , "make": {}
        , "have": {}
        
        , noop: (function () { var noop = function () { }; noop.__functiontype = "noop"; return noop })()
    })
    
    var basemoduleproto = {
        name: ""
        , _parent: null
        , path: ""
        , fullpath: ""
        , isrootmodule: false
        
        , supermodelname: ""
        
        , loadstate: 0
        , definition: null
        
        , modules: null
        , docs: null
        
        , files: null
        , commands: null
        , loader: null
        
        , create: function (parent, path) {
            //Get intellisense to work
            this.loader = scope.loader
            
            if (this.isrootmodule && parent) {
                path = parent.path + path
            }
            
            if (!parent) {
                //hack for object construction during runtime
                this.name = path
            } else {
                
                this._parent = parent
                
                this.splitmodulepath(path)
                
                if (!parent.loader) {
                    //                    this.loader = parent
                    this.isroot = true
                    
                    if (this.loader.rootmodule) { throw "error" }
                    this.loader.rootmodule = this

                } else {
                    //                    this.loader = parent.loader
                }
                
                if (this._parent.modules[this.modulename]) { throw "error" }
                this._parent.modules[this.modulename] = this
            }
            
            if (!this.isrootmodule) {
                this.asmodule()
            }
            
            this.modules = {}
            this.docs = []
            this.commands = []
        }
        
        , splitmodulepath: function (modulepath) {
            modulepath = normalizepath(modulepath)
            
            if (!modulepath) {
                modulepath = "_root"
            } else if (isdir(modulepath)) {
                modulepath += "_root"
            }
            
            var namepos = modulepath.lastIndexOf("/")
            
            this.path = modulepath.substr(0, namepos + 1) || this._parent.path
            this.name = modulepath.substr(namepos + 1)
            
            var extpos = this.name.lastIndexOf(".")
            
            
            //var extpos = this.name.lastIndexOf(".")
            //if (extpos > 0) { this.name = this.name.substr(0, extpos) }
            
            this.isrootmodule = this.isrootmodule || (this.name.substr(0, 1) == "_")
            
            this.modulename = (this.isrootmodule? this.path : "") + this.name
            this.fullpath = this.path + this.name
        }
        
        , updatestate: function () {
            var me = this
            var loader = me.loader
            
            
            for (var key in me.modules) {
                var module = me.modules[key]
                if (!module.isdone) {
                    module.updatestate()
                    if (!module.isdone) return
                }
            }
            
            while (this.commands.length) {
                var command = this.commands.shift()
                
                switch (command.command) {
                    case "include":
                        
                        if (loader.checkrule(command.rule)) {
                            loader.loadjs(this, command.path)
                            return
                        }
                        break

                    case "source":
                        me.make(command.source)
                        break
                }
            }
            
            me.isdone = true
        }
        
        , onload: function (fn) {
            var me = this
            var loader = me.loader
            var scope = loader.scope
            
            if (loader.ready) {
                if (loader.currentmodule) { throw "error" }
                
                foreach(me.modules, function (module, key) {
                    module.onload()
                })
                
                while (me.onloadcache && me.onloadcache.length) {
                    var fnonload = me.onloadcache.shift()
                    loader.currentmodule = this
                    fnonload.call(me)
                    loader.currentmodule = null
                }
                
                if (isfunction(fn)) {
                    loader.currentmodule = this
                    fn()
                    loader.currentmodule = null
                }

            } else {
                if (isfunction(fn)) {
                    if (!me.onloadcache) { me.onloadcache = [] }
                    me.onloadcache.push(fn)
                }
            }
        }
        
        , make: function (source) {
            var me = this
            var scope = me.loader.scope
            
            if (!isfunction(source)) { throw "Function expected" }
            source.call(me, scope)
        }
        
        , asmodule: function (moduledef) {
            moduledef = cval(moduledef)
            
            var loader = this.loader
            
            loader.definemodule(this.name, Object.getPrototypeOf(this), moduledef)
            extend(this, moduledef)
            
            return this
        }
        
        , getmodules: function (shallow, includeroot) {
            var me = this
            result = []
            
            foreach(me.modules, function (module, key) {
                if (module.isrootmodule) {
                    if (includeroot) {
                        result.push(module)
                    }
                    
                    if (!shallow) {
                        result = result.concat(module.getmodules(shallow, includeroot))
                    }

                } else {
                    result.push(module)
                }
            })
            return result
        }
        
        , debuginfo: function () {
        }
    }
    
    
    var rootmoduleproto = merge(basemoduleproto, {
        isrootmodule: true
        
        , include: function (path, rule) {
            if (this.isdone) {
                throw "error"
            }
            
            path = isdir(path) ? path + "_root" : path
            path = path.substr(0, 1) == "/" ? path : this.path + path
            
            this.commands.push({ command: "include", path: path, rule: rule })
            return this
        }
    })
    
    var moduleproto = merge(basemoduleproto, {
        include: function (path, rule) {
            if (this.isdone) {
                throw "error"
            }

            
            
            path = isdir(path) ? path + "_root" : path
            path = path.substr(0, 1) == "/"? path: this.path + path
            
            this.commands.push({ command: "include", path: path, rule: rule })
            return this
        }
        
        , source: function (source) {
            if (this.isdone) {
                throw "error"
            }
            
            if (!this._parent) {
                //hack for object construction during runtime
                this.make(source)
            } else {
                this.commands.push({ command: "source", source: source })
            }
            return this
        }
        
        //Add tutorial text
        //fndoc: commented text 
        //usage: function(//** text including enters **//) 
        , addtext: function (fndoc) {
            var text = cut$(fndoc.toString(), "//**", "**//")
            if (text) {
                this.docs.push({
                    type: "text"
                    , text: text
                })
            }
            return this
        }
        
        , addtest: function (name, fn) {
            if (fn) {
                this.docs.push({
                    name: name
                    , type: "test"
                    , fn: fn
                })
            }
            return this
        }
        
        , findtest: function (name) {
            for (var index in this.docs) {
                var doc = this.docs[index]
                
                if ((doc.type == "test") && (doc.name == name)) {
                    return doc.fn
                }
            }
            return null
        }
    })
    
    var loader = makeobject({
        role: null
        , rootmodule: null
        , modules: null
        , allmodules: null
        , moduledefs: null
        , ready: false
        , filelist: null
        
        , create: function (scope) {
            var scope = scope || _
            this.scope = scope
            this.role = {}
            
            this.modules = {}
            this.allmodules = {}
            this.moduledefs = {}
            this.filelist = []
        }
        
        , start: function (appconfig) {
            var me = this
            var scope = this.scope
            
            if (appconfig) { extend(scope.config, appconfig) }
            
            if (scope.isserver) {
                this.loadconfig()
            }
            
            var config = scope.config
            
            var path = config.path
            var productcode = config.productcode
            var scriptversion = _.config.appscriptversion || "last"
            var scriptpath = "script/" + scriptversion + "/"
            
            if (scope.isserver) {
                config.basepath.serverroot = same$(config.basepath.product, config.basepath.shared)
                
                var length = config.basepath.serverroot.length
                config.basepath.product = config.basepath.product.slice(length)
                config.basepath.shared = config.basepath.shared.slice(length)
                
                path.webroot = ""
                path.productpath = "" //andrew: shouldn't this be set to product/ + productcode
                
                path.script = scriptpath
                path.productscript = config.basepath.product
                
                this.addrole("server")

            } else {
                path.webroot = ""
                path.productpath = ""
                
                //script paths should be relative to the index.html for visual studio to work
                path.script = "../../" + scriptpath
                path.productscript = "product/" + config.productcode + "/"
                
                this.addrole("client")
            }
            
            foreach(_.config.role, function (rolename) {
                if (rolename) { me.addrole(rolename) }
            })
            
            //Add roles for each local harborroute
            foreach(scope.config.harbor, function (value, name) {
                if (!value.ocean) {
                    me.addrole(name)
                }
            })
            
            scope.isserver = config.isserver || scope.isserver
            scope.debugmode = config.debugmode
            scope.devmode = config.devmode
            
            //load source modules
            if (scope.isserver) {
                this.path = ""
                this.updatestate()
            } else {
                this.path = ""
                this.updatestate()
            }
            
            return this
        }
        
        , loadconfig: function () {
            var settings = fs.readFileSync(scope.config.basepath.product + "config/serverconfig", "utf-8")
            
            var settings = eval("(" + settings + ")")
            extend(scope.config, settings)
        }
        
        , addrole: function (role) {
            this.role[role] = true
            return this
        }
        
        , hasrole: function (role) {
            if (role.substr(0, 1) == "!") {
                return !this.role[role.substr(1)]
            } else {
                return !!this.role[role]
            }
        }
        
        , delrole: function (role) {
            if (this.hasrole(role)) { delete this.role[role] }
            return this
        }
        
        , checkrule: function (rule) {
            var me = this
            
            if (!rule) { return true }
            
            if (isarray(rule)) {
                var result = true
                
                foreach(rule, function (rule) {
                    if (!me.checkrule(rule)) { result = false }
                })
                return result
            }
            
            if (isfunction(rule)) {
                rule = rule()
            }
            
            return validaterule(this, rule)
        }
        
        , loadfile: function (url, next) {
            if (scope.isserver) {
                try {
                    //todo
                } catch (e) {
                    next(e)
                }

            } else {
                var request = new XMLHttpRequest();
                
                request.onload = function () {
                    next(null, this.response)
                }
                
                request.onerror = function () {
                    next(this.statusText || "Timeout", this.response)
                }
                
                request.open("GET", url)
                request.send(null)
            }
        }
        
        , loadscript: function (url, next) {
            if (scope.isserver) {
                //try {
                require(url)
                next(null)
                //} catch (e) {
                //    next("Couldn't load " + url)
                //}

            } else {
                var scriptnodes = document.getElementsByTagName("script")
                var script = document.createElement('script');
                
                script.type = "text/javascript";
                script.src = url;
                script.async = false;
                
                script.onerror = function () {
                    next("Couldn't load " + url)
                }
                
                script.onload = function () {
                    next(null, script)
                }
                
                scriptnodes[scriptnodes.length - 1].parentNode.appendChild(script)
            }
        }
        
        , loadjs: function (parent, filename) {
            var me = this
            var isrootfile = filename.substr(-5) == "_root"? true: false
            
            //            _.debug("loading " + filename)
            
            if (me.currentmodule) { throw "error" }
            
            me.currentmodule = parent
            
            var url = _.config.basepath.serverroot + filename + ".js"
            
            if (url.search("undefined") >= 0) {
                _.debug("Couldn't load " + url + " of parent " + (parent? parent.path: "loader"))
                throw "Error"
            }
            
            me.loadscript(url, function (err, result) {
                if (err) {
                    _.debug("Couldn't load " + url)
//                    throw "Error"
                } else {
                    if (!isrootfile) {
                        me.filelist.push(url)
                    }
                    me.currentmodule = null
                    me.updatestate()
                }
            })
            
            return this
        }
        
        , loadmodule: function (filename, next) {

        }
        
        , loadlanguage: function (langcode, next) {
            var me = this
            var config = me.scope.config
            var i18npath = config.path.i18n
            
            if (!i18npath) {
                next();
                return
            }
            if (!!config.language[langcode]) {
                next();
                return
            }
            
            var url = i18npath + langcode + ".js"
            
            //todo: loadfile and merge. Language should be a json
            me.loadscript(url, function (err, result) {
                if (err) {
                    config.language[langcode] = {}
                } else {
                    //
                }
                next()
            })
        }
        
        , onload: function (fn) {
            if (this.rootmodule) {
                this.rootmodule.onload(fn)
            }
            return this
        }
        
        , updatestate: function () {
            if (this.rootmodule) {
                if (!this.rootmodule.isdone) {
                    this.rootmodule.updatestate()
                }
                
                if (this.rootmodule.isdone) {
                    this.ready = true
                    this.rootmodule.onload()
                }
            } else {
                if (scope.config.compactscript) {
                    this.currentmodule = this
                    this.rootmodule = this.initmodule("module", scope.config.path.script + scope.config.path.productscript)
                    this.currentmodule = null
                    this.rootmodule.include("script_min")
                    this.updatestate()
                } else {
                    //this.loadjs(this, scope.config.path.productscript + "_root")
                    this.path = scope.config.path.script
                    this.loadjs(this, this.path + "_root")
                }
            }
        }
        
        , getmodules: function () {
            if (!this.rootmodule) { return null }
            return this.rootmodule.getmodules()
        }
        
        , getsourcefilelist: function () {
            return this.filelist
        }
        
        //, findmodule: function (path) {
        //    //todo: findmodule in flatten list
        //    if (!path) {
        //        path = "_root"
        //    } else if (isdir(path)) {
        //        path += "_root"
        //    }
        
        //    return this.modules[path]
        //}
        
        , initmodule: function (name, path, source) {
            if (this.ready) {
                module = new this.moduledefs[name](this.currentmodule, path)
                module.supermodelname = name
                if (source) { module.source(source) }
                
                return module
            }
            
            if (!this.currentmodule) { throw "error" }
            
            module = new this.moduledefs[name](this.currentmodule, path)
            module.supermodelname = name
            
            var modulename = module.modulename
            
            if (this.allmodules[modulename]) {
                _.debug("module already exists. " + module.fullpath)
                return
                throw "error"
            }
            
            this.allmodules[modulename] = module
            
            if (source) { module.source(source) }
            return module
        }
        
        , definemodule: function (name, protomodule, protoextend) {
            var me = this
            
            me.moduledefs[name] = makeobject(protomodule, protoextend)
            
            var parts = name.split(".")
            var cursor = scope.define
            
            for (var index = 0; index < parts.length; index++) {
                var namepart = parts[index]
                
                if (index < parts.length - 1) {
                    if (!cursor[namepart]) {
                        cursor[namepart] = {}
                    }
                    cursor = cursor[namepart]
                } else {
                    cursor[namepart] = function (path, source) {
                        return me.initmodule(name, path, source)
                    }
                }
            }
        }
        
        , test: function (modulename, testname, rawmode) {
            var module = this.allmodules[modulename]
            
            if (!module) { throw "invalid modulename" }
            
            var test = module.findtest(testname)
            if (!test) { throw "invalid testname" }
            
            if (rawmode) {
                test()
            } else {
                try {
                    test()
                } catch (e) {
                    throw "test " + modulename + ":" + testname + " didn't pass. " + e
                }
            }
            return this
        }
        
        , debuginfo: function () {
            var result = {
                module: this.rootmodule.debuginfo()
            }
            
            return result
        }
        
        , configui: function (groupname, config) {
            var config = cval(config)
            
            config = merge(config, _.config.ui[groupname] || {})
            _.config.ui[groupname] = config
        }
 
    }, proto)
    
    var loader = new loader()
    loader.definemodule("module", moduleproto)
    loader.definemodule("rootmodule", rootmoduleproto)
    
    return loader
}

_.loader = _.makeloader(_)
