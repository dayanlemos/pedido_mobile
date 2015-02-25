function loginDAO(){
	this.insertLogin = insertLogin;
	this.listAll = listAll;
	this.findByUser = findByUser;
	this.findById = findById;
	var db = window.openDatabase(nomeBanco, versaoBanco, "", 1000000);
	
	function insertLogin(usuario, senha, userData){
		try{
			db.transaction(function(ctx) {
				//alert('entrou db.transaction');
				
				sqlInsert = "INSERT INTO Login(usuario ";
				sqlValues = ") VALUES (" + "'" + usuario + "'";
				
				sqlInsert = sqlInsert + ", senha";
				sqlValues = sqlValues + ",'" + senha + "'";
				
				sqlInsert = sqlInsert + ", token";
				sqlValues = sqlValues + ",'" + userData.token + "'";

                sqlInsert = sqlInsert + ", permitePauta";
                sqlValues = sqlValues + ",'" + userData.permitePauta + "'";

                sqlInsert = sqlInsert + ", id";
                sqlValues = sqlValues + ",'" + userData.id + "'";

				sqlValues = sqlValues + ");";
				
				console.log(':::::::::::Gravando Login:::::::::::::');
				console.log(sqlInsert + sqlValues);
				
				ctx.executeSql(sqlInsert + sqlValues);
				
				//alert('passou db.transaction');
			
			});	
		}catch(err){
			alert("Erro ao inserir login: " + err.message)
		}
	}
	
	function listAll() {
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				//alert('listAll transaction');
				ctx.executeSql("SELECT * " +
								  "FROM Login " +
								  "ORDER BY usuario desc ", [],successFind(d), errorCB);
		    });
		});	
	}
	
	function findByUser(usuario, senha){
		return $.Deferred(function (d) {
			db.transaction(function(ctx) {
				ctx.executeSql("SELECT * " +
								  "FROM Login WHERE usuario = " + '"'+ usuario + '"' + "AND senha = " + '"'+ senha + '"', [],successFind(d), errorCB);
			});
		});
	}

    function findById(id){
        return $.Deferred(function (d) {
            db.transaction(function(ctx) {
                ctx.executeSql("SELECT * " +
                "FROM Login WHERE id = " + id, [],successFind(d), errorCB);
            });
        });
    }

	function successFind(d) {
        return (function (tx, data) {
        	d.resolve(data)
        })
    }
}
