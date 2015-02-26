// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    var serviceModule = angular.module('starter.services', []);
  });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$ionicConfigProvider.tabs.position('bottom');

	
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

	.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
	})

    .state('pedido', {
      url: "/pedido",
      abstract: true
    })


    .state('pedido-cliente', {
      url: '/pedido-cliente',
      templateUrl: 'templates/pedido-cliente.html',
      controller: 'ClientesCtrl'
    })
    .state('pedido-produto', {
      url: '/pedido-produto',
      templateUrl: 'templates/pedido-produto.html',
      controller: 'ProdutosCtrl'
    })
    .state('pedido-fechamento', {
      url: '/pedido-fechamento',
      templateUrl: 'templates/pedido-fechamento.html',
      controller: 'PedidosCtrl'
    })
    .state('pedido-resumo', {
      url: '/pedido-resumo',
      templateUrl: 'templates/pedido-resumo.html',
      controller: 'PedidosCtrl'
    })


	
	// setup an abstract state for the tabs directive
	.state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })


	

    // Each tab has its own nav history stack:

    .state('tab.pedidos', {
      url: '/pedidos',
      views: {
        'tab-pedidos': {
          templateUrl: 'templates/tab-pedidos.html',
          controller: 'PedidosCtrl'
        }
      }
    })
	.state('tab.pedido-detalhe', {
      url: '/pedido/:indexPedido',
      views: {
        'tab-pedidos': {
          templateUrl: 'templates/pedido-detalhe.html',
          controller: 'PedidoDetalheCtrl'
        }
      }
    })

    .state('tab.clientes', {
      url: '/clientes',
      views: {
        'tab-clientes': {
          templateUrl: 'templates/tab-clientes.html',
          controller: 'ClientesCtrl'
        }
      }
    })
	.state('tab.cliente-detalhe', {
      url: '/cliente/:indexCliente',
      views: {
        'tab-clientes': {
          templateUrl: 'templates/cliente-detalhe.html',
          controller: 'ClienteDetalheCtrl'
        }
      }
    })

	
    .state('tab.produtos', {
      url: '/produtos',
      views: {
        'tab-produtos': {
          templateUrl: 'templates/tab-produtos.html',
          controller: 'ProdutosCtrl'
        }
      }
    })
	.state('tab.produto-detalhe', {
      url: '/produto/:indexProduto',
      views: {
        'tab-produtos': {
          templateUrl: 'templates/produto-detalhe.html',
          controller: 'ProdutoDetalheCtrl'
        }
      }
    })


	
    .state('tab.sincronismo', {
      url: '/sincronismo',
      views: {
        'tab-sincronismo': {
          templateUrl: 'templates/tab-sincronismo.html',
          controller: 'SincronismoCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  //Tela Inicial
  $urlRouterProvider.otherwise('/login');
  //$urlRouterProvider.otherwise('/tab/pedidos');

});

//--------------------------------------------------------------------------------------
	j = jQuery;
	
	var pedidoObj = {};
    var idVendedor = null;


	function isEmpty(obj) {
		if (obj == null) return true;
		if (obj.length > 0)    return false;
		if (obj.length === 0)  return true;
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) return false;
		}
		return true;
	}	

	
	//Botões-----------------------------------------------------
	
	var rotate = 0;
	
    var skipClientes = 0;
    var skipProdutos = 0;
    var loadMoreVal = true;
    var descontoLimite = 0;
    var desconto = 0;


	
	
	//Lista de configurações---------------------
	function configs(){
		j('.configs').toggle();
		j('.info').hide();
		j('.marcara').hide();
		j('.ion-gear-a').css('transform','rotate('+(rotate+360)+'deg)');
		rotate=rotate+360;
	}
	
	function btnCadastrarCliente(){
		j('#cadastroCliente').show('slide');
		j('.configs').hide();
	}
	
	function info(){
		j('.info').toggle();
		j('.configs').toggle();
	}
	
	function sair(){
        localStorage.setItem("username", "");
        localStorage.setItem("idUser", "");
        window.location = '#/login';
        j('#limpa-hist').click();
	}



	//Pedido-------------------------------------
	function novoPedido(){
		for (var member in pedidoObj) delete pedidoObj[member];
		pedidoObj.pedidoProduto = new Array();
		pedidoObj.status = {};
		pedidoObj.dataPedido = dataHoje();
		pedidoObj.sincronizado = false;
		pedidoObj.id = null;
		pedidoObj.status.id = 'fechado';
		pedidoObj.latitude = '';
		pedidoObj.longitude = '';
		pedidoObj.sincronizado = null;
		
		pedidoObj.fechamento = {};
		pedidoObj.fechamento.prazo = {};
        pedidoObj.fechamento.pauta = {};
		pedidoObj.fechamento.tipoCobranca = {};
		pedidoObj.fechamento.descontoComissao = {};	

		pedidoObj.fechamento.prazo.nome = null;
        pedidoObj.fechamento.pauta.nome = null;
		pedidoObj.fechamento.tipoCobranca.nome = null;
		pedidoObj.fechamento.descontoComissao.nome = null;

        pedidoObj.fechamento.prazo.id = null;
        pedidoObj.fechamento.pauta.id = null;
        pedidoObj.fechamento.tipoCobranca.id = null;
        pedidoObj.fechamento.descontoComissao.id = null;
		pedidoObj.fechamento.id = null;

        tipoCobrancaSelect = "";
        prazoSelect = "";

		indexProduto = 0;
		tabsNovoPedido = 0;

		j('.hide').hide();
		j('.cliente-checked').hide();
        j('.btn-configs').hide();
        j('.btn-cancelar-pedido').show();
        j('.pedido-produto').show();
        j('.btn-proximo').show();
		//j('.btn-ok').hide();
		//j('.btn-cancelar-produto').hide();
		//j('#modal-pedido').show('drop');
		//j('#form-cliente').show();
		j('li').show();
		
		//j('.btn-confirmar').hide();
		//j('.btn-proximo').show();
		//j('.btn-voltar').hide();

		j('li').removeClass('marked');
		
		j('#limpar-search-cliente').click();
		j('#limpar-search-produto').click();
        j('#limpar-produtos').click();
		
	}
	
	function cancelarNovoPedido(){
		//j('#modal-pedido').hide('drop');
        j('.btn-configs').show();
        j('.btn-cancelar-pedido').hide();
        j('.btn-cancelar-produto').hide();
        j('.btn-ok').hide();
        //location.reload();
	}
	
	function confirmarNovoPedido(){
        j('.btn-configs').show();
        j('.btn-cancelar-pedido').hide();
    }
	
	function recarregaPedidosClick(){
		setTimeout(function(){ 
			j('#recarrega-pedidos').click();
		}, 1000);
	}

    var prazoSelect="";
    var tipoCobrancaSelect="";
	var tabsNovoPedido = 0;
	function novoPedidoProximo(){
		
		if(tabsNovoPedido == 0){
			if(!j('li.cliente').hasClass('marked')){
				j('#alert-selecionar-cliente').click();
				return;
			}else{
				j('#form-cliente').hide('blind');
				j('#form-produto').show('blind');
				j('.btn-voltar').show();
                tabsNovoPedido = 1;
				return;
			}
		}
		
		if(tabsNovoPedido == 1){
			if(!j('li.produto').hasClass('marked')){
				j('#alert-selecionar-produto').click();
				return;
			}else{
				j('#form-produto').hide('blind');
				j('#detalhes-pedido').show('blind');
                j('#verifica-pauta').click();
				tabsNovoPedido = 2;
				return;
			}
		}
		
		if(tabsNovoPedido == 2){
            if(tipoCobrancaSelect == "" && prazoSelect == ""){
                j('.require-tipoCobranca').show();
                j('.require-prazo').show();
                return
            }
            if(tipoCobrancaSelect == ""){
                j('.require-tipoCobranca').show();
                return;
            }
            if(prazoSelect == ""){
                j('.require-prazo').show();
                return;
            }

            j('.require-prazo').hide();
            j('.require-tipoCobranca').hide();

			j('#detalhes-pedido').hide('blind');
			j('#resumo-pedido').show('blind');
			j('.btn-proximo').hide();
			j('.btn-confirmar').show();
			tabsNovoPedido = 3;
			return;
		}
		
	}

	function okGrades(){
		j('.btn-voltar').show();
		j('.btn-proximo').show();
		j('.btn-ok').hide();
		j('.btn-cancelar-produto').hide();
	}
	
	function cancelaGrades(){
        j('#limpar-grades').click();
        j('.btn-ok').hide();
        j('.btn-cancelar-produto').hide();
        j('.btn-voltar').show();
        j('.btn-proximo').show();
        j('#grade-produto').hide();

	}

	
	
	//Pegar data
	function dataHoje() {
		var data = new Date();
		var dia = data.getDate();
		var mes = data.getMonth() + 1;
		var ano = data.getFullYear();
		return [dia, mes, ano].join('/');
	}
	
	
	//Verifica se há conexão com a internet
	function checkConnection() {
		var networkState = navigator.network.connection.type;
		if(networkState=='none')
			return false;
		else
			return true;
	}
	
	
	
	
	
	
