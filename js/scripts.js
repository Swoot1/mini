(function(){
	var items = {};

	document.querySelector('.js-submit-in-and-out-form').addEventListener('click', () => {
		let inAndOutForm = document.querySelector('[name="in-and-out-form"]');
		var item = {
			name: null,
			date: null,
			thoughts: null,
			direction: 'out'
		};
		inAndOutForm.querySelectorAll('.js-form-binding').forEach((element) => {
			if(item.hasOwnProperty(element.dataset.propertyName)){
				item[element.dataset.propertyName] = element.value;	
			}
		});
		let isThrownOut = inAndOutForm.querySelector('.js-direction-out').checked;
		item.direction = isThrownOut ? 'out' : 'in';
		items[item.date] = items[item.date] || {};
		items[item.date][item.direction] = items[item.date][item.direction] || []; 
		items[item.date][item.direction].push(item);
		document.querySelector('.js-in-and-out-overview').innerHTML = makeItemListHTML(items);
	});

	function makeItemListHTML(items){
		var listHTML = '<ul>';
		var itemHTML = '';

		for(property in items){
			listHTML += '<li>'
			listHTML += property;
			listHTML += '<ul>';

			listHTML += '<li>';
			listHTML += 'In';
			listHTML += '<ul>';
			listHTML += (items[property].in || []).map((item) => {
				return '<li> ' + item.name + '<br>' + item.thoughts +  ' </li>';
			});
			listHTML += '</ul>';
			listHTML += '</li>';

			listHTML += '<li>';
			listHTML += 'Ut';
			listHTML += '<ul>';
			listHTML += (items[property].out || []).map((item) => {
				return '<li> ' + item.name + '<br>' + item.thoughts +  ' </li>';
			});
			listHTML += '</ul>';
			listHTML += '</li>';

			listHTML += '</ul>';
			listHTML += '</li>'
		}
		listHTML += '</ul>';
		return listHTML;
	}
})();