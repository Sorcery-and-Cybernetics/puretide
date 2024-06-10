//*************************************************************************************************
// config
//*************************************************************************************************
; (function (_) {
    
    _ = "config": {
            "debugmode": false
            , "devmode": false
            , "appversion": "last"
            , "productcode": ""
            
            , "client": {
                "langcode": "en"
                , "ismobile": false
                , "screenlocks": 0
                , "location": "" + (_.isserver? "": window.location)
            }
            
            , "server": {
                "httpport": 80
                , "httpsport": 443
                , "webdomain": "http://localhost"
                
                , "sessiontimeout": 3600
                , "responsetimeout": 3000
                , "keepalivemixtimeout": 45000
                
                , "sender": "info@sactide.com"
            }

            , "basepath": {
                "product": ""
                , "shared": ""
                , "serverroot": ""
            }
            
            , "path": {
                "webroot": ""
                , "productscript": ""
                , "script": ""
                
                , "media": "media/"
                , "i18n": "interface/i18n/"
                , "data": "data/"
                , "cert": "cert/"
            }
            
            , "language": {}
            , "ui": {}
        }
        
        , "system": {}
        
        //refactormarker        , location: {}
        //refactormarker        , routes: {}
        , "harbor": {}
        
        , "system": {}
        
        , "helper": {}
        , "enum": {}
        , "define": {}
        , "make": {}
        , "extend": {}        
        , "kind": {}
    }
})(_)