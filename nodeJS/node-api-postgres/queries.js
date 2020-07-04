const Pool = require('pg').Pool
const pool = new Pool({
	connectionString: 'postgres://gjfqcnos:H3PuoY00qAas_Py6wE7K1XZRcZLxqtdl@ruby.db.elephantsql.com:5432/gjfqcnos'
})

const newUser = (request, response) => {
	let reqData = request.body.userReqData;
	let optionalData = request.body.userOptionalData;
	//console.log(`INSERT INTO USUARIOS (telefono,correo,clave,fecha_nacimiento,nombre,contacto_emg1,contacto_emg2, tipo_sangre,alergias,enfermedades_cronicas,discapacidades) VALUES ('${reqData.phone}', '${reqData.email}','${reqData.password}', '${reqData.birthdate}', '${reqData.name}', '${optionalData.emgc1}', '${optionalData.emgc2}', '${optionalData.bloodType}', '${optionalData.allergies}', '${optionalData.cronic}', '${optionalData.discapacity}');`);
	pool.query(`INSERT INTO USUARIOS (telefono,correo,clave,fecha_nacimiento,nombre,contacto_emg1,contacto_emg2, tipo_sangre,alergias,enfermedades_cronicas,discapacidades) VALUES ('${reqData.phone}', '${reqData.email}','${reqData.password}', '${reqData.birthdate}', '${reqData.name}', '${optionalData.emgc1}', '${optionalData.emgc2}', '${optionalData.bloodType}', '${optionalData.allergies}', '${optionalData.cronic}', '${optionalData.discapacity}');`
		, (error, results) => {
			console.log('newUser');
			if (error) {
				console.log("error");
				response.status(204).send('0');
				throw error
			} else {
				response.status(200).send('1');
			}
		})
}

const logUser = (request, response) => {
	let phone = request.body.phone;
	let password = request.body.password;
	pool.query(`SELECT * FROM USUARIOS WHERE telefono='${phone}' AND clave='${password}' LIMIT 1`
		, (error, results) => {
			console.log('logUser');
			if (error) {
				console.log("error");
				throw error
			}
			if (results.rows.length > 0) {
				response.status(200).send(results.rows);

			} else if (results.rows.length == 0) {
				response.status(204).send('0');
			}
		})


}

const userGroups = (request, response) => {
	let user = request.params.user;
	pool.query(`SELECT * FROM USUARIOS_GRUPOS WHERE fk_usuario = '${user}'`,
		(error, results) => {
			if (error) {
				console.log("error");
				throw error
			}
			if (results.rows.length > 0) {
				response.status(200).send(results.rows);
			}
			else if (results.rows.length == 0) {
				response.status(204).send('0');
			}
		})

}

const groupUsers = (request, response) => {
	let phone = request.params.phone;
	let group = request.params.group;
	let admin = request.params.isAdmin;
	/*`SELECT * FROM USUARIOS_GRUPOS WHERE FK_GRUPO = ${group} AND FK_USUARIO <> '${phone}'`*/
	pool.query(`SELECT ug.*,u.nombre FROM usuarios_grupos ug JOIN usuarios u ON u.telefono = ug.fk_usuario WHERE ug.fk_grupo = ${group};`
		, (error, results) => {
			if (results.rows.length > 0) {
				response.status(200).send(results.rows);
			} else {
				response.status(204).send('0');
			}
		})
}

const createGroup = (request, response) => {
	let groupName = request.body.groupName;
	let groupDescription = request.body.groupDescription;
	let groupEnviroment = request.body.groupEnviroment;
	let groupCreator = request.body.groupCreator;
	pool.query(`INSERT INTO GRUPOS (nombre,descripcion,lugar,creator) VALUES ('${groupName}', '${groupDescription}','${groupEnviroment}', '${groupCreator}') RETURNING pk_grupo;`
		, (error, results) => {
			console.log('createGroup');
			if (error) {
				console.log(error);
				response.status(204).send('0');
			} else {
				response.status(200).send(results.rows);
			}
		})
}

const createUserGroup = (request, response) => {
	let user = request.params.user;
	let isAdmin = request.body.isAdmin;
	let groupNumber = request.body.groupNumber;
	let groupName = request.body.groupName;
	let funcionario = request.body.funcionario;

	if (request.body.notEmpty) {
		user = request.body.phoneNumber;
		//console.log(`do $$ begin if exists(select * from usuarios where telefono = '${user+1}' LIMIT 1) then insert into usuarios_grupos (fk_grupo,isadmin,fk_usuario,nombre,funcionario) values (${groupNumber},${isAdmin},'${user}','${groupName}', ${funcionario}); ELSE RAISE NOTICE 'no encontrado'; end IF;end $$`);
		pool.query(`select * from usuarios where telefono='${user}'`,
			(error, results) => {
				if (error) {
					console.log(error);
				} else {
					if (results.rows.length == 0) {
						response.status(204).send('0');
					} else {
						pool.query(`do $$ begin if exists(select * from usuarios where telefono = '${user}' LIMIT 1) then insert into usuarios_grupos (fk_grupo,isadmin,fk_usuario,nombre,funcionario) values (${groupNumber},false,'${user}','${groupName}', ${funcionario}); end IF;end $$`,
							(error, results) => {
								console.log('createUserGroup');
								if (error) {
									console.log(error);
									response.status(204).send('0');
								} else {
									console.log(results.rows);
									response.status(200).send(results.rows);
								}
							})
					}
				}
			})
	} else {
		pool.query(`INSERT INTO USUARIOS_GRUPOS (fk_grupo,fk_usuario,isadmin, nombre, funcionario) VALUES (${groupNumber}, '${user}',${isAdmin}, '${groupName}',false) RETURNING pk_usuariogrupo;`
			, (error, results) => {
				console.log('createUserGroup');
				if (error) {
					console.log(error);
					response.status(204).send('0');
				} else {
					response.status(200).send(results.rows);
				}
			})
	}
}

