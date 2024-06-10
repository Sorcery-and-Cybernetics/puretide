_.ambient.module("basicdate")
    .source(function (_) {
        _.now = Date.now || function () {
            return new Date().getTime()
        }

        _.formatdate$ = function (value, format, asutc) {
            if (!_.isdate(value)) {
                value = new Date(value)
            }
            //HACK: The Language function is used here ! In a really core like class....
            return format.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|d|hh|h|nn|n|ss|iii|ii|i)/gi, function ($1) {
                switch ($1) {
                    case "yyyy": return asutc ? value.getUTCFullYear() : value.getFullYear()
                    case "mmmm": return _.lang(_.months[asutc ? value.getUTCMonth() : value.getMonth()])
                    case "mmm": return _.monthsshort[asutc ? value.getUTCMonth() : value.getMonth()]
                    case "mm": return _.padleft$((asutc ? value.getUTCMonth() : value.getMonth()) + 1, "0", 2)
                    case "dddd": return _.lang(_.days[asutc ? value.getUTCDay() : value.getDay()])
                    case "ddd": return _.daysshort[asutc ? value.getUTCDay() : value.getDay()]
                    case "dd": return _.padleft$(asutc ? value.getUTCDate() : value.getDate(), "0", 2)
                    case "d": return asutc ? value.getUTCDate() : value.getDate()
                    case "hh": return _.padleft$(asutc ? value.getUTCHours() : value.getHours(), "0", 2)
                    case "h": return asutc ? value.getUTCHours() : value.getHours()
                    case "nn": return _.padleft$(asutc ? value.getUTCMinutes() : value.getMinutes(), "0", 2)
                    case "n": return asutc ? value.getUTCMinutes() : value.getMinutes()
                    case "ss": return _.padleft$(asutc ? value.getUTCSeconds() : value.getSeconds(), "0", 2)
                    case "iii": case "ii": return _.padleft$(asutc ? value.getUTCMilliseconds() : value.getMilliseconds(), "0", 3)
                    case "i": return _.padleft$(asutc ? value.getUTCMilliseconds() : value.getMilliseconds(), "0", 3)
                }
            })
        }

        _.formattime$ = function (time, includehour, asutc) {
            var time = _.roundto(time, 1000)

            if ((time > 3600) || includehour) {
                return _.formatdate$(time, "h:nn:ss", asutc)
            } else {
                return _.formatdate$(time, "nn:ss", asutc)
            }
        }
    })