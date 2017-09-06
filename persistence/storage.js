var fs = require("fs");
var hosts = readJSON();

module.exports = {
    add: function(host){
        host.id = hosts.length;
        hosts.push(host);
        writeJSON(hosts);
    },
    getAll: function(){
        return hosts;
    },
    getByAddress: function(address){
        for(i = 0; i < hosts.length; i++){
            if(hosts[i].address == address){
                return hosts[i];
            }
        }
        return null;
    },
    getById: function(id){
        for(i = 0; i < hosts.length; i++){
            if(hosts[i].id == id){
                return hosts[i];
            }
        }
        return null;
    },
    edit: function(id, host){
        hosts[id].address = host.address;
        hosts[id].description = host.description;
        writeJSON(hosts);
    },
    moveDown: function(id){
        if(id < hosts.length - 1){
            var hostTo = hosts[++id];
            hosts[id] = hosts[--id];
            hosts[id] = hostTo;
            writeJSON(hosts);
        }
    },
    moveUp: function(id){
        if(id > 0){
            var hostTo = hosts[--id];
            hosts[id] = hosts[++id];
            hosts[id] = hostTo;
            writeJSON(hosts);
        }
    },
    remove: function(id){
        hosts.splice(id,1);
        writeJSON(hosts);
    }
}

function correctIndices(){
    for(i = 0; i < hosts.length; i++){
        hosts[i].id = hosts.indexOf(hosts[i]);
    }
}

function readJSON() {
    if (!(fs.existsSync(__dirname + "/" + "staticips.json"))) {
        fs.writeFileSync(__dirname + "/" + "staticips.json", "[]");
    }
    return JSON.parse(fs.readFileSync(__dirname + "/" + "staticips.json", 'utf8'));
}

function writeJSON(data) {
    correctIndices();
    fs.writeFile(__dirname + "/" + "staticips.json", JSON.stringify(data), function(err) {
        if (err) {
            return console.error(err);
        }
    });
}
