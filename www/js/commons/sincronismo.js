//var servidor = "http://silvialacerda.getconsultoria.com.br/pedidoweb/soa/service/";
var servidor = "http://pedidoweb.getconsultoria.com.br/pedidoweb/soa/service/";
//var servidor = "https://10.1.1.101:8080/pedidoweb/soa/service/";
var url = "http://pedidoweb.getconsultoria.com.br/pedidoweb/soa/autenticacao?login=teste&senha=123456"; 
var grade = "grade";
var clienteTabela = "cliente?indCliente=true";
var vendedor = "vendedor?indVendedor=true";
var uf = "uf";
var tabelaPreco = "tabelapreco";
var composicao = "composicao";
var tipoCobranca = "tipocobranca";
var prazo = "prazo";
var produto = "produto";
var pedido = "pedido";
var pauta = "pauta";
var userData = {};

function getDados(tabela) {
	try {
		var xhr = new XMLHttpRequest();

		xhr.addEventListener("progress", updateProgress, false);
		xhr.addEventListener("error", transferFailed, false);
		xhr.addEventListener("abort", transferCanceled, false);
	 
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4)
				return; 
			if (xhr.status != 200) {
				alert("Erro: " + xhr.status);
				return;
			}
			
			if(tabela == prazo){
				//alert(JSON.stringify(xhr.responseText));
			}
			processaDados(tabela, JSON.parse(preparaJson(xhr.responseText)));
			
			return;
		}
		//alert(servidor + tabela);
		xhr.open("GET", servidor + tabela, true);
		xhr.withCredentials = true;
		xhr.send();
		
	} catch (err) {
		alert(err.message);
	}
}
function getToken(url,usuario,senha) {	
	try {
		var xhr = new XMLHttpRequest();

		xhr.addEventListener("progress", updateProgress, false);
		xhr.addEventListener("error", transferFailed, false);
		xhr.addEventListener("abort", transferCanceled, false);
	 
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4)
				return; 
			if (xhr.status != 200) {
				alert("Erro: " + xhr.status);
				return;
			}
			userData = JSON.parse(xhr.responseText);
			//alert(JSON.stringify(userData));

			if(userData.token == 'AcessoNegado'){
				loginErro();
			}else{
				gravarLogin(usuario,senha,userData);
                idVendedor = userData.id;
                localStorage.setItem("idUser", userData.id);
				//alert('Login Success');
				loginSuccess();
			}
			
			
			
			return;
		}
		//alert(servidor + tabela);
		xhr.open("GET", url, true);
		xhr.withCredentials = true;
		xhr.send();
		
		return;
		
	} catch (err) {
		alert(err.message);
	}
}

//Verifica a data de expiração do token
function validaToken(token){
	//alert('Entrou validaToken: '+token);
	date = new Date;
	diaAtual = date.getDate();
	mesAtual = date.getMonth()+1;
	anoAtual = date.getFullYear();
	
	var diaToken = token[9] + token[10];
	var mesToken = token[11] + token[12];
	var anoToken = token[13] + token[14] + token[15] + token[16];
	
	//alert('Data atual: '+diaAtual+' '+mesAtual+' '+anoAtual);
	//alert('Data token: '+diaToken+' '+mesToken+' '+anoToken);
	
	if(anoAtual<anoToken){
		return true;
	}else if(anoAtual==anoToken && mesAtual<mesToken){
		return true;
	}else if(anoAtual==anoToken && mesAtual==mesToken && diaAtual <= diaToken){
		return true;
	}else{
		return false;
	}
}

//Insere os dados de login no banco local
function gravarLogin(usuario, senha, userData){
	//alert('entrou gravarLogin');
	var service = new loginDAO();
	service.insertLogin(usuario, senha, userData);
}
	
//Status da transferencia de dados
function updateProgress(oEvent) {
	if (oEvent.lengthComputable) {
		var percentComplete = oEvent.loaded / oEvent.total;
	} else {
		//Exibir Progresso
	}
}

function transferFailed(evt) {
	alert('Ocorreu um erro na transferência de dados.');
}

function transferCanceled(evt) {
	alert('O sincronismo foi cancelado.');
}

//Adapta JSON para ser usado com função parse
function preparaJson(texto){
	var inicio = texto.indexOf("[");
	var fim = 1 + texto.lastIndexOf("]");
	return texto.substring(inicio, fim);
}

