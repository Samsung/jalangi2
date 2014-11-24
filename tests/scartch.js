var
    elements = [], n,
    all = document.getElementsByTagName('*'),
    types = [ 'click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover',
        'mouseup', 'change', 'focus', 'blur', 'scroll', 'select', 'submit', 'keydown', 'keypress',
        'keyup', 'load', 'unload' ],
    i, iLen, j, jLen = types.length;

for ( i=0, iLen=all.length ; i<iLen ; i++ ) {
    for ( j=0 ; j<jLen ; j++ ) {
        if ( typeof all[i]['on'+types[j]] == 'function' ) {
            elements.push( all[i]['on'+types[j]]);
        }
    }
}
