function produtoDAO(){
	this.insertProduto = insertProduto;
	this.listAll = listAll;
	this.findById = findById;
    this.search = search;
	this.deleteProduto = deleteProduto;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertProduto(produto, index, total){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Produto(id ";
				sqlValues = ") VALUES (" + produto.id;
				
				if (produto.ordem != null){
					sqlInsert = sqlInsert + ", ordem";
					sqlValues = sqlValues + ",'" + produto.ordem + "'";
				}

				if (produto.cor != null){
					sqlInsert = sqlInsert + ", cor";
					sqlValues = sqlValues + ",'" + produto.cor + "'";
				}
				
				if (produto.descricao != null){
					sqlInsert = sqlInsert + ", descricao";
					sqlValues = sqlValues + ",'" + produto.descricao + "'";
				}
				
				if (produto.codigoFabricante != null){
					sqlInsert = sqlInsert + ", codigoFabricante";
					sqlValues = sqlValues + ",'" + produto.codigoFabricante + "'";
				}
								
				if (produto.grupoProduto != null){
					sqlInsert = sqlInsert + ", grupoProduto";
					sqlValues = sqlValues + "," + produto.grupoProduto.id;					
				}

				if (produto.unidade != null){
					sqlInsert = sqlInsert + ", unidade";
					sqlValues = sqlValues + "," + produto.unidade.id;					
				}
				
				if (produto.fabricante != null){
					sqlInsert = sqlInsert + ", fabricante";
					sqlValues = sqlValues + "," + produto.fabricante.id;
				}
				
				if (produto.composicao != null){
					sqlInsert = sqlInsert + ", composicao";
					sqlValues = sqlValues + "," + produto.composicao.id;					
				}

				if (produto.tabelaPreco != null){
					sqlInsert = sqlInsert + ", tabelaPreco";
					sqlValues = sqlValues + "," + produto.tabelaPreco.id;
				}
				
				sqlInsert = sqlInsert + ", codigoOrigem";
				sqlValues = sqlValues + "," + produto.codigoOrigem;
				
				sqlInsert = sqlInsert + ", valor";
				sqlValues = sqlValues + "," + produto.valor;

				sqlInsert = sqlInsert + ", valorMinimo";
				sqlValues = sqlValues + "," + produto.valorMinimo;
				
				sqlInsert = sqlInsert + ", qtdeEmbalagem";
				sqlValues = sqlValues + "," + produto.qtdeEmbalagem;
				
				sqlValues = sqlValues + ");";
				
				console.log(sqlInsert + sqlValues);
				console.log(':::::::::::Gravando Produto:::::::::::::');
				console.log('Index: '+index);
				console.log('Total: '+total);
				totalProdutos = total;
				if(index < total){
					percentProdutos = 100*index/total;
					totalProdutos = total;
					j('#atualiza-loader').click();
					j('.progress-produtos').show();
					console.log('Produtos: '+percentProdutos+'%');
				}else{
					j('.produtos-ok').show('slide');
					setTimeout(function(){
						j('.produtos-ok').hide('slide');
						j('.progress-produtos').hide('slide');
						
					}, 5000);
				}
				ctx.executeSql(sqlInsert + sqlValues);
				
				//Grava tabela ProdutoGrade
				if (produto.produtoGrade != null){
					oProdutoGradeDAO = new produtoGradeDAO();
					for(i = 0; i < produto.produtoGrade.length; i++) {
						produto.produtoGrade[i].produto = produto.id;
						oProdutoGradeDAO.insertProdutoGrade(produto.produtoGrade[i], total, index);
					}
				}
			});	
		}catch(err){
			alert("Erro ao inserir produto: " + err.message)
		}
	}
	
	function listAll(skip) {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
                //alert("listAll skip: "+skip);
				ctx.executeSql("SELECT * " +
								  "FROM Produto " +
								  "ORDER BY descricao desc " +
								  "LIMIT "+skip+",10", [],successFind(d), errorCB);
		    });
		});	
	}

    function search(consulta) {
        //alert("search pessoaDAO: "+consulta);
        return $.Deferred(function (d) {
            db.transaction(function(ctx) {
                //alert('search pessoaDAO transaction: '+consulta);
                ctx.executeSql("SELECT * " +
                "FROM produto " +
                "WHERE descricao LIKE '%"+consulta+"%' "+
                "ORDER BY descricao ", [],successFind(d), errorCB);
            });
        });
    }
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Produto " +
								  "WHERE id = " + id, [],successFind(d), errorCB);
		    });
		});
	}
	
	function deleteProduto(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Produto " +
								  "WHERE id = " + id, [],successDelete(d), errorCB);
		    });
		});
	}

    function deleteAll(id){
        return $.Deferred(function (d) {
            db.transaction(function(ctx) {
                ctx.executeSql("DELETE " +
                "FROM Produto, PedidoProduto ", [],successDelete(d), errorCB);
            });
        });
    }
	
	function successDelete(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
	
	function successFind(d) {
        return (function (tx, data) {
        	d.resolve(data)
        })
    }
}
