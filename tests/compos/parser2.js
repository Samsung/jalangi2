var ident = 1, number = 2, lparen = 3, rparen = 4, times = 5, slash = 6, plus = 7,
    minus = 8, eql = 9, neq = 10, lss = 11, leq = 12, gtr = 13, geq = 14, callsym = 15, beginsym = 16, semicolon = 17,
    endsym = 18, ifsym = 19, whilesym = 20, becomes = 21, thensym = 22, dosym = 23, constsym = 24, comma = 25,
    varsym = 26, procsym = 27, period = 28, oddsym = 29;

var sym;
var count = 0, N = 4;

function getsym() {
    if (count < N) {
        count++;
        sym = J$.readInput(1);
    } else {
        sym = 0;
    }
}

function accept(s) {
    if (sym == s) {
        getsym();
        return 1;
    }
    return 0;
}

function expect(s) {
    if (accept(s))
        return 1;
    console.log("expect: unexpected symbol");
    return 0;
}

function factor() {
    if (accept(ident)) {
        ;
    } else if (accept(number)) {
        ;
    } else if (accept(lparen)) {
        expression();
        expect(rparen);
    } else {
        console.log("factor: syntax error");
        getsym();
    }
}

function term() {
    factor();
    while (sym == times || sym == slash) {
        getsym();
        factor();
    }
}

function expression() {
    if (sym == plus || sym == minus)
        getsym();
    term();
    while (sym == plus || sym == minus) {
        getsym();
        term();
    }
}

function condition() {
    if (accept(oddsym)) {
        expression();
    } else {
        expression();
        if (sym == eql || sym == neq || sym == lss || sym == leq || sym == gtr || sym == geq) {
            getsym();
            expression();
        } else {
            console.log("condition: invalid operator");
            getsym();
        }
    }
}

function statement() {
    if (accept(ident)) {
        expect(becomes);
        expression();
    } else if (accept(callsym)) {
        expect(ident);
    } else if (accept(beginsym)) {
        do {
            statement();
        } while (accept(semicolon));
        expect(endsym);
    } else if (accept(ifsym)) {
        condition();
        expect(thensym);
        statement();
    } else if (accept(whilesym)) {
        condition();
        expect(dosym);
        statement();
    } else {
        console.log("statement: syntax error");
        getsym();
    }
}

function block() {
    if (accept(constsym)) {
        do {
            expect(ident);
            expect(eql);
            expect(number);
        } while (accept(comma));
        expect(semicolon);
    }
    if (accept(varsym)) {
        do {
            expect(ident);
        } while (accept(comma));
        expect(semicolon);
    }
    while (accept(procsym)) {
        expect(ident);
        expect(semicolon);
        block();
        expect(semicolon);
    }
    statement();
}

function program() {
    getsym();
    block();
    expect(period);
}

program();
