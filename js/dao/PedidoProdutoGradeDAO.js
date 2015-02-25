function pedidoProdutoGradeDAO(){
	this.insertPedidoProdutoGrade = insertPedidoProdutoGrade;
	this.findByPedidoProduto = findByPedidoProduto;
	this.findById = findById;
	this.deletePedidoProdutoGrade = deletePedidoProdutoGrade;
    this.findByPedidoProdutoCompleto = findByPedidoProdutoCompleto;
	
	function insertPedidoProdutoGrade(pedidoProdutoGrade, codMobile){
		try{
			db1.transaction(function(ctx) {
				sqlInsert = "INSERT INTO PedidoProdutoGrade (id ";
				sqlValues = ") VALUES (" + pedidoProdutoGrade.id;
	
				sqlInsert = sqlInsert + ", pedido";
				sqlValues = sqlValues + "," + codMobile;
				
				sqlInsert = sqlInsert + ", quantidade";
				sqlValues = sqlValues + "," + pedidoProdutoGrade.quantidade;

				sqlInsert = sqlInsert + ", gradeNumeracao";
				sqlValues = sqlValues + "," + pedidoProdutoGrade.id;
				
				sqlInsert = sqlInsert + ", pedidoProduto";
				sqlValues = sqlValues + "," + pedidoProdutoGrade.pedidoProduto;			
				
				sqlValues = sqlValues + ");";
				console.log('PedidoProdutoGrade: '+sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir PedidoProdutoGrade: " + err.message)
		}
	}
	
	function findByPedidoProduto(pedidoProduto){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM PedidoProdutoGrade " +
								  "WHERE pedidoProduto = " + pedidoProduto, [],successWrapper(d), errorCB);
		    });
		});
	}

    function findByPedidoProdutoCompleto(pedidoProduto){
        //alert('findByPedidoProduto: '+pedidoProduto);
        return $.Deferred(function (d) {
            db1.transaction(function(ctx) {
                ctx.executeSql("SELECT * " +
                "FROM PedidoProdutoGrade " +
                "WHERE pedidoProduto = " + pedidoProduto.id +
                    " AND pedido = " + pedidoProduto.pedido, [],successWrapper(d, pedidoProduto), errorCB);
            });
        });
    }

	function findById(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM PedidoProdutoGrade " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deletePedidoProdutoGrade(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM PedidoProdutoGrade " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteAll(){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM PedidoProdutoGrade ", [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function successWrapper(d) {
        return (function (tx, data) {
			d.resolve(data)
        })
    }

    function successWrapperPedido(d, pedidoProduto) {
        return (function (tx, data) {
            var resposta;
            if (data.rows.length > 0){
                resposta = {data:data, pedidoProduto:pedidoProduto};
            }else{
                resposta = data;
            }
            d.resolve(resposta)
        })
    }
	
}
	