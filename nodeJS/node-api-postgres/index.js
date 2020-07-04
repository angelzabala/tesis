const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const socketOptions = { jsonp: false, agent: '-', pfx: '-', cert: '-', ca: '-', ciphers: '-', rejectUnauthorized: '-', perMessageDeflate: '-' } ;
const io = require('socket.io')(server, socketOptions);
const db = require('./queries');
const path = require('path');
var opn = require('opn');
const port = 3000;

server.listen(port);

io.on('connect', (socket) => {
	socket.on('update', (data)=>{
		io.emit('updateEmit', data);
	});
	socket.on('manualDatabaseUpdate', ()=>{
		io.emit('updateDatabase');
	})
});

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname, "updatedemo.html"));
})


app.post('/usuario/', db.logUser);
app.post('/usuarios', db.newUser);

app.get('/u-grupos/:user', db.userGroups);
app.get('/u-grupos/:phone/:group/:admin', db.groupUsers);
app.post('/u-grupos/:user',db.createUserGroup);

app.post('/grupos', db.createGroup);

app.get('/alertas/:user', db.recentUserAlerts);
app.get('/alerta/:pk_alerta', db.getAlertData);
app.get('/alertas/grupo/:fk_grupo', db.getGroupAlerts);
app.post('/alertas', db.createAlert);
app.put('/alertas/:pk_alerta', db.modifyAlert);

app.get('/reportes/grupo/:fk_grupo', db.getGroupReports);
app.post('/reportes', db.addReport);

