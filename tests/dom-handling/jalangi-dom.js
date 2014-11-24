var domroot = document.documentElement

var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mut) {
        DOMWalker(mut.target, mut.removedNodes.length)
    })
})
var config = { attributes: true, childList: true, characterData: true, subtree: false};
function observe(node) {
    observer.observe(node, config);
    node.isObserved = true
}
function isObserved(node) {
    return node.isObserved === true
}

function DOMWalker(n, extraLen) {
    console.log("HERE2")
    var children = n.childNodes
    n.childNodes = children
    n.isDom = true
    for (var i = 0; i < children.length; i++) {
        var child = children[i]
        children[i] = child
	if (!isObserved(children[i])) {
            observe(children[i])
        }
        DOMWalker(children[i], 0)
    }
    for(; i< children.length+extraLen;i++) {
        children[i] = undefined;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("HERE")
    DOMWalker(domroot, 0)
});

J$.DOMWalker = DOMWalker
J$.observe = observe
