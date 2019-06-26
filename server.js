/*jslint node:true*/
var express = require('express');
var sanitizer = require('sanitizer');
var bcrypt = require('bcryptjs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var mysql = require('mysql');
var EventEmitter = require('events');
var dateTime = require('node-datetime');
var emitter = new EventEmitter();

var DB_HOST = 'localhost';
var DB_USER = 'root';
var DB_PASS = '';
var DB_NAME = 'triemerge';

users = [];
connections = [];
connectedUserList = [];

var SVR_PORT = '3000';
var obj = {
    "ID": '',
    "authStatus": ''
};

// Parse JSON bodies (as sent by API clients)
app.use(express.json({limit: '50mb'}));
// Parse URL-encoded bodies (as sent by HTML forms)
//app.use(express.urlencoded());

// Set static path
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'fonts')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'sounds')));

//app.route('/').get(function (req, res) {
//    'use strict';
//    res.sendFile('index.html', {root: __dirname});
//});

app.get('/', function (req, res) {
    'use strict';
    res.sendFile('index.html', {root: __dirname});
});
app.get('/pages', function (req, res) {
    'use strict';
    res.sendFile('pages/index.html', {root: __dirname});
});
app.get('/dashboard-manager', function (req, res) {
    'use strict';
    res.sendFile('pages/dashboard-manager.html', {root: __dirname});
});
app.get('/dashboard-officer', function (req, res) {
    'use strict';
    res.sendFile('pages/dashboard-officer.html', {root: __dirname});
});
app.get('/account-management', function (req, res) {
    'use strict';
    res.sendFile('pages/account-management.html', {root: __dirname});
});
app.get('/account/:account', function (req, res) {
    'use strict';
    res.sendFile('pages/account.html', {root: __dirname});
});
app.get('/truck-management', function (req, res) {
    'use strict';
    res.sendFile('pages/truck-management.html', {root: __dirname});
});
app.get('/area-management', function (req, res) {
    'use strict';
    res.sendFile('pages/area-management.html', {root: __dirname});
});
app.get('/dashboard-officer', function (req, res) {
    'use strict';
    res.sendFile('pages/dashboard-officer.html', {root: __dirname});
});
app.get('/acr-management', function (req, res) {
    'use strict';
    res.sendFile('pages/acr-management.html', {root: __dirname});
});
app.get('/notification', function (req, res) {
    'use strict';
    res.sendFile('pages/notification.html', {root: __dirname});
});
app.get('/error', function (req, res) {
    'use strict';
    res.sendFile('pages/error-404.html', {root: __dirname});
});
app.get('/daily-report', function(req, res) {
    'use strict';
    res.sendFile('pages/daily-report.html', {root: __dirname});
});
app.get('/driver-management', function(req, res) {
    'use strict';
    res.sendFile('pages/driver-management.html', {root: __dirname});
});
app.get('/zone-management', function(req, res) {
    'use strict';
    res.sendFile('pages/zone-management.html', {root: __dirname});
});
app.get('/role-management', function(req, res) {
    'use strict';
    res.sendFile('pages/role-management.html', {root: __dirname});
});
app.get('/auth/:auth', function(req, res) {
    'use strict';
    res.sendFile('pages/auth.html', {root: __dirname});
});
app.get('/area/:areaID', function(req, res) {
    'use strict';
    res.sendFile('pages/area.html', {root: __dirname});
});
app.get('/bin-management', function(req, res) {
    'use strict';
    res.sendFile('pages/bin-management.html', {root: __dirname});
});
app.get('/reporting', function (req, res) {
    'use strict';
    res.sendFile('pages/reporting.html', {root: __dirname});
});
app.get('/view-report/:reportCode', function (req, res) {
    'use strict';
    res.sendFile('pages/view-report.html', {root: __dirname});
});
app.get('/edit-report/:reportCode', function (req, res) {
    'use strict';
    res.sendFile('pages/edit-report.html', {root: __dirname});
});
app.get('/data-visualization', function (req, res) {
    'use strict';
    res.sendFile('pages/data-visualization.html', {root: __dirname});
});
app.get('/bin-database', function (req, res) {
    'use strict';
    res.sendFile('pages/bin-database.html', {root: __dirname});
});
app.get('/bin-inventory', function (req, res) {
    'use strict';
    res.sendFile('pages/bin-inventory.html', {root: __dirname});
});
app.get('/complaint-module', function (req, res) {
    'use strict';
    res.sendFile('pages/complaint-module.html', {root: __dirname});
});
app.get('/complaint-detail/:complaintCode', function (req, res) {
    'use strict';
    res.sendFile('pages/complaint-detail.html', {root: __dirname});
});
var makeID = function(keyword, creationDate) {
    var table, property, header, ID;
    var getDateArr, row, stringRow, prefix, i;
    var getDate = creationDate.split(' ');
    
    switch (keyword) {
        case "account":
            table = "tblstaff";
            property = "staffID";
            header = "ACC";
            break;
        case "truck":
            table = "tbltruck";
            property = "truckID";
            header = "TRK";
            break;
        case "zone":
            table = "tblzone";
            property = "zoneID";
            header = "ZON";
            break;
        case "area":
            table = "tblarea";
            property = "areaID";
            header = "ARE";
            break;
        case "bin":
            table = "tblbincenter";
            property = "binCenterID";
            header = "BIN";
            break;
        case "role":
            table = "tblposition";
            property = "positionID";
            header = "ATH";
            break;
        case "acr":
            table = "tblacr";
            property = "acrID";
            header = "ACR";
            break;
        case "report":
            table = "tblreport";
            property = "reportID";
            header = "RPT";
            break;
        default: break;
    }
    
    var sql = "SELECT " + property + " FROM " + table + " WHERE creationDateTime LIKE '%" + getDate[0] + "%'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        
        getDateArr = getDate[0].split('-');
        
        row = result.length;
        row += 1;
        stringRow = row.toString();
        prefix = '';
        for (i = stringRow.length; i < 4; i += 1) {
            prefix += '0';
        }
        ID = header + getDateArr[0] + getDateArr[1] + getDateArr[2] + prefix + row;
    });
    
    setTimeout(function() {
        obj.ID = ID;
    }, 100);
};

var checkAuthority = function (keyword, whoIs) {
    'use strict';
    
    var sql;
    
    switch (keyword) {
        case "create account":
            sql = "SELECT tblaccess.status FROM tblstaff JOIN tblposition ON tblstaff.positionID = tblposition.positionID JOIN tblaccess ON tblposition.positionID = tblaccess.positionID JOIN tblmanagement ON tblmanagement.mgmtID = tblaccess.mgmtID WHERE tblmanagement.mgmtName = 'create account' AND tblstaff.staffID = '" + whoIs + "'";
            break;
    }
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        obj.authStatus = result[0].status;
    });
    
};

