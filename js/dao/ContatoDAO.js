function contatoDAO(){
	this.insertContato = insertContato;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteContato = deleteContato;
	
	function insertContato(contato){
		try{
			db1.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Contato (id ";
				sqlValues = ") VALUES (" + contato.id;
				
				if (contato.nome != null){
					sqlInsert = sqlInsert + ", nome";
					sqlValues = sqlValues + ",'" + contato.nome + "'";
				}
				if (contato.telefone != null){
					sqlInsert = sqlInsert + ", telefone";
					sqlValues = sqlValues + ",'" + contato.telefone + "'";
				}
				if (contato.email != null){
					sqlInsert = sqlInsert + ", email";
					sqlValues = sqlValues + ",'" + contato.email + "'";
				}
				
				sqlInsert = sqlInsert + ", pessoa";
				sqlValues = sqlValues + "," + contato.pessoa.id;

				sqlValues = sqlValues + ");";

				console.log(sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir Contato: " + err.message)
		}
	}
	
	function listAll() {
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Contato " +
								  "ORDER BY nome", [],successWrapper(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Contato " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteContato(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Contato " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function successWrapper(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
}
