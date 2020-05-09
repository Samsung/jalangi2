function f(){
       return eval("3");
}
Object.prototype.g=function(){ throw "should not be called!"; }
f();
