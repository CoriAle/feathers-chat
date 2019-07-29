//Estableciendo conección a socketio
const socket = io();

//Inicializando nuestro cliente feathers a través de socket
//con hooks y autenticanción

const client = feathers();

cliente.configure(feathers.socketio(socket));

//Localstorage para lamacenar el token de login

cliente.configure(feathers.authentication({
	storage: window.localStorage
}));

// Login screen
const loginHTML = `<main class="login container">
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet text-center heading">
      <h1 class="font-100">Log in or signup</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
      <form class="form">
        <fieldset>
          <input class="block" type="email" name="email" placeholder="email">
        </fieldset>

        <fieldset>
          <input class="block" type="password" name="password" placeholder="password">
        </fieldset>

        <button type="button" id="login" class="button button-primary block signup">
          Log in
        </button>

        <button type="button" id="signup" class="button button-primary block signup">
          Sign up and log in
        </button>
      </form>
    </div>
  </div>
</main>`;


// Chat base HTML (without user list and messages)
const chatHTML = `<main class="flex flex-column">
  <header class="title-bar flex flex-row flex-center">
    <div class="title-wrapper block center-element">
      <img class="logo" src="http://feathersjs.com/img/feathers-logo-wide.png"
        alt="Feathers Logo">
      <span class="title">Chat</span>
    </div>
  </header>

  <div class="flex flex-row flex-1 clear">
    <aside class="sidebar col col-3 flex flex-column flex-space-between">
      <header class="flex flex-row flex-center">
        <h4 class="font-300 text-center">
          <span class="font-600 online-count">0</span> users
        </h4>
      </header>

      <ul class="flex flex-column flex-1 list-unstyled user-list"></ul>
      <footer class="flex flex-row flex-center">
        <a href="#" id="logout" class="button button-primary">
          Sign Out
        </a>
      </footer>
    </aside>

    <div class="flex flex-column col col-9">
      <main class="chat flex flex-column flex-1 clear"></main>

      <form class="flex flex-row flex-space-between" id="send-message">
        <input type="text" name="text" class="flex flex-1">
        <button class="button-primary" type="submit">Send</button>
      </form>
    </div>
  </div>
</main>`;

//Agregar un nuevo usuario a la lista

const addUser = user =>{
	const userList = document.querySelector('.user-list');

	if(userList){
		//Agregar un nuevo usuario a lista
		userList.insertAdjacentHTML('beforeend', `<li>
			<a class="block relative" href="#">
				<img src="${user.avatar}" alt="" class="avatar">
				<span class="absolute username">${user.email}</span>
			</a>
		</li>`);

		//Actualizar el número de usuarios
		const userCount = document.querySelectorAll('.user-list li').length;

		document.querySelector('.online-count').innerHTML = userCount;
	}
};

//Renderiza un nuevo mensaje y encuentra el usuario que pertenece el mensaje

const addMessage = message=>{
	//Encuentra al usuario a quien pertenece el usuario o anonima si no encontrado
	const { user = {} } = message;
	const chat = document.querySelector('.chat');

	//Escape HTML
	const text = message.text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;').replace(/>/g, '&gt;');


	if(chat){
		chat.insertAdjacentHTML( 'beforeend', `<div class="message flex flex-row">
		     <img src="${user.avatar}" alt="${user.email}" class="avatar">
		     <div class="message-wrapper">
		       <p class="message-header">
		         <span class="username font-600">${user.email}</span>
		         <span class="sent-date font-300">${moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
		       </p>
		       <p class="message-content font-300">${text}</p>
		     </div>
		   </div>`);

		chat.scrollTop = chat.scrollHeight - chat.clientHeight;

	}

}

//Mostrar la página de login

const showLogin = (error={})=>{
	if(document.querySelector('.login').length){
		document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>` );

	}
	else{
		document.getElementById('app').innerHTML = loginHTML;
	}
}

//Mostrar la página de cha
const showChat = async ()=>{
	document.getElementById('app').innerHTML = chatHTML;

	//Encuentra los últimos 25 mensajes, Estos vendrás con desde el más nuevo
	//que es la razón debemos ponerlos al revés antes de añadirlos
	const messages = await client.service('messages').find({
		query:{
			$sort: { createdAt: -1},
			$limit: 25
		}
	});

	//queremos mostrar el mensaje más resiete de último
	messages.data.reverse().forEach(addMessage)

	//encuentra a doso los usuarios
	const user = await cliente.service('users').find();

	user.data.forEach(addUser);
}

//Retrive email/password del form login/signup

const getCredentials = ()=>{
	const user = {
		email: document.querySelector('[name="email"]').value,
		password: document.querySelector('[name="password"').value
	};

	return user;
}

//Log in usando el email y passwrod o el token en el storage

const login = async credentials =>{
	try {
		if(!credentials){
			//Intenta autenticar usando el jwt del localstorage
			await client.authenticate();
		}
		else{
			//Si está la información de login, agregar la estrategia a usar para login
			const payload = new Object.assign({strategy: 'local', credentials});

			await client.authenticate(payload);
		}

		//Con éxito mostrar chats
		showChat();

	} catch(e) {
		// statements
		console.log(e);
		showLogin(e);
	}
}