function tabelaDAO(nomeTabela){
	this.insertTabela = insertTabela;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteTabela = deleteTabela;
		
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertTabela(tabela){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO " + nomeTabela +" (id ";
				sqlValues = ") VALUES (" + tabela.id;
				
				if (tabela.nome != null){
					sqlInsert = sqlInsert + ", nome";
					sqlValues = sqlValues + ",'" + tabela.nome + "'";
				}
				
				sqlInsert = sqlInsert + ", codigoOrigem";
				sqlValues = sqlValues + "," + tabela.codigoOrigem;

				sqlValues = sqlValues + ");";

				console.log(sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
			
			});
		}catch(err){
			alert("Erro ao inserir Tabela: " + err.message)
		}			
	}
	
	function listAll() {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM " + nomeTabela +
								  " ORDER BY nome", [],successWrapper(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
						  		  "FROM " + nomeTabela +
								  " WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteTabela(nomeTabela){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM " + nomeTabela, [],successDelete(d), errorCB);
		    });
		});
	}
	
	function successWrapper(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
	
}
	