app.post('/login', function (req, res) {
    'use strict';

    var sql = "SELECT tblstaff.staffID, tblstaff.password, tblposition.positionName FROM tblstaff JOIN tblposition ON tblposition.positionID = tblstaff.positionID WHERE tblstaff.username = '" + req.body.username + "' AND tblstaff.staffStatus = 'A'";

    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length > 0) {
            if (bcrypt.compareSync(req.body.password, result[0].password)) {
                res.json({"status": "valid", details: {"staffPosition": result[0].positionName, "staffID": result[0].staffID}});
            } else {
                res.json({"status": "invalid"});
            }
        } else {
            res.json({"status": "invalid"});
        }
    });
}); // Complete
app.post('/navigationControl', function (req, res) {
    'use strict';
    
    var sql = "SELECT tblmanagement.mgmtName, tblaccess.status FROM tblaccess JOIN tblmanagement ON tblmanagement.mgmtID = tblaccess.mgmtID JOIN tblposition ON tblposition.positionID = tblaccess.positionID WHERE tblposition.positionName = '" + req.body.position + "' AND tblaccess.status = 'A'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

// Account Management
app.post('/addUser', function (req, res) {
    'use strict';

    checkAuthority("create account", req.body.owner);
    setTimeout(function () {
        if (obj.authStatus == 'A') {
            makeID("account", req.body.creationDate);
            setTimeout(function() {
                var thePassword = bcrypt.hashSync(req.body.password, 10);
                var sql = "INSERT INTO tblstaff (staffID, username, password, staffName, positionID, creationDateTime, staffStatus) VALUE ('" + obj.ID + "', '" + req.body.username + "', '" + thePassword + "', '" + req.body.name + "', '" + req.body.position.id + "', '" + req.body.creationDate + "', 'A')";
                db.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    res.json({"status": "success", "message": "Account created successfully!", "details": {"staffID": obj.ID}});
                    res.end();
                });
            }, 100);
        } else {
            res.json({"status": "error", "message": "You have no permission to create account!"});
        }
    }, 100);
}); // Complete
app.get('/getAllUser', function (req, res) {
    'use strict';
    
    var sql = "SELECT tblstaff.staffID AS id, tblstaff.staffName AS name, tblstaff.username, (CASE WHEN tblstaff.staffStatus = 'A' THEN 'ACTIVE' WHEN tblstaff.staffStatus = 'I' THEN 'INACTIVE' END) AS status, tblposition.positionName AS position FROM tblstaff JOIN tblposition ON tblstaff.positionID = tblposition.positionID AND tblposition.positionName != 'ADMINISTRATOR'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete
app.post('/updatePassword', function (req, res) {
    'use strict';

    var thePassword = bcrypt.hashSync(req.body.password, 10);

    var sql = "UPDATE tblstaff SET password = '" + thePassword + "' WHERE staffID = '" + req.body.id + "'";
    db.query(sql, function (err, result) {
        if (err) {
            res.json({"status": "error", "message": "Update failed."});
            throw err;
        }
        res.json({"status": "success", "message": "Password updated."});
    });
}); // Complete
app.post('/loadSpecificAccount', function (req, res) {
    'use strict';
    
    var sql = "SELECT tblstaff.staffID AS id, tblstaff.staffName AS name, tblstaff.staffIC AS ic, (CASE WHEN tblstaff.staffGender = 'M' THEN 'Male' WHEN tblstaff.staffGender = 'F' THEN 'Female' END) AS gender, DATE_FORMAT(tblstaff.staffDOB, '%d %M %Y') AS dob, tblstaff.staffAddress AS address, (CASE WHEN tblstaff.staffStatus = 'A' THEN 'Active' WHEN tblstaff.staffStatus = 'I' THEN 'Inactive' END) AS status, tblstaff.handphone, tblstaff.phone, tblstaff.email, tblposition.positionName AS position, tblstaff.staffPic AS avatar FROM tblstaff JOIN tblposition ON tblstaff.positionID = tblposition.positionID WHERE tblstaff.staffID = '" + req.body.id + "' LIMIT 0, 1";
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete
app.get('/getStaffList', function (req, res) {
    'use strict';
    var sql = "SELECT tblstaff.staffID AS id, tblstaff.staffName AS name FROM tblstaff JOIN tblposition ON tblstaff.positionID = tblposition.positionID WHERE tblstaff.staffStatus = 'A' AND tblposition.positionName = 'Reporting Officer'";
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete
app.post('/updateProfile', function (req, res) {
    'use strict';
    
    var dt = dateTime.create(req.body.dob);

    req.body.status = req.body.status == "Active" ? 'A' : 'I';
    req.body.gender = req.body.gender == "Male" ? 'M' : 'F';
    req.body.dob = dt.format('Y-m-d');
    
    var sql = "SELECT positionID AS id FROM tblposition WHERE positionName = '" + req.body.position + "' LIMIT 0, 1";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        req.body.position = result[0].id;
        var sql = "UPDATE tblstaff SET staffName = '" + req.body.name + "', staffIC = '" + req.body.ic + "', staffGender = '" + req.body.gender + "', staffDOB = '" + req.body.dob + "', staffAddress = '" + req.body.address + "', handphone = '" + req.body.handphone + "', phone = '" + req.body.phone + "', email = '" + req.body.email + "', positionID = '" + req.body.position + "', staffStatus = '" + req.body.status + "', staffPic = '" + req.body.avatar + "' WHERE staffID = '" + req.body.id + "'";
        db.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            res.json({"status": "success", "message": "Profile Updated!"});
        });
    });
}); // Complete

// Role Management
app.post('/addRole', function (req, res) {
    'use strict';
    
    makeID("role", req.body.creationDate);
    setTimeout(function () {
        var sql = "INSERT INTO tblposition (positionID, positionName, creationDateTime, positionStatus) VALUE ('" + obj.ID + "', '" + req.body.name + "', '" + req.body.creationDate + "', 'A')";
        db.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            res.json({"status": "success", "message": "Role created successfully!", "details": {"roleID": obj.ID}});
        });
    }, 100);
}); // Complete
app.get('/getAllRole', function (req, res) {
    'use strict';
    
    var sql = "SELECT positionID AS id, positionName AS name, (CASE WHEN positionStatus = 'A' THEN 'ACTIVE' WHEN positionStatus = 'I' THEN 'INACTIVE' END) AS status FROM tblposition WHERE positionName != 'ADMINISTRATOR'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete
app.post('/setAuth', function (req, res) {
    'use strict';
    
    var sql = "SELECT positionID AS id FROM tblposition WHERE positionName = '" + req.body.name + "' LIMIT 0, 1";
    db.query(sql, function (err, result){
        if (err) {
            throw err;
        }
        var staffID = result[0].id;
        var sql = "SELECT mgmtID AS id FROM tblmanagement WHERE mgmtName = '" + req.body.management + "' LIMIT 0, 1";
        db.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            var managementID = result[0].id;
            var sql = "DELETE FROM tblaccess WHERE positionID = '" + staffID + "' AND mgmtID = '" + managementID + "'";
            db.query(sql, function (err, result) {
                if (err) {
                    throw err;
                }
                var sql = "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + staffID + "', '" + managementID + "', '" + req.body.access + "')";
                db.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    var message = req.body.access == 'A' ? "Permission given." : "Permission removed.";
                    res.json({"status": "success", "message": message});
                });
            });
        });
    });
}); // Complete
app.get('/getPositionList', function(req, res) {
    'use strict';
    
    var sql = "SELECT positionID AS id, positionName AS name FROM tblposition WHERE positionStatus = 'A' AND positionName != 'ADMINISTRATOR'";
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
    
}); // Complete
app.post('/getAllAuth', function (req, res) {
    'use strict';
    
    var sql = "SELECT tblmanagement.mgmtName AS name, tblaccess.status FROM tblaccess JOIN tblposition ON tblaccess.positionID = tblposition.positionID JOIN tblmanagement ON tblmanagement.mgmtID = tblaccess.mgmtID WHERE tblposition.positionName = '" + req.body.name + "'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete

// Truck Management
app.post('/addTruck', function (req, res) {
    'use strict';
    makeID("truck", req.body.creationDate);
    setTimeout(function () {
        var sql = "INSERT INTO tbltruck (truckID, transporter, truckTon, truckNum, truckExpiryStatus, creationDateTime, truckStatus) VALUE ('" + obj.ID + "', '" + req.body.transporter + "', '" + req.body.ton + "', '" + req.body.no + "', '" + req.body.roadtax + "', '" + req.body.creationDate + "', 'A')";
        db.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            res.json({"status": "success", "details": {"truckID": obj.ID}});
        });
    }, 100);
}); // Complete
app.post('/editTruck', function (req, res) {
    'use strict';
    
    req.body.status = req.body.status == "ACTIVE" ? 'A' : 'I';
    
    var sql = "UPDATE tbltruck SET transporter = '" + req.body.transporter + "', truckTon = '" + req.body.ton + "', truckNum = '" + req.body.no + "', truckExpiryStatus = '" + req.body.roadtax + "', truckStatus = '" + req.body.status + "' WHERE truckID = '" + req.body.id + "'";
    db.query(sql, function (err, result) {
        if (err) {
            res.json({"status": "error", "message": "Something wrong!"});
            throw err;
        }
        res.json({"status": "success", "message": "Truck edited!"});
    });
}); // Complete
app.get('/getTruckList', function (req, res) {
    'use strict';
    var sql = "SELECT truckID AS id, truckNum AS no FROM tbltruck WHERE truckStatus = 'A'";
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/getAllTruck', function(req,res){
    'use strict';
    
    var sql = "SELECT truckID AS id, transporter, truckTon AS ton, truckNum AS no, truckExpiryStatus AS roadtax, (CASE WHEN truckStatus = 'A' THEN 'ACTIVE' WHEN truckStatus = 'I' THEN 'INACTIVE' END) AS status FROM tbltruck";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete

// Zone Management
app.post('/addZone', function (req, res) {
    'use strict';
    makeID("zone", req.body.creationDate);
    setTimeout(function() {
        var sql = "INSERT INTO tblzone (zoneID, zoneName, creationDateTime, zoneStatus) VALUE ('" + obj.ID + "', '" + req.body.name + "', '" + req.body.creationDate + "', 'A')";
        db.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            res.json({"status": "success", "details": {"zoneID": obj.ID}});
        });
    }, 100);
}); // Complete
app.get('/getZoneList', function (req, res) {
    'use strict';
    var sql = "SELECT zoneID AS id, zoneName AS name FROM tblzone WHERE zoneStatus = 'A'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/getAllZone', function (req, res) {
    'use strict';
    var sql = "SELECT zoneID AS id, zoneName AS name, (CASE WHEN zoneStatus = 'A' THEN 'ACTIVE' WHEN zoneStatus = 'I' THEN 'INACTIVE' END) AS status FROM tblzone";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.post('/editZone',function(req, res){
    'use strict';
    var sql = "UPDATE tblzone SET zoneName = '" + req.body.name+ "', zoneStatus = '" + req.body.status + "' WHERE zoneID = '"+ req.body.id + "'";
    db.query(sql, function (err, result) {
        if (err) {
            res.json({"status": "error", "message": "Update failed."});
            throw err;
        }
        res.json({"status": "success", "message": "Zone Information Updated."});
    });
}); // Complete

// Area Management
app.post('/addArea', function (req, res) {
    'use strict';
    makeID("area", req.body.creationDate);
    setTimeout(function () {
        var sql = "INSERT INTO tblarea (areaID, zoneID, staffID, areaName, creationDateTime, areaStatus) VALUE ('" + obj.ID + "', '" + req.body.zone.id + "', '" + req.body.staff.id + "', '" + req.body.name + "', '" + req.body.creationDate + "', 'A')";
        db.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            res.json({"status": "success", "details": {"areaID": obj.ID}});
        });
    }, 100);
}); // Complete
app.get('/getAllArea', function (req, res) {
    'use strict';
    var sql = "SELECT a.areaID AS id, a.areaName AS name, z.zoneID as zone, z.zoneName as zoneName, s.staffID as staff, s.staffName as staffName, collection_frequency as collectionFrequency, (CASE WHEN areaStatus = 'A' THEN 'ACTIVE' WHEN areaStatus = 'I' THEN 'INACTIVE' END) as status FROM tblarea a INNER JOIN tblzone z ON a.zoneID = z.zoneID INNER JOIN tblstaff s ON a.staffID = s.staffID";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete
app.get('/getAreaList', function (req, res) {
    'use strict';
    var sql = "SELECT tblzone.zoneID AS zoneID, tblzone.zoneName AS zoneName, GROUP_CONCAT(tblarea.areaID) AS id, GROUP_CONCAT(tblarea.areaName) AS name FROM tblarea JOIN tblzone ON tblarea.zoneID = tblzone.zoneID WHERE tblarea.areaStatus = 'A' GROUP BY tblzone.zoneID";
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete
app.post('/updateArea',function(req,res){
    'use strict';
    
    var sql = "SELECT staffID FROM tblstaff WHERE staffName = '" + req.body.staff + "' LIMIT 0, 1";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        var staffID = result[0].staffID;
        
        var sql = "SELECT zoneID FROM tblzone WHERE zoneName = '" + req.body.zone + "' LIMIT 0, 1";
        db.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            var zoneID = result[0].zoneID;
            
            req.body.status = req.body.status == 'Active' ? 'A' : 'I';
            var sql = "UPDATE tblarea SET areaName = '" + req.body.name+ "', zoneID = '" + zoneID + "', staffID = '" + staffID +"', collection_frequency = '" + req.body.frequency + "', areaStatus = '" + req.body.status + "' WHERE areaID = '"+ req.body.id + "'";
            
            db.query(sql, function (err, result) {
                if (err) {
                    res.json({"status": "error", "message": "Update failed."});
                    throw err;
                }
                res.json({"status": "success", "message": "Area Information Updated."});
            });
        });
    });
}); // Complete
app.post('/thisArea', function (req, res) {
    'use strict';
    
    var sql = "SELECT tblarea.areaID AS id, tblarea.areaName AS name, tblstaff.staffName AS staff, tblzone.zoneName AS zone, (CASE WHEN tblarea.areaStatus = 'A' THEN 'Active' WHEN tblarea.areaStatus = 'I' THEN 'Inactive' END) AS status, collection_frequency AS frequency FROM tblarea JOIN tblzone ON tblarea.zoneID = tblzone.zoneID JOIN tblstaff ON tblarea.staffID = tblstaff.staffID WHERE tblarea.areaID = '" + req.body.id + "'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.post('/addCollection', function (req, res) {
    'use strict';
    
    var sql = "INSERT INTO area_collection (areaID, areaAddress, areaCollStatus) VALUE ('" + req.body.area + "', '" + req.body.address + "', 'A')";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json({"status": "success", "message": "Address Added!", "details": {"id": result.insertId}});
    });
});
app.post('/getCollection', function (req, res){
    'use strict';

    var sql = "SELECT acID AS id, areaAddress AS address FROM area_collection WHERE areaCollStatus = 'A' AND areaID = '" + req.body.id + "'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
        res.end();
    });
});
app.post('/deleteCollection', function (req, res) {
    'user strict';
    
    var sql = "UPDATE area_collection SET areaCollStatus = 'I' WHERE acID = '" + req.body.id + "'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json({"status": "success", "message": "Delete successfully!"});
    });
});
app.post('/updateCollection', function (req, res) {
    'use strict';
    
    var sql = "UPDATE area_collection SET areaAddress = '" + req.body.address + "' WHERE acID = '" + req.body.id + "'";
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        res.json({"status": "success", "message": "Area collection updated!"});
    });
});

