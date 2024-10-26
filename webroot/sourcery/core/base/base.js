_.ambient.module("base")
    .source(function (_) {
    
        _.crlf = "\r\n"
        _.lf = "\n"
        _.cr = "\r"

        _.enum = {}
        _.helper = {
            base: {}
        }
    
        _.__uniqueid = 1
    
        _.uniqueid = function () { 
            return _.__uniqueid++
        }

        //############################################################################################################################################
        //Typecasting
        //############################################################################################################################################
        _.undef = function (value, initial) {
            return value === undefined ? initial : value
        }

        _.isstring = function (value) {
            return !!(value && (value.constructor == String))
        }

        _.isnumber = function (value) {
            return !!((value != null) && (value.constructor == Number))
        }

        _.isdate = function (value) {
            return !!(value && (value.constructor == Date))
        }

        _.isarray = function (value) {
            return !!(value && (value.constructor == Array))
        }

        _.isfunction = function (value) {
            return !!(value && (value.constructor == Function))
        }

        _.isobject = function (value) {
            return !!(value && (value.constructor == Object))
        }

        _.iskind = function (value) {
            return !!(value && value.__kindname)
        }

        _.isarraybuffer = function (value) {
            return !!(value && (value.constructor == ArrayBuffer))
        }

        _.isregex = function (value) {
            return !!(value && (value.constructor == RegExp))
        }

        _.iselement = function (value) {
            return !!(value && (value.nodeType == 1))
        }

        _.isempty = function (value) {
            return ((value == "") || (value == null))
        }

        _.isemptyobject = function (obj) {
            if (obj == null) return true

            if (obj.length > 0) return false
            if (obj.length === 0) return true

            for (var prop in obj) {
                if (typeof obj.prop != "function") {
                    return false
                }
            }
            return true
        }

        _.isodd = function (value) {
            return !!(value % 2)
        }

        _.iseven = function (value) {
            return !(value % 2)
        }

        _.iserror = function (value) {
            return !!(value && ((value.constructor == Error) || (value instanceof _.kind.error)))
        }

        _.isjserror = function (value) {
            return !!(value && (value.constructor == Error))
        }

        _.isnumeric = function (value) {
            return !_.isarray(value) && ((value - parseFloat(value) + 1) == 1)
        }

        _.normalize = function (value, context) {
            return _.isfunction(value) ? value.call(context) : value
        }

        _.cint = function (value) {
            return Math.round(value || 0)
        }

        _.cpos = function (value) {
            if (value == "*") {
                return ""
            }
            return !!value? Math.round(value || 0):null
        }

        _.cstr = function (str) {
            return str == null ? "" : str.toString()
        }

        _.isdir = function (path) {
            path = _.cstr(path)
            return (path.substr(path.length - 1) == "/")
        }

        _.tostring = function (value) {
            if (!value) {
                return ""
            } else if (_.isobject(value) || _.isarray(value)) {
                return JSON.stringify(value)
            } else {
                return value.toString()
            }
        }

        _.length = function (value) {
            if (!value) {
                return 0

            } else if (_.isstring(value)) {
                return value.length

            } else if (_.isarray(value)) {
                return value.length

            } else if (_.isobject(value)) {
                return Object.keys(value).length

            } else {
                return 1
            }
        }

        _.cbool = function (value) {
            _.helper.base.boolvalues = {
                "y": true
                , "yes": true
                , "t": true
                , "true": true
                , "ja": true
                , "j": true
            }

            if (typeof value == "string") {
                return _.helper.base.boolvalues[value.toLowerCase()] || false
            }
            return !!value
        }

        _.eqnull = function (obj, funcname) {
            var eqnull = false

            if (obj == null) {
                eqnull = true

            } else if (obj.exists) {
                eqnull = !obj.exists()
            }

            if (eqnull && funcname && _.debug.warn) {
                _.debug.warn("eqnull", funcname, null, "object is missing")
            }
            return eqnull
        }

        _.exists = function (obj, funcname) {
            return !_.eqnull(obj, funcname)
        }

        _.ensure = function (obj, funcname) {
            return _.eqnull(obj, funcname) ? null : obj
        }

        _.arg2array = function (args) {
            return Array.prototype.slice.call(args)
        }

        //############################################################################################################################################
        //Loops and optimization
        //############################################################################################################################################
        _.done = new Error("done")
        _.done.cancel = true
        _.remove = new Error("remove")

        _.foreach = function (items, fn, context) {
            context = context || this

            if (_.isarray(items)) {
                for (var index = 0; index < items.length; index++) {
                    if (fn.call(context, items[index], index) == _.done) return false
                }
            } else if (_.isobject(items)) {
                for (var index in items) {
                    if (fn.call(context, items[index], index) == _.done) return false
                }
            } else if (items) {
                fn.call(context, items)
            }
        }

        _.rofeach = function (items, fn, context) {
            context = context || this

            if (_.isarray(items)) {
                index = items.length
                while (index--) {
                    if (fn.call(context, items[index], index, items) == _.done) return false
                }
            } else if (_.isobject(items)) {
                var keys = Object.keys(items)
                index = 0 | keys.length

                while (index--) {
                    var key = keys[index]
                    if (fn.call(context, items[key], key, items) == _.done) return false
                }
            } else if (items) {
                fn.call(context, items)
            }
        }


        //andrewalert: naar async
        _.sequence = function (items, fn, next, context) {
            context = context || this

            var execute = next
            if (items.rofeach) {
                items.rofeach(function (item, index) {
                    execute = function (xitem, xindex, next) {
                        fn.call(context, xitem, xindex, next)
                    }.bind(context, item, index, execute)
                })
            } else if (items.rofeachchild) {
                items.rofeachchild(function (item, index) {
                    execute = function (xitem, xindex, next) {
                        fn.call(context, xitem, xindex, next)
                    }.bind(context, item, index, execute)
                })
            } else {
                _.rofeach(items, function (item, index) {
                    execute = function (xitem, xindex, next) {
                        fn.call(context, xitem, xindex, next)
                    }.bind(context, item, index, execute)
                })

            }
            return execute()
        }

        _.memoize = function (fn) {
            var cache = {}

            return function (value) {
                return cache[value] !== undefined ? cache[value] : cache[value] = fn(value)
            }
        }

        _.define = _.define || {}

        _.buildenum = function (items, offset) {
            _.debug("Buildenum is deprecated. Use define.enum instead")
            var result = {}
            offset = offset || 0

            //if (result && (result.constructor == Array)) { return null }

            for (var index = 0; index < items.length; index++) {
                result[items[index]] = index + offset
            }

            return result
        }

        _.define.enum = function (name, items, offset) {
            var values = {}
            var names = {}
            offset = offset || 0

            _.foreach(items, function (itemname, index) {
                values[itemname] = index + offset
                names[index + offset] = itemname
            })

            _.enum[name] = values
            _.enum[name + "name"] = names

            return names
        }

        _.define.binnum = function (name, items, offset) {
            var values = {}
            var names = {}
            var value = offset || 0

            _.foreach(items, function (itemname) {
                values[itemname] = value
                names[value] = itemname

                value = value? value << 1: 1
            })

            _.enum[name] = values
            _.enum[name + "name"] = names

            return names
        }

        //############################################################################################################################################
        //Vartypes
        //############################################################################################################################################
        //Don't change the order
        _.vtnull = 0
        _.vtstring = 1
        _.vtboolean = 2
        _.vtnumber = 3
        _.vtdate = 4
        _.vtregex = 5
        _.vtfunction = 6
        _.vtarray = 7
        _.vtobject = 8
        _.vtblob = 9
        _.vtkind = 10

        _.define.enum("vartype", ["null", "string", "bool", "number", "date", "regex", "function", "object", "array", "blob", "kind", "record"])

        _.vartype = function (value) {
            if (value == null) { return _.vtnull }

            switch (value.constructor) {
                case String: { return _.vtstring }
                case Number: { return _.vtnumber }
                case Boolean: { return _.vtboolean }
                case Function: { return _.vtfunction }
                case Date: { return _.vtdate }
                case Array: { return _.vtarray }
                case RegExp: { return _.vtregex }
                case Object: { return _.vtobject }
                    //                case ArrayBuffer: {  return _.vtblob }
            }

            //todo: find better way to detect kinds
            return (value.clone ? (value.__proto__ ? _.vtobject : _.vtkind) : undefined)
        }

        _.typename = function (value) {
            return _.enum.vartypename[_.vartype(value)]
        }

        _.noop = function () { }
        _.noop.__functiontype = "noop"

        _.createempty = function (vartype) {
            switch (vartype) {
                case _.vtnull: return null
                case _.vtstring: return ""
                case _.vtboolean: return false
                case _.vtnumber: return 0
                case _.vtdate: return _.now()
                case _.vtregex: return null
                case _.vtfunction: return _.noop
                case _.vtobject: return {}
                case _.vtarray: return []
            }
        }

        _.setvalue = function (arg, param, context) {
            return _.isfunction(arg) ? arg.call(context || null, param) : arg
        }
      
        _.setprop = function (obj, name, value) {
            if (!obj) { return }
            if (_.isfunction(obj[name])) {
                obj[name](value)
            } else {
                obj[name] = value
            }
        }

        _.getprop = function (obj, name) {
            if (!obj) { return undefined }

            var prop = obj[name]
            if (_.isfunction(prop)) {
                return obj[name]()
            } else {
                return prop
            }
        }

})