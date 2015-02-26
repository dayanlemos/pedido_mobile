var nomeBanco = "pedidomobile";
var versaoBanco = "1.0";

//Responsavel pela criação do banco e tabelas
var CREATE_TABLE_LOGIN = "CREATE TABLE IF NOT EXISTS Login (" +
        "id LONG," +
        "usuario TEXT," +
		"senha TEXT," +
        "permitePauta BOOLEAN," +
        "token TEXT" +
		");";

var CREATE_TABLE_PESSOA = "CREATE TABLE IF NOT EXISTS Pessoa (" +
		"id LONG, " +
		"tipoPessoa TEXT," +
		"cpfCnpj TEXT," +
		"nomeRazao TEXT," +
		"nomeFantasia TEXT," +
		"sexo TEXT," +
		"dataNascimentoFundacao TEXT," +
		"dataCadastro TEXT," +
		"email TEXT," +
		"inscricaoMunicipal TEXT," +
		"inscricaoEstadual TEXT," +
		"suframa TEXT," +
		"telefone1 TEXT," +
		"telefone2 TEXT," +
		"celular TEXT," +
		"sigla TEXT," +
		"indCliente BOOLEAN," +
		"indVendedor BOOLEAN," +
		"observacoes TEXT," +
		"regiao LONG," +
		"pessoaPai LONG, " +
		"situacaoFinanceira LONG," +
		"tabelaPreco LONG," +
		"tipoCobranca LONG," +
		"permitePauta LONG," +
		"visita LONG" +
		");";

var CREATE_TABLE_PEDIDO = "CREATE TABLE IF NOT EXISTS Pedido (" +
		"id LONG," +
        "codigo TEXT,"+
		"cliente LONG," +
		"vendedor LONG," +
		"dataPedido TEXT," +
		"status TEXT," +
		"sincronizado TEXT,"+
		"latitude TEXT,"+
		"longitude TEXT,"+
		"codigoMobile INTEGER PRIMARY KEY AUTOINCREMENT"+		
		");";
		
var CREATE_TABLE_FECHAMENTO = "CREATE TABLE IF NOT EXISTS Fechamento (" +
		"id LONG, " +
		"pedido LONG," +
		"observacoes TEXT," +
		"prazo LONG," +
		"tipoCobranca LONG," +
		"entrega TEXT," +
		"desconto DOUBLE," +
		"pauta LONG," +
		"descontoComissao LONG" +		
		");";

var CREATE_TABLE_PRAZO = "CREATE TABLE IF NOT EXISTS Prazo (" +
		"id LONG, " +
		"codigoOrigem LONG," +
		"nome TEXT," +
		"desconto DOUBLE," +
		"acrescimo DOUBLE" +		
		");";

var CREATE_TABLE_PAUTA = "CREATE TABLE IF NOT EXISTS Pauta (" +
		"id LONG, " +
		"codigoOrigem LONG," +
		"descricao TEXT," +
		"porcentagem DOUBLE" +		
		");";
		
		
var CREATE_TABLE_PEDIDO_PRODUTO = "CREATE TABLE IF NOT EXISTS PedidoProduto (" +
		"id LONG, " +
		"quantidade DOUBLE," +
		"pedido LONG," +
		"produto LONG," +
		"valorUnitario DOUBLE" +
		");";

var CREATE_TABLE_PEDIDO_PRODUTO_GRADE = "CREATE TABLE IF NOT EXISTS PedidoProdutoGrade (" +
		"id LONG, " +
		"pedido LONG," +
		"quantidade DOUBLE," +
		"gradeNumeracao	LONG," +
		"pedidoProduto LONG" +
		");";
		
var CREATE_TABLE_PRODUTO= "CREATE TABLE IF NOT EXISTS Produto (" +
		"id LONG," +
		"codigoOrigem INTEGER," +
		"ordem TEXT," +
		"cor TEXT," +
		"descricao TEXT," +
		"grupoProduto LONG," +
		"unidade LONG," +
		"fabricante LONG," +
		"composicao LONG," +
		"codigoFabricante TEXT," +
		"valor DOUBLE," +
		"valorMinimo DOUBLE," +
		"qtdeEmbalagem DOUBLE," +
		"tabelaPreco LONG" +
		");";

