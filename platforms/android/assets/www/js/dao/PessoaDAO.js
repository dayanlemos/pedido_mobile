function pessoaDAO(){
	this.insertPessoa = insertPessoa;
	this.listAll = listAll;
    this.search = search;
	this.findById = findById;
	this.deletePessoa = deletePessoa;
    this.deleteAll = deleteAll;
    var oEnderecoService = new enderecoService();
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	/**
	 * Insere Pessoa no banco de dados
	 */
	 
	function insertPessoa(pessoa, index, total){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Pessoa(id ";
				sqlValues = ") VALUES (" + pessoa.id; 	
					
				if (pessoa.tipoPessoa.lookup != null){
					sqlInsert = sqlInsert + ", tipoPessoa";
					sqlValues = sqlValues + ",'" + pessoa.tipoPessoa.lookup + "'";
				} 	
				if (pessoa.cpfCnpj != null){
					sqlInsert = sqlInsert + ", cpfCnpj";
					sqlValues = sqlValues + ",'" + pessoa.cpfCnpj + "'";
				} 
				if (pessoa.nomeRazao != null){
					sqlInsert = sqlInsert + ", nomeRazao";
					sqlValues = sqlValues + ",'" + pessoa.nomeRazao + "'";
				} 
				if (pessoa.nomeFantasia != null){
					sqlInsert = sqlInsert + ", nomeFantasia";
					sqlValues = sqlValues + ",'" + pessoa.nomeFantasia + "'";
				} 
				if (pessoa.sexo != null){
					sqlInsert = sqlInsert + ", sexo";
					sqlValues = sqlValues + ",'" + pessoa.sexo + "'";
				} 
				if (pessoa.email != null){
					sqlInsert = sqlInsert + ", email";
					sqlValues = sqlValues + ",'" + pessoa.email + "'";
				} 
				if (pessoa.inscricaoMunicipal != null){
					sqlInsert = sqlInsert + ", inscricaoMunicipal";
					sqlValues = sqlValues + ",'" + pessoa.inscricaoMunicipal + "'";
				}
				if (pessoa.inscricaoEstadual != null){
					sqlInsert = sqlInsert + ", inscricaoEstadual";
					sqlValues = sqlValues + ",'" + pessoa.inscricaoEstadual + "'";
				} 
				if (pessoa.suframa != null){
					sqlInsert = sqlInsert + ", suframa";
					sqlValues = sqlValues + ",'" + pessoa.suframa + "'";
				}
				if (pessoa.telefone1 != null){
					sqlInsert = sqlInsert + ", telefone1";
					sqlValues = sqlValues + ",'" + pessoa.telefone1 + "'";
				} 
				if (pessoa.telefone2 != null){
					sqlInsert = sqlInsert + ", telefone2";
					sqlValues = sqlValues + ",'" + pessoa.telefone2 + "'";
				}
				if (pessoa.celular != null){
					sqlInsert = sqlInsert + ", celular";
					sqlValues = sqlValues + ",'" + pessoa.celular + "'";
				} 
				if (pessoa.sigla != null){
					sqlInsert = sqlInsert + ", sigla";
					sqlValues = sqlValues + ",'" + pessoa.sigla + "'";
				}
				if (pessoa.observacoes != null){
					sqlInsert = sqlInsert + ", observacoes";
					sqlValues = sqlValues + ",'" + pessoa.observacoes + "'";
				} 
				if (pessoa.dataNascimentoFundacao != null){
					sqlInsert = sqlInsert + ", dataNascimentoFundacao";
					sqlValues = sqlValues + ",'" + pessoa.dataNascimentoFundacao + "'";
				}
				if (pessoa.dataCadastro != null){	
					sqlInsert = sqlInsert + ", dataCadastro";
					sqlValues = sqlValues + ",'" + pessoa.dataCadastro + "'";
				}
				if (pessoa.pessoaPai != null){
					sqlInsert = sqlInsert + ", pessoaPai";
					sqlValues = sqlValues + "," + pessoa.pessoaPai.id + "";
				}
				
				if (pessoa.indCliente == 'true'){
					pessoa.indCliente = 1;
					pessoa.indVendedor = 0;
				}else{
					pessoa.indCliente = 0;
					pessoa.indVendedor = 1;
				}
				
				if (pessoa.permitePauta == 'true'){
					pessoa.permitePauta = 1;
				}else{
					pessoa.permitePauta = 0;
				}
				
				sqlInsert = sqlInsert + ", indCliente";
				sqlValues = sqlValues + "," + pessoa.indCliente;

				sqlInsert = sqlInsert + ", indVendedor";
				sqlValues = sqlValues + "," + pessoa.indVendedor;				
				
				sqlInsert = sqlInsert + ", regiao";
				sqlValues = sqlValues + "," + pessoa.regiao + "";
				
				sqlInsert = sqlInsert + ", situacaoFinanceira";
				sqlValues = sqlValues + "," + pessoa.situacaoFinanceira + "";
				
				sqlInsert = sqlInsert + ", tabelaPreco";
				sqlValues = sqlValues + "," + pessoa.tabelaPreco + "";
				
				sqlInsert = sqlInsert + ", tipoCobranca";
				sqlValues = sqlValues + "," + pessoa.tipoCobranca + "";
				
				sqlInsert = sqlInsert + ", visita";
				sqlValues = sqlValues + "," + pessoa.visita + "";
				
				sqlValues = sqlValues + ");";
				console.log(sqlInsert + sqlValues);
				console.log(':::::::::::Gravando Cliente:::::::::::::');
				console.log('Index: '+index);
				console.log('Total: '+total);
				
				//exibe loader
				if(index < total){
					percentClientes = 100*index/total;
					console.log('Clientes: '+percentClientes+'%');
					totalClientes = total;
					j('#atualiza-loader').click();
					j('.progress-clientes').show();
				}else{
					j('.clientes-ok').show('slide');
					setTimeout(function(){
						j('.clientes-ok').hide('slide');
						j('.progress-clientes').hide('slide');
						
					}, 5000);
				}
				
				ctx.executeSql(sqlInsert + sqlValues);
				//Grava tabela endereco
				if(pessoa.endereco!=null){
					oEnderecoService = new enderecoService();
					for(i = 0; i < pessoa.endereco.length; i++) {
						//alert('pessoa.endereco.length: '+pessoa.endereco.length);
						pessoa.endereco[i].pessoa = pessoa.id;
						oEnderecoService.insertEndereco(pessoa.endereco[i], pessoa.endereco.length);
					}
				}
				//Grava tabela contato				
				if(pessoa.contato!=null){
					oContatoService = new contatoService();
					for(i = 0; i < pessoa.contato.length; i++) { 
						oContatoService.insertContato(pessoa.contato[i]);
					}
				}
			});
		}catch(err){
			alert("Erro ao inserir pessoa: " + err.message)
		}
	}

	function listAll(skip) {
        //alert("listAll: "+skip);
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {				  
				ctx.executeSql("SELECT * " +
								  "FROM pessoa " +
								  "ORDER BY nomeRazao " +
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
                "FROM pessoa " +
                "WHERE nomeRazao LIKE '%"+consulta+"%' "+
                "ORDER BY nomeRazao ", [],successFind(d), errorCB);
            });
        });
    }
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM pessoa " +
								  "WHERE id = " + id, [],successFind(d), errorCB);
		    });
		});
	}
	
	function deletePessoa(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM pessoa " +
								  "WHERE id = " + id, [],successDelete(d), errorCB);
		    });
		});
	}

    function deleteAll(){
        return $.Deferred(function (d) {
            db.transaction(function(ctx) {
                ctx.executeSql("DELETE " +
                    "FROM Pessoa", [],successDelete(d), errorCB);

                ctx.executeSql("DELETE " +
                    "FROM Endereco", [],successDelete(d), errorCB);

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