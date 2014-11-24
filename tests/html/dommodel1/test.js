function DOMWalker(node, indent, extraLen) {
    var children = node.childNodes
    for (var i = 0; i < children.length; i++) {
        console.log("bar")
        DOMWalker(children[i], indent + " ", 0)
    }
    for(; i< children.length+extraLen;i++) {
        console.log("zee")
        children[i] = undefined;
    }
}
elem = document.createElement("div");
var elem1 = document.createElement("span");
var elem2 = document.createElement("p");
elem1.p = {p: "LARGE"}
var config = { attributes: true, childList: true, characterData: true, subtree: true};
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mut) {
        DOMWalker(mut.target, "", mut.removedNodes.length)
    })
})
observer.observe(elem, config);

elem.appendChild(elem1)
elem.appendChild(elem2)

console.log("DONE")