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

var print = function() {
	output(pop());
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
	'^':exp
};

var nonreturn = {
	'p':print
};

var digits = [0,1,2,3,4,5,6,7,8,9];

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
		
		pointer += 1;
		console.log(stack);
	}
}

var run = function(code) {
	var instructions = parse(code);
	console.log(instructions);
	execute(instructions);
}
