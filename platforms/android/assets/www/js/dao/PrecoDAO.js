function precoDAO(){
	this.insertPreco = insertPreco;
	this.listAll = listAll;
	this.findById = findById;
	this.updatePreco = updatePreco;
	this.deletePreco = deletePreco;
		
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertPreco(tabela){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Preco (id ";
				sqlValues = ") VALUES (" + tabela.id;
				
				sqlInsert = sqlInsert + ", idProduto";
				sqlValues = sqlValues + "," + tabela.idProduto;

				sqlInsert = sqlInsert + ", idCliente";
				sqlValues = sqlValues + "," + tabela.idProduto;

				sqlInsert = sqlInsert + ", valor";
				sqlValues = sqlValues + "," + tabela.valor;
				
				sqlValues = sqlValues + ");";

				ctx.executeSql(sqlInsert + sqlValues);
			
			});
		}catch(err){
			alert("Erro ao inserir Valor: " + err.message)
		}			
	}
	
	function findById(idProduto, idCliente){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
						  		  "FROM Preco " +
								  "WHERE idProduto = " + idProduto " " +
								  		"AND idCliente = " + idCliente, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deletePreco(idProduto, idCliente){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Preco " +
								  "WHERE idProduto = " + idProduto " " +
								  "AND idCliente = " + idCliente, [],successDelete(d), errorCB);
		    });
		});
	}
	
	function updatePreco(preco){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("UPDATE Preco " +
								  "SET valor " + preco.valor + " " +
								  "WHERE idProduto = " + preco.idProduto " " +
								  "AND idCliente = " + preco.idCliente, [],successDelete(d), errorCB);
		    });
		});
	}
	
	
	function successWrapper(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
	
}
	