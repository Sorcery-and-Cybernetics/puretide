_.ambient.module("basicmath")
 .source(function (_) {

    //############################################################################################################################################
    //Math
     //############################################################################################################################################

     var rnd = null

     //Algorithm based on lcg 
     var m_w = 123456789;
     var m_z = 987654321;
     var mask = 0xffffffff;

     _.seed = function (seed) {
         if (seed == null) { seed = Date.now() }

         m_w = (123456789 + seed) & mask;
         m_z = (987654321 - seed) & mask;
     }

     _.seed()

     var random = function () {
         m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
         m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
         return ((m_z << 16) + (m_w & 65535)) >>> 0;
     }

     _.random = function (lbound, ubound) {
         if (ubound == undefined) {
             ubound = lbound
             lbound = 1
         }

         return (random() % (ubound - lbound + 1)) + lbound
     }

    //_.random = function (max) {
    //    return Math.floor(Math.random() * max) + 1
    //}

    //Thanks to http://www.jacklmoore.com/notes/rounding-in-javascript/
    _.round = function (value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
    }

    _.roundto = function (value, divider) {
        return Math.round(value / divider) * divider
    }

    _.floorto = function (value, divider) {
        return Math.floor(value / divider) * divider
    }

    _.ceilto = function (value, divider) {
        return Math.ceil(value / divider) * divider
    }

    _.anchorto = function (value, divider, margin) {
        var anchor = Math.round(value / divider) * divider
        return Math.abs(anchor - value) <= margin ? anchor : value
    }

    _.hex2 = function (dec) {
        var hex = "0123456789ABCDEF"
        return hex.charAt((dec >> 4) & 15) + hex.charAt(dec & 15)
    }

    _.perc = function (current, max) {
        return max == 0 ? 1 : Math.round(current / max * 100)
    }

    _.percfrom = function (current, min, max) {
        min = min || 0
        if ((max - min) == 0) { return 0 }
        return ((current - min) / (max - min))
    }

    _.percto = function (min, max, perc) {
        return ((max - min) * (perc / 100)) + min
    }

    _.perctoperc = function (min, max, perc) {
        //If max = 0 then result = Infinity
        var value = ((max - min) * (perc / 100)) + min
        value = (value / max)
        return value
    }

    _.between = function (value, floor, ceil) {
        return (value >= floor) && (value < ceil) ? true : false
    }

    _.inbetween = function (value, floor, ceil) {
        return (value >= floor) && (value <= ceil) ? true : false
    }

    _.exbetween = function (value, floor, ceil) {
        return (value > floor) && (value < ceil) ? true : false
    }

    _.limitbetween = function (value, floor, ceil) {
        return (value < floor ? floor : (value > ceil ? ceil : value))
    }

    _.limitmin = function (value, floor, ceil) {
        if (value == null) { value = floor }
        return (value < floor ? floor : (value > ceil ? ceil : value))
    }

    _.limitmax = function (value, floor, ceil) {
        if (value == null) { value = ceil }
        return (value < floor ? floor : (value > ceil ? ceil : value))
    }

    _.loopbetween = function (value, floor, ceil) {
        if (value < floor) {
            value = ceil
        } else if (value > ceil) {
            value = floor
        }
        return value
    }

    _.snapdiff = function (value, margin, floor, ceil) {
        if (value <= floor + margin) {
            return floor - value
        } else if (value >= ceil - margin) {
            return ceil - value
        }
        return 0
    }

    _.snapto = function (value, margin, floor, ceil) {
        return value + _.snapdiff(value, margin, floor, ceil)
    }

    _.log = function (value, base) {
        return Math.log(value) / Math.log(base || 10)
    }

    _.max = Math.max
    _.min = Math.min
   
    _.radtodeg = function (radians) {
        return radians * (180 / Math.PI)
    }

    _.degtorad = function (degrees) {
        return degrees / (180 / Math.PI)
    }
    
    _.sumsq = function (x, y) {
        return Math.sqrt(x * x + y * y)
    }

    _.atan = function (x, y) {
        return Math.atan2(y, x)
    }

    _.dist = function (c1, c2) {
        return Math.sqrt(Math.pow(c1.x - c2.x,2) + Math.pow(c1.y - c2.y,2))
    }
})
