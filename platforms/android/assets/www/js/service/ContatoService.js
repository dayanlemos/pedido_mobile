function contatoService() {
	var oContatoDAO = new contatoDAO();
	this.insertContato = insertContato;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteContato = deleteContato; 
	
	function insertContato(contato) {
		oContatoDAO.insertContato(contato);
	}
	
	function listAll(){    
        $.when(oContatoDAO.listAll()).done(function (dta) {
        	console.log('listAll ' + dta.rows.length);
        	return dta.rows.item;
        	}).fail(erro);
	}
	
    function findById(id){
        $.when(oContatoDAO.findById(id)).done(function (dta) {
        	return dta.rows.item;
            }).fail(erro);
    }
    
    function deleteContato(id){
        $.when(oContatoDAO.deleteContato(id)).done(function (dta) {
            console.log('deleteContato');
            return true;
            }).fail(erro);
    }
	
	function erro(err) {
        alert('Erro: ' + err);
    }
}
	