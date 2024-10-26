//*************************************************************************************************
// world - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
; (function (_) {
    _.define.object("world", function () {
        return {
            create: function (god, name) {
                this.god = god
                this.name = name
            }
        }
    })
}) (_.ambient)