// Bin Center Management
app.post('/addBinCenter', function (req, res) {
    'use strict';
    makeID("bin", req.body.creationDate);
    setTimeout(function () {
        var sql = "INSERT INTO tblbincenter (binCenterID, areaID, binCenterName, binCenterLocation, binCenterStatus, creationDateTime) VALUE ('" + obj.ID + "', '" + req.body.area + "' , '" + req.body.name + "', '" + req.body.location + "', 'A', '" + req.body.creationDate + "')";
        db.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            res.json({"status": "success", "details": {"binID": obj.ID}});
        });
    }, 100);
}); // Complete
app.post('/editBinCenter', function (req, res) {
    'use strict';
    
    req.body.status = req.body.status == "ACTIVE" ? 'A' : 'I';
    var sql = "UPDATE tblbincenter SET binCenterName = '" + req.body.name + "', binCenterLocation = '" + req.body.location + "', areaID = '" + req.body.area + "', binCenterStatus = '" + req.body.status + "' WHERE binCenterID = '" + req.body.id + "'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json({"status": "success", "message": "Successfully updated!"});
    });
}); // Complete
app.get('/getAllBinCenter', function(req,res){
    'use strict';
    
    var sql = "SELECT binCenterID AS id, areaID AS area, binCenterName as name, binCenterLocation AS location, (CASE WHEN binCenterStatus = 'A' THEN 'ACTIVE' WHEN binCenterStatus = 'I' THEN 'INACTIVE' END) AS status FROM tblbincenter";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete

// ACR Management
app.post('/addAcr',function(req,res){
    'use strict';
    var i, days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    
    makeID("acr", req.body.creationDate);
    setTimeout(function () {
        var sql = "INSERT INTO tblacr (acrID, acrName, acrPhoneNo, acrAddress, acrPeriod, acrStatus, creationDateTime) VALUE ('" + obj.ID + "', '" + req.body.name + "' , '" + req.body.phone + "', '" + req.body.address + "', '" + req.body.enddate + "', 'A', '" + req.body.creationDate + "')";
        
        db.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            for (i = 0; i < days.length; i += 1) {
                if (req.body.days[days[i]] != undefined) {
                    var sql = "INSERT INTO tblacrfreq (acrID, areaID, day) VALUE ('" + obj.ID + "', '" + req.body.area + "', '" + days[i] + "')";
                    db.query(sql, function (err, result) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
            res.json({"status": "success", "message": "ACR created!", "details": {"acrID": obj.ID}});
        });
    }, 100);
}); // Complete
app.get('/getAllAcr', function(req,res){
    'use strict';
    
    var sql = "SELECT DISTINCT a.acrID AS id, a.acrName AS name, a.acrPhoneNo AS phone, a.acrAddress AS address, DATE_FORMAT(a.acrPeriod, '%d %M %Y') as enddate, c.areaName as area,(CASE WHEN a.acrStatus = 'A' THEN 'ACTIVE' WHEN a.acrStatus = 'I' THEN 'INACTIVE' END) AS status FROM tblacr a INNER JOIN tblacrfreq b ON a.acrID = b.acrID INNER JOIN tblarea c ON c.areaID = b.areaID";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/getScheduleList', function (req, res) {
    'use strict';
    
    var sql = "SELECT tblacr.acrName AS name, GROUP_CONCAT(tblacrfreq.day) AS days FROM tblacr JOIN tblacrfreq ON tblacr.acrID = tblacrfreq.acrID GROUP BY tblacr.acrID";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
        res.end();
    });
});

// Report Management
app.post('/addReport',function(req,res){
    'use strict';
    makeID('report',req.body.creationDate);
    setTimeout(function () {
        var sql = "INSERT INTO tblreport (reportID, areaID, reportCollectionDate, operationTimeStart, operationTimeEnd, garbageAmount, iFleetMap, readStatus, completionStatus, truckID, driverID, remark, creationDateTime) VALUE ('" + obj.ID + "', '" + req.body.areaCode + "', '" + req.body.collectionDate + "', '" + req.body.startTime + "', '" + req.body.endTime + "', '" + req.body.ton + "', '" + req.body.ifleetImg + "', 'I', '" + req.body.status+ "','" + req.body.truck + "', '" + req.body.driver + "', '" + req.body.remark + "','" + req.body.creationDate + "')";
        var i = 0, j = 0;
        var reportID = obj.ID;
        
        db.query(sql, function(err, result) {
            if (err) {
                throw err;
            }
            if (Object.keys(req.body.marker).length > 0) {
                for (i = 0; i < Object.keys(req.body.marker).length; i++) {
                    var circleSQL = "INSERT INTO tblmapcircle (radius, cLong, cLat, reportID) VALUE ('" + req.body.marker[i].radius + "', '" + req.body.marker[i].lng + "', '" + req.body.marker[i].lat + "', '" + reportID + "')";

                    db.query(circleSQL, function (err, result) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
            if (Object.keys(req.body.rectangle).length > 0) {
                for (j = 0; j < Object.keys(req.body.rectangle).length; j++) {
                    var rectSQL = "INSERT INTO tblmaprect (neLat, neLng, swLat, swLng, reportID) VALUE ('" + req.body.rectangle[j].neLat + "', '" + req.body.rectangle[j].neLng + "', '" + req.body.rectangle[j].swLat + "', '" + req.body.rectangle[j].swLng + "', '" + reportID + "')";
                    
                    db.query(rectSQL, function (err, result) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
            res.json({"status": "success", "details": {"reportID": obj.ID}});
        });
    }, 100);
}); // Complete
app.post('/editReport',function(req,res){
    'use strict';
    
    var sql = "UPDATE tblreport SET reportCollectionDate = '" + req.body.date + "', operationTimeStart = '" + req.body.startTime + "', operationTimeEnd = '" + req.body.endTime + "', garbageAmount = '" + req.body.ton + "', iFleetMap = '"+ req.body.ifleet + "', completionStatus = '" + req.body.status + "', truckID = '" + req.body.truckID + "', driverID = '" + req.body.driverID + "', remark = '" + req.body.remark + "' WHERE reportID = '" + req.body.id + "'";
    
    var i = 0, j = 0;
    
    db.query(sql, function (err, result) {
        if (err) {
            res.json({"status": "error", "message": "Something wrong!"});
            throw err;
        }

        if (Object.keys(req.body.marker).length > 0) {
            var dltCircleSQL = "DELETE FROM tblmapcircle WHERE reportID = '" + req.body.id + "'";
            
            db.query(dltCircleSQL, function (err, result) {
                if (err) {
                    throw err;
                }
            });           
            
            
            for (i = 0; i < Object.keys(req.body.marker).length; i++) {
                var circleSQL = "INSERT INTO tblmapcircle (radius, cLong, cLat, reportID) VALUE ('" + req.body.marker[i].radius + "', '" + req.body.marker[i].cLong + "', '" + req.body.marker[i].cLat + "', '" + req.body.id + "')";
                
                console.log(circleSQL);

                db.query(circleSQL, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
        if (Object.keys(req.body.rectangle).length > 0) {
            
            var dltRectSQL = "DELETE FROM tblmaprect WHERE reportID = '" + req.body.id + "'";
            
            db.query(dltRectSQL, function (err, result) {
                if (err) {
                    throw err;
                }
            }); 
            
            for (j = 0; j < Object.keys(req.body.rectangle).length; j++) {
                var rectSQL = "INSERT INTO tblmaprect (neLat, neLng, swLat, swLng, reportID) VALUE ('" + req.body.rectangle[j].neLat + "', '" + req.body.rectangle[j].neLng + "', '" + req.body.rectangle[j].swLat + "', '" + req.body.rectangle[j].swLng + "', '" + req.body.id + "')";

                db.query(rectSQL, function (err, result) {
                    if (err) {
                        throw err;
                    }
                });
            }
        }        
        res.json({"status": "success", "message": "report edited!"});
    });
});
app.post('/getReport', function(req, res){
    'use strict';
    var sql = "SELECT tblreport.reportID AS id, tblreport.areaID AS area, tblreport.reportCollectionDate AS date, tblreport.operationTimeStart AS startTime, tblreport.operationTimeEnd AS endTime, tblreport.remark, tblarea.latitude AS lat, tblarea.longitude AS lng, tblreport.garbageAmount AS ton, tblreport.iFleetMap AS ifleet, tbltruck.truckNum AS truck, tbltruck.truckID as truckID, tbltruck.transporter AS transporter, tblstaff.staffName AS driver, tblstaff.staffID AS driverID, GROUP_CONCAT(area_collection.areaAddress) AS collection, tblarea.collection_frequency AS frequency, tblreport.completionStatus as status FROM tblreport JOIN tbltruck ON tbltruck.truckID = tblreport.truckID JOIN tblstaff ON tblreport.driverID = tblstaff.staffID JOIN area_collection ON tblreport.areaID = area_collection.areaID JOIN tblarea ON tblarea.areaID = tblreport.areaID WHERE tblreport.reportID = '" + req.body.reportID + "' GROUP BY tblreport.areaID";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Wait for area_collection
app.post('/getReportingAreaList', function (req, res) {
    'use strict';
    
    var sql = "SELECT tblzone.zoneID AS zoneID, tblzone.zoneName AS zoneName, GROUP_CONCAT(tblarea.areaID) AS id, GROUP_CONCAT(tblarea.areaName) AS name FROM tblarea JOIN tblzone ON tblarea.zoneID = tblzone.zoneID WHERE tblarea.areaStatus = 'A' AND tblarea.staffID = '" + req.body.officerid + "'GROUP BY tblzone.zoneID";
    
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete
app.post('/getReportBinCenter', function(req,res){
    'use strict';
    
    var sql = "SELECT binCenterName AS name FROM tblbincenter WHERE areaID = '" + req.body.areaID + "'";
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
//app.post('/getReportACR', function (req, res) {
//    'use strict';
//    
//    var sql = "SELECT tblacr.acrName AS name FROM tblacrfreq JOIN tblreport ON tblreport.areaID = tblacrfreq.areaID JOIN tblacr ON tblacr.acrID = tblacrfreq.acrID WHERE tblreport.reportID = '" + req.body.reportID + "' GROUP BY tblacr.acrName";
//    
//    db.query(sql, function (err, result) {
//        if (err) {
//            throw err;
//        }
//        res.json(result);
//    });
//});
app.post('/getReportCircle', function(req,res){
    'use strict';
    
    var sql = "SELECT radius, cLong, cLat FROM tblmapcircle WHERE reportID = '" + req.body.reportID + "'";
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.post('/getReportRect', function (req, res) {
    'use strict';
    var sql = "SELECT neLat, neLng, swLat, swLng FROM tblmaprect WHERE reportID = '" + req.body.reportID + "'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/getReportList', function(req, res){
    'use strict';
    
    var sql ="SELECT reportID, reportCollectionDate, tblarea.areaName, completionStatus, garbageAmount, remark FROM tblreport INNER JOIN tblarea ON tblreport.areaID = tblarea.areaID ORDER BY reportCollectionDate DESC";
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete
app.post('/getGoogleLocation', function (req, res) {
    'use strict';
    
    var sql = "SELECT tblarea.areaName AS area, tblzone.zoneName AS zone FROM tblarea INNER JOIN tblzone ON tblarea.zoneID = tblzone.zoneID WHERE tblarea.areaID = '" + req.body.areaCode + "' LIMIT 0, 1";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

//});
app.post('/getAreaLngLat', function(req, res) {
    'use strict';
    var sql = "SELECT longitude, latitude FROM tblarea WHERE areaID = '" + req.body.areaCode+ "'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete

app.post('/updateAreaLngLat', function(req, res) {
    'use strict';
    var sql = "UPDATE tblarea SET longitude = '" + req.body.lng + "', latitude = '" + req.body.lat+ "' WHERE areaID = '" + req.body.areaCode + "'";
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete

// Visualization Management
app.post('/getDataVisualization', function(req, res){
    'use strict';
    
    var sql ="SELECT a.areaID, a.areaName, r.reportCollectionDate, r.operationTimeStart, r.operationTimeEnd, r.garbageAmount, r.completionStatus FROM tblreport r INNER JOIN tblarea a ON r.areaID = a.areaID WHERE r.reportCollectionDate BETWEEN '"+req.body.dateStart+"' AND '"+req.body.dateEnd+"' ORDER BY r.reportCollectionDate";
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.post('/getDataVisualizationGroupByDate', function(req, res){
    'use strict';
    
    var sql ="SELECT reportCollectionDate, SUM(operationTimeStart) AS 'operationTimeStart', SUM(operationTimeEnd) AS 'operationTimeEnd', SUM(garbageAmount) AS 'garbageAmount' FROM tblreport WHERE reportCollectionDate BETWEEN '"+req.body.dateStart+"' AND '"+req.body.dateEnd+"' GROUP BY reportCollectionDate ORDER BY reportCollectionDate";
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

// Driver
app.get('/getDriverList', function(req, res) {
    'use strict';
    var sql = "SELECT tblstaff.staffID AS id, tblstaff.staffName AS name FROM tblposition JOIN tblstaff ON tblstaff.positionID = tblposition.positionID WHERE tblposition.positionName = 'Driver' AND tblstaff.staffStatus = 'A'";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete



//get count
app.get('/getZoneCount',function(req,res){
    var sql="SELECT COUNT(*) AS 'count' FROM tblzone";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });

});
app.get('/getAreaCount',function(req,res){
    var sql="SELECT COUNT(*) AS 'count' FROM tblarea";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });

});
app.get('/getAcrCount',function(req,res){
    var sql="SELECT COUNT(*) AS 'count' FROM tblacr";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });

});
app.get('/getBinCenterCount',function(req,res){
    var sql="SELECT COUNT(*) AS 'count' FROM tblbincenter";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });

});
app.get('/getTruckCount',function(req,res){
    var sql="SELECT COUNT(*) AS 'count' FROM tbltruck";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });

});
app.get('/getUserCount',function(req,res){
    var sql="SELECT COUNT(*) AS 'count' FROM tblstaff";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });

});
app.get('/getReportCompleteCount',function(req,res){
    var sql="SELECT COUNT(*) AS 'completeCount' FROM tblreport WHERE completionStatus = 'C'";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });

});
app.get('/getReportIncompleteCount',function(req,res){
    var sql="SELECT COUNT(*) AS 'incompleteCount' FROM tblreport WHERE completionStatus = 'I'";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });

});

//complaint module
app.get('/getComplaintList',function(req,res){
    var sql="SELECT tblComplaint.date AS 'date', tblComplaint.complaintTitle AS 'title', tblCustomer.name AS  'customer', tblComplaintType.complaintType AS 'type', tblArea.areaName AS 'area', tblComplaint.complaintID AS ' complaintID' FROM tblComplaint JOIN tblComplaintType ON tblComplaint.complaintType = tblComplaintType.complaintType JOIN tblCustomer ON tblCustomer.customerID = tblComplaint.customerID JOIN tblArea ON tblArea.areaID = tblCustomer.areaID";
     db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });    
});

app.get('/getComplaintLoc',function(req,res){
    
    var sql = ""
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });        
});
//get complaint detail by id
app.post('/getComplaintDetail',function(req,res){
    'use strict';
    var sql = "SELECT t.complaint, co.complaintTitle, co.complaintContent, co.date, cu.name, CONCAT(cu.houseNo, ', ', cu.streetNo, ', ', cu.neighborhood, ', ', cu.neighborhood, ', ', cu.postCode, ', ', cu.city) AS address, a.areaName from tblComplaint co JOIN tblComplaintType t ON co.complaintType = t.complaintType JOIN tblCustomer cu ON co.customerID = cu.customerID JOIN tblArea a ON a.areaID = cu.areaID WHERE co.complaintID = '" + req.body.id + "'";

    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });        
});
app.post('/updateAreaLngLat', function(req, res) {
    'use strict';
    var sql = "UPDATE tblarea SET longitude = '" + req.body.lng + "', latitude = '" + req.body.lat+ "' WHERE areaID = '" + req.body.areaCode + "'";
    
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
}); // Complete

/* Emitter Registered */
// Create Database Tables
emitter.on('createTable', function () {
    'use strict';
    var sqls, i;
    
    sqls = [
        "CREATE TABLE tblCustomer (customerID int auto_increment, username varchar(30),  password varchar(30),  contactNumber int, ic varchar(20), tradingLicense varchar(20),  name varchar(50),  houseNo varchar(5),  streetNo varchar(20),  neighborhood varchar(20),  postCode int,  city varchar(20),  status char(1),  creationDateTime datetime, areaID varchar(15),  PRIMARY KEY (customerID))",
        "CREATE TABLE tblPosition (  positionID varchar(15),  positionName varchar(30),  positionStatus char(1),  creationDateTime datetime,  primary key (positionID))",
        "CREATE TABLE tblBins (  serialNo int,  customerID int,  size int,  status char(1),  PRIMARY KEY (serialNo),  foreign key (customerID) references tblCustomer(customerID))",
        "CREATE TABLE tblManagement (  mgmtID int auto_increment,  mgmtName varchar(50),  PRIMARY KEY (mgmtID))",
        "CREATE TABLE tblZone (  zoneID varchar(15),  zoneName varchar(100), zoneStatus char(1),  creationDateTime datetime,  PRIMARY KEY (zoneID))",
        "CREATE TABLE tblBinInventory (  date date,  doNo varchar(10),  inNew120 int,  inNew240 int,  inNew660 int,  inNew1000 int,  outNew120 int,  outNew240 int,  outNew660 int,  outNew1000 int,  inReusable120 int,  inReusable240 int,  inReusable660 int,  inReusable1000 int,  outReusable120 int,  outReusable240 int,  outReusable660 int,  outReusable1000 int,  newBalance120 int,  newBalance240 int,  newBalance660 int,  newBalance1000 int,  reusableBalance120 int,  reusableBalance240 int,  reusableBalance660 int,  reusableBalance1000 int,  overallBalance120 int,  overallBalance240 int,  overallBalance660 int,  overallBalance1000 int,  PRIMARY KEY (date))",
        "CREATE TABLE tblStaff (  staffID varchar(15),  username varchar(20),  password mediumtext,  staffName varchar(50),  staffIC varchar(15),  staffGender char(1),  staffDOB date,  staffAddress varchar(255),  handphone varchar(11),  phone varchar(10),  email varchar(50),  positionID varchar(15),  staffStatus char(1),  creationDateTime datetime,  staffPic mediumtext,  PRIMARY KEY (staffID),  foreign key (positionID) references tblPosition(positionID))",
        "CREATE TABLE tblTruck (  truckID varchar(15),  transporter varchar(15),  truckTon int(11),  truckNum varchar(10),  truckExpiryStatus date,  truckStatus char(1),  creationDateTime datetime,  PRIMARY KEY (truckID))",
        "CREATE TABLE tblDBD (  dbdID int auto_increment,  creationDateTime datetime,  status char(1),  PRIMARY KEY (dbdID))",
        "CREATE TABLE tblDBDEntry (  idNo int auto_increment,  dbdID int,  serialNo int,  reportedBy varchar(15),  damageType varchar(15),  reason mediumtext,  repair char(1),  replacement char(1),  costCharged varchar(5),  status char(1),  rectifiedDate datetime,  PRIMARY KEY (idNo),  foreign KEY  (dbdID) references tblDBD(dbdID),  foreign KEY  (serialNo) references tblBins(serialNo),  foreign KEY  (reportedBy) references tblStaff(staffID))",
        "CREATE TABLE tblAcr (  acrID varchar(15),  serialNo int,  acrSticker varchar(10),  customerID int,  acrPeriod date,  acrStatus char(1),  creationDateTime datetime,  PRIMARY KEY (acrID),  foreign key (serialNo) references tblBins(serialNo),  foreign key (customerID) references tblCustomer(customerID))",
        "CREATE TABLE tblArea (  areaID varchar(15),  zoneID varchar(15),  staffID varchar(15),  areaName varchar(30),  collection_frequency varchar(30),  longitude double(10,7),  latitude double(10,7),  areaStatus char(1),  creationDateTime datetime,  PRIMARY KEY (areaID),  foreign key (zoneID) references tblZone(zoneID),  foreign key (staffID) references tblStaff(staffID))",
        "CREATE TABLE tblBDAF (  bdafID int auto_increment,  creationDateTime datetime,  status char(1),  PRIMARY KEY (bdafID));",
        "CREATE TABLE tblBDAFentry (  idNo int auto_increment,  bdafID int,  customerID int,  acrID varchar(15),  serialNo int,  binDelivered int,  binPulled int,  jobDesc longtext,  remarks longtext,  completed boolean,  PRIMARY KEY (idNo),  foreign key (customerID) references tblCustomer(customerID),  foreign key (acrID) references tblAcr(acrID),  foreign key (bdafID) references tblBDAF(bdafID),  foreign key (serialNo) references tblBins(serialNo),  foreign key (binDelivered) references tblBins(serialNo),  foreign key (binPulled) references tblBins(serialNo))",
        "CREATE TABLE tblDCS (  dcsID int auto_increment,  creationDateTime datetime,  status char(1),  PRIMARY KEY (dcsID))",
        "CREATE TABLE tblDCSentry (  idNo int auto_increment,  dcsID int,  acrID varchar(15),  customerID int,  areaID varchar(15),  driverID varchar(15),  beBins int,  acrBins int,  mon boolean,  tue boolean,  wed boolean,  thurs boolean,  fri boolean,  sat boolean,  remarks longtext,  PRIMARY KEY (idNo),  foreign key (acrID) references tblAcr(acrID),  foreign key (customerID) references tblCustomer(customerID),  foreign key (areaID) references tblArea(areaID),  foreign key (dcsID) references tblDCS(dcsID),  foreign key (driverID) references tblStaff(staffID))",
        "CREATE TABLE area_collection (  acID int auto_increment,  areaID varchar(15),  areaAddress mediumtext,  longitude double(10,7),  latitude double(10,7),  areaCollStatus char(1),  PRIMARY KEY (acID),  foreign key (areaID) references tblArea(areaID))",
        "CREATE TABLE tblWheelBinDatabase (  idNo int auto_increment,  date datetime,  customerID int,  areaID varchar(15),  serialNo int,  acrID varchar(15),  activeStatus char(1),  PRIMARY KEY (idNo),  foreign key (customerID) references tblCustomer(customerID),  foreign key (areaID) references tblArea(areaID),  foreign key (serialNo) references tblBins(serialNo),  foreign key (acrID) references tblAcr(acrID))",
        "CREATE TABLE tblUserActions (  date datetime,  staffID varchar(15),  action varchar(20),  onObject varchar(20),  PRIMARY KEY (date, staffID),  foreign key (staffID) references tblStaff(staffID))",
        "CREATE TABLE tblAccess (  positionID varchar(15),  mgmtID int,  status char(1),  primary key (positionID, mgmtID),  foreign key (positionID) references tblPosition(positionID),  foreign key (mgmtID) references tblManagement(mgmtID))",
        "CREATE TABLE tblReport (  reportID VARCHAR(15),  areaID VARCHAR(15),  reportCollectionDate date,  creationDateTime datetime,  operationTimeStart time,  operationTimeEnd time,  garbageAmount int,  iFleetMap mediumtext,  readStatus char(1),  completionStatus char(1),  truckID varchar(15),  driverID varchar(15),  zoom double(2,2),  remark text,  PRIMARY KEY (reportID),  foreign key (areaID) references tblArea(areaID),  foreign key (truckID) references tblTruck(truckID),  foreign key (driverID) references tblStaff(staffID))",
        "CREATE TABLE tblMapCircle (  circleID int auto_increment,  radius varchar(50),  cLong double(10,7),  cLat double(10,7),  reportID varchar(15),  primary key (circleID),  foreign key (reportID) references tblReport(reportID))",
        "CREATE TABLE tblMapRect (  rectID int auto_increment,  neLat double(10,7),  neLng double(10,7),  swLat double(10,7),  swLng double(10,7),  reportID varchar(15),  primary key (rectID),  foreign key (reportID) references tblReport(reportID))",
        "CREATE TABLE tblAcrFreq (  acrID varchar(15),  areaID varchar(15),  day varchar(30),  primary key (acrID, areaID, day),  foreign key(acrID) references tblAcr(acrID),  foreign key(areaID) references tblArea(areaID))",
        "CREATE TABLE tblBinCenter (  binCenterID varchar(15),  areaID varchar(15),  binCenterName varchar(100),  binCenterLocation varchar(100),  binCenterStatus char(1),  creationDateTime datetime,  PRIMARY KEY (binCenterID),  foreign key (areaID) references tblArea(areaID))",
        "CREATE TABLE tblLostBinRecord (  idNo int auto_increment,  customerID int,  serialNo int,  noOfBins int,  sharedBin boolean,  areaID varchar(15),  lossDate datetime,  reasons longtext,  PRIMARY KEY (idNo),  foreign key (customerID) references tblCustomer(customerID),  foreign key (areaID) references tblArea(areaID),  foreign key (serialNo) references tblBins(serialNo))",
        "CREATE TABLE tblTag (  date datetime,  serialNo int,  truckID varchar(15),  longitude double(10,7),  latitude double(10,7),  PRIMARY KEY (date, serialNo),  foreign key (truckID) references tblTruck(truckID))", "create table tblComplaintType ( complaintType int auto_increment,    complaint varchar(15), primary key (complaintType))", " create table tblComplaint ( complaintID int auto_increment, customerID int, date datetime, complaintType int, complaintTitle mediumtext, complaintContent longtext, primary key (complaintID), foreign key (customerID) references tblCustomer(customerID), foreign key (complaintType) references tblComplaintType(complaintType))"
    ];
    
    for (i = 0; i < sqls.length; i += 1) {
        db.query(sqls[i], function (err, result) {
            if (err) {
                throw err;
            }
        });
    }
    console.log('Tables created...');
}); // Complete
emitter.on('defaultUser', function () {
    'use strict';
    
    var sqls = [
        "INSERT INTO tblmanagement (mgmtName) VALUE ('create account')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit account')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view account')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('create driver')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit driver')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view driver')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('create truck')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit truck')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view truck')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('create zone')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit zone')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view zone')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('create area')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit area')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view area')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('add collection')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit collection')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('create bin')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit bin')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view bin')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('create acr')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit acr')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view acr')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view database')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit database')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('create database')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('view inventory')",
        "INSERT INTO tblmanagement (mgmtName) VALUE ('edit inventory')"

    ], i;
    
    for (i = 0; i < sqls.length; i += 1) {
        db.query(sqls[i], function (err, result) {
            if (err) {
                throw err;
            }
        });
    }
    
    var dt = dateTime.create();
    var formatted= dt.format('Y-m-d H:M:S');
    var roleFormat = dt.format('Ymd');
    
    var roleID = "ATH" + roleFormat + "0001";
    var sql = "INSERT INTO tblposition (positionID, positionName, creationDateTime, positionStatus) VALUE ('" + roleID + "', 'ADMINISTRATOR', '" + formatted + "', 'A')";
    db.query(sql, function (err, result) {
        if (err) {
            throw err;
        }

        makeID("account", formatted);
        setTimeout(function () {
            var thePassword = bcrypt.hashSync('adminacc123', 10);
            var sql = "INSERT INTO tblstaff (staffID, username, password, positionID, creationDateTime, staffStatus) VALUE ('" + obj.ID + "', 'trienekens@admin.com', '" + thePassword + "', '" + roleID + "', '" + formatted + "', 'A')";
            db.query(sql, function (err, result) {
                if (err) {
                    throw err;
                }                    
                var sqls = [
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '1', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '2', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '3', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '4', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '5', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '6', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '7', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '8', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '9', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '10', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '11', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '12', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '13', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '14', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '15', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '16', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '17', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '18', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '19', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '20', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '21', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '22', 'A')",
                    "INSERT INTO tblaccess (positionID, mgmtID, status) VALUE ('" + roleID + "', '23', 'A')"
                ], j;
                    
                for (j = 0; j < sqls.length; j += 1) {
                    db.query(sqls[j], function (err, result) {
                        if (err) {
                            throw err;
                        }
                    });
                }
                console.log('Administrator generated...');
            });
        }, 1000);
    });
    
    
}); // Complete
/* Emitter Registered */


// Create connection
var db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS
});

// Connect
db.connect(function (err) {
    'use strict';
    if (err) {
        throw err;
    }
    db.query('SELECT schema_name FROM information_schema.schemata WHERE schema_name = "' + DB_NAME + '"', function (err, result) {
        if (result[0] === undefined) {
            db.query('CREATE DATABASE ' + DB_NAME + '', function (err, result) {
                if (err) {
                    throw err;
                }
                console.log('Database created...');
                db.query('USE ' + DB_NAME + '', function (err, result) {
                    if (err) {
                        throw err;
                    }
                    console.log('MySQL Connected...');
                    emitter.emit('createTable');
                    emitter.emit('defaultUser');
                });
            });
        } else {
            if (result[0].schema_name === DB_NAME) {
                db.query('USE ' + DB_NAME + '', function (err, result) {
                    if (err) {
                        throw err;
                    }
                    console.log('MySQL Connected...');
                });
            }
        }
    });
});

server.listen(process.env.PORT || SVR_PORT, function () {
    'use strict';
    console.log('Server is running on port ' + SVR_PORT + '');
});

//------------------------------------------------------------------------------------------
// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) { 
    for(var i = 0; i < this.length; i++) { 
        if(comparer(this[i])) return true; 
    }
    return false; 
};

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
    if (!this.inArray(comparer)) {
        this.push(element);
    } else {
        for (var i = 0; i < this.length; i++) {
            if (this[i].user == element.user) {
                this[i].socketID = element.socketID;
            }
        }
    }
};
//------------------------------------------------------------------------------------------

var roomManager = "manager";

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    
    // Disconnect
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
    
    socket.on('socketID', function (data) {
        connectedUserList.pushIfNotExist(data, function(e) { 
            return e.user === data.user;
        });
        console.log(connectedUserList);
    });
    
    socket.on('room', function (room) {
        socket.join(room);
    });
    
    socket.on('make report', function (data) {
        var sql = "SELECT staffName AS name, staffPic AS avatar FROM tblstaff WHERE staffID = '" + data.owner + "' LIMIT 0, 1";
        
        db.query(sql, function (err, result) {
            if (err) {
                throw err;
            }
            if (result[0].avatar == "") {
                result[0].avatar = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
            }
            io.sockets.in(roomManager).emit('receive report notification', {
                id: data.reportID,
                name: result[0].name,
                avatar: result[0].avatar
            });
        });
    });
    
    
    //Send Message
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {
            msg: data,
            user: socket.username
        });
    });
    
    //Create New User
    socket.on('create new user', function(data) {
        socket.broadcast.emit('append user list', {
            id: obj.ID,
            name: data.name,
            username: data.username,
            position: data.position.name,
            status: 'ACTIVE'
        });
    });
    
    // New User
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
    
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});