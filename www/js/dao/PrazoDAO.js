function prazoDAO(){
	this.insertPrazo = insertPrazo;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteAll = deleteAll;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertPrazo(prazo){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Prazo (id ";
				sqlValues = ") VALUES (" + prazo.id;
				
				if (prazo.codigoOrigem != null){
					sqlInsert = sqlInsert + ", codigoOrigem";
					sqlValues = sqlValues + "," + prazo.codigoOrigem;
				}
				if (prazo.nome != null){
					sqlInsert = sqlInsert + ", nome";
					sqlValues = sqlValues + ",'" + prazo.nome + "'";
				}
				if (prazo.desconto != null){
					sqlInsert = sqlInsert + ", desconto";
					sqlValues = sqlValues + "," + prazo.desconto;
				}				
				if (prazo.acrescimo != null){
					sqlInsert = sqlInsert + ", acrescimo";
					sqlValues = sqlValues + "," + prazo.acrescimo ;
				}
				sqlValues = sqlValues + ");";
				ctx.executeSql(sqlInsert + sqlValues);
				console.log(sqlInsert + sqlValues);
				
				//Grava tabela descontoComissao
				if (prazo.descontoComissao != null){
					var oDescontoComissaoDAO = new descontoComissaoDAO;
					for(var i = 0; i < prazo.descontoComissao.length; i++) {
						prazo.descontoComissao[i].prazo = prazo.id;
						oDescontoComissaoDAO.insertDescontoComissao(prazo.descontoComissao[i]);
					}
				}
				
			 });
		}catch(err){
			alert("Erro ao inserir Prazo: " + err.message)
		}
	}
	
	function listAll() {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Prazo " +
								  "ORDER BY nome desc ", [],successFind(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Prazo " +
								  "WHERE id = " + id, [],successFind(d), errorCB);
		    });
		});
	}
	
	function deleteAll(){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Prazo", [],successFind(d), errorCB);

                ctx.executeSql("DELETE " +
                                  "FROM DescontoComissao", [],successFind(d), errorCB);

		    });
		});
	}
	
	function successFind(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
	
}