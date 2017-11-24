jQuery(document).ready(function($) {

	var _author;
	var _messages;
	var _newMessage;

	function init () {
		var config = {
			apiKey: "AIzaSyD5FbiKl4S7VIPHU9AQanZ-NJgqGuAuxKU",
			authDomain: "chat-f6bd1.firebaseapp.com",
			databaseURL: "https://chat-f6bd1.firebaseio.com",
			projectId: "chat-f6bd1",
			storageBucket: "",
			messagingSenderId: "1028053957568"
		};
		firebase.initializeApp(config);

		_messages = jQuery('#chat-textarea');
		_newMessage = jQuery('#input-msg');
		_author = jQuery('#input-author');

		jQuery('#main-form').on('submit', onSubmit);
		jQuery('#main-form').on('click', '.delete', removeItem);

		// Escucho el cambio en el nodo messages
		firebase.database().ref('messages/').orderByChild('date').on('value', updateItems);
	}

	// Envio un nuevo mensaje
	function onSubmit (e) {
		if(e){e.preventDefault();}
		var msg = _newMessage.val();
		if(msg.length > 2){
			var newData = {
				"author":_author.val(),
				"message":msg,
				"date":firebase.database.ServerValue.TIMESTAMP
			};
			// Obtengo el id del futuro nuevo nodo que se insertara
			var newKey = firebase.database().ref().child('messages').push().key;
			var updates = {};
			updates['/messages/' + newKey] = newData;
			firebase.database().ref().update(updates);
			_newMessage.val('');
		}
		return false;
	}

	// Elimino un mensaje concreto
	function removeItem(e) {
		var id = jQuery(this).parents('li').attr('data-id');
		if(id){
			firebase.database().ref().child('/messages/'+id).remove();
		}
	}

	// Cuando hay un cambio en el nodo messages actualizo el listado de mensajes
	function updateItems(snapshot) {
		//console.log(snapshot.val());
		var values = snapshot.val();
		var str = '<ul>';
		for (var i in values) {
			str += '<li data-id="'+i+'"><span class="author">'+values[i].author + ': </span><span class="date">'+formatDate(values[i].date)+'</span><span class="message">' +values[i].message+'</span><button type="button" id="delete-btn" class="delete" tabindex="-1"></button></li>';
		}
		str += '</ul>';
		_messages.html(str);
		// Muevo el scroll al final
		_messages[0].scrollTo(0, _messages[0].scrollHeight);

		return false;
	}

	// Formato dd-mm-yyyy hh:mm:ss
	function formatDate(timestamp){
		var date = new Date(timestamp);
		return addZeroBefore(date.getDate(), 2)+'/'+addZeroBefore(date.getMonth(), 2)+'/'+date.getFullYear()+' '+addZeroBefore(date.getHours(), 2)+':'+addZeroBefore(date.getMinutes(), 2);
	}
	// Aniado ceros delante de un numero (1 -> 01)
	function addZeroBefore(number, digits) {
		var numDig = digits-String(number).length;
		if (numDig<=0) {
			return String(number);
		}
		numDig = Math.pow(10, numDig);
		var stringDig = String(numDig).substring(1);
		return stringDig + String(number);
	}

	init();
});



