const express = require("express");
const app = express();
const server = require("http").createServer(app);

const bodyParser = require("body-parser");
const db = require("./databaseActions");
const path = require("path");

const socketOptions = {
  jsonp: false,
  agent: "-",
  pfx: "-",
  cert: "-",
  ca: "-",
  ciphers: "-",
  rejectUnauthorized: "-",
  perMessageDeflate: "-",
};
const io = require("socket.io")(server, socketOptions);

const port = 3000;

server.listen(port);

io.on("connect", (socket) => {
  socket.on("update", (data) => {
    io.emit("updateEmit", data);
  });
  socket.on("manualDatabaseUpdate", () => {
    io.emit("updateDatabase");
  });
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "updatedemo.html"));
});

app.post("/usuario/", db.logUser);
app.post("/usuarios", db.postUsers);

app.get("/u-grupos/:user", db.getUserGroups);
app.get("/u-grupos/:phone/:group/:admin", db.getGroupUsers);
app.post("/u-grupos/:user", db.postUserGroups);

app.post("/grupos", db.postGroups);

app.get("/alertas/:user", db.getUserAlerts);
app.get("/alerta/:pk_alerta", db.getAlert);
app.get("/alertas/grupo/:fk_grupo", db.getGroupAlerts);
app.post("/alertas", db.postAlerts);
app.put("/alertas/:pk_alerta", db.putAlert);

app.get("/reportes/grupo/:fk_grupo", db.getGroupReports);
app.post("/reportes", db.postReports);
