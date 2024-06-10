; (function (_) {
    _.define.object("world", function () {
        return {
            create: function (god) {
                this.god = god
            }
        }
    })
}) (_.ambient)