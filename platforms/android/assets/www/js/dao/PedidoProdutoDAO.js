function pedidoProdutoDAO(){
	this.insertPedidoProduto = insertPedidoProduto;
	this.findByPedido = findByPedido;
    this.findByPedidoCompleto = findByPedidoCompleto;
	this.findById = findById;
	this.deletePedidoProduto = deletePedidoProduto;
	this.deleteAll = deleteAll;
		
	function insertPedidoProduto(pedidoProduto, codMobile){	
		try{
			db1.transaction(function(ctx) {
				//alert('insertPedidoProduto');
				//alert('Produto: '+pedidoProduto.descricao+' '+typeof pedidoProduto.descricao);
				
				sqlInsert = "INSERT INTO PedidoProduto (id ";
				sqlValues = ") VALUES (" + pedidoProduto.id;
				
				sqlInsert = sqlInsert + ", quantidade";
				sqlValues = sqlValues + "," + pedidoProduto.quantidade;
								
				sqlInsert = sqlInsert + ", pedido";
				sqlValues = sqlValues + "," + codMobile;
				
				sqlInsert = sqlInsert + ", produto";
				sqlValues = sqlValues + "," + pedidoProduto.produto;
				
				if (pedidoProduto.valorUnitario == ''){
					pedidoProduto.valorUnitario = 0;
				}
				sqlInsert = sqlInsert + ", valorUnitario";
				sqlValues = sqlValues + "," + pedidoProduto.valorUnitario;
				
				sqlValues = sqlValues + ");";
				console.log('PedidoProduto: '+sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
				
				//Grava tabela pedidoProdutoGrade
				if (pedidoProduto.pedidoProdutoGrade != null){
					oPedidoProdutoGradeDAO = new pedidoProdutoGradeDAO();
					for(var i = 0; i < pedidoProduto.pedidoProdutoGrade.length; i++) {
                        if (pedidoProduto.pedidoProdutoGrade[i].quantidade > 0){
                            pedidoProduto.pedidoProdutoGrade[i].pedidoProduto = pedidoProduto.id;
                            oPedidoProdutoGradeDAO.insertPedidoProdutoGrade(pedidoProduto.pedidoProdutoGrade[i], codMobile);
                        }
					}
				}
				
			});
		}catch(err){
			alert("Erro ao inserir PedidoProduto: " + err.message)
		}
	}
	
	function findByPedido(pedido){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM PedidoProduto " +
								  "WHERE pedido = " + pedido.codigoMobile, [],successWrapper(d), errorCB);
		    });
		});
	}

    function findByPedidoCompleto(pedido){
        return $.Deferred(function (d) {
            db1.transaction(function(ctx) {
                ctx.executeSql("SELECT * " +
                "FROM PedidoProduto " +
                "WHERE pedido = " + pedido.codigoMobile, [],successWrapperPedido(d, pedido), errorCB);
            });
        });
    }

	function findById(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM PedidoProduto " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deletePedidoProduto(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM PedidoProduto " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	function deleteAll(){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM PedidoProduto", [],successWrapper(d), errorCB);
		    });
		});
	}
	function successWrapper(d) {
        return (function (tx, data) {
			d.resolve(data)
        })
    }

    function successWrapperPedido(d, pedido) {
        return (function (tx, data) {
            var resposta;
            if (data.rows.length > 0){
                resposta = {data:data, pedido:pedido};
            }else{
                resposta = data;
            }
            d.resolve(resposta)
        })
    }
	
}
	