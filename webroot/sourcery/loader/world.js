//*************************************************************************************************
// world - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("world", function () {
        return {
            system: null
            , name: null
            
            , create: function (system, name) {
                this.system = system
                this.name = name
            }
        }
    })
}) (_.ambient)