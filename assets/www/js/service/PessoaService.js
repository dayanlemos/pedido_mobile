function pessoaService() {
	var oPessoaDAO = new pessoaDAO();
	this.insertPessoa = insertPessoa;
	this.listAll = listAll;
	this.findById = findById;
	this.deletePessoa = deletePessoa;
	
	function insertPessoa(pessoa, index, total) {
		oPessoaDAO.insertPessoa(pessoa, index, total);
	}
	
	function listAll(){    
        $.when(oPessoaDAO.listAll()).done(function (dta) {
        	console.log('listAll ' + dta.rows.length);
        	return dta.rows.item;
        	}).fail(erro);
	}
	
    function findById(id){
        $.when(oPessoaDAO.findById(id)).done(function (dta) {
        	return dta.rows.item;
            }).fail(erro);
    }
    
    function deletePessoa(id){
        $.when(oPessoaDAO.deletePessoa(id)).done(function (dta) {
            console.log('deletePessoa ' + dta.rows.length);
            return true;
            }).fail(erro);
    }

    function deleteAll(){
        $.when(oPessoaDAO.deleteAll()).done(function (dta) {
            return true;
        }).fail(erro);
    }

    function erro(err) {
        alert('Erro: ' + err);
    }
    

}