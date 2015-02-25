function tabelaPrecoService() {
	var oTabelaPrecoDAO = new tabelaPrecoDAO();
	this.insertTabelaPreco = insertTabelaPreco;
	this.listAll = listAll;
	this.findById = findById;
	
	function insertTabelaPreco(tabelaPreco) {
		oTabelaPrecoDAO.insertTabelaPreco(tabelaPreco);
	}
	
	function listAll(){    
        $.when(oTabelaPrecoDAO.listAll()).done(function (dta) {
        	console.log('listAllTabelaPreco ' + dta.rows.length);
        	return dta.rows.item;
        	}).fail(erro);
	}
	
    function findById(id){
        $.when(oTabelaPrecoDAO.findById(id)).done(function (dta) {
        	console.log('findByidTabelaPreco ' + dta.rows.item(0).nome);
        	return dta.rows.item;
            }).fail(erro);
    }
    
    function deleteTabelaPreco(){
        $.when(oTabelaPrecoDAO.deleteTabelaPreco()).done(function (dta) {
            console.log('deleteTabelaPreco ');
            return true;
            }).fail(erro);
    }
	
    function erro(err) {
        alert('Erro: ' + err);
    }
}
