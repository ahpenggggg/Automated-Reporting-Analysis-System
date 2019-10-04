var express = require('express');
var app = express();
var database = require('./database-management');
//var variable = require('../variable');

app.post('/updateComplaintStatus', function (req, res) {
    'use strict';
    var sql = "UPDATE tblcomplaint SET status = '" + req.body.status + "' WHERE complaintID = '" + req.body.id + "'";
    
    database.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.post('/updateComplaintStatus', function(req,res){
    
    var sql = "UPDATE tblcomplaint SET status = (CASE WHEN '" + req.body.status + "' = 'Confirmation' THEN 'c' WHEN '" + req.body.status + "' = 'Pending' THEN 'p' WHEN '" + req.body.status + "' = 'In progress' THEN 'i' WHEN '" + req.body.status + "' = 'Done' THEN 'd' END) WHERE complaintID = '" + req.body.id + "'";

    var status = {
        "status":""
    };
    database.query(sql, function (err, result) {
        if (err) {
            
            status.status = "error";
            res.json(status);
            throw err;
        }else{
            status.status = "success";
            res.json(status);
        }
    });    
});

//complaint module
app.get('/getComplaintList', function (req, res) {
    'use strict';
    var sql = "SELECT tblcomplaint.complaintDate AS 'date', tblcomplaint.complaint AS 'title', tbluser.name AS  'customer', tblcomplaint.premiseType AS 'type', tblarea.areaName AS 'area', CONCAT(tblzone.zoneCode,tblarea.areaCode) AS 'code', tblcomplaint.complaintID AS ' complaintID', (CASE WHEN tblcomplaint.status = 'c' THEN 'Confirmation' WHEN tblcomplaint.status = 'p' THEN 'Pending' WHEN tblcomplaint.status = 'i' THEN 'In progress' WHEN tblcomplaint.status ='d' THEN 'Done' END) AS status FROM tblcomplaint JOIN tbluser ON tbluser.userID = tblcomplaint.userID JOIN tbltaman ON tbltaman.tamanID = tbluser.tamanID JOIN tblarea ON tblarea.areaID = tbltaman.areaID JOIN tblzone ON tblzone.zoneID = tblarea.zoneID";
    database.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.get('/getComplaintLoc', function (req, res) {
    'use strict';
    var sql = "SELECT tblcomplaint.complaintID, tblcomplaint.complaintDate AS 'date', tbltaman.longitude AS 'longitude', tbltaman.latitude AS 'latitude', tblarea.areaName AS 'area', CONCAT(tblzone.zoneCode,tblarea.areaCode) AS 'code', tbltaman.tamanName as 'taman', tbluser.name AS 'customer', tblcomplaint.status AS 'status' FROM tbluser JOIN tbltaman ON tbluser.tamanID = tbltaman.tamanID JOIN tblarea ON tblarea.areaID = tbltaman.areaID JOIN tblcomplaint ON tblcomplaint.userID = tbluser.userID JOIN tblzone ON tblzone.zoneID = tblarea.zoneID";
    
    database.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
//get complaint detail by id
app.post('/getComplaintDetail', function (req, res) {
    'use strict';
    var sql = "SELECT co.complaintID, co.premiseType, co.complaint, co.remarks, co.complaintDate, cu.name, CONCAT(cu.houseNo, ', ', cu.streetNo, ', ', tbltaman.tamanName, ', ', cu.postCode, ', ', cu.city) AS address, a.areaID, a.areaName, CONCAT(z.zoneCode,a.areaCode) AS 'code', (CASE WHEN co.status = 'c' THEN 'Confirmation' WHEN co.status = 'p' THEN 'Pending' WHEN co.status = 'i' THEN 'In progress' WHEN co.status = 'd' THEN 'Done' END) AS status from tblcomplaint co JOIN tbluser cu ON co.userID = cu.userID JOIN tbltaman ON tbltaman.tamanID = cu.tamanID JOIN tblarea a ON a.areaID = tbltaman.areaID JOIN tblzone z ON z.zoneID = a.zoneID WHERE co.complaintID = '" + req.body.id + "'";

    database.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

//get report date list for complaint by id
app.post('/getDateListForComplaint', function (req, res) {
    'use strict';
    var sql = "SELECT reportID, reportCollectionDate as date FROM tblreport WHERE areaID = '" + req.body.id + "' ORDER BY reportCollectionDate DESC";

    database.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.post('/getReportForComplaint', function (req, res) {
    'use strict';
    var content = '', sql;
    
    sql = "SELECT tblreport.reportID AS id, tblreport.areaID AS area, tblreport.reportCollectionDate AS date, tblreport.operationTimeStart AS startTime, tblreport.operationTimeEnd AS endTime, tblreport.remark, tblarea.latitude AS lat, tblarea.longitude AS lng, tblreport.garbageAmount AS ton, tblreport.iFleetMap AS ifleet, tbltruck.truckNum AS truck, tbltruck.truckID as truckID, tbltruck.transporter AS transporter, tblstaff.staffName AS driver, tblstaff.staffID AS driverID, GROUP_CONCAT(tbltaman.tamanName) AS collection, tblarea.collection_frequency AS frequency, tblreport.completionStatus as status FROM tblreport JOIN tbltruck ON tbltruck.truckID = tblreport.truckID JOIN tblstaff ON tblreport.driverID = tblstaff.staffID JOIN tblarea ON tblarea.areaID = tblreport.areaID JOIN tbltaman ON tbltaman.areaID = tblarea.areaID WHERE tblreport.reportID = '" + req.body.reportID + "' GROUP BY tblreport.areaID";
    database.query(sql, function (err, result) {
        if (err) {
            throw err;
        }
        console.log(sql);
        console.log(result);
        
        content += '<div class="row"><div class="col-md-12"><table border="1"><thead><tr><th colspan="2">IVWM INSPECTION REPORT ID: ' + result[0].id + '</th><th>Completion Status:' + result[0].status + '</th><th>Collection Date: ' + result[0].date + '</th><th>Garbage Amount(ton): ' + result[0].ton + '</th><th>Time Start: ' + result[0].startTime + '</th><th>Time End: ' + result[0].startEnd + '</th><th>Reporting Staff:</th></tr><tr><th>Area</th><th>Collection Area</th><th>COLLECTION FREQUENCY</th><th>BIN CENTERS</th><th>ACR CUSTOMER</th><th>TRANSPORTER</th><th>TRUCK NO.</th><th>DRIVER</th></tr></thead><tbody><tr><td>' + result[0].area + '</td><td>' + result[0].collection + '</td><td>' + result[0].frequency + '</td><td >bin</td><td>acr</td><td>' + result[0].transporter + '</td><td>' + result[0].truck + '</td><td>' + result[0].driver + '</td></tr><tr><td>Remarks:</td><td colspan="7">' + result[0].remark + '</td></tr></tbody></table></div></div>';
        
        res.json({"content": content, "result": result});
        
    });
    
});

module.exports = app;