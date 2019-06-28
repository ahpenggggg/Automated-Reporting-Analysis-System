var express = require('express');
var app = express();
var path = require('path');

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
app.get('/authorization', function (req, res) {
    'use strict';
    res.sendFile('pages/authorization.html', {root: __dirname});
});
app.get('/complaint-module', function (req, res) {
    'use strict';
    res.sendFile('pages/complaint-module.html', {root: __dirname});
});
app.get('/complaint-detail/:complaintCode', function (req, res) {
    'use strict';
    res.sendFile('pages/complaint-detail.html', {root: __dirname});
});

module.exports = app;