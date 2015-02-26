function tabelaService(nomeTabela) {
	var oTabelaDAO = new tabelaDAO(nomeTabela);
	this.insertTabela = insertTabela;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteTabela = deleteTabela; 
	
	function insertTabela(tabela) {
		oTabelaDAO.insertTabela(tabela);
	}
	
	function listAll(){    
        $.when(oTabelaDAO.listAll()).done(function (dta) {
        	console.log('listAll ' + dta.rows.length);
        	return dta.rows.item;
        	}).fail(erro);
	}
	
    function findById(id){
        $.when(oTabelaDAO.findById(id)).done(function (dta) {
        	console.log('findByid'+ nomeTabela + ': ' + dta.rows.item(0).nome);
        	return dta.rows.item;
            }).fail(erro);
    }
	
	function deleteTabela(nomeTabela){
	       $.when(oTabelaDAO.deleteTabela(nomeTabela)).done(function (dta) {
	           console.log('deleteTabela ' + nomeTabela);
	           return true;
	           }).fail(erro);
	}
	
	function erro(err) {
	 	alert('Erro: ' + err);
	}
	
	
}