var CREATE_TABLE_ENDERECO = "CREATE TABLE IF NOT EXISTS Endereco (" +
		"id LONG," +
		"bairro TEXT," +
		"cep TEXT," +
		"cidade TEXT," +
		"complemento TEXT," +
		"logradouro TEXT," +
		"numero TEXT," +
		"tipoEndereco TEXT," +
		"pessoa LONG," +
		"uf LONG" +
		");";

var CREATE_TABLE_GRADE = "CREATE TABLE IF NOT EXISTS Grade(" +
		"id LONG," +
		"codigoOrigem INTEGER," +
		"descricao TEXT" +
		");";
		
var CREATE_TABLE_PRODUTO_GRADE = "CREATE TABLE IF NOT EXISTS ProdutoGrade (" +
		"id LONG," +
		"grade LONG," +
		"produto LONG" +
		");";
		
var CREATE_TABLE_GRADE_NUMERACAO = "CREATE TABLE IF NOT EXISTS GradeNumeracao (" +
		"id LONG," +
		"grade LONG," +
		"numeracao TEXT" +
		");";				

var CREATE_TABLE_DESCONTO_COMISSAO = "CREATE TABLE IF NOT EXISTS DescontoComissao (" +
		"id LONG," +
		"prazo LONG," +
		"desconto DOUBLE," +
		"comissao DOUBLE" +
		");";		

var CREATE_TABLE_TABELA_PRECO = "CREATE TABLE IF NOT EXISTS TabelaPreco (" +
		"id LONG," +
		"nome TEXT," +
		"valor DOUBLE" +
		");";

var CREATE_TABLE_PRECO = "CREATE TABLE IF NOT EXISTS Preco (" +
		"id LONG," +
		"idProduto LONG," +
		"idCliente LONG," +
		"valor DOUBLE" +
		");";

var CREATE_TABLE_UF = "CREATE TABLE IF NOT EXISTS Uf (" +
		"id LONG," +
		"nome TEXT," +
		"sigla TEXT" +
		");"
		
var CREATE_TABLE_TIPO_COBRANCA = "CREATE TABLE IF NOT EXISTS TipoCobranca (" +
		"id LONG," +
		"codigoOrigem LONG," +
		"nome TEXT" +
		");";

var CREATE_TABLE_COMPOSICAO = "CREATE TABLE IF NOT EXISTS Composicao (" +
		"id LONG," +
		"codigoOrigem LONG," +
		"nome TEXT" +
		");";

var CREATE_TABLE_CONTATO = "CREATE TABLE IF NOT EXISTS Contato (" +
		"id LONG," +
		"nome TEXT," +
		"telefone TEXT," +
		"pessoa LONG," +
		"email TEXT" +
		");";
 
var CREATE_TABLE_FABRICANTE = "CREATE TABLE IF NOT EXISTS Fabricante (" +
		"id LONG," +
		"codigoOrigem LONG," +
		"nome TEXT" +
		");";

var CREATE_TABLE_REGIAO = "CREATE TABLE IF NOT EXISTS Regiao (" +
		"id LONG," +
		"codigoOrigem LONG," +
		"nome TEXT" +
		");";

var CREATE_TABLE_SITUACAO_FINANCEIRA = "CREATE TABLE IF NOT EXISTS SituacaoFinanceira (" +
		"id LONG," +
		"codigoOrigem LONG," +
		"nome TEXT" +
		");";

var CREATE_TABLE_UNIDADE = "CREATE TABLE IF NOT EXISTS Unidade (" +
		"id LONG," +
		"codigoOrigem LONG," +
		"nome TEXT" +
		");";

var CREATE_TABLE_VISITA = "CREATE TABLE IF NOT EXISTS Visita (" +
		"id LONG," +
		"codigoOrigem LONG," +
		"nome TEXT" +
		");";

