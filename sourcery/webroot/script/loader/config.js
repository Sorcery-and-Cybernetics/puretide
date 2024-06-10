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
    
                , keepalivemixtimeout: 45000
                , responsetimeout: 3000
                , location: "" + (_.isserver? "": window.location)
                    
                , basepath: {
                    product: ""
                    , script: ""
                    , serverroot: ""
                }
                    
                , path: {
                    media: "media/"
                    , i18n: "interface/i18n/"
                    , data: "data/"
                    , cert: "cert/"
                }

                , worlds: null
            }
            
            if (_.isserver) {
                _.file.loadfile("./config/serverconfig", function (err, data) {
                    if (err) {
                        console.log("Error loading serverconfig: " + err)
                    } else {
                        var settings = eval("(" + data + ")")
                        _.extend(config, settings)
                    }
                })
            }

            if (startconfig) { _.extend(config, startconfig) }
            
            if (_.isserver) {
                config.basepath.serverroot = _.sameleft$(config.basepath.product, config.basepath.shared)
                
            } else {
                //script paths should be relative to the index.html for visual studio to work
                config.basepath.script = "../../script/" 
            }
            
            return config
        }

    }) (_.ambient)