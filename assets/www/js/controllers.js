angular.module('starter.controllers', [])


.controller('PedidosCtrl', function($scope, $stateParams, $ionicScrollDelegate, $ionicPopup, Clientes) {
	$scope.showDetalhes = false;
	$scope.showPedidos = true;
	$scope.btnVoltar = false;
	$scope.prazos = [];


	//Recupera lista de Pedidos
	Clientes.allPedido().then(function(result) {
		$scope.pedidos = result.reverse();
        angular.forEach($scope.pedidos, function(pedido, key){
            Clientes.getClienteById(pedido.cliente).then(function(result){
                $scope.pedidos[key].objCliente = result;
            }, function(error){
                console.log('Erro: ',error)
            });
        });
    }, function(error) {
    	console.log ('error', error);
    });

	$scope.recarregaPedidos = function(){
		Clientes.allPedido().then(function(result) {
			$scope.pedidos = result.reverse();
            angular.forEach($scope.pedidos, function(pedido, key){
                Clientes.getClienteById(pedido.cliente).then(function(result){
                    $scope.pedidos[key].objCliente = result;
                }, function(error){
                    console.log('Erro: ',error)
                });
            });
		}, function(error) {
			console.log ('error', error);
		});
	}

	
	//Recupera lista de Produtos
    /*
	Clientes.allProduto().then(function(result) {	
		$scope.produtos = result;
    }, function(error) {
    	console.log ('error', error);
    });	
	*/
	//Recupera lista de Tipos de cobrança
	Clientes.allTipoCobranca().then(function(result) {
		$scope.tiposCobranca = result;
	}, function(error) {
		console.log ('error', error);
	});
	
	//Recupera lista de Prazos
	Clientes.allPrazo().then(function(result) {
		$scope.prazos = [];
		$scope.prazos = result;
    }, function(error) {
    	console.log ('error', error);
    });
	
	//Recupera lista de Pautas
	Clientes.allPauta().then(function(result) {
		$scope.pautas = [];
		$scope.pautas = result;
    }, function(error) {
    	console.log ('error', error);
    });
	
	//Recupera descontos / comissao
	Clientes.allDescontoComissao().then(function(result) {
		$scope.descontosComissao = [];
		$scope.descontosComissao = result;
    }, function(error) {
    	console.log ('error', error);
    });


    $scope.setTipoCobrancaSelect = function(){
        tipoCobrancaSelect = $scope.pedido.fechamento.tipoCobranca.nome;
        j('.require-tipoCobranca').hide();
    }
	//Busca desconto limite
	$scope.recuperaDescontoLimite = function(){
        prazoSelect = $scope.pedido.prazoSelecionado;
        j('.require-prazo').hide();
		angular.forEach($scope.prazos, function(prazo, key){
            //alert($scope.pedido.prazoSelecionado+' | '+prazo.nome);
			if($scope.pedido.prazoSelecionado == prazo.nome){
				$scope.prazo = prazo;
				$scope.descontoLimite = prazo.desconto;
                descontoLimite = prazo.desconto;
				
				$scope.descontoComissao = [];
				angular.forEach($scope.descontosComissao, function(dc, key){
					if(dc.prazo == prazo.id){
						$scope.descontoComissao.push(dc);
					}
				});
			}
			
		});
	}

	$scope.voltarPedidos = function(){
		$scope.showDetalhes = false;
		$scope.showPedidos = true;
		$scope.btnVoltar = false;
	};	

	
	//Novo Pedido------------------------------------------------------------------------------
	
	$scope.ngNovoPedido = function(){	
		$scope.pedido={};
		$scope.tipoCobranca={};
		$scope.searchCliente = '';

	}
	
	//Tela de Fechamento (Detalhes do Pedido)

	$scope.verificaPrazo = function(){
        //alert($scope.pedido.prazoSelecionado);
		if(typeof($scope.pedido.prazoSelecionado) == 'undefined'){
			return true;
		}else pedidoObj.fechamento.prazo.nome = $scope.pedido.prazoSelecionado;
	}

    $scope.buscaVendedor = function () {
        Clientes.userLoginId(idVendedor).then(function(result) {
            $scope.vendedor = result;
            permitePauta = $scope.vendedor.permitePauta;
            //alert(JSON.stringify($scope.vendedor));
            return;
        }, function(error) {
            console.log ('error', error);
        });
    }

    $scope.vrificaPauta = function(){
        Clientes.userLoginId(idVendedor).then(function(result) {
            $scope.vendedor = result;
            return;
        }, function(error) {
            console.log ('error', error);
        });
    }

	var codMobile = 0;
	//Resumo do pedido usa $scope.pedido	
	$scope.pedido = pedidoObj;
	
	//Gravar Pedido
	$scope.gravaPedidoMobile = function(){


		//Tipo de Cobrança
		angular.forEach($scope.tiposCobranca, function(tipoCobranca, key) {
			if(tipoCobranca.nome == $scope.pedido.fechamento.tipoCobranca.nome){
				pedidoObj.fechamento.tipoCobranca.id = tipoCobranca.id;	
				return;
			}
			pedidoObj.fechamento.tipoCobranca.id = null;
		});

		//Desconto / Comissão
		console.log($scope.pedido.fechamento.descontoComissao.nome);
		angular.forEach($scope.descontosComissao, function(dc, key) {
			if(dc.desconto+'% / '+dc.comissao+'%' == $scope.pedido.fechamento.descontoComissao.nome){
				pedidoObj.fechamento.descontoComissao.id = dc.id;	
				return;
			}
			//pedidoObj.fechamento.descontoComissao.id = null;
		});


        //Pauta
        angular.forEach($scope.pautas, function(pauta, key) {
            //alert(pauta.descricao+" "+pedidoObj.fechamento.pauta.nome);
            if(pauta.descricao == pedidoObj.fechamento.pauta.nome){
                pedidoObj.fechamento.pauta.id = pauta.id;
                return;
            }
        });
		
		//Prazo
		angular.forEach($scope.prazos, function(prazo, key) {
			//alert(prazo.nome+" "+pedidoObj.fechamento.prazo.nome);
			if(prazo.nome == pedidoObj.fechamento.prazo.nome){
				pedidoObj.fechamento.prazo.id = prazo.id;	
				return;
			}
		});
		
		//Valida Prazo
		if(typeof(pedidoObj.fechamento.prazo.id) == 'undefined'){
			pedidoObj.fechamento.prazo.id = null;
			//alert('Prazo é obrigatório');
			//return;
		}
		
		Clientes.allPedido().then(function(result) {
			
			$scope.pedidos = result.reverse();
			if ($scope.pedidos == ''){
				var codMobile =  1;
			}else{
				var codMobile =  $scope.pedidos[0].codigoMobile+1;
			}

            var data = new Date();


			pedidoObj.codigoMobile = codMobile;
			pedidoObj.fechamento.codigoMobile = codMobile;
            pedidoObj.codigo = data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+'-'+idVendedor+'M'+codMobile;
			pedidoObj.vendedor = idVendedor;

			oPedidoDao = new pedidoDAO();
			oPedidoDao.insertPedido(pedidoObj);
			
			oFechamentoDao = new fechamentoDAO();
			oFechamentoDao.insertFechamento(pedidoObj.fechamento);
			
			//remove produtos selecionados
			angular.forEach($scope.produtos, function(produto, key){
					produto.checked = false;
			});


		}, function(error) {
			console.log ('error', error);
		});


        window.location = "#/tab/pedidos"



	}
	
	$scope.scrollTop = function() {
		$ionicScrollDelegate.scrollTop();
	};

    //Alerts
    $scope.alertSelecionarPrazo = function(){
        var alertPopup = $ionicPopup.alert({
            title: 'Escolha pelo menos um Produto'
        });
    }
	
})
.controller('PedidoDetalheCtrl', function($scope, $stateParams, Clientes) {
	$scope.pedido = Clientes.getPedido($stateParams.indexPedido);
	console.log(JSON.stringify($scope.pedido));

	//Recupera Cliente
    Clientes.getClienteById($scope.pedido.cliente).then(function(result){
        $scope.pedido.objCliente = result;
    }, function(error){
        console.log('Erro: ',error)
    });

    $scope.carregaGrade = function(idProduto){
        Clientes.allGradeProduto(idProduto).then(function(result) {
            $scope.grades = result;
        }, function(error) {
            console.log ('error', error);
        });

    }

	//Recupera lista de Produtos
    /*
	Clientes.allProduto().then(function(result) {	
		$scope.produtos = [];
		$scope.produtos = result;
    }, function(error) {
    	console.log ('error', error);
    });
    */


	
	_detalhesPedido($scope.pedido);

	//Recupera detalhes de Pedidos
	function _detalhesPedido(pedido){
		console.log('entrou detalhesPedido');
		Clientes.allPedidoFechamento(pedido).then(function(result) {
            console.log(JSON.stringify(pedido));
            $scope.fechamento = [];
            $scope.fechamento = result[0];
            console.log('fechamento: ' + JSON.stringify($scope.fechamento));

            //Recupera tipo de cobrança
            Clientes.allTipoCobranca().then(function (result) {
                $scope.tiposCobranca = result;
                angular.forEach($scope.tiposCobranca, function (tc, key) {
                    if ($scope.fechamento.tipoCobranca == tc.id) {
                        $scope.fechamento.tipoCobrancaNome = tc.nome;
                    }
                });
            }, function (error) {
                console.log('error', error);
            });

            //Recupera Prazo
            Clientes.allPrazo().then(function (result) {
                $scope.prazos = [];
                $scope.prazos = result;
                angular.forEach($scope.prazos, function (prazo, key) {
                    if ($scope.fechamento.prazo == prazo.id) {
                        $scope.fechamento.prazoNome = prazo.nome;
                    }
                });
            }, function (error) {
                console.log('error', error);
            });

            //Recupera descontos / comissao
            Clientes.allDescontoComissao().then(function (result) {
                $scope.descontosComissao = [];
                $scope.descontosComissao = result;
                angular.forEach(descontosComissao, function(dc, key){
                    if(dc.id == $scope.fechamento.descontoComissao){
                        $scope.fechamento.descontoComissaoNome = dc.desconto+"% / "+dc.comissao+"%";
                    }

                });

            }, function (error) {
                console.log('error', error);
            });

            //Recupera lista de Pautas
            Clientes.allPauta().then(function (result) {
                $scope.pautas = [];
                $scope.pautas = result;
                angular.forEach($scope.pautas, function(pauta,key){
                    if(pauta.id == $scope.fechamento.pauta){
                        $scope.fechamento.pautaNome = pauta.descricao;
                    }
                });
            }, function (error) {
                console.log('error', error);
            });
        });
		Clientes.allPedidoProduto(pedido).then(function(result) {
			$scope.pedidoProdutos = [];
			$scope.pedidoProdutos = result;
			console.log('pedidoproduto: '+JSON.stringify($scope.pedidoProdutos));
			$scope.pedidoProdutosGrade = [];
            $scope.grades = [];
            Clientes.allGradeNumeracao().then(function(result) {
                $scope.grades = [];
                $scope.grades = result;
            }, function(error) {
                console.log ('error', error);
            });
			angular.forEach($scope.pedidoProdutos, function(produto, key) {




				Clientes.allPedidoProdutoGrade(produto.id).then(function(result) {
					$scope.pedidoProdutosGrade.push(result);
				}, function(error) {
					console.log ('error', error);
				});
			});
		}, function(error) {
			console.log ('error', error);
		});

	};

})

