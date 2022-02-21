const ipv4 = require("../serverip.json").serverIp;

export const postReport = (data, successFn) => {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(ipv4 + "/reportes", options)
    .then((response) => {
      if (response.status == 200) {
        alert("el reporte se ha agregado correctamente");
        successFn();
      } else {
        alert("error interno, por favor intente más tarde");
      }
    })
    .catch((err) => console.log(err));
};

export const postUserGroups = (data, successFn) => {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(ipv4 + "/u-grupos/" + AsyncStorage.getItem("phone"), options)
    .then((response) => {
      if (response.status == 200) {
        alert("el usuario se ha agregado correctamente");
        successFn();
      } else {
        alert("usuario no registrado");
      }
    })
    .catch((err) => console.log(err));
};

export const getAlerts = (userPhoneNumber) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  fetch(ipv4 + "/alertas/" + userPhoneNumber, options)
    .then((response) => {
      if (response.status == 200 || response.status == 204) {
        response.json().then((jsonObj) => {
          return { fulfilled: true, alertas: jsonObj };
        });
      } else {
        alert("error interno, por favor intente más tarde");
      }
    })
    .catch((err) => console.log(err));
};

export const getAlert = (alertPk) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  fetch(ipv4 + "/alerta/" + alertPk, options)
    .then((response) => {
      if (response.status == 200) {
        response.json().then((jsonObj) => {
          return { fulfilled: true, alerta: jsonObj[0] };
        });
      } else if (response.status == 204) {
        alert("error interno, por favor intente más tarde");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const putAlert = (data, alertPk, successFn) => {
  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(ipv4 + "/alertas/" + alertPk, options)
    .then((response) => {
      if (response.status == 200) {
        response.json().then(() => {
          successFn();
        });
      } else {
        alert("error interno, por favor intente más tarde");
      }
    })
    .catch((err) => console.log(err));
};

export const postAlert = (data) => {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(ipv4 + "/alertas", options)
    .then((response) => {
      if (response.status == 200) {
        response.json().then((jsonObj) => {
          return { fulfilled: true, alerta: jsonObj[0] };
        });
      } else {
        alert("error interno, por favor intente más tarde");
      }
    })
    .catch((err) => console.log(err));
};

export const postGroup = (data, state, successFn) => {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(ipv4 + "/grupos", options)
    .then((response) => {
      if (response.status == 200) {
        response.json().then((jsonObj) => {
          const data2 = {
            groupNumber: jsonObj[0].pk_grupo,
            groupName: state.groupName,
            isAdmin: state.isAdmin,
          };
          const options = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data2),
          };
          fetch(ipv4 + "/u-grupos/" + state.groupCreator, options).then(
            (response) => {
              if (response.status == 200) {
                successFn();
              } else {
                alert(
                  "error interno, el grupo no pudo ser creado, por favor intente más tarde"
                );
              }
            }
          );
        });
      } else {
        alert(
          "error interno, el grupo no pudo ser creado, por favor intente más tarde"
        );
      }
    })
    .catch((err) => console.log(err));
};

export const getUserGroups = (data) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  fetch(
    data.phone &&
      ipv4 +
        "/u-grupos/" +
        data.phone +
        "/" +
        data.fk_grupo +
        "/" +
        data.isAdmin,
    options
  )
    .then((response) => {
      if (response.status == 200) {
        response.json().then((jsonObj) => {
          return { fulfilled: true, users: jsonObj };
        });
      } else if (response.status == 204) {
        alert("error interno");
      }
    })
    .catch((err) => console.log(err));
};

export const getSubscribedGroups = (data) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  fetch(ipv4 + "/u-grupos/" + data, options)
    .then((response) => {
      if (response.status == 200 || response.status == 204) {
        response.json().then((jsonObj) => {
          return { fulfilled: true, groups: jsonObj };
        });
      } else {
        alert("error interno, intente mas tarde");
      }
    })
    .catch((err) => console.log(err));
};

export const getGroupReports = (grupo) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  fetch(ipv4 + "/reportes/grupo/" + grupo, options)
    .then((response) => {
      if (response.status == 200 || response.status == 204) {
        response.json().then((jsonObj) => {
          return { fulfilled: true, reportes: jsonObj };
        });
      } else {
        alert("error interno, intente mas tarde");
      }
    })
    .catch((err) => console.log(err));
};

export const postUser = (data, successFn) => {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(ipv4 + "/usuario", options)
    .then((response) => {
      if (response.status == 200) {
        response.json().then(() => {
          successFn();
        });
      } else if (response.status == 204) {
        alert("usuario o contraseña incorrecta");
      }
    })
    .catch((err) => console.log(err));
};

export const postUsers = (data, successFn) => {
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(ipv4 + "/usuarios", options)
    .then((response) => {
      if (response.status == 200) {
        successFn();
      } else {
        alert("error interno, por favor intente más tarde");
      }
    })
    .catch((err) => console.log(err));
};

export const getGroupAlerts = (grupo) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  fetch(
    ipv4 + "/alertas/grupo/" + grupo,
    options
  )
    .then((response) => {
      if (response.status == 200) {
        response.json().then((jsonObj) => {
        return{fulfilled: true, alertas: jsonObj};
        });
      } else if (response.status == 204) {
        console.log("error interno");
      }
    })
    .catch((err) => console.log(err));
};
