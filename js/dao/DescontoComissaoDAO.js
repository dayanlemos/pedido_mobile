function descontoComissaoDAO(){
	this.insertDescontoComissao = insertDescontoComissao;
	this.listAll = listAll;
	this.findById = findById;
	this.findByPrazo = findByPrazo;
	this.deleteAll = deleteAll;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertDescontoComissao(desconto){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO DescontoComissao (id ";
				sqlValues = ") VALUES (" + desconto.id;

				sqlInsert = sqlInsert + ", prazo";
				sqlValues = sqlValues + "," + desconto.prazo;
				
				sqlInsert = sqlInsert + ", desconto";
				sqlValues = sqlValues + "," + desconto.desconto;

				sqlInsert = sqlInsert + ", comissao";
				sqlValues = sqlValues + "," + desconto.comissao;
				
				sqlValues = sqlValues + ");";
				
				console.log(sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir DescontoComissao: " + err.message)
		}
	}
	
	function listAll() {
		//alert('entrou listAll descontoComissao');
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM DescontoComissao " +
								  "ORDER BY desconto", [],successWrapper(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM DescontoComissao " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function findByPrazo(prazo){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM DescontoComissao " +
								  "WHERE prazo = " + prazo +
								  " ORDER BY desconto", [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteAll(){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM DescontoComissao", [],successDelete(d), errorCB);
		    });
		});
	}
	
	function successWrapper(d) {
        return (function (tx, data) {
			console.log('R: ' + data.rows.length)
            d.resolve(data)
        })
    }
	
}