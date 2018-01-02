(function(){
	var items = {};

	document.querySelector('.js-submit-item-form').addEventListener('click', () => {
		let inAndOutForm = document.querySelector('[name="item-form"]');
		let item = getItemDefaults();
		inAndOutForm.querySelectorAll('.js-form-binding')
				    .forEach((element) => {
						if(item.hasOwnProperty(element.dataset.propertyName)){
							item[element.dataset.propertyName] = element.value;	
						}
					});
		let isThrownOut = inAndOutForm.querySelector('.js-direction-out').checked;
		item.direction = isThrownOut ? 'out' : 'in';
		saveItem(item);
	});

	function resetItemForm(){
		document.querySelector('form[name="item-form"]').reset();
	}

	function getItemDefaults(){
		return {
			name: null,
			date: null,
			comment: null,
			direction: 'out'
		};
	}

	function makeItemListHTML(items){
		var listHTML = '<ul>';
		for(var propertyName in items){
			if(items.hasOwnProperty(propertyName)){
				listHTML += '<li>'
				listHTML += '<span class="header">' + propertyName + '</span>';
				listHTML += '<ul>';
				
				if(items[propertyName].in){
					listHTML += '<li>';
					listHTML += 'In';
					listHTML += '<ul>';
				
					listHTML += items[propertyName].in.map((item) => {
						return '<li>' + item.name + '<br>' + item.comment +  '</li>';
					}).join('');	
					
					listHTML += '</ul>';
					listHTML += '</li>';
				}

				if(items[propertyName].out){
					listHTML += '<li>';
					listHTML += 'Ut';
					listHTML += '<ul>';
					
						listHTML += items[propertyName].out.map((item) => {
							return '<li> ' + item.name + '<br>' + item.comment +  ' </li>';
						}).join('');	
					
					listHTML += '</ul>';
					listHTML += '</li>';
				}
				listHTML += '</ul>';
				listHTML += '</li>'
			}
		}
		listHTML += '</ul>';
		return listHTML;
	}
	
	// Initialize Firebase
    const config = {
	    apiKey: 'AIzaSyBWrr7WLj72pjFKExFTzyOxtsberVtAJsg',
	    authDomain: 'mini-1b778.firebaseapp.com',
	    databaseURL: 'https://mini-1b778.firebaseio.com',
	    projectId: 'mini-1b778',
	  };
    firebase.initializeApp(config);
    
    // FirebaseUI config.
    const uiConfig = {
        signInSuccessUrl: '/',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '<your-terms-of-service-url>' // TODO
    };


    const ui = new firebaseui.auth.AuthUI(firebase.auth());
	
	ui.start('.js-login', uiConfig);	

	firebase.auth()
	        .onAuthStateChanged(function(user) {
		      if (user) {
		        window.currentUser = user;
		        getItems();
		      } else {
		        window.currentUser = null;
		      }
		    });

    function saveItem(item){
    	const userId = window.currentUser.uid;
    	const key = firebase.database()
                      .ref('users/' + userId + '/items/')
                      .push()
                      .key;
      
      
		if(!userId || !key) {
	 		console.log('Kunde inte spara med userId: \'' + userId + '\' och key: \'' + key +'\'');
			return;
		}

		firebase.database()
              .ref('users/' + userId + '/items/' + key)
              .set(item)
              .then(() => {
                alert('nu är den sparad! woho!');
                resetItemForm();
              })
              .catch(() => {
                alert('uh-oh! nu blev det fel');
              });
    }

    function getItems(){
    	let userId = window.currentUser.uid;
        let itemsRef = firebase.database()
                                    .ref('users/' + userId + '/items');
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            items = mapItems(items);
            document.querySelector('.js-item-overview').innerHTML = makeItemListHTML(items);
        });
    }

    function mapItems(items){
    	let sortedItems = {};
    	for(let key in items){
    		if(items.hasOwnProperty(key)){
    			let item = items[key];
	    		sortedItems[item.date] = sortedItems[item.date] || {};
				sortedItems[item.date][item.direction] = sortedItems[item.date][item.direction] || [];
				item.key = key;
				sortedItems[item.date][item.direction].push(item);		
    		}
    	}
    	return sortedItems;
    }
})();