//*************************************************************************************************
// file
//*************************************************************************************************

; (function (_) {
    var fs = require("fs")

    _.file = {
        normalizepath: function (path) {
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

        , loadfile:  function (url, next) {
            if (_.isserver) {
                try {
                    var response = fs.readFileSync(url, "utf-8")
                    next(null, response)
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
            if (_.isserver) {
                require(url)
                next(null)

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

        , isdir$: function (path) {
            return !!(path && (path.substr(path.length - 1) == "/"))
        }
    }

}) (_.ambient.loader)