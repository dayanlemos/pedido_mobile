function pedidoDAO(){
	this.insertPedido = insertPedido;
	this.listAll = listAll;
	this.findById = findById;
	this.findByCliente = findByCliente;
	this.findByData = findByData;
	this.findByNaoSincronizado = findByNaoSincronizado;
	this.updateSincronizados = updateSincronizados;
	this.deletePedido = deletePedido;
	this.updatePedido = updatePedido;
    this.updateSincronizadoById = updateSincronizadoById;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);

	/**
	 * Insere Pedido no banco de dados
	 */
	function insertPedido(pedido){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Pedido(codigo ";
				sqlValues = ") VALUES ('" + pedido.codigo+"'";


                if (pedido.cliente != null){
					sqlInsert = sqlInsert + ", cliente";
					sqlValues = sqlValues + "," + pedido.cliente.id;
				}
				if (pedido.vendedor!= null){
					sqlInsert = sqlInsert + ", vendedor";
					sqlValues = sqlValues + "," + pedido.vendedor;
				}
				if (pedido.status != null){//ABERTO/FECHADO
					sqlInsert = sqlInsert + ", status";
					sqlValues = sqlValues + ",'" + pedido.status.id + "'";
				}
				if (pedido.dataPedido != null){
					sqlInsert = sqlInsert + ", dataPedido";
					sqlValues = sqlValues + ",'" + pedido.dataPedido + "'";
				}
				
				
				//campos somente mobile
				if (pedido.sincronizado != null){
					sqlInsert = sqlInsert + ", sincronizado";
					sqlValues = sqlValues + ",'" + pedido.sincronizado + "'";
				}
				
				//codigoMobile é auto incremento
				
				sqlValues = sqlValues + ");";
				console.log('Pedido: '+sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
				
				//Grava tabela pedidoProduto
				if (pedido.pedidoProduto != null){
					oPedidoProdutoDAO = new pedidoProdutoDAO();
					for(var i = 0; i < pedido.pedidoProduto.length; i++) { 
						//console.log(JSON.stringify(pedido.pedidoProduto[i]));
						oPedidoProdutoDAO.insertPedidoProduto(pedido.pedidoProduto[i], pedido.codigoMobile);
					}
				}
				
		    });
		}catch(err){
			alert("Erro ao inserir pedido: " + err.message)
		}
	}

	function listAll() {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM pedido " +
								  "ORDER BY id", [],successFind(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM pedido " +
								  "WHERE id = " + id, [],successFind(d), errorCB);
		    });
		});
	}
	
	function findByCliente(cliente){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM pedido " +
								  "WHERE cliente = " + cliente, [],successFind(d), errorCB);
		    });
		});
	}
	
	function findByData(dataInicial, dataFinal){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				//'yyyy-MM-DD'
				ctx.executeSql("SELECT * " +
								  "FROM pedido " +
								  "WHERE date(dataPedido) >= date('" + dataInicial +"') AND date(dataPedido) <= date('"+ dataFinal+"'", [],successFind(d), errorCB);
		    });
		});
	}

	function findByNaoSincronizado(){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
                    "FROM pedido " +
					"WHERE sincronizado is null or sincronizado <> 'S'", [],successFind(d), errorCB);
		    });
		});
	}

    function updateSincronizadoById(codigo){
        return $.Deferred(function (d) {
            db.transaction(function(ctx) {
                ctx.executeSql("UPDATE pedido " +
                "SET sincronizado = 'S' " +
                "WHERE codigo = '" + codigo + "'", [],successFind(d), errorCB);
            });
        });
    }
	function updateSincronizados(ids){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				var idsLista = '';
				if (ids != null){
					oPedidoProdutoDAO = new pedidoProdutoDAO();
					idsLista = ids[0];
					for(var i = 1; i < ids.length; i++) { 
						idsLista = idsLista + ',' + ids[i];
					}
				}
				ctx.executeSql("UPDATE pedido " +
								  "SET sincronizado = 'S' " +
								  "WHERE id in (" + idsLista + ")", [],successFind(d), errorCB);
		    });
		});
	}
	
	function updatePedido(pedido){
		pedidoGravado=[];
		var sqlUpdate = "UPDATE Pedido SET (";
		
		sqlUpdate = sqlUpdate + "id = " + id;
		
    	if (pedido.cliente != null){
			sqlUpdate = sqlUpdate + ", cliente=" + pedido.cliente.id;
		} 	
		if (pedido.vendedor!= null){
			 sqlUpdate = sqlUpdate + ", vendedor=" + pedido.vendedor.id;
		} 
		if (pedido.observacoes != null){
			 sqlUpdate = sqlUpdate + ", observacoes='" + pedido.observacoes+ "'";
		} 
		if (pedido.dataPedido != null){
			 sqlUpdate = sqlUpdate + ", dataPedido='" + pedido.dataPedido + "'";
		}
		if (pedido.entrega != null){
			 sqlUpdate = sqlUpdate+ ", entrega='" + pedido.entrega + "'";
		}
		if (pedido.status != null){//ABERTO/FECHADO
			 sqlUpdate = sqlUpdate + ", status='" + pedido.status.id + "'";
		}
		if (pedido.tipoCobranca != null){
			 sqlUpdate = sqlUpdate+ ", tipoCobranca=" + pedido.tipoCobranca.id + "";
		}
		if (pedido.prazo != null){
			 sqlUpdate = sqlUpdate+ ", prazo=" + pedido.prazo.id + "";
		}
		if (pedido.sincronizado != null){
			 sqlUpdate = sqlUpdate+ ", sincronizado='" + pedido.sincronizado + "'";
		}
		//if (pedido.codigoMobile != null){
		//	 sqlUpdate = sqlUpdate+ ", codigoMobile='" + pedido.codigoMobile + "'";
		//}
		
		sqlUpdate = sqlUpdate + ") where codigoMobile = " + pedido.codigoMobile;
	
		return "true";
	}

	function deletePedido(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM pedido " +
								  "WHERE id = " + id, [],successDelete(d), errorCB);
		    });
		});
	}
	
	function successDelete(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }

    function errorCB() {
        alert('Erro ao recuperar pedido.')
    }

	function successFind(d) {
        return (function (tx, data) {
        	d.resolve(data)
        })
    }
} 
