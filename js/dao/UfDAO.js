function ufDAO(){
	this.insertUf = insertUf;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteUf = deleteUf;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertUf(uf){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Uf (id ";
				sqlValues = ") VALUES (" + uf.id;
				
				if (uf.nome != null){
					sqlInsert = sqlInsert + ", nome";
					sqlValues = sqlValues + ",'" + uf.nome + "'";
				}
				if (uf.sigla != null){
					sqlInsert = sqlInsert + ", sigla";
					sqlValues = sqlValues + ",'" + uf.sigla + "'";
				}
				sqlValues = sqlValues + ");";
				console.log(sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir UF: " + err.message)
		}
	}
	
	function listAll() {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Uf " +
								  "ORDER BY nome", [],successWrapper(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Uf " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteUf(){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Uf", [],successDelete(d), errorCB);
		    });
		});
	}
	
	function successWrapper(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
	
}