function create(){
		var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
		db.transaction(createDB, errorCB, successCB);
		console.log("DB criado.");
}

function createDB(tx){
	 /*
	 tx.executeSql('DROP TABLE IF EXISTS Pessoa');
	 tx.executeSql('DROP TABLE IF EXISTS Contato');
	 tx.executeSql('DROP TABLE IF EXISTS Regiao');
	 tx.executeSql('DROP TABLE IF EXISTS SituacaoFinanceira');
	 tx.executeSql('DROP TABLE IF EXISTS Visita');
	 tx.executeSql('DROP TABLE IF EXISTS TabelaPreco');
	 tx.executeSql('DROP TABLE IF EXISTS Endereco');
	 tx.executeSql('DROP TABLE IF EXISTS Uf');
	 tx.executeSql('DROP TABLE IF EXISTS Unidade');
	 tx.executeSql('DROP TABLE IF EXISTS Fabricante');
	 tx.executeSql('DROP TABLE IF EXISTS Preco');
	 tx.executeSql('DROP TABLE IF EXISTS Produto');
	 tx.executeSql('DROP TABLE IF EXISTS Pedido');
	 tx.executeSql('DROP TABLE IF EXISTS PedidoProduto');	 
	 tx.executeSql('DROP TABLE IF EXISTS PedidoProdutoGrade');	 
	 tx.executeSql('DROP TABLE IF EXISTS ProdutoGrade');
	 tx.executeSql('DROP TABLE IF EXISTS TipoCobranca');
	 tx.executeSql('DROP TABLE IF EXISTS Grade');
	 tx.executeSql('DROP TABLE IF EXISTS GradeNumeracao');
	 tx.executeSql('DROP TABLE IF EXISTS Fechamento');
	 tx.executeSql('DROP TABLE IF EXISTS Prazo');
	 tx.executeSql('DROP TABLE IF EXISTS Login');
     tx.executeSql('DROP TABLE IF EXISTS Pauta');
     */

	 tx.executeSql(CREATE_TABLE_LOGIN);
	 tx.executeSql(CREATE_TABLE_PESSOA);
	 tx.executeSql(CREATE_TABLE_CONTATO);
	 tx.executeSql(CREATE_TABLE_REGIAO);
	 tx.executeSql(CREATE_TABLE_SITUACAO_FINANCEIRA);
	 tx.executeSql(CREATE_TABLE_VISITA);
	 tx.executeSql(CREATE_TABLE_TIPO_COBRANCA);
	 tx.executeSql(CREATE_TABLE_TABELA_PRECO);
	 tx.executeSql(CREATE_TABLE_ENDERECO);
	 tx.executeSql(CREATE_TABLE_UF);
	 tx.executeSql(CREATE_TABLE_PRAZO);
	 tx.executeSql(CREATE_TABLE_DESCONTO_COMISSAO);
	 tx.executeSql(CREATE_TABLE_COMPOSICAO);
	 tx.executeSql(CREATE_TABLE_UNIDADE);
	 tx.executeSql(CREATE_TABLE_FABRICANTE);
	 tx.executeSql(CREATE_TABLE_PRECO);
	 tx.executeSql(CREATE_TABLE_PRODUTO);
	 tx.executeSql(CREATE_TABLE_GRADE);
	 tx.executeSql(CREATE_TABLE_PRODUTO_GRADE);
	 tx.executeSql(CREATE_TABLE_GRADE_NUMERACAO);
	 tx.executeSql(CREATE_TABLE_PEDIDO);
	 tx.executeSql(CREATE_TABLE_PEDIDO_PRODUTO);
	 tx.executeSql(CREATE_TABLE_PEDIDO_PRODUTO_GRADE);
	 tx.executeSql(CREATE_TABLE_FECHAMENTO);
	 tx.executeSql(CREATE_TABLE_PAUTA);
}

function open(){
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000); 
}
	
function errorCB(err) {
	//alert("Erro ao processar SQL: "+ err.code);
}
	 
function successCB() {
	//alert("Banco criado.");		       	
}    		
	