const recentUserAlerts = (request, response) => {
	let user = request.params.user;
	pool.query(`select * from usuarios u join usuarios_grupos ug on u.telefono = ug.fk_usuario join alertas a on a.fk_grupo = ug.fk_grupo where u.telefono = '${user}' order by hora desc`, (error, results) => {
		if (error) {
			console.log(error);
		} else {
			response.status(200).send(results.rows);
		}
	})
}

const createAlert = (request, response) => {
	let user = request.body.usuario;
	let fk_grupo = request.body.fk_grupo;
	let nivel = request.body.nivel;
	let latitud = request.body.latitud;
	let longitud = request.body.longitud;

	pool.query(`INSERT INTO alertas (fk_usuario,fk_grupo,nivel,hora,estado,falsa,latitud,longitud) VALUES ('${user}', ${fk_grupo}, ${nivel}, (now() - interval '4 hours'), true,false,'${latitud}', '${longitud}') RETURNING pk_alerta, hora`,
		(error, results) => {
			if (error) {
				console.log(error);
				response.status(204).send('0');
			} else {
				response.status(200).send(results.rows);
			}
		})

}

const modifyAlert = (request, response) => {
	let pk_alerta = Number(request.params.pk_alerta);
	if (request.body.falsa) {
		pool.query(`UPDATE alertas SET falsa=true WHERE pk_alerta=${pk_alerta}`,
			(error, results) => {
				if (error) {
					console.log(error);
					response.status(204).send('0');
				} else {
					response.status(200).send('1');
				}
			})
	} else {
		let lugar = request.body.lugar;
		let description = request.body.description;
		pool.query(`UPDATE alertas SET lugar='${lugar}', descripcion='${description}', estado=false WHERE pk_alerta=${pk_alerta}`,
			(error, results) => {
				if (error) {
					console.log(error);
					response.status(204).send('0');
				} else {
					response.status(200).send('1');
				}
			})
	}
}

const getAlertData = (request, response) => {
	//request.params.pk_alerta
	pool.query(`SELECT alertas.*,nombre  FROM alertas JOIN grupos on grupos.pk_grupo=alertas.fk_grupo WHERE pk_alerta=${request.params.pk_alerta}`,
		(error, results) => {
			if (error) {
				console.log(error);
				response.status(204).send('0');
			} else {
				response.status(200).send(results.rows);
			}
		})
}

const getGroupReports = (request, response) => {
	pool.query(`select * from reportes where fk_grupo = ${request.params.fk_grupo}`,
		(error, results) => {
			if (error) {
				response.status(204).send('0');
			} else {
				response.status(200).send(results.rows);
			}
		})
}

const getGroupAlerts = (request, response) => {
	pool.query(`select *,
				(select count(*) from alertas where fk_grupo = ${request.params.fk_grupo} and falsa = false) as alertas_reales,
				(select count(*) from alertas where fk_grupo = ${request.params.fk_grupo} and falsa = true) as alertas_falsas,
				(select count(*) from alertas where fk_grupo = ${request.params.fk_grupo}) as alertas_totales
				from alertas where fk_grupo = ${request.params.fk_grupo}`,
		(error, results) => {
			if (error) {
				console.log(error);
				response.status(204).send('0');
			} else {
				response.status(200).send(results.rows);
			}
		})
}
const addReport = (request, response) => {
	let b=request.body;
	console.log(request.body);
	pool.query(`INSERT INTO reportes (fk_grupo, usuario,fecha,hora,minuto, meridiem, avenida, calle, 
		edificio, local_suceso, descripcion, sexo_victima, edad_victima, descripcion_victima, 
		numero_delincuentes, descripcion_delincuentes, ruta_escape_delincuentes, fk_alerta) VALUES
	(${b.fk_grupo}, '${b.usuario}', '${b.fecha}', '${b.hora}', '${b.minuto}', '${b.meridiem}', '${b.avenida}', 
	'${b.calle}', '${b.edificio}', '${b.local}', '${b.descripcion}', 
	'${b.sexo_victima}', ${Number(b.edad_victima)}, '${b.descripcion_victima}', ${Number(b.numero_delincuentes)}, '${b.descripcion_delincuentes}', '${b.ruta_escape_delincuentes}', ${b.fk_alerta})`,
	(error,results) => {
		if(error){
			console.log(error);
			response.status(204).send('0');
		}else{
			response.status(200).send('1');
		}
	})
}
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
	addReport
}