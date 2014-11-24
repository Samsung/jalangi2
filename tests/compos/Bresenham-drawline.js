
function calc_abs(a){
  if(a < 0) {
    return 0-a;
  } else {
    return a;
  }
} 


/**
* Bresenham's line drawing algorithm.
* It has complexity O(n)
* @param {number} x1 The first coordinate of the beginning of the line
* @param {number} y1 The second coordinate of the beginning of the line
* @param {number} x2 The first coordinate of the end of the line
* @param {number} y2 The second coordinate of the end of the line
*/
function drawLine(x1, y1, x2, y2) {
  var dx = calc_abs(x2 - x1),
    dy = calc_abs(y2 - y1),
    error = dx - dy,
    doubledError;

    var cx, cy;
    if (x1 < x2) {
      cx = 1;
    } else {
      cx = -1;
    }
    if (y1 < y2) {
      cy = 1;
    } else {
      cy = -1;
    }
  
  while (x1 !== x2 || y1 !== y2) {
    drawPoint(x1, y1);
    doubledError = error + error;
    if (doubledError > -dy) {
      error -= dy;
      x1 += cx;
    }
    if (doubledError < dx) {
      error += dx;
      y1 += cy;
    }
  }
}

/**
* Draws (prints) the given coordinates
* @param {number} x The first coordinate of the point
* @param {number} y The second coordinate of the point
*/
function drawPoint(x, y) {
  // do nothing
}

var x1 = J$.readInput(1);
var y1 = J$.readInput(2);

if(x1 > 4) {
  x1 = 3;
}

if(x1 < -4) {
  x1 = -3
}

if(y1 > 4) {
  y1 = 4;
}

if(y1 < -4) {
  y1 = -4;
}

drawLine(x1, 2, y1, 3);



