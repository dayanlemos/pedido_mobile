function enderecoService(){
	var oEnderecoDAO = new enderecoDAO();
	this.insertEndereco = insertEndereco;
	this.findByPessoa = findByPessoa;
	this.findById = findById;
	this.deleteEndereco = deleteEndereco;
	
	function insertEndereco(endereco) {
		oEnderecoDAO.insertEndereco(endereco);
	}

	function findByPessoa(id){
        $.when(oEnderecoDAO.findById(id)).done(function (dta) {
        	/*alert('findByPessoa ' + dta.rows.length);
        	for(i = 0; i < dta.rows.length; i++) { 
        		alert(dta.rows.item(i).id + dta.rows.item(i).bairro);
        	}*/
            return dta;
        	}).fail(erro);
    }
	
	function findById(id){
        $.when(endereco = oEnderecoDAO.findById(id)).done(function (dta) {
        	console.log('findByPessoa ' + id);
            return endereco;
        	}).fail(erro);
    }
    
    function deleteEndereco(id){
        $.when(oEnderecoDAO.deleteEndereco(id)).done(function (dta) {
            console.log('deleteEndereco ' + id);
            return true;
           	}).fail(erro);
    }
    
    
    function erro(err) {
        alert('Erro: ' + err);
    }
    
	
}