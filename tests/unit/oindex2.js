
function GeneratePayloadTree(depth, tag) {
    if (depth == 0) {
        return {
            array  : [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
            string : 'String for key ' + tag + ' in leaf node'
        };
    } else {
        return {
            left:  GeneratePayloadTree(depth - 1, tag),
            right: GeneratePayloadTree(depth - 1, tag)
        };
    }
}


var x = GeneratePayloadTree(2,"x");
//console.log(JSON.stringify(x));

function printT(tree) {
    if (tree) {
        if (tree.left) {
            printT(tree.left);
        }
        if (tree.array) {
            console.log(tree.array);
        }
        if (tree.right) {
            printT(tree.right);
        }
    }
}

printT(x);