//Clientes Controller----------------------------------------------------------------------
.controller('ClientesCtrl', function($scope, $http, $ionicScrollDelegate, $ionicPopup, $stateParams, Clientes) {
        var indexClientes = 0;
        $scope.clientes = [];
        $scope.searchCliente = {};

        for (var member in $scope.clientes) delete $scope.clientes[member];
        $scope.noMoreItemsAvailable = false;

        $scope.loadMore = function() {

            //alert("Load More : "+skipClientes);
            if(loadMoreVal) {
                $scope.carregaClientes();
                loadMoreVal = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        };

        $scope.carregaClientes = function(){
            $scope.noMoreItemsAvailable = false;
            if(isEmpty($scope.searchCliente.search)){
                console.log('Carrega mais sem consulta');
                //alert("skip: "+skipClientes);
                Clientes.all().then(function(result) {
                    $scope.clientes=[];
                    $scope.clientes=result;
                    skipClientes+=10;
                    loadMoreVal = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function(error) {
                    console.log ('error', error);
                });
            }else{
               console.log('Carrega mais com consulta');
               $scope.clientes = [];
               $scope.searchClientes($scope.searchCliente.search);
            }
        }

        $scope.searchClientes = function(consulta){
            Clientes.allClientesSearch(consulta).then(function(result) {
                console.log(JSON.stringify(result));
                $scope.clientes=result;
                $scope.noMoreItemsAvailable = true;
            }, function(error) {
                console.log ('error', error);
            });
        }

        $scope.scrollTop = function() {
           $ionicScrollDelegate.scrollTop();

        };

        $scope.limparSearchCliente = function(){
            $scope.search = '';
        }


        $scope.cancelar = function(){
            j('li').removeClass('marked');
        };



        //$scope.index = 0;
        $scope.title = 'Clientes';
        $scope.showDetalhes = false;
        $scope.showClientes = true;
        $scope.btnVoltar = false;

        $scope.indexCliente = function(idCliente){
            $scope.showDetalhes = true;
            $scope.showClientes = false;
            $scope.btnVoltar = true;

            angular.forEach($scope.clientes, function(cliente, key) {
                if(cliente.id == idCliente){
                    $scope.cliente = cliente;
                    return;
                }
            });

        }


        //ng-click Cliente
        $scope.pedidoCliente = function(idCliente, nomeCliente){
            pedidoObj.cliente = {};
            pedidoObj.cliente.id = idCliente;
            pedidoObj.cliente.nomeRazao = nomeCliente;
        }
        $scope.markIt = function(cliente,$scope){
            cliente.checked = !cliente.checked;
        }
        $scope.escondeLista = function(){
            setTimeout(function(){
                if(j('li').hasClass('marked')){
                    j('.item.cliente').hide();
                    j('.item.marked').show();
                    $scope.noMoreItemsAvailable = true;
                }
                else{
                    j('li').show(100);
                    $scope.noMoreItemsAvailable = false;
                }
                //alert($scope.noMoreItemsAvailable);
            }, 50);
        }
        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };

        $scope.voltarClientes = function(){
            $scope.showDetalhes = false;
            $scope.showClientes = true;
            $scope.btnVoltar = false;
        }

        //Remove cliente selecionado
        $scope.removerClientes = function(){
            angular.forEach($scope.clientes, function(cliente, key){
                cliente.checked = false;
            });
        }

        //Alerts
        $scope.alertSelecionarCliente = function(){
            var alertPopup = $ionicPopup.alert({
                title: 'Escolha um cliente'
            });
        }

        $scope.showListaClientes = true;

})

.controller('ClienteDetalheCtrl', function($scope, $stateParams, Clientes) {

        Clientes.getClienteById($stateParams.indexCliente).then(function(result) {
            $scope.cliente=result;
        }, function(error) {
            console.log ('error', error);
        });


        $scope.salvaCliente = function(cliente){
            pedidoObj.cliente = {};
            pedidoObj.cliente.id = cliente.id;
            pedidoObj.cliente.nomeRazao = cliente.nomeRazao;
        }

})

//Produtos Controller----------------------------------------------------------------------
.controller('ProdutosCtrl', function($scope, $ionicScrollDelegate, $ionicPopup, Clientes) {

        $scope.produtos = [];
        $scope.produtosSelecionados = [];
        $scope.searchProduto = {};

        $scope.limparSearchProduto = function(){
            $scope.search = '';
        }
        $scope.limparProdutos = function(){
            angular.forEach($scope.produtos, function(produto, key){
                produto.checked = false;
            });
        }

        //for (var member in $scope.produtos) delete $scope.produtos[member];

        $scope.noMoreItemsAvailable = false;

        $scope.loadMore = function() {

            if(loadMoreVal) {
                //alert("Load More : "+skipProdutos);
                $scope.carregaProdutos();
                loadMoreVal = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        };

        $scope.carregaProdutos = function(){
            $scope.noMoreItemsAvailable = false;
            if(isEmpty($scope.searchProduto.search)) {
                //alert("skip: "+skipProdutos);
                Clientes.allProduto().then(function (result) {
                    $scope.produtos = [];
                    $scope.produtos = result;
                    skipProdutos += 10;
                    loadMoreVal = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function (error) {
                    console.log('error', error);
                });
            }else{
                console.log('Buscar produtos');
                $scope.produtos = [];
                $scope.searchProdutos($scope.searchProduto.search);

            }
        }

        $scope.searchProdutos = function(consulta){
            Clientes.allProdutosSearch(consulta).then(function(result) {
                console.log(JSON.stringify(result));
                $scope.produtos=result;
                $scope.noMoreItemsAvailable = true;
            }, function(error) {
                console.log ('error', error);
            });
        }



        $scope.title = 'Produtos';
        $scope.showDetalhes = false;
        $scope.showProdutos = true;
        $scope.btnVoltar = false;
        //pedidoObj.pedidoProduto = new Array();
        //indexProduto = 0;
        idProduto = 0;
        $scope.qtdGrade = [];

        $scope.clearInputs = function(){
            angular.forEach($scope.qtdGrade, function(valor, key){
                $scope.qtdGrade[key]='';
            });
        }

        //Novo Pedido: ng-click Produto
        $scope.pedidoProduto = function(id, nome, codMobile, valor, checked){
            if(checked == true){return}
            valorUnitario = valor;
            idProduto = id;
            nomeProduto = nome;
            j('#grade-produto').show();
            j('#limpar-grades').click();
            j('.btn-voltar').hide();
            j('.btn-proximo').hide();
            j('.btn-ok').show();
            j('.btn-cancelar-produto').show();
        }
        $scope.markIt = function(produto,$scope){
            if(produto.checked == true){return}
            produto.checked = !produto.checked;
        }



        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };

        //botão 'OK', adiciona grades ao objeto json
        $scope.pedidoProdutoGrade = function(grades){
            pedidoObj.pedidoProduto[indexProduto] = {};
            pedidoObj.pedidoProduto[indexProduto].id = idProduto;
            pedidoObj.pedidoProduto[indexProduto].produto = idProduto;
            pedidoObj.pedidoProduto[indexProduto].descricao = nomeProduto;
            pedidoObj.pedidoProduto[indexProduto].valorUnitario = valorUnitario;

            pedidoObj.pedidoProduto[indexProduto].pedidoProdutoGrade = new Array();

            //console.log(JSON.stringify(grades));

            var soma = 0;

            for (var i = 0; i < grades.length; i++){

                pedidoObj.pedidoProduto[indexProduto].pedidoProdutoGrade[i] = {};
                pedidoObj.pedidoProduto[indexProduto].pedidoProdutoGrade[i].id = grades[i].id;
                pedidoObj.pedidoProduto[indexProduto].pedidoProdutoGrade[i].descricaoGrade = grades[i].descricaoGrade;
                pedidoObj.pedidoProduto[indexProduto].pedidoProdutoGrade[i].gradeNumeracao = grades[i].numeracao;

                pedidoObj.pedidoProduto[indexProduto].pedidoProdutoGrade[i].quantidade = $scope.qtdGrade[i];

                if(isNaN($scope.qtdGrade[i])){
                    pedidoObj.pedidoProduto[indexProduto].pedidoProdutoGrade[i].quantidade = 0;
                }

                //soma de todas as grades para cada produto

                soma = soma + pedidoObj.pedidoProduto[indexProduto].pedidoProdutoGrade[i].quantidade;

                $scope.qtdGrade[i] = '';
            }
            pedidoObj.pedidoProduto[indexProduto].quantidade = soma;
            indexProduto++;

            $scope.scrollTop = function() {
                $ionicScrollDelegate.scrollTop();
            };


        }
        $scope.pedidoProdutoGradeCancelar = function(){
            angular.forEach($scope.produtos, function(produto, key){
                if(produto.id == idProduto){
                    produto.checked = false;
                }
            });
        }
        // Excluir produto
        $scope.showConfirm = function(title, text, produto) {
            var confirmPopup = $ionicPopup.confirm({
                title: title,
                template: text
            });
            confirmPopup.then(function(res) {
                if(res) {
                    for(var i=0;i<pedidoObj.pedidoProduto.length;i++){
                        if(pedidoObj.pedidoProduto[i].id == produto.id){
                            pedidoObj.pedidoProduto.splice(i,1);
                            indexProduto = indexProduto-1;
                        }
                    }
                    produto.checked = !produto.checked;
                } else {
                    console.log('Não excluir produto');
                }
            });
        };

        //cancelar pedido
        $scope.cancelar = function(){
            angular.forEach($scope.produtos, function(produto, key){
                    produto.checked = false;
            });
        }

        //Alerts
        $scope.alertSelecionarProduto = function(){
            var alertPopup = $ionicPopup.alert({
                title: 'Escolha pelo menos um Produto'
            });
        }


        /*Clientes.allProduto().then(function(result) {
            $scope.produtos = [];
            $scope.produtos = result;
        }, function(error) {
            console.log ('error', error);
        });
        */
        $scope.carregaGrade = function(idProduto){
            Clientes.allGradeProduto(idProduto).then(function(result) {
                $scope.grades = result;
            }, function(error) {
                console.log ('error', error);
            });

        }





        $scope.detalhesProduto = function(idProduto){
            $scope.showDetalhes = true;
            $scope.showProdutos = false;
            $scope.btnVoltar = true;


            angular.forEach($scope.produtos, function(produto, key) {
                if(produto.id == idProduto){
                    $scope.produto = produto;
                    return;
                }
            });

        };
        $scope.voltarProdutos = function(){
            $scope.showDetalhes = false;
            $scope.showProdutos = true;
            $scope.btnVoltar = false;
        };
	
	

	
	
})

.controller('ProdutoDetalheCtrl', function($scope, $stateParams, Clientes) {
	    //$scope.produto = Clientes.getProdutoById($stateParams.indexProduto);
        Clientes.getProdutoById($stateParams.indexProduto).then(function(result) {
            $scope.produto=result;
        }, function(error) {
            console.log ('error', error);
        });
})	

	


//Sincronismo Controller----------------------------------------------------------------------
.controller('SincronismoCtrl', function($scope, $stateParams, $ionicPopup, Clientes) {
	var data=new Date();
	$scope.dia=data.getDate();
	$scope.mes=data.getMonth();
	$scope.ano=data.getFullYear();
	data = $scope.dia + '/' + ($scope.mes++) + '/' + $scope.ano;
	$scope.dataAtual = data;

	$scope.selecionaData = function(){		
		//j( "#datepicker" ).datepicker(); 
	};

        $scope.enviar = function() {
            if (checkConnection()) {
                Clientes.enviaPedidos().then(function (result) {
                    if (result != null) {
                        if (result.length > 0) {
                            var numPedidosSincronizados = 0;
                            var numPedidos = result.length;
                            result.map(function (pedido) {
                                var cPedido = {};
                                cPedido.pedido = (JSON.parse(JSON.stringify(pedido)));

                                delete cPedido.pedido.id;
                                delete cPedido.pedido.codigoMobile;
                                delete cPedido.pedido.sincronizado;

                                cPedido.pedido.cliente = {};
                                cPedido.pedido.cliente.id = pedido.cliente;

                                cPedido.pedido.vendedor = {};
                                cPedido.pedido.vendedor.id = pedido.vendedor;

                                if (cPedido.pedido.vendedor.id == null) {
                                    cPedido.pedido.vendedor.id = 7;
                                }

                                if (cPedido.pedido.status != null) {
                                    cPedido.pedido.status = {};
                                    cPedido.pedido.status.id = pedido.status.toUpperCase();
                                } else {
                                    delete cPedido.pedido.status;
                                }

                                cPedido.pedido.dataPedido = cPedido.pedido.dataPedido + " 00:00:00";

                                if (cPedido.pedido.fechamento != null) {
                                    delete cPedido.pedido.fechamento[0].id;
                                    delete cPedido.pedido.fechamento[0].pedido;

                                    if (cPedido.pedido.fechamento[0].tipoCobranca != null) {
                                        cPedido.pedido.fechamento[0].tipoCobranca = {};
                                        cPedido.pedido.fechamento[0].tipoCobranca.id = pedido.fechamento[0].tipoCobranca;
                                    } else {
                                        delete cPedido.pedido.fechamento[0].tipoCobranca;
                                    }

                                    if (cPedido.pedido.fechamento[0].entrega == null) {
                                        delete cPedido.pedido.fechamento[0].entrega;
                                    }
                                    if (cPedido.pedido.fechamento[0].observacoes == null) {
                                        delete cPedido.pedido.fechamento[0].observacoes;
                                    }
                                    if (cPedido.pedido.fechamento[0].prazo != null) {
                                        cPedido.pedido.fechamento[0].prazo = {};
                                        cPedido.pedido.fechamento[0].prazo.id = pedido.fechamento[0].prazo;
                                    } else {
                                        delete cPedido.pedido.fechamento[0].prazo;
                                    }
                                    if (cPedido.pedido.fechamento[0].desconto == null) {
                                        delete cPedido.pedido.fechamento[0].desconto;
                                    }
                                    if (cPedido.pedido.fechamento[0].pauta != null) {
                                        cPedido.pedido.fechamento[0].pauta = {};
                                        cPedido.pedido.fechamento[0].pauta.id = pedido.fechamento[0].pauta;
                                    } else {
                                        delete cPedido.pedido.fechamento[0].pauta;
                                    }

                                    if (cPedido.pedido.fechamento[0].descontoComissao != null) {
                                        cPedido.pedido.fechamento[0].descontoComissao = {};
                                        cPedido.pedido.fechamento[0].descontoComissao.id = pedido.fechamento[0].descontoComissao;
                                    } else {
                                        delete cPedido.pedido.fechamento[0].descontoComissao;
                                    }
                                    //acerta JSON pedidoProduto
                                    if (cPedido.pedido.pedidoProduto != null) {
                                        for (i = 0; i < cPedido.pedido.pedidoProduto.length; i++) {
                                            delete cPedido.pedido.pedidoProduto[i].id;
                                            delete cPedido.pedido.pedidoProduto[i].pedido;

                                            if (cPedido.pedido.pedidoProduto[i].produto != null) {
                                                cPedido.pedido.pedidoProduto[i].produto = {};
                                                cPedido.pedido.pedidoProduto[i].produto.id = pedido.pedidoProduto[i].produto;
                                            } else {
                                                delete cPedido.pedido.pedidoProduto.produto;
                                            }
                                            //Ajusta JSON PedidoProdutoGrade
                                            if (cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade != null) {
                                                for (j = 0; j < cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade.length; j++) {
                                                    delete cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade[j].id;
                                                    delete cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade[j].pedido;
                                                    delete cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade[j].pedidoProduto;

                                                    if (cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade[j].gradeNumeracao != null) {
                                                        cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade[j].gradeNumeracao = {};
                                                        cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade[j].gradeNumeracao.id = pedido.pedidoProduto[i].pedidoProdutoGrade[j].gradeNumeracao;
                                                    } else {
                                                        cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade[j].gradeNumeracao;
                                                    }
                                                }
                                            }
                                            //delete cPedido.pedido.pedidoProduto[i].pedidoProdutoGrade;
                                        }
                                    }
                                }
                                console.log("Pedido: " + JSON.stringify(cPedido));
                                Clientes.sincronizaPedidos(cPedido).then(function (result) {
                                    numPedidosSincronizados = numPedidosSincronizados + 1;
                                    if (numPedidosSincronizados == numPedidos){
                                        alert('Pedidos sincronizados com sucesso.');
                                    }
                                }, function (errorSend) {
                                    console.log('Erro no envio ', errorSend);
                                });
                            });

                        }else{
                            alert("Nao existem pedidos a serem enviados.");
                        }
                    }else{
                        alert("Nao existem pedidos a serem enviados.");
                    }
                }, function (error) {
                    console.log('error', error);
                });
            } else {
                console.log('Envio Cancelado');
            }
        };
	
	
	$scope.x=0;
	totalProdutos = 0;
	totalClientes = 0;

	
	$scope.sincronizar = function(){

        var confirmPopup = $ionicPopup.confirm({
            title: 'Sincronizar',
            template: 'Dependendo da sua conexão o sincronismo pode demorar alguns minutos. Deseja sincronizar agora?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                if(checkConnection()){
                    $scope.btnSincronizar = true;
                    atualizaDados();
                }else alert('Sem conexão com a internet');
            } else {
                console.log('Sincronismo Cancelado');
            }
        });
	}
		
	$scope.atualizaLoader = function(){
		if(totalClientes!=0){
			$scope.perClientes = percentClientes.toFixed(1);
			$scope.btnSincronizar = true;
		}
		if(totalProdutos!=0){
			$scope.perProdutos = percentProdutos.toFixed(1);
			$scope.btnSincronizar = true;
		}
		
		if(percentProdutos.toFixed(0) == 100 && percentClientes.toFixed(0) == 100){
			$scope.btnSincronizar = false;
			j('.atualizando-registros').show();
			//location.reload();
		}
		
	}
	
	
	

})


