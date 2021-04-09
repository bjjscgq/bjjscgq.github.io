function tran(){
		instr = document.getElementById("in")
		var instr = instr.value;
		var outstr;
		var outArray = new Array();
		var outarray = new Array();
		var inHex = document.getElementById("inHex").value;
		var outHex = document.getElementById("outHex").value;
		if (instr.indexOf('.')==-1){
			var len = instr.length;
			for(var i = 0; i < len; i++)
				if(parseInt("0x"+instr[i])>=inHex){
					alert("input error!");
					return -1;
				}
				else{
					outarray[len-i-1] = parseInt("0x"+instr[i]);
				}

			for(var k = 0; len;){
		        for(var i = len-1; i>0; i--){ 
		            outarray[i-1] = outarray[i-1] + outarray[i]%outHex*inHex; 
		            outarray[i]=parseInt(outarray[i]/outHex); 
		        }
		        outArray[k++]=outarray[0]%outHex;
		        outarray[0]=parseInt(outarray[i]/outHex); 
		        while(len&&!outarray[len-1]) --len;
		    }
		    for(var i = 0; i < outArray.length; i++){
		    	outArray[i] = outArray[i].toString(outHex);
		    }
		    outstr = outArray.reverse().join('');
		    document.getElementById("out").value = outstr;
		}
		else{
			alert("暂未开发小数进制转换");
		}
	    
	}