//Define quais tabela serao atualizadas
function atualizaDados(){

    //getDados(composicao);
	//sleep(1000);
    getDados(tipoCobranca);
    sleep(1000);
	getDados(grade);
	//sleep(1000);
	getDados(produto);
	//sleep(1000);
	getDados(prazo);
	//sleep(1000);
    getDados(clienteTabela);
    //sleep(1000);
	getDados(pauta);
	//sleep(1000);
}

function processaDados(tabela, arr){
	if (tabela == clienteTabela){
		processaCliente(arr);
	}else if (tabela == grade){
		processaGrade(arr);
	}else if (tabela == uf){
		processaUf(arr);
	}else if (tabela == tabelaPreco){
		processaTabelaPreco(arr);
	}else if (tabela == composicao){
		processaComposicao(arr);
	}else if (tabela == prazo){
		processaPrazo(arr);
	}else if (tabela == pauta){
		processaPauta(arr);
	}else if (tabela == produto){
		processaProduto(arr);
	}else if (tabela == tipoCobranca){
		processaTipoCobranca(arr);
	}else if (tabela == pedido){
		processaPedido(arr);
	}
}

//faz a gravacao dos dados de grade
function processaGrade(arr){
	var i;
	var service = new gradeDAO();
    if (arr != null) {
        service.deleteAll();
    }
	for(i = 0; i < arr.length; i++) {
		service.insertGrade(arr[i]);
	}
}

//faz a gravacao dos dados de pauta
function processaPauta(arr){
	var i;
	var service = new pautaDAO();
    if (arr != null) {
        service.deleteAll();
    }
	for(i = 0; i < arr.length; i++) {
		service.insertPauta(arr[i]);
	}
}

//faz a gravacao dos dados de pedido
function processaPedido(arr){
	var i;
	var service = new pedidoDAO();
	for(i = 0; i < arr.length; i++) {
		service.insertPedido(arr[i]);
	}
	service.listAll();
}

//faz a gravacao dos dados de prazo
function processaPrazo(arr){
	var i;
	var service = new prazoDAO();
    if (arr != null) {
        service.deleteAll();
    }
	for(i = 0; i < arr.length; i++) { 
		service.insertPrazo(arr[i]);
	}
	service.listAll();
	//service.findById(218);
}

//faz a gravacao dos dados de produto
function processaProduto(arr){
	var i;
	var service = new produtoDAO();
    if (arr != null) {
        service.deleteAll();
    }
	for(i = 0; i < arr.length; i++) { 
		service.insertProduto(arr[i], i, arr.length-1);
	}	
	service.listAll();
	//service.findById(1);
}


//faz a gravacao dos dados de composicao
function processaComposicao(arr){
	var i;
	var service = new tabelaService(composicao);
    if (arr != null){
        service.deleteTabela("composicao");
    }
	for(i = 0; i < arr.length; i++) { 
		service.insertTabela(arr[i]);
	}
	service.listAll();
	service.findById(1);
}

//faz a gravacao dos dados de tipo de cobrança
function processaTipoCobranca(arr){
	var i;
	var service = new tabelaService(tipoCobranca);
    if (arr != null) {
        service.deleteTabela("TipoCobranca");
    }
	for(i = 0; i < arr.length; i++) { 
		service.insertTabela(arr[i]);
	}
	service.listAll();
	service.findById(1);
}

//faz a gravacao dos dados de uf
function processaUf(arr){
	var i;
	var service = new ufService();
    if (arr != null) {
        service.deleteUf();
    }
	for(i = 0; i < arr.length; i++) { 
		service.insertUf(arr[i]);
	}
	service.listAll();
	service.findById(1);
}

//faz a gravacao dos dados das tabelas de preços
function processaTabelaPreco(arr){
	var i;
	var service = new tabelaPrecoService();
    if (arr != null) {
        service.deleteTabelaPreco();
    }
	for(i = 0; i < arr.length; i++) { 
		service.insertTabelaPreco(arr[i]);
	}
	service.listAll();
	service.findById(1);
}

//faz a gravacao dos dados de cliente
function processaCliente(arr){
	var i;
	var service = new pessoaService();
    if (arr != null) {
        service.deleteAll();
    }
	for(i = 0; i < arr.length; i++) { 
		service.insertPessoa(arr[i], i, arr.length-1);
	}
	service.listAll();
}
