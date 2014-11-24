function counter() {
	return {
		i : 0,
		inc : function() {i++},
		dec : function() {j--},	
	}
}

var c = counter()
c.inc()
c.inc()
c.dec()
c.imc() //typo