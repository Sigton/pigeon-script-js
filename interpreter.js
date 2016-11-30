function strip(str, remove) {
	// I needed this python feature...
  while (str.length > 0 && remove.indexOf(str.charAt(0)) != -1) {
    str = str.substr(1);
  }
  while (str.length > 0 && remove.indexOf(str.charAt(str.length - 1)) != -1) {
    str = str.substr(0, str.length - 1);
  }
  return str;
}

var stack = [];

var toNum = function(input){
	if(isNaN(Number(input))) {
		return input;
	} else {
		return Number(input);
	}
}

var pop = function() {
	if(stack.length) {
		return stack.pop();
	} else {
		return toNum(prompt("Value Required"));
	}
}

var sum = function() {
	if(stack.length > 1) {
		return pop() + pop();
	} else {
		return pop() * 2;
	}
}

var sub = function() {
	if(stack.length > 1) {
		return -1 * (pop() - pop());
	} else {
		return -1 * pop();
	}
}

var mult = function() {
	if(stack.length) {
		return pop() * pop();
  } else {
		return pow(pop(), 2);
	}
}

var div = function() {
  if(stack.length) {
    return 1 / (pop() / pop());
	} else {
    return 1 / pop();
	}
}

var exp = function() {
	if(stack.length > 1) {
		var a = pop();
		var b = pop();
		return pow(b, a);
	} else {
		var a = pop();
		return pow(a, a);
	}
}

var mod = function() {
	a = pop();
	b = pop();
	return b % a;
}

var factorial = function() {
	i = 1;
	for(n=1; n<=pop(); n++) {
		i *= n;
	}
	return i;
}

var indice = function() {
	var index = pop();
	var item = pop();
	return item[index];
}

var length = function() {
	return pop().length;
}

var print = function() {
	output(pop());
}

var pshtoarr = function() {
	to_append.push(pop());
}

var output = function(data) {
	var ul = document.getElementById("list");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(data));
	ul.appendChild(li);
}

var functions = {
	'+':sum,
	'-':sub,
	'*':mult,
	'/':div,
	'^':exp,
	'%':mod,
	'!':factorial,
	'~':indice,
	'l':length
};

var nonreturn = {
	'p':print,
	'|':pshtoarr
};

var constants = {
	'g':[]
};

var digits = [0,1,2,3,4,5,6,7,8,9];

var set_var = ["A","B","C","D","E","F"];
var get_var = ["a","b","c","d","e","f"];

var to_append = [];

scope = {
	'a':0,
	'b':0,
	'c':0,
	'd':0,
	'e':0,
	'f':"Hello World"
};

var parse = function(code) {
	
	var pointer = 0;
	
	var c = function() {
		return code[pointer];
	}
	
	var parsed = [];
	
	while (pointer < code.length) {
		
		if(c() in digits) {
			
			var number = "";
			
			while ((pointer < code.length)&&((c() in digits)||(c() == '.' && !('.' in number)))) {
				number += c();
				pointer += 1;
			}
			pointer -= 1;
			parsed.push(["push", toNum(number)]);
		}
		
		if(c() == '"') {
			
			var string = "";
			
			while (pointer < code.length) {
				string += c();
				pointer += 1;
				if((pointer >= code.length)||(c()=='"')) {
					break
				}
			}
			parsed.push(["push", strip(string, '"')]);
		}

		if(c() in functions) {
			parsed.push(["function", functions[c()]]);
		}
		
		if(c() in nonreturn) {
			parsed.push(["nonreturn", nonreturn[c()]]);
		}
		
		if (c() in set_var) {
			parsed.push(["setvar", c().toLowerCase()]);
		}
		
		if (c() in get_var) {
			parsed.push(["getvar", c()]);
		}
		
		if (c() in constants) {
			parsed.push(("push", constants[c()]));
		}
		
		pointer += 1;

	}
	return parsed;
}

var execute = function(code) {
	
	var pointer = 0;
	
	var c = function() {
		return code[pointer];
	}
	
	while (pointer < code.length) {
		if (c()[0] == "push") {
			stack.push(c()[1]);
		}
		
		if (c()[0] == "function") {
			stack.push(c()[1]());
		}
		
		if (c()[0] == "nonreturn") {
			c()[1]();
		}
		
		if (c()[0] == "setvar") {
			if (scope[c()[1]] instanceof Array) {
				var a = pop();
				if (a instanceof String) {
					if ("|" in a) {
						var b = a.split("|");
						for(var d = 0; i < b.length; d++) {
							scope[c()[1]].push(d);
						}
					} else {
						scope[c()[1]].push(a);
					}
				}
				if ((a instanceof Number)) {
					for(var b = 0; b < to_append.length; b++) {
						scope[c()[1]].push(to_append.pop(0));
					}
					scope[c()[1]].push(a);
				}
			} else {
				scope[c()[1]] = pop();
			}
		}
		
		if (c()[0] == "getvar") {
			stack.push(scope[c()[1]]);
		}
		
		pointer += 1;
	}
}

var run = function(code) {
	
	if(((code.split('"').length-1) % 2)!=0) {
		code = '"' + code;
	}
	
	var instructions = parse(code);
	console.log(instructions);
	execute(instructions);
}
