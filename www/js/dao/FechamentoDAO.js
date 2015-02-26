function fechamentoDAO(){
	this.insertFechamento = insertFechamento;
	this.findByPedido = findByPedido;
    this.findByPedidoCompleto = findByPedidoCompleto;
	this.findById = findById;
	this.deleteFechamento = deleteFechamento;
	this.deleteAll = deleteAll;
	
	function insertFechamento(fechamento){
		try{
			db1.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Fechamento (id ";
				sqlValues = ") VALUES (" + fechamento.id;
				
				sqlInsert = sqlInsert + ", pedido";
				sqlValues = sqlValues + "," + fechamento.codigoMobile;				
				
				if (fechamento.entrega != null){
					sqlInsert = sqlInsert + ", entrega";
					sqlValues = sqlValues + ",'" + fechamento.entrega + "'";
				}
				if (fechamento.observacoes != null){
					sqlInsert = sqlInsert + ", observacoes";
					sqlValues = sqlValues + ",'" + fechamento.observacoes+ "'";
				}
				if (fechamento.tipoCobranca != null){
					sqlInsert = sqlInsert + ", tipoCobranca";
					sqlValues = sqlValues + "," + fechamento.tipoCobranca.id + "";
				}
				if (fechamento.prazo != null){
					sqlInsert = sqlInsert + ", prazo";
					sqlValues = sqlValues + "," + fechamento.prazo.id + "";
				}
                if (fechamento.pauta != null){
                    sqlInsert = sqlInsert + ", pauta";
                    sqlValues = sqlValues + "," + fechamento.pauta.id + "";
                }
				if (fechamento.desconto != null){
					sqlInsert = sqlInsert + ", desconto";
					sqlValues = sqlValues + "," + fechamento.desconto + "";
				}
				
				if (fechamento.descontoComissao != null){
					sqlInsert = sqlInsert + ", descontoComissao";
					sqlValues = sqlValues + "," + fechamento.descontoComissao.id + "";
				}

				sqlValues = sqlValues + ");";
				console.log(sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir fechamento: " + err.message)
		}
	}
	
	
	function findByPedido(codigoMobile){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Fechamento " +
								  "WHERE pedido = " + codigoMobile, [],successWrapper(d), errorCB);
		    });
		});
	}

    function findByPedidoCompleto(pedido){
        return $.Deferred(function (d) {
            db1.transaction(function(ctx) {
                ctx.executeSql("SELECT * " +
                "FROM Fechamento " +
                "WHERE pedido = " + pedido.codigoMobile, [],successWrapperPedido(d, pedido), errorCB);
            });
        });
    }



	function findById(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Fechamento " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteFechamento(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Fechamento " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteAll(){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Fechamento ", [],successWrapper(d), errorCB);
		    });
		});
	}	
	
	function successWrapper(d) {
        return (function (tx, data) {

			//console.log('EnderecoDAO'+data.rows.item(0).bairro);
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
	
