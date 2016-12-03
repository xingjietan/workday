angular.module("myapp",[])
.controller("homework",["$scope",function($scope){
	var students=[
		{
			firstName:"marry",lastName:"john",salary:12000.00,birthday:660677879481
		},
		{
			firstName:"sasy",lastName:"rose",salary:15650.50,birthday:580007879481
		},
		{
			firstName:"vvan",lastName:"summer",salary:17270.00,birthday:880099979481
		},
		{
			firstName:"make",lastName:"baby",salary:11070.00,birthday:770677870541
		},
	]
	$scope.students=students;
	$scope.find="";
	$scope.untrue=true;
	$scope.one=function(num){
		//console.log($("thead tr td").eq(num))
		var index=num;
		if(index>=3){
			index--;
		}
		var findDom=$("thead tr td").eq(num).find("em");
		if( findDom[0].className==""){
			$("thead tr td").find("em").attr("class","")
			this.untrue=true;
			this.find=line(index);
			//console.log(this.find)
			findDom[0].className="block";

		}else{
			if(findDom[0].className=="block"){
				this.untrue=false;
				findDom[0].className="none";
			}else{
				findDom[0].className="block";
				this.untrue=true;
			}
		}
		
	}
	function line(num){

		var obj = students[0];
		var k =0;
		for( var i in obj ){
			if(k == num){
				return i
			}
				k++;
		}

	}
	

}]);