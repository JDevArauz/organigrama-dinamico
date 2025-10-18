(function(window, document){
	
	var org = {};

	
	var _data; 
	var _container; 
	var _containerId; 
	

	function _findNode(node, nodeId){
		if(node.id == nodeId){
			return node;
		}
		if (node.hijos) {
			for(var i = 0; i < node.hijos.length; i++){
				var nodoEncontrado = _findNode(node.hijos[i], nodeId);
				if(nodoEncontrado) return nodoEncontrado;
			}
		}
		return null;
	}

	function _removeNodeRecursive(node, nodeId){
		if (node.hijos) {
			for(var i = 0; i < node.hijos.length; i++){
				if(node.hijos[i].id == nodeId){
					node.hijos.splice(i, 1);
					return true;
				} else {
					if(_removeNodeRecursive(node.hijos[i], nodeId)){
						return true;
					}
				}
			}
		}
		return false;
	}

	function _createControls(nodoDOM, nodoId){
		var div = document.createElement('div');
		div.className = 'controls';

		var btn = document.createElement('btn');
		btn.setAttribute('type', 'button');
		btn.setAttribute('data-id', nodoId);
		btn.className = 'btn btn-primary btn-block btn-add';
		var icon = document.createElement('i');
		icon.className = 'glyphicon glyphicon-plus';
		btn.appendChild(icon);
		div.appendChild(btn);

		btn = document.createElement('btn');
		btn.setAttribute('type', 'button');
		btn.setAttribute('data-id', nodoId);
		btn.className = 'btn btn-success btn-block btn-edit';
		icon = document.createElement('i');
		icon.className = 'glyphicon glyphicon-pencil';
		btn.appendChild(icon);
		div.appendChild(btn);

		btn = document.createElement('btn');
		btn.setAttribute('type', 'button');
		btn.setAttribute('data-id', nodoId);
		btn.className = 'btn btn-danger btn-block btn-remove';
		icon = document.createElement('i');
		icon.className = 'glyphicon glyphicon-remove';
		btn.appendChild(icon);
		div.appendChild(btn);

		nodoDOM.appendChild(div);
	}


	function _addNodeDOM(parentTable, dataNode) {
		var row = document.createElement('tr');
		var cell = document.createElement('td');
		var nodo = document.createElement('div');
		nodo.className = 'nodo';
		nodo.setAttribute('data-id', dataNode.id);
		row.className = 'nodo-header';

		var childs = dataNode.hijos != undefined ? dataNode.hijos.length : 0;
		cell.setAttribute('colspan', childs * 2 || 1); 

		var item = document.createElement('div');
		item.innerText = dataNode.id;
		item.className = 'nodo-id badge';
		nodo.appendChild(item);

		item = document.createElement('div');
		item.innerText = dataNode.puesto;
		item.className = 'nodo-puesto';
		nodo.appendChild(item);

		item = document.createElement('div');
		item.innerText = dataNode.nombre;
		item.className = 'nodo-nombre';
		nodo.appendChild(item);

		_createControls(nodo, dataNode.id);

		cell.appendChild(nodo);
		row.appendChild(cell);
		parentTable.appendChild(row);

		if (childs > 0) {
			var btnExpand = document.createElement('div');
			btnExpand.className = 'btn-collapse glyphicon glyphicon-minus';
			nodo.appendChild(btnExpand);
			_on('click', btnExpand, _expandCollapse);

			var trs = document.createElement('tr');
			var tds = document.createElement('td');
			var div = document.createElement('div');
			trs.className = 'nodo-child';
			div.className = 'line-down';
			div.innerHTML = '&nbsp;';

			tds.appendChild(div);
			tds.setAttribute('colspan', childs * 2);
			trs.appendChild(tds);
			parentTable.appendChild(trs);

			trs = document.createElement('tr');
			trs.className = 'nodo-child';

			if (childs === 0) {
				tds = document.createElement('td');
				tds.className = 'line left right';
				tds.setAttribute('colspan', 2); 
				tds.innerHTML = '&nbsp;';
				trs.appendChild(tds);
			} else {
				for(var i = 0; i < childs * 2; i++){
					tds = document.createElement('td');
					tds.className = 'line ';
					tds.innerHTML = '&nbsp;';
					
					if (i === 0) {
						tds.className += 'right'; 
					} else if (i === (childs * 2) - 1) {
						tds.className += 'left'; 
					} else if (i % 2 === 0) {
						tds.className += 'right up'; 
					} else {
						tds.className += 'left up'; 
					}
					trs.appendChild(tds);
				}
			}
			
			parentTable.appendChild(trs);

			trs = document.createElement('tr');
			trs.className = 'nodo-child';
			parentTable.appendChild(trs);

			for(var i = 0; i < childs; i++){
				tds = document.createElement('td');
				tds.setAttribute('colspan', 2);
				trs.appendChild(tds);
				
				var childTable = document.createElement('table');
				tds.appendChild(childTable);
				_addNodeDOM(childTable, dataNode.hijos[i]);
			}
		}
	}


	function _expandCollapse(){
		var table = this.parentNode.parentNode.parentNode.parentNode;
		var childRows = [];
		for (var i = 0; i < table.childNodes.length; i++) {
			if (table.childNodes[i].className && table.childNodes[i].className.indexOf('nodo-child') > -1) {
				childRows.push(table.childNodes[i]);
			}
		}

		for(var i = 0; i < childRows.length; i++){
			var classname = childRows[i].className;
			childRows[i].className = classname.indexOf('hidden') != -1 ?
				classname.replace(' hidden','') :
				classname + ' hidden';
		}
		
		this.className = this.className.indexOf('minus') != -1 ?
			this.className.replace('minus', 'plus') :
			this.className.replace('plus', 'minus');
	}


	function _on(eventName, element, aFunction){
		if(document.addEventListener)
			element.addEventListener(eventName, aFunction, false);
		else
			element.attachEvent('on' + eventName, aFunction);
	}

	function _render() {
		_container.innerHTML = '';
		_container.className = 'organigrama';
		
		var mainTable = document.createElement('table');
		_container.appendChild(mainTable);
		
		if (_data) {
			_addNodeDOM(mainTable, _data);
		}
	}


	function _bindEvents() {
		var btnsAdd = _container.querySelectorAll('.btn-add');
		for(var i = 0; i < btnsAdd.length; i++){
			_on('click', btnsAdd[i], function(){
				var id = this.getAttribute('data-id');
				_handle_Add(id);
			});
		}

		var btnsEdit = _container.querySelectorAll('.btn-edit');
		for(var i = 0; i < btnsEdit.length; i++){
			_on('click', btnsEdit[i], function(){
				var id = this.getAttribute('data-id');
				_handle_Edit(id);
			});
		}

		var btnsRemove = _container.querySelectorAll('.btn-remove');
		for(var i = 0; i < btnsRemove.length; i++){
			_on('click', btnsRemove[i], function(){
				var id = this.getAttribute('data-id');
				_handle_Remove(id);
			});
		}
	}


	function _refresh() {
		_render();
		_bindEvents();
	}
	
	

	function _handle_Add(parentId) {
		var newId = prompt("Ingrese el ID del nuevo nodo:");
		if (!newId) return; 

		if (_findNode(_data, newId)) {
			alert("Error: El ID '" + newId + "' ya existe. Por favor ingrese un ID único.");
			return;
		}

		var newNombre = prompt("Ingrese el nombre del nuevo nodo:");
		if (!newNombre) return; 

		var newPuesto = prompt("Ingrese el puesto del nuevo nodo:");
		if (!newPuesto) return; 
	
		var parentNode = _findNode(_data, parentId);
		if (parentNode) {
			if (!parentNode.hijos) {
				parentNode.hijos = [];
			}
			parentNode.hijos.push({
				"id": newId,
				"puesto": newPuesto,
				"nombre": newNombre,
				"hijos": []
			});
			
			_refresh(); 
		}
	}
	
	function _handle_Edit(nodeId) {
		var node = _findNode(_data, nodeId);
		if(node){
			var newNombre = prompt("Ingrese el nuevo nombre:", node.nombre);
			if (newNombre !== null) { 
				node.nombre = newNombre;
			} else {
				return;  
			}

			var newPuesto = prompt("Ingrese el nuevo puesto:", node.puesto);
			if (newPuesto !== null) {
				node.puesto = newPuesto;
			} else {
				return; 
			}
			
			_refresh();
		}
	}
	
	function _handle_Remove(nodeId) {
		if (nodeId == _data.id) {
			alert("No se puede eliminar el nodo raíz.");
			return;
		}

		if(confirm("¿Está seguro de que desea eliminar este nodo?")){
			_removeNodeRecursive(_data, nodeId);
			_refresh(); 
		}
	}


	/**
	 * Inicia la aplicación del organigrama
	 * @param {string} containerId - El ID del div contenedor
	 * @param {object} initialData - El objeto de datos inicial
	 */
	org.init = function(containerId, initialData) {
		_containerId = containerId;
		_container = document.getElementById(containerId);
		
		if (!_container) {
			console.error("Contenedor del organigrama no encontrado:", containerId);
			return;
		}
		
		_data = initialData;
		
		_refresh();
	};

	window.organigrama = org;

})(window, document);