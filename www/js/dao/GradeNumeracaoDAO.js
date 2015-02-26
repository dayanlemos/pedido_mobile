function gradeNumeracaoDAO(){
	this.insertGradeNumeracao = insertGradeNumeracao;
	this.listAll = listAll;
	this.findById = findById;
	this.findByGrade = findByGrade;
	this.findByProduto = findByProduto;
	this.deleteAll = deleteAll;
	
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertGradeNumeracao(grade){
		try{
			db.transaction(function(ctx) {
				sqlInsert = "INSERT INTO GradeNumeracao (id ";
				sqlValues = ") VALUES (" + grade.id;
				if (grade.grade != null){
					sqlInsert = sqlInsert + ", grade";
					sqlValues = sqlValues + "," + grade.grade;
				}
				if (grade.numeracao != null){
					sqlInsert = sqlInsert + ", numeracao";
					sqlValues = sqlValues + ",'" + grade.numeracao + "'";
				}
				sqlValues = sqlValues + ");";
				console.log(sqlInsert + sqlValues);
				ctx.executeSql(sqlInsert + sqlValues);
			 });
		}catch(err){
			alert("Erro ao inserir GradeNumeracao: " + err.message)
		}
	}
	
	function listAll() {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM GradeNumeracao " +
								  "ORDER BY numeracao", [],successWrapper(d), errorCB);
		    });
		});	
	}
	
	function findById(id){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM GradeNumeracao " +
								  "WHERE id = " + id, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function findByGrade(grade){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM GradeNumeracao " +
								  "WHERE grade = " + grade, [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function findByProduto(idProduto){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT gn.id, g.codigoOrigem as codigoOrigemGrade, " +
									"g.descricao as descricaoGrade, gn.numeracao " +
								"FROM ProdutoGrade pg, Grade g, GradeNumeracao gn " +
								"WHERE pg.produto = " + idProduto +" AND pg.grade = g.id " +
								"AND gn.grade = g.id", [],successWrapper(d), errorCB);
		    });
		});
	}
	
	function deleteAll(){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("DELETE " +
								  "FROM GradeNumeracao", [],successDelete(d), errorCB);
		    });
		});
	}
	
	function successWrapper(d) {
        return (function (tx, data) {
			console.log('R: ' + data.rows.length)
            d.resolve(data)
        })
    }
	
}