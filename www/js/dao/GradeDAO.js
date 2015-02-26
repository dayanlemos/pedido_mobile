function gradeDAO(){
	this.insertGrade = insertGrade;
	this.listAll = listAll;
	this.findById = findById;
	this.deleteAll = deleteAll;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertGrade(grade){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO Grade (id ";
				sqlValues = ") VALUES (" + grade.id;
				
				if (grade.codigoOrigem != null){
					sqlInsert = sqlInsert + ", codigoOrigem";
					sqlValues = sqlValues + ",'" + grade.codigoOrigem + "'";
				}
				if (grade.descricao != null){
					sqlInsert = sqlInsert + ", descricao";
					sqlValues = sqlValues + ",'" + grade.descricao + "'";
				}
				sqlValues = sqlValues + ");";
				console.log(sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
				
				//Grava tabela gradeNumeracao
				if (grade.gradeNumeracao != null){
					oGradeNumeracaoDAO = new gradeNumeracaoDAO();
					for(var i = 0; i < grade.gradeNumeracao.length; i++) { 
						grade.gradeNumeracao[i].grade = grade.id;
						oGradeNumeracaoDAO.insertGradeNumeracao(grade.gradeNumeracao[i]);
					}
				}
			 });
		}catch(err){
			alert("Erro ao inserir Grade: " + err.message)
		}
	}
	
	function listAll() {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Grade " +
								  "ORDER BY descricao " +
								  "LIMIT 10", [],successWrapper(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Grade " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteAll(){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM Grade ", [],successWrapper(d), errorCB);
                ctx.executeSql("DELETE " +
                        "FROM GradeNumeracao", [],successWrapper(d), errorCB);
		    });
		});
	}

	function successWrapper(d) {
        return (function (tx, data) {
            d.resolve(data)
        })
    }
	
}