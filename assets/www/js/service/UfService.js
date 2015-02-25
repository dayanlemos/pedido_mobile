function ufService() {
	var oUfDAO = new ufDAO();
	this.insertUf = insertUf;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteUf = deleteUf; 
	
	function insertUf(uf) {
		oUfDAO.insertUf(uf);
	}
	
	function listAll(){    
        $.when(oUfDAO.listAll()).done(function (dta) {
        	console.log('listAllUf ' + dta.rows.length);
        	return dta.rows.item;
        	}).fail(erro);
	}
	
    function findById(id){
        $.when(oUfDAO.findById(id)).done(function (dta) {
        	console.log('findByidUf ' + dta.rows.item(0).nome);
        	return dta.rows.item;
            }).fail(erro);
    }
    
    function deleteUf(){
        $.when(oUfDAO.deleteUf()).done(function (dta) {
            console.log('deleteUf');
            return true;
            }).fail(erro);
    }
	
    function erro(err) {
        alert('Erro: ' + err);
    }
}
