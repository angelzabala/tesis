const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString:
    "postgres://gjfqcnos:H3PuoY00qAas_Py6wE7K1XZRcZLxqtdl@ruby.db.elephantsql.com:5432/gjfqcnos",
});

const newUser = (request, response) => {
  const reqData = request.body.userReqData;
  const optionalData = request.body.userOptionalData;

  pool.query(
    `INSERT INTO USUARIOS (telefono,correo,clave,fecha_nacimiento,nombre,contacto_emg1,contacto_emg2, tipo_sangre,alergias,enfermedades_cronicas,discapacidades) VALUES ('${reqData.phone}', '${reqData.email}','${reqData.password}', '${reqData.birthdate}', '${reqData.name}', '${optionalData.emgc1}', '${optionalData.emgc2}', '${optionalData.bloodType}', '${optionalData.allergies}', '${optionalData.cronic}', '${optionalData.discapacity}');`,
    (error) => {
      if (error) {
        response.status(204).send("0");
        throw error;
      } else {
        response.status(200).send("1");
      }
    }
  );
};

const logUser = (request, response) => {
  const phone = request.body.phone;
  const password = request.body.password;

  pool.query(
    `SELECT * FROM USUARIOS WHERE telefono='${phone}' AND clave='${password}' LIMIT 1`,
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        response.status(200).send(results.rows);
      } else if (results.rows.length == 0) {
        response.status(204).send("0");
      }
    }
  );
};

const userGroups = (request, response) => {
  const user = request.params.user;

  pool.query(
    `SELECT * FROM USUARIOS_GRUPOS WHERE fk_usuario = '${user}'`,
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        response.status(200).send(results.rows);
      } else if (results.rows.length == 0) {
        response.status(204).send("0");
      }
    }
  );
};

const groupUsers = (request, response) => {
  const group = request.params.group;

  pool.query(
    `SELECT ug.*,u.nombre FROM usuarios_grupos ug JOIN usuarios u ON u.telefono = ug.fk_usuario WHERE ug.fk_grupo = ${group};`,
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rows.length > 0) {
        response.status(200).send(results.rows);
      } else {
        response.status(204).send("0");
      }
    }
  );
};

const createGroup = (request, response) => {
  const groupName = request.body.groupName;
  const groupDescription = request.body.groupDescription;
  const groupEnviroment = request.body.groupEnviroment;
  const groupCreator = request.body.groupCreator;

  pool.query(
    `INSERT INTO GRUPOS (nombre,descripcion,lugar,creator) VALUES ('${groupName}', '${groupDescription}','${groupEnviroment}', '${groupCreator}') RETURNING pk_grupo;`,
    (error, results) => {
      if (error) {
        response.status(204).send("0");
      } else {
        response.status(200).send(results.rows);
      }
    }
  );
};

const createUserGroup = (request, response) => {
  const user = request.params.user;
  const isAdmin = request.body.isAdmin;
  const groupNumber = request.body.groupNumber;
  const groupName = request.body.groupName;
  const funcionario = request.body.funcionario;

  if (request.body.notEmpty) {
    user = request.body.phoneNumber;

    pool.query(
      `select * from usuarios where telefono='${user}'`,
      (error, results) => {
        if (error) {
        } else {
          if (results.rows.length == 0) {
            response.status(204).send("0");
          } else {
            pool.query(
              `do $$ begin if exists(select * from usuarios where telefono = '${user}' LIMIT 1) then insert into usuarios_grupos (fk_grupo,isadmin,fk_usuario,nombre,funcionario) values (${groupNumber},false,'${user}','${groupName}', ${funcionario}); end IF;end $$`,
              (error, results) => {
                if (error) {
                  response.status(204).send("0");
                } else {
                  response.status(200).send(results.rows);
                }
              }
            );
          }
        }
      }
    );
  } else {
    pool.query(
      `INSERT INTO USUARIOS_GRUPOS (fk_grupo,fk_usuario,isadmin, nombre, funcionario) VALUES (${groupNumber}, '${user}',${isAdmin}, '${groupName}',false) RETURNING pk_usuariogrupo;`,
      (error, results) => {
        if (error) {
          response.status(204).send("0");
        } else {
          response.status(200).send(results.rows);
        }
      }
    );
  }
};

