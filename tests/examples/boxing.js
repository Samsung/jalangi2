function annotate(x) {
	x.annotate = "OK"
}

var o = {prop : 0}
annotate(o)
var i = 4
annotate(i)