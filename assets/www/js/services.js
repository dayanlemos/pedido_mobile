angular.module('starter.services', [])

.factory('Clientes', function ($q,$http) {

  var pedidos = [];
  var clientes = [];
  var clientesTotal = [];
  var produtos = [];
  var produtosTotal = [];
  var fechamento = [];
  var tiposCobranca = [];
  var pautas;
  var buscaCliente = true;
  var descontoComissao = 'DescontoComissao';

  return {
    all: function() {

			//alert('entrou');
			var deferred = $q.defer();
			
			var oPessoaDAO = new pessoaDAO();

			$.when(oPessoaDAO.listAll(skipClientes)).done(function (dta) {
				clientes = [];
				oEndereco = new enderecoDAO();
				
				for (var i=0; i<dta.rows.length; i++){
					clientes.push(dta.rows.item(i));
					clientes[i].endereco = [];
				}
				
				$q.all(clientes.map(function(cliente){
					
					var def2 = $q.defer();
					
					$.when(oEndereco.findByPessoa(cliente)).done(function (data) {
						try{
							for (var j=0; j<data.data.rows.length; j++){
								//console.log('Cliente '+ data.pessoa.nomeRazao);
								data.pessoa.endereco.push(data.data.rows.item(j));
							}
						}catch(err){
							alert('erro ao buscar endereco: '+err);
						}
						def2.resolve();
					}).fail(function erroEnd(err) {
						deferred.reject('Erro: ' + err);
						alert('Erro: ' + err);
					});
					
					return def2.promise;
				
				})).then(function(){
					//alert('Entrou promise');
                    //alert(clientes[0].nomeRazao);
                    for(var i=0;i<clientes.length;i++){
                        clientesTotal.push(clientes[i]);
                    }
                    //alert("allCliente Service | clientesTotal: "+clientesTotal.length+" "+clientes.length);
					deferred.resolve(clientesTotal);

				}, function (err){
					alert('erro: '+err);
				});
				

			}).fail(function erro(err) {
					deferred.reject('Erro: ' + err);
					alert('Erro: ' + err);
			});
			
			return deferred.promise;

		
    },
    allClientesSearch: function(consulta) {
          //alert('services: '+consulta);
          var deferred = $q.defer();
          var oPessoaDAO = new pessoaDAO();

          $.when(oPessoaDAO.search(consulta)).done(function (dta) {
              clientes = [];
              oEndereco = new enderecoDAO();
              for (var i=0; i<dta.rows.length; i++){
                  clientes.push(dta.rows.item(i));
                  clientes[i].endereco = [];
              }

              $q.all(clientes.map(function(cliente){

                  var def2 = $q.defer();

                  $.when(oEndereco.findByPessoa(cliente)).done(function (data) {
                      try{
                          for (var j=0; j<data.data.rows.length; j++){
                              //console.log('Cliente '+ data.pessoa.nomeRazao);
                              data.pessoa.endereco.push(data.data.rows.item(j));
                          }
                      }catch(err){
                          alert('erro ao buscar endereco: '+err);
                      }
                      def2.resolve();
                  }).fail(function erroEnd(err) {
                      deferred.reject('Erro: ' + err);
                      alert('Erro: ' + err);
                  });

                  return def2.promise;

              })).then(function(){
                  //for(var i=0;i<clientes.length;i++){
                  //    clientesTotal.push(clientes[i]);
                  //}
                  deferred.resolve(clientes);
              }, function (err){
                  alert('erro: '+err);
              });


          }).fail(function erro(err) {
              deferred.reject('Erro: ' + err);
              alert('Erro: ' + err);
          });

          return deferred.promise;



    },
    allProdutosSearch: function(consulta) {
          //alert('services: '+consulta);
          var deferred = $q.defer();
          var oProdutoDAO = new produtoDAO();

          $.when(oProdutoDAO.search(consulta)).done(function (dta) {
              produtos = [];
              for (var i=0; i<dta.rows.length; i++){
                  produtos.push(dta.rows.item(i));
              }
              deferred.resolve(produtos);
          }).fail(function erro(err) {
              deferred.reject('Erro: ' + err);
              alert('Erro: ' + err);
          });

          return deferred.promise;

    },

	allPedido: function(){
		
    	var deferred = $q.defer();
    	
    	var oPedidoDAO = new pedidoDAO();
    	
    	$.when(oPedidoDAO.listAll()).done(function (dta) {
			pedidos = [];
			for (var i=0; i<dta.rows.length; i++){
				pedidos.push(dta.rows.item(i));
        	}
			console.log('N de pedidos: '+pedidos.length);
		
        	deferred.resolve(pedidos);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
    },
      sincronizaPedidos: function(cPedido) {
          return $http.post('http://pedidoweb.getconsultoria.com.br/pedidoweb/soa/service/pedido', cPedido).
              success(function (data, status, headers, config) {
                  var oPedidoDAO = new pedidoDAO();
                  oPedidoDAO.updateSincronizadoById(cPedido.pedido.codigo);
              }).
              error(function (data, status, headers, config) {
                  alert('Erro ao sincronizar pedido: ' + cPedido.pedido.codigo);
              });
      },
    enviaPedidos: function(){
        var deferred = $q.defer();

        var oPedidoDAO = new pedidoDAO();

        $.when(oPedidoDAO.findByNaoSincronizado()).done(function (dta) {
            pedidos = [];
            oFechamento = new fechamentoDAO();
            oPedidoProduto = new pedidoProdutoDAO();

            console.log("Numero de pedidos: " + dta.rows.length);
            console.log("Sincronizado " + dta.sincronizado);
            for (var i=0; i<dta.rows.length; i++){
                pedidos.push(dta.rows.item(i));
                pedidos[i].fechamento = [];
                pedidos[i].pedidoProduto = [];
            }

            //Grava detalhes do pedido
            $q.all(pedidos.map(function(pedido) {
                var def2 = $q.defer();
                var def3 = $q.defer();

                //Grava detalhe Fechamento
                $.when(oFechamento.findByPedidoCompleto(pedido)).done(function (data) {
                    try {
                        if (data.data.rows.length > 0) {
                            data.pedido.fechamento.push(data.data.rows.item(0));
                        }
                    }catch(err){
                        alert('erro ao buscar fechamento: '+err);
                    }
                    def2.resolve();
                }).fail(function erroEnd(err) {
                    deferred.reject('Erro Pedido: ' + err);
                    alert('Erro Pedido: ' + err);
                });

                //Grava detalhe PedidoProduto
                $.when(oPedidoProduto.findByPedidoCompleto(pedido)).done(function (dataProduto) {
                    try {
                        console.log('Buscando PedidoProduto');

                        var subPromises = [];

                        for (var k = 0; k < dataProduto.data.rows.length; k++) {
                            dataProduto.pedido.pedidoProduto.push(dataProduto.data.rows.item(k));
                            dataProduto.pedido.pedidoProduto[k].pedidoProdutoGrade = [];
                        };

                        //Grava sub-detalhe PedidoProdutoGrade
                        $q.all(dataProduto.pedido.pedidoProduto.map(function(pedidoProduto) {
                            var subDetalhe = $q.defer();
                            var oPedidoProdutoGradeDAO = new pedidoProdutoGradeDAO() ;

                            $.when(oPedidoProdutoGradeDAO.findByPedidoProdutoCompleto(pedidoProduto)).done(function (dtaSub) {
                                //alert('Tamanho sub: ' + dtaSub.rows.length);
                                for (var i=0; i<dtaSub.rows.length; i++){
                                    pedidoProduto.pedidoProdutoGrade.push(dtaSub.rows.item(i));
                                }

                                subDetalhe.resolve(pedidoProduto.pedidoProdutoGrade);

                            }).fail(function erro(err) {
                                subDetalhe.reject('Erro: ' + err);
                                alert('Erro: ' + err);
                            });

                            return subDetalhe.promise;

                        })).then(function(){
                            console.log('retorno sub detalhe');
                            def3.resolve();
                        }, function (err){
                            alert('Erro sub-detalhe: '+err);
                        });

                    }catch(err){
                        alert('erro ao buscar pedidoProduto: '+err);
                    }

                }).fail(function erroEnd(err) {
                    deferred.reject('Erro pedidoProduto: ' + err);
                    alert('Erro PedidoProduto: ' + err);
                });

                return $q.all([def2.promise, def3.promise]).then(function(){
                    console.log('retorno detalhes');

                });

            })).then(function(){
                console.log('retorno funcao');
                deferred.resolve(pedidos);
            }, function (err){
                alert('Erro: '+err);
            });

        }).fail(function erro(err) {
            deferred.reject('Erro: ' + err);
            alert('Erro: ' + err);
        });

        return deferred.promise;
    },
    allProduto: function(){
    	var deferred = $q.defer();
    	
    	var oProdutoDAO = new produtoDAO();
    	
    	produtos = [];
    	
    	$.when(oProdutoDAO.listAll(skipProdutos)).done(function (dta) {
            produtos = [];
        	for (var i=0; i<dta.rows.length; i++){
        		console.log('desc '+dta.rows.item(i).descricao)
				produtos.push(dta.rows.item(i));
        	}


            for(var i=0;i<produtos.length;i++){
                produtosTotal.push(produtos[i]);
            }

            //alert("allProduto Service | produtosTotal: "+produtosTotal.length+" "+produtos.length);
        	deferred.resolve(produtosTotal);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
    },
	allPrazo: function(){

    	var deferred = $q.defer();

    	var oPrazoDAO = new prazoDAO();


    	$.when(oPrazoDAO.listAll()).done(function (dta) {
        	prazos = [];
			for (var i=0; i<dta.rows.length; i++){
        		console.log('desc '+dta.rows.item(i).nome)
				prazos.push(dta.rows.item(i));
        	}
		
        	deferred.resolve(prazos);
			
    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
    },
	allPauta: function(){
		
    	var deferred = $q.defer();
    	
    	var oPautaDAO = new pautaDAO();

        pautas = [];
    	$.when(oPautaDAO.listAll()).done(function (dta) {
        	pautas = [];
			for (var i=0; i<dta.rows.length; i++){
        		console.log('desc '+dta.rows.item(i).nome)
				pautas.push(dta.rows.item(i));
        	}
		
        	deferred.resolve(pautas);
			
    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
    },
	allDescontoComissao: function(){
		
    	var deferred = $q.defer();
    	
    	var oDescontoComissaoDAO = new descontoComissaoDAO();


    	$.when(oDescontoComissaoDAO.listAll()).done(function (dta) {
        	descontosComissao = [];
			for (var i=0; i<dta.rows.length; i++){
        		console.log('desc '+dta.rows.item(i).nome)
				descontosComissao.push(dta.rows.item(i));
        	}
		
        	deferred.resolve(descontosComissao);
			
    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
    },
	

	allTipoCobranca: function(){
    	var deferred = $q.defer();
    	
    	var oTipoCobrancaDAO = new tabelaDAO(tipoCobranca);
    	
    	tiposCobranca = [];
    	
    	$.when(oTipoCobrancaDAO.listAll()).done(function (dta) {
        	tiposCobranca = [];
			for (var i=0; i<dta.rows.length; i++){
        		tiposCobranca.push(dta.rows.item(i));
        	}
		
        	deferred.resolve(tiposCobranca);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
    },
	
	allGradeProduto: function(idProduto){
		var deferred = $q.defer();
    	var oGradeNumeracaoDAO = new gradeNumeracaoDAO();
		
    	grade = [];
	
		$.when(oGradeNumeracaoDAO.findByProduto(idProduto)).done(function (dta) {
		//$.when(oGradeNumeracaoDAO.listAll()).done(function (dta) {
			for (var i=0; i<dta.rows.length; i++){
        		console.log('Grade ' + dta.rows.item(i).descricaoGrade);
				grade.push(dta.rows.item(i));
        	}
		
        	deferred.resolve(grade);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
	
	},
	
	allPedidoProduto: function(pedido){
		var deferred = $q.defer();
    	var oPedidoProdutoDAO = new pedidoProdutoDAO();
		
    	pedidoProduto = [];
	
		$.when(oPedidoProdutoDAO.findByPedido(pedido)).done(function (dta) {
		//$.when(oGradeNumeracaoDAO.listAll()).done(function (dta) {
			for (var i=0; i<dta.rows.length; i++){
        		console.log('pedidoProduto ' + dta.rows.item(i).id);
				pedidoProduto.push(dta.rows.item(i));
        	}
		
        	deferred.resolve(pedidoProduto);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
	
	},
	allPedidoProdutoGrade: function(pedidoProduto){
		//alert('allPedidoProduto: '+pedidoProduto);
		var deferred = $q.defer();
    	var oPedidoProdutoGradeDAO = new pedidoProdutoGradeDAO();
		
    	pedidoProdutoGrade = [];
	
		$.when(oPedidoProdutoGradeDAO.findByPedidoProduto(pedidoProduto)).done(function (dta) {
		//$.when(oGradeNumeracaoDAO.listAll()).done(function (dta) {
			for (var i=0; i<dta.rows.length; i++){
        		console.log('pedidoProdutoGrade ' + dta.rows.item(i).id);
				pedidoProdutoGrade.push(dta.rows.item(i));
        	}
		
        	deferred.resolve(pedidoProdutoGrade);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
	
	},
	
	allPedidoFechamento: function(pedido){
		//alert('entrou allPedidoFechamento');
		var deferred = $q.defer();
    	var oFechamentoDAO = new fechamentoDAO();
		
		$.when(oFechamentoDAO.findByPedido(pedido.codigoMobile)).done(function (dta) {
			fechamento = [];
			for (var i=0; i<dta.rows.length; i++){
				fechamento.push(dta.rows.item(i));
        	}
			//alert(JSON.stringify(fechamento));
        	deferred.resolve(fechamento);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
	
	},
    allGradeNumeracao: function(){
      var deferred = $q.defer();

      var oGradeNumeracaoDAO = new gradeNumeracaoDAO();

      grades = [];
      $.when(oGradeNumeracaoDAO.listAll()).done(function (dta) {
          for (var i=0; i<dta.rows.length; i++){
              console.log('desc '+dta.rows.item(i).usuario);
              grades.push(dta.rows.item(i));
          }

          deferred.resolve(grades);

      }).fail(function erro(err) {
          deferred.reject('Erro: ' + err);
          alert('Erro: ' + err);
      });

      return deferred.promise;
    },
    allLogin: function(){
    	var deferred = $q.defer();
    	
    	var oLoginDAO = new loginDAO();
    	
    	logins = [];
    	$.when(oLoginDAO.listAll()).done(function (dta) {
        	for (var i=0; i<dta.rows.length; i++){
        		console.log('desc '+dta.rows.item(i).usuario);
				logins.push(dta.rows.item(i));
        	}
		
        	deferred.resolve(logins);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
    },
	userLogin: function(usuario, senha){
    	var deferred = $q.defer();
    	
    	var oLoginDAO = new loginDAO();
    	
    	login = {};
    	$.when(oLoginDAO.findByUser(usuario, senha)).done(function (dta) {
        	for (var i=0; i<dta.rows.length; i++){
        		console.log('desc '+dta.rows.item(i).usuario);
				login = dta.rows.item(i);
        	}
		
        	deferred.resolve(login);

    		}).fail(function erro(err) {
        		deferred.reject('Erro: ' + err);
        		alert('Erro: ' + err);
            });
        
        return deferred.promise;
    },
    userLoginId: function(id){
        var deferred = $q.defer();

        var oLoginDAO = new loginDAO();

        login = {};
        $.when(oLoginDAO.findById(id)).done(function (dta) {
            for (var i=0; i<dta.rows.length; i++){
            console.log('desc '+dta.rows.item(i).usuario);
            login = dta.rows.item(i);
        }

        deferred.resolve(login);

        }).fail(function erro(err) {
            deferred.reject('Erro: ' + err);
            alert('Erro: ' + err);
        });

        return deferred.promise;
    },
    getClienteById: function(id){
        var deferred = $q.defer();

        var oPessoaDAO = new pessoaDAO();

        pessoa = {};
        $.when(oPessoaDAO.findById(id)).done(function (dta) {
            for (var i=0; i<dta.rows.length; i++){
                pessoa = dta.rows.item(i);
            }

            deferred.resolve(pessoa);

        }).fail(function erro(err) {
            deferred.reject('Erro: ' + err);
            alert('Erro: ' + err);
        });

        return deferred.promise;
    },
    getProdutoById: function(id){
      var deferred = $q.defer();

      var oProdutoDAO = new produtoDAO();

      produto = {};
      $.when(oProdutoDAO.findById(id)).done(function (dta) {
          for (var i=0; i<dta.rows.length; i++){
              produto = dta.rows.item(i);
          }

          deferred.resolve(produto);

      }).fail(function erro(err) {
          deferred.reject('Erro: ' + err);
          alert('Erro: ' + err);
      });

      return deferred.promise;
    },
    getGradeById: function(id){
      var deferred = $q.defer();

      var oGradeDAO = new gradeDAO();

      grade = {};
      $.when(oGradeDAO.findById(id)).done(function (dta) {
          for (var i=0; i<dta.rows.length; i++){
              grade = dta.rows.item(i);
          }

          deferred.resolve(grade);

      }).fail(function erro(err) {
          deferred.reject('Erro: ' + err);
          alert('Erro: ' + err);
      });

      return deferred.promise;
    },

	getPedido: function(indexPedido) {
		// Simple index lookup
		return pedidos[indexPedido];
    },
	getCliente: function(indexCliente) {
		console.log('Entrou getCliente');
		//console.log(JSON.stringify(clientesTotal[0]));
		console.log(indexCliente);

        console.log(clientesTotal.length);
        for(var i=0;i<clientesTotal.length;i++){
            if(clientesTotal[i].id == indexCliente){
                return clientesTotal[i];
            }
        }
        //return clientesTotal[indexCliente];

    },
	getProduto: function(indexProduto) {
		console.log('Entrou getProduto');
		// Simple index lookup
		console.log(JSON.stringify(produtos[0]));
		console.log(indexProduto);
		return produtos[indexProduto];
    }



  }
	  
});







