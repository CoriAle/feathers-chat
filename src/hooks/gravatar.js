// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars

const crypto = require('crypto');

//La imagen del gravatar
const gravatarUrl = 'https://s.gravatar.com/avatar';
//El tamaño del query
const query = 's=60';

module.exports = function (options = {}) {
  return async context => {
  	//El email delusuario
  	const { email } = context.data;

  	//Gravatar usa hash MD5 de una dirección de correo para obtener la imagen
  	const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

  	context.data.avatar = `${gravatarUrl}/${hash}?${query}`;

  	//Un hook siempre debería retornar el contexto
    return context;
  };
};
