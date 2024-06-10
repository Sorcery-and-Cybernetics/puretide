//*************************************************************************************************
// base
//*************************************************************************************************
if (typeof global == "undefined") {
    _ = _ || {}
    var isserver = false

} else {
    global._ = global._ || {} 
    _ = global._
    var isserver = true
}

_.ambient = _.ambient || {}

_.ambient.isserver  =  isserver
_.ambient.loader = { ambient: _.ambient }

_.ambient.rootmodule = function (path, source) {
    return _.ambient.loader.definerootmodule(path, source)
}

_.ambient.module = function (path, source) {
    return _.ambient.loader.definemodule(path, source)
}

_.ambient.start = function(config) {
    _.ambient.loader.start(config)
}



    //_.helper = {}
    //_.enum = {}
    //_.kind = {}
    //_.make = {}
    //_.extend = {}
  


; (function(_){
    //*************************************************************************************************
    // Initial logging
    //*************************************************************************************************
    _.isserver = isserver

    _.debug = function (line) {
        if ((typeof Debug !== "undefined") && Debug.writeln) {
            Debug.writeln(line)
        }

        if ((typeof console !== "undefined") && console.log) {
            console.log(line)
        }
    }


    _.noop = function () { }
    _.noop.__functiontype = "noop"
    
    _.isfunction = function (value) {
        return !!(value && (value.constructor === Function))
    }
    
    _.isobject = function (value) {
        return !!(value && (value.constructor === Object))
    }

    _.isarray = function(value) {
        return !!(value && (value.constructor == Array))
    }

    _.cstr = function(str) {
        return str == null ? "" : str.toString()
    }
    
    _.normalize = function (value, context, arg) {
        return _.isfunction(value) ? value.call(context, arg) : value
    }
    
    _.sameleft$ = function (str1, str2) {
        var pos = 0
        var result = ""
        
        while ((pos < str1.length) && (pos < str2.length)) {
            if (str1.charCodeAt(pos) != str2.charCodeAt(pos)) {
                break
            }
            result += str1.charAt(pos)
            pos++
        }
        
        return result
    }

    _.trim$ = function (str) {
        return _.cstr(str).replace(/^\s+/, "").replace(/\s+$/, "")
    }  

    _.split$ = function (str, delimiter, count) {
        return str == null ? [] : str.toString().split(delimiter, count)
    }

    _.foreach = function (items, next) {
        if (_.isarray(items)) {
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
    
    _.extend = function (target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                var value = source[key]
                
                if (_.isobject(value)) {
                    if (!target[key]) { target[key] = {} }
                    if (!_.isobject(target[key])) { throw "error" }
                    _.extend(target[key], value)
                } else {
                    target[key] = value
                }
            }
        }
    }

    _.merge = function (target, source) {
        var result = {}

        _.extend(result, target)
        _.extend(result, source)
        
        return result
    }

}) (_.ambient.loader)