//Login Controller----------------------------------------------------------------------
.controller('LoginCtrl', function($scope, $stateParams, $ionicHistory, Clientes) {

    $scope.limparHistorico = function() {
        $ionicHistory.clearHistory();
    }

	$scope.validaLoginLocal = function(user, pass){
		//alert('Entrou validaLoginLocal');
		Clientes.userLogin(user, pass).then(function(result) {
			$scope.dadosLogin = result;
			if(!isEmpty($scope.dadosLogin)){
                idVendedor = $scope.dadosLogin.id;
				//Testa validade do token local
				if(validaToken($scope.dadosLogin.token)){
					//alert('Login Success!')
					loginSuccess();
				}else{
					if(!checkConnection()){
						alert('Seu Token expirou! Conecte seu dispositivo a internet e faça login novamente para atualizar o Token');
					}
					if(checkConnection()){
						//alert('Conectado');
						$scope.validaLoginServer(user, pass);
					}
					
				}
				
			}
			if(isEmpty($scope.dadosLogin)){
				//alert('Login Local Erro');
				if(checkConnection()){
					$scope.validaLoginServer(user, pass);
				}else{
					alert('Conecte seu dispositivo a internet para fazer o primeiro login');
				}
			}
		}, function(error) {
			console.log ('error', error);
		});
	}
	
	$scope.validaLoginServer = function(user, pass){
		//alert('Entrou validaLoginServer');
		//alert(user + " " + pass);
		var url = "http://pedidoweb.getconsultoria.com.br/pedidoweb/soa/autenticacao?login="+user+"&senha="+pass;
		getToken(url,user,pass);
	}

	//Lista de logins
	/*
	Clientes.allLogin().then(function(result) {
		$scope.logins = result;
    }, function(error) {
    	console.log ('error', error);
    });
	*/

});






