function produtoGradeDAO(){
	this.insertProdutoGrade = insertProdutoGrade;
	this.findByProduto = findByProduto;
	this.deleteProdutoGrade = deleteProdutoGrade;
	
	function insertProdutoGrade(produtoGrade, totalProdutos, indexProduto){
		try{
			console.log('id' + produtoGrade.id);
			db1.transaction(function(ctx) {
				sqlInsert = "INSERT INTO ProdutoGrade (id ";
				sqlValues = ") VALUES (" + produtoGrade.id;
				
				if (produtoGrade.idGrade != null){
					sqlInsert = sqlInsert + ", grade";
					sqlValues = sqlValues + "," + produtoGrade.idGrade;
				}
				if (produtoGrade.produto != null){
					sqlInsert = sqlInsert + ", produto";
					sqlValues = sqlValues + "," + produtoGrade.produto;
				}
				sqlValues = sqlValues + ");";
				console.log(sqlInsert + sqlValues);
				console.log(indexProduto+' '+totalProdutos);
				if(indexProduto==totalProdutos){
					j('.atualizando-registros').hide();
					j('.sincronismo-ok').show();
					setTimeout(function(){
						j('.sincronismo-ok').hide();
						location.reload();
					},3500);
				}
				
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir ProdutoGrade: " + err.message)
		}
	}
	
	function findByProduto(idProduto){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM ProdutoGrade " +
								  "WHERE produto = " + idProduto, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteProdutoGrade(){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM ProdutoGrade", [],successDelete(d), errorCB);
		    });
		});
	}
	
	function successWrapper(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
	
}