    //*************************************************************************************************
    // Scope
    //*************************************************************************************************
    
    ; (function (_) {
        var scope = _.ambient

        _.extend(scope, {
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
                
                // , language: {}
                
                // , ui: {}
            }
            
            // , system: {}
            
            // //refactormarker        , location: {}
            // , routes: {}   //refactormarker 
            // , harbor: {}
            
            // , "helper": {}
            // , "enum": {}
            // , "define": {}
            // , "kind": {}
            // , "make": {}
            // , "have": {}
            
            // , noop: (function () { var noop = function () { }; noop.__functiontype = "noop"; return noop })()
        })


        _.loadconfig = function (appconfig) {
            var me = this
            var scope = this.scope
            
            if (appconfig) { extend(scope.config, appconfig) }
            
            if (scope.isserver) {
                var settings = fs.readFileSync(scope.config.basepath.product + "config/serverconfig", "utf-8")
            
                var settings = eval("(" + settings + ")")
                _.extend(scope.config, settings)                
            }
            
            var config = scope.config
            
            var path = config.path
            var productcode = config.productcode
            var scriptversion = _.config.appscriptversion || "last"
            var scriptpath = "scripts/" + scriptversion + "/"
            
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

    })