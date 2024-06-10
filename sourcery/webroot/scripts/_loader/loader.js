//*************************************************************************************************
// loader
//*************************************************************************************************
var fs = require("fs")

; (function (_) {
    _.define.object("loader", null, {
        config: null
        
        , create: function (config) {
            this.config = config
            var startpath = config.webroot.shared
        }
        
        //, start: function (config, next) {
        //    var startpath = config.webroot.shared || "loader/"
        //}
        
        , start: function (appconfig) {
            var me = this
            
            if (appconfig) { extend(scope.config, appconfig) }
            
            if (_.isserver) {
                this.loadconfig()
            }
            
            var config = _.config
            
            var path = config.path
            var productcode = config.productcode
            var scriptversion = _.config.appversion || "last"
            var scriptpath = "scripts/" + scriptversion + "/"
            
            if (_.isserver) {
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
            foreach(_.config.harbor, function (value, name) {
                if (!value.ocean) {
                    me.addrole(name)
                }
            })
            
            _.debugmode = config.debugmode
            _.devmode = config.devmode
            
            //load source modules
            if (_.isserver) {
                this.path = ""
                this.updatestate()
            } else {
                this.path = ""
                this.updatestate()
            }
            
            return this
        }
        
        , loadconfig: function () {
            var settings = fs.readFileSync(_.config.basepath.product + "config/serverconfig", "utf-8")
            
            var settings = eval("(" + settings + ")")
            extend(_.config, settings)
        }
        
        , path: function () { 
        }
        
        , loadroot: function (path) { 

        }
        
        , updatestate: function () { 
        }        
        
        , onload: function (next) { 
        }
    })
})(_)

