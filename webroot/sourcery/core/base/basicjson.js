_.ambient.module("basicjson")
    .source(function (_) {
        //############################################################################################################################################
        //JSON
        //############################################################################################################################################
        _.json = {
            first: function (obj) {
                for (var index in obj) {
                    return {
                        key: index
                        , value: obj[index]
                    }
                }
                return null
            }

            , parse: function (data) {
                try {
                    return JSON.parse(data)
                } catch (e) {
                    return null
                }
            }

            , invert: function (obj, keyname) {
                var result = {}

                _.foreach(obj, function (value, key) {
                    if (keyname) {
                        if ((value != null) && value[keyname]) { result[value[keyname]] = key }
                    } else {
                        if (value) { result[value] = key }
                    }
                })
                return result
            }

            , stringify: JSON.stringify
            , keys: function (json) {
                return json ? Object.keys(json) : null
            }
            //, trim: function (json) {
            //    var keys = _.json.keys(json)

            //    _.foreach(keys, function (key) {
            //        if (!json[key]) {
            //            delete json[key]
            //        }
            //    })
            //    return json
            //}
            , get: function (json, name, delim) {
                if (!json) { return undefined }

                delim = delim || "."

                var path = name.split(delim)
                var result = json

                for (var index = 0; index < path.length; index++) {
                    result = result[path[index]]
                    if (result == null) { return result }
                }
                return result
            }

            , edit: function (json, name, value, delim) {
                return _.json.set(json, name, value, delim, true)
            }

            //editonly: don't add new values, only edit existing. (Unless in a data?)
            , set: function (json, name, value, delim, editonly) {
                if (!json) { return false }
                var changed = false

                delim = delim || "."
                var parts = _.kvsplit$(name, delim)

                if (parts.value) {
                    //if (parts.name == "data") { editonly = false }
                    changed = _.json.set(json[parts.key], parts.value, value, delim, editonly)
                } else {
                    if (!editonly || json[name] != undefined) {
                        if (json[name] != value) {
                            json[name] = value
                            return true
                        }
                    }
                }
                return changed
            }

            , groupby: function (obj, keys) {
                var result = {}

                var cursor = result

                _.foreach(obj, function (item, id) {
                    cursor = result
                    _.foreach(keys, function (key) {
                        var groupby = item[key]
                        var newcursor = cursor[groupby] || {}
                        cursor[groupby] = newcursor
                        cursor = newcursor
                    })
                    cursor[id] = item
                })
                return result
            }

            , flatten: function (obj, path, context) {
                var result = []
                var context = context || {}

                path = _.clone(path)
                var currentpath = path.shift()

                _.foreach(obj, function (item, key) {
                    var itemcontext = _.clone(context)
                    itemcontext[currentpath] = key

                    if (path.length == 0) {
                        _.foreach(item, function (record) {
                            var flatitem = _.clone(record)
                            _.json.mergeinto(flatitem, itemcontext)
                            result.push(flatitem)
                        })
                    } else {
                        result = result.concat(_.json.flatten(item, path, itemcontext))
                    }
                })
                return result
            }

            , shallowclone: function (obj) {
                var result = {}

                for (var index in obj) {
                    result[index] = obj[index]
                }
                return result
            }

            , foreach: function (obj, fn, nested, level, path) {
                level = level || 0

                for (var key in obj) {
                    var item = obj[key]
                    var currentpath = (path ? path + "/" : "") + key

                    if (nested && (_.isobject(item) || _.isarray(item))) {
                        fn(item, key, obj, currentpath, level)
                        _.json.foreach(item, fn, nested, currentpath, level + 1)
                    } else {
                        fn(item, key, obj, currentpath, level)
                    }
                }
                return
            }

            //, forcontainer: function (obj, containerkey, fn) {
            //    var container = obj[containerkey]

            //    if (_.isobject(container)) {
            //        for (var key in container) {
            //            var item = container[key]

            //            if (_.isobject(item)) {
            //                fn(item, obj)

            //                _.json.forcontainer(item, containerkey, fn)
            //            }
            //        }
            //    }
            //}

            , filter: function (obj, filter, ignorenull, nested) {
                var result = {}

                filter = _.isarray(filter) ? filter : [filter]
                _.json.foreach(obj, function (item, key) {
                    if (!ignorenull && (item != null)) {
                        if (_.inarray(filter, key) >= 0) {
                            result[key] = item
                        }
                    }
                })
                return result
            }

            , tochecklist: function (list, keyword) {
                var result = {}

                _.foreach(list, function (item, key) {
                    if (keyword) {
                        key = item[keyword]
                    }
                    if (key) { result[key] = true }
                })
                return result
            }


            , values: function (obj) {
                var result = []
                for (var key in obj) {
                    result.push(obj[key])
                }
                return result
            }

            , tokeyvalue: function (obj, initial) {
                var result = []

                for (var key in obj) {
                    result.push({ key: key, value: obj[key] || initial })
                }
                return result
            }

            , tosavestring: function (obj, spaces) {
                var stack
                var keys

                return JSON.stringify(obj, function (key, value) {
                    if (_.isobject(value)) {
                        if (!stack) {
                            stack = [value]
                            keys = [""]
                        } else {
                            var index = stack.indexOf(this)
                            if (index >= 0) {
                                stack.splice(index + 1)
                                keys.splice(index + 1, Infinity, key)
                            } else {
                                stack.push(this)
                                keys.push(key)
                            }

                            var index = stack.indexOf(value)
                            if (index >= 0) {
                                value = "[Circular ~" + keys.slice(0, index + 1).join(".") + "]"
                            }
                        }
                    }
                    return value
                }, spaces)
            }

            , merge: function (source1, source2) {
                return _.merge(_.clone(source1), source2)
            }

            , shallowmerge: function (source1, source2) {
                return _.merge(_.shallowclone(source1), source2, true)
            }

            , mergeinto: function (target, source) {
                return _.merge(target, source)
            }

            , totext: function (obj, delim, linedelim) {
                delim = delim || ": "
                linedelim = linedelim || "\n"

                var result = ""

                _.foreach(obj, function (value, key) {
                    result += key + delim + value + linedelim
                })

                return result
            }


            , swapcolumns: function (json, colleft, colright) {
                if (!colleft) {
                    result = {}

                    _.foreach(json, function (item, oldkey) {
                        if (colright) {
                            var newkey = item[colright]
                            item[colright] = oldkey
                        } else {
                            var newkey = item
                            item = oldkey
                        }
                        result[newkey] = item
                    })
                    return result

                } else if (colright) {
                    _.foreach(json, function (item) {
                        var swap = item[colleft]
                        item[colleft] = item[colright]
                        item[colright] = swap
                    })
                    return json

                } else {
                    return _.jsoncolumnswap(json, colright, colleft)
                }
            }

            , format: function (json) {
                return JSON.stringify(json, null, 2)
            }

            , toargumentstring: function (json, linedelimiter) {
                var result = ""
                linedelimiter = linedelimiter || "&"

                _.foreach(json, function (value, key) {
                    if (result) { result += linedelimiter }

                    result += key + "=" + encodeURIComponent(value)
                })

                return result
            }

        }



        //############################################################################################################################################
        //Array & Object
        //############################################################################################################################################
        _.inobject = function (object, search, keyname, retname) {
            search = _.lcase$(search)

            var result = -1

            _.foreach(object, function (item, key) {
                if (_.lcase$(keyname ? item[keyname] : item)) {
                    result = retname ? item[retname] : key
                    return false
                }
            })
        }

        _.clonefunction = function (fn) {
            return (new Function("return " + fn.toString()))()
        }

        _.shallowclone = function (source) {
            return _.clone(source, true)
        }

        //note: Functions will not be cloned
        _.clone = function (source, shallow) {
            var result
            var prop

            switch (_.vartype(source)) {
                case _.vtdate:
                    return new Date(source.getTime())
                case _.vtarray:
                    result = []
                    break
                case _.vtobject:
                    result = {}
                    break
                case _.vtkind:
                    return source.clone()

                default:
                    return source
            }

            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    switch (prop) {
                        case "__proto__":
                            break

                        default:
                            if (shallow) {
                                result[prop] = source[prop]
                            } else {
                                result[prop] = _.clone(source[prop])
                            }
                    }
                }
            }
            return result
        }

        _.shallowmerge = function (target, source) {
            return _.merge(target, source, true)
        }

        //Note: Arrays will always be copied over the old value
        _.merge = function (target, source, shallow) {
            var prop
            var value

            if (!target) {
                target = {}
            } else {
                if (!_.isobject(target)) throw "merge error"
            }

            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    value = source[prop]

                    if (value !== undefined) {
                        if (shallow || (_.vartype(value) <= _.vtarray)) {
                            target[prop] = value
                        } else {
                            target[prop] = _.merge(target[prop], value)
                        }
                    }
                }
            }
            return target
        }

        _.json.isdifferent = function (base, compare) {
            var result = false

            for (var index in compare) {
                var basevalue = base[index]
                var comparevalue = compare[index]

                if (basevalue != comparevalue) {
                    if (typeof (comparevalue) != "object") {
                        return true
                    } else if (_.isdifferent(basevalue, comparevalue)) {
                        return true
                    }
                }
            }
            return false
        }

        _.json.compare = function (base, compare, ignoremissing) {
            var prop
            var value
            var differentvalue
            var result
            var count = 0

            var comparetype = _.vartype(base)

            if (comparetype <= _.vtfunction) {
                return compare != base ? compare : null
            }
            result = {}

            for (prop in base) {
                basevalue = base[prop]
                comparevalue = compare[prop]

                switch (prop) {
                    case "_owner":
                    case "_parent":
                    case "_groot":
                    case "_db":
                        break

                    default:
                        if (basevalue != comparevalue) {
                            if (typeof (comparevalue) != "object") {
                                result[prop] = _.undef(comparevalue, null)
                                count++
                            } else {
                                differentvalue = _.json.compare(basevalue, comparevalue, ignoremissing)
                                if (differentvalue) {
                                    result[prop] = differentvalue
                                    count++
                                }
                            }
                        }
                }
            }

            if (!ignoremissing) {
                for (prop in compare) {
                    basevalue = base[prop]
                    comparevalue = compare[prop]

                    if ((basevalue === undefined) && (comparevalue != null)) {
                        result[prop] = comparevalue
                        count++
                    }
                }
            }
            return count ? result : null
        }

        _.filter = function (items, filter, context) {
            var result = []
            var fnfilter = null

            if (_.isfunction(filter)) {
                fnfilter = filter.bind(context)

            } else if (_.isobject(filter)) {
                fnfilter = function (item) { return _.isdifferent(item, filter) }
            }

            if (fnfilter) {
                _.foreach(items, function (item, key) {
                    if (fnfilter(item, key, items)) {
                        result.push(item)
                    }
                }, context)
            }
            return result
        }



        _.initialize = {
            //Set argument defaults. Will try to match callback functions to arguments with default value Function. 
            //_.initialize.arguments({ name: "empty", value: -1, next: Function, [null, 0, function() {}]) => { name: "empty", value: 0, function() {} }
            //_.initialize.arguments({ name: "empty", value: -1, next: Function, ["Some name", function() {}]) => { name: "Some name", value: -1, function() {} }
            arguments: function (initialvalues, values) {
                var keys = Object.keys(initialvalues)
                var result = {}

                var valueindex = 0
                for (var keyindex = 0; keyindex < keys.length; keyindex++) {
                    var key = keys[keyindex]
                    var initial = initialvalues[key]
                    var value = valueindex < values.length ? values[valueindex] : null

                    if (initial != Function) {
                        if (_.isfunction(value)) {
                            result[key] = initial
                        } else {
                            result[key] = _.undef(value, initial)
                            valueindex++
                        }
                    } else {
                        if (_.isfunction(value)) {
                            result[key] = value
                            valueindex++
                        } else {
                            //Error???
                            result[key] = (initial == Function ? null : initial)
                        }
                    }
                }
                return result
            }
        }


    })