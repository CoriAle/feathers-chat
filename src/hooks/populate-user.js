// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

  	const { app, method, result, params } = context;

  	//Asegurarse que seimpre se obtenga una lista de mensajes
  	//Ya sea por meter un objeto en un array u obteniendo data del método find
  	const messages = method === 'find' ? result.data : [ result ];
  	//Obtener el usuario de cada mensaje a traves de userId
  	//Y añadirlo al mensaje, de forma asíncrona
  	//Promise all asegura que toda las llamadas corran en paralelo y no de forma secuencial
  	await Promise.all(messages.map(async message=>{
  		//Mandar los parámetros originales a la llamda del servcio
  		//así tiene la misma información disponible ej. quién hace la petición
  		console.log(message)
  		message.user = await app.service('users').get(message.userId, params);

  	}));

  	//Buena práctica: una hook siempre debería retornar el contexto.

    return context;
  };
};
