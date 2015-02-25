function pautaDAO(){
	this.insertPauta = insertPauta;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteAll = deleteAll;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertPauta(pauta){
		//alert('inserPauta');
		//alert(JSON.stringify(pauta));
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Pauta (id ";
				sqlValues = ") VALUES (" + pauta.id;
				
				if (pauta.codigoOrigem != null){
					sqlInsert = sqlInsert + ", codigoOrigem";
					sqlValues = sqlValues + "," + pauta.codigoOrigem;
				}
				if (pauta.descricao != null){
					sqlInsert = sqlInsert + ", descricao";
					sqlValues = sqlValues + ",'" + pauta.descricao + "'";
				}
				
				if (pauta.porcentagem != null){
					sqlInsert = sqlInsert + ", porcentagem";
					sqlValues = sqlValues + "," + pauta.porcentagem;
					//alert(pauta.porcentagem);
				}				
				sqlValues = sqlValues + ");";
				ctx.executeSql(sqlInsert + sqlValues);
				console.log(sqlInsert + sqlValues);
				
			 });
		}catch(err){
			alert("Erro ao inserir Pauta: " + err.message)
		}
	}
	
	function listAll() {

		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Pauta " +
								  "ORDER BY descricao desc ", [],successFind(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Pauta " +
								  "WHERE id = " + id, [],successFind(d), errorCB);
		    });
		});
	}
	
	function deleteAll(){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Pauta", [],successDelete(d), errorCB);
		    });
		});
	}
	
	function successFind(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
	
}