const recentUserAlerts = (request, response) => {
  const userPhone = request.params.user;

  pool.query(
    `select * from usuarios u join usuarios_grupos ug on u.telefono = ug.fk_usuario join alertas a on a.fk_grupo = ug.fk_grupo where u.telefono = '${userPhone}' order by hora desc`,
    (error, results) => {
      if (error) {
      } else {
        response.status(200).send(results.rows);
      }
    }
  );
};

const createAlert = (request, response) => {
  const user = request.body.usuario;
  const fk_grupo = request.body.fk_grupo;
  const nivel = request.body.nivel;
  const latitud = request.body.latitud;
  const longitud = request.body.longitud;

  pool.query(
    `INSERT INTO alertas (fk_usuario,fk_grupo,nivel,hora,estado,falsa,latitud,longitud) VALUES ('${user}', ${fk_grupo}, ${nivel}, (now() - interval '4 hours'), true,false,'${latitud}', '${longitud}') RETURNING pk_alerta, hora`,
    (error, results) => {
      if (error) {
        response.status(204).send("0");
      } else {
        response.status(200).send(results.rows);
      }
    }
  );
};

const modifyAlert = (request, response) => {
  const pk_alerta = Number(request.params.pk_alerta);

  if (request.body.falsa) {
    pool.query(
      `UPDATE alertas SET falsa=true WHERE pk_alerta=${pk_alerta}`,
      (error) => {
        if (error) {
          response.status(204).send("0");
        } else {
          response.status(200).send("1");
        }
      }
    );
  } else {
    const lugar = request.body.lugar;
    const description = request.body.description;

    pool.query(
      `UPDATE alertas SET lugar='${lugar}', descripcion='${description}', estado=false WHERE pk_alerta=${pk_alerta}`,
      (error) => {
        if (error) {
          response.status(204).send("0");
        } else {
          response.status(200).send("1");
        }
      }
    );
  }
};

const getAlertData = (request, response) => {
  pool.query(
    `SELECT alertas.*,nombre  FROM alertas JOIN grupos on grupos.pk_grupo=alertas.fk_grupo WHERE pk_alerta=${request.params.pk_alerta}`,
    (error, results) => {
      if (error) {
        response.status(204).send("0");
      } else {
        response.status(200).send(results.rows);
      }
    }
  );
};

const getGroupReports = (request, response) => {
  pool.query(
    `select * from reportes where fk_grupo = ${request.params.fk_grupo}`,
    (error, results) => {
      if (error) {
        response.status(204).send("0");
      } else {
        response.status(200).send(results.rows);
      }
    }
  );
};

const getGroupAlerts = (request, response) => {
  pool.query(
    `select *,
				(select count(*) from alertas where fk_grupo = ${request.params.fk_grupo} and falsa = false) as alertas_reales,
				(select count(*) from alertas where fk_grupo = ${request.params.fk_grupo} and falsa = true) as alertas_falsas,
				(select count(*) from alertas where fk_grupo = ${request.params.fk_grupo}) as alertas_totales
				from alertas where fk_grupo = ${request.params.fk_grupo}`,
    (error, results) => {
      if (error) {
        response.status(204).send("0");
      } else {
        response.status(200).send(results.rows);
      }
    }
  );
};
const addReport = (request, response) => {
  const body = request.body;

  pool.query(
    `INSERT INTO reportes (fk_grupo, usuario,fecha,hora,minuto, meridiem, avenida, calle, 
		edificio, local_suceso, descripcion, sexo_victima, edad_victima, descripcion_victima, 
		numero_delincuentes, descripcion_delincuentes, ruta_escape_delincuentes, fk_alerta) VALUES
	(${body.fk_grupo}, '${body.usuario}', '${body.fecha}', '${body.hora}', '${body.minuto}', 
  '${body.meridiem}', '${body.avenida}', '${body.calle}', '${body.edificio}', 
  '${body.local}', '${body.descripcion}', '${body.sexo_victima}', ${Number(body.edad_victima)}, 
  '${body.descripcion_victima}', ${Number(body.numero_delincuentes)}, '${body.descripcion_delincuentes}', 
  '${body.ruta_escape_delincuentes}', ${body.fk_alerta})`,
    (error) => {
      if (error) {
        response.status(204).send("0");
      } else {
        response.status(200).send("1");
      }
    }
  );
};

module.exports = {
  newUser,
  logUser,
  userGroups,
  groupUsers,
  createGroup,
  createUserGroup,
  recentUserAlerts,
  createAlert,
  modifyAlert,
  getAlertData,
  getGroupReports,
  getGroupAlerts,
  addReport,
};
