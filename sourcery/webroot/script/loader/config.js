    //*************************************************************************************************
    // Scope
    //*************************************************************************************************
    
    ; (function (_) {


        _.loadconfig = function (startconfig) {
            var config = {
                debugmode: false
                , ismobile: false
                , langcode: "en"
                
                , productcode: ""
                , appstamp: _.now()
    
                , keepalivemixtimeout: 45000
                , responsetimeout: 3000
                , location: "" + (_.isserver? "": window.location)
                    
                , basepath: {
                    product: ""
                    , script: ""
                    , serverroot: ""
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
            }
            
            if (scope.isserver) {
                _.loadfile("./config/serverconfig", function (err, data) {
                    if (err) {
                        console.log("Error loading serverconfig: " + err)
                    } else {
                        var settings = eval("(" + data + ")")
                        _.extend(config, settings)
                    }
                })
            }

                        
            if (appconfig) { extend(config, startconfig) }
            _.config = config

            
            var path = config.path
            var productcode = config.productcode
            var scriptversion = _.config.appscriptversion || "last"
            var scriptpath = "script/" + scriptversion + "/"
            
            if (scope.isserver) {
                config.basepath.serverroot = _.same$(config.basepath.product, config.basepath.shared)
                
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
            
            return config
        }

    }) (_.ambient)