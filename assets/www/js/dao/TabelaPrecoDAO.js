function tabelaPrecoDAO(){
	this.insertTabelaPreco = insertTabelaPreco;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteTabelaPreco = deleteTabelaPreco;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertTabelaPreco(tabelaPreco){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO TabelaPreco (id ";
				sqlValues = ") VALUES (" + tabelaPreco.id;
				
				if (tabelaPreco.nome != null){
					sqlInsert = sqlInsert + ", nome";
					sqlValues = sqlValues + ",'" + tabelaPreco.nome + "'";
				}
				
				sqlInsert = sqlInsert + ", valor";
				sqlValues = sqlValues + "," + tabelaPreco.valor;

				sqlValues = sqlValues + ");";

				console.log(sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir TabelaPreco: " + err.message)
		}
	}
	
	
	function listAll() {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM TabelaPreco " +
								  "ORDER BY nome", [],successWrapper(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM TabelaPreco " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteTabelaPreco(){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM TabelaPreco", [],successDelete(d), errorCB);
		    });
		});
	}
	
	function successWrapper(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
}