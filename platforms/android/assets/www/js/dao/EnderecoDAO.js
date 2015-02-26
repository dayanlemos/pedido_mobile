function enderecoDAO(){
	this.insertEndereco = insertEndereco;
	this.findByPessoa = findByPessoa;
	this.findById = findById;
	this.deleteEndereco = deleteEndereco;
	
	function insertEndereco(endereco, total){
		try{
			db1.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Endereco (id ";
				sqlValues = ") VALUES (" + endereco.id;
				
				if (endereco.bairro != null){
					sqlInsert = sqlInsert + ", bairro";
					sqlValues = sqlValues + ",'" + endereco.bairro + "'";
				}
				if (endereco.cep  != null){
					sqlInsert = sqlInsert + ", cep";
					sqlValues = sqlValues + ",'" + endereco.cep + "'";
				}
				if (endereco.cidade != null){
					sqlInsert = sqlInsert + ", cidade";
					sqlValues = sqlValues + ",'" + endereco.cidade + "'";
				}
				if (endereco.complemento != null){
					sqlInsert = sqlInsert + ", complemento";
					sqlValues = sqlValues + ",'" + endereco.complemento + "'";
				}
				if (endereco.logradouro != null){
					sqlInsert = sqlInsert + ", logradouro";
					sqlValues = sqlValues + ",'" + endereco.logradouro + "'";
				}
				if (endereco.numero != null){
					sqlInsert = sqlInsert + ", numero";
					sqlValues = sqlValues + ",'" + endereco.numero + "'";
				}
				if (endereco.tipoEndereco.lookup != null){
					sqlInsert = sqlInsert + ", tipoEndereco";
					sqlValues = sqlValues + ",'" + endereco.tipoEndereco.lookup + "'";
				}
				if (endereco.uf != null){
					sqlInsert = sqlInsert + ", uf";
					sqlValues = sqlValues + ",'" + endereco.uf.id + "'";
				}
		
				sqlInsert = sqlInsert + ", pessoa";
				sqlValues = sqlValues + "," + endereco.pessoa;
				
				sqlValues = sqlValues + ");";
				console.log(sqlInsert + sqlValues);
				console.log('Total Endereco: '+total);
				
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir endereço: " + err.message)
		}
	}
	
	function findByPessoa(pessoa){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM endereco " +
								  "WHERE pessoa = " + pessoa.id, [],successWrapperPessoa(d, pessoa), errorCB);
		    });
		});
	}

	function findById(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM endereco " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteEndereco(id){
		return $.Deferred(function (d) {
			db1.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM endereco " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	function successWrapper(d) {
        return (function (tx, data) {

			//console.log('EnderecoDAO'+data.rows.item(0).bairro);
			d.resolve(data)
        })
    }
	
	function successWrapperPessoa(d, pessoa) {
        return (function (tx, data) {
			var resposta = {data:data, pessoa:pessoa};
			//console.log('EnderecoDAO'+data.rows.item(0).bairro);
			d.resolve(resposta)
        })
    }
	
}
	