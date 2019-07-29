// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
  	const { data } = context;

  	//Lanzar un error si no hay un texto
  	if(!data.text){
  		throw new Error('Un mensaje debe tener un texto');
  	}

  	//El usuario autenticado
  	const user = context.params.user;

  	//El mensaje
  	const text = context.data.text
  	//mensajes no pueden ser más largs que 400 caracteres
  	.substring(0, 400);

  	//sobrescribir la data original (para que la gente no pueda mandar otras coas)
  	context.data = {
  		text,
  		//El id del usuario
  		userId: user._id,
  		//La fecha de hoy
  		createdAt: new Date().getTime()

  	};
  	console.log(context.data)
  	//Buenas practicas: un hooke siempre debería retornar el contexto
    return context;
  };
};
