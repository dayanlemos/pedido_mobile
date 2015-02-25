function precoService(){
	var oPrecoDAO = new precoDAO();
	this.insertPreco = insertPreco;
	this.updatePreco = updatePreco;
	this.listAll = listAll;
	this.findById = findById;
	this.deletePreco = deletePreco;
	
	function insertPreco(preco) {
		oPrecoDAO.insertTabela(preco);
	}

	function updatePreco(preco) {
		oPrecoDAO.updateTabela(preco);
	}
	
	function listAll(){    
        $.when(oPrecoDAO.listAll()).done(function (dta) {
        	console.log('listAllPreco ' + dta.rows.length);
        	return dta.rows.item;
        	}).fail(erro);
	}
	
    function findById(id){
        $.when(oPrecoDAO.findById(id)).done(function (dta) {
        	console.log('findByid Preco: ' + dta.rows.item(0).nome);
        	return dta.rows.item;
            }).fail(erro);
    }

    function deletePreco(){
        $.when(oTabelaPrecoDAO.deletePreco()).done(function (dta) {
            console.log('deletePreco');
            return true;
            }).fail(erro);
    }
	
    function erro(err) {
        alert('Erro: ' + err);
    }
	
}
	