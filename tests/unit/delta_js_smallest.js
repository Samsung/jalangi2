function runTypescript() {
    var compiler = createCompiler();
    compiler.addUnit(compiler_input);
    compiler.emit();
}
function createCompiler() {
    var compiler = new TypeScript.TypeScriptCompiler();
    return compiler;
}
var compiler_input = '/// <reference path="./ts-declarations/jalangi.d.ts" />\n\n/**\n * Created by m.sridharan on 1/28/14.\n */\n\n/**\n * computes the dominator tree for a DAG.\n *\n * See http://www.cs.rice.edu/~keith/EMBED/dom.pdf, Figure 3\n * TODO document node numbering\n * TODO proper type for nodes parameter, Array<ConcolicValue>\n * @param nodes nodes in the DAG, in topological order\n * @param getNodeId for any node, returns its index in the nodes array\n * @param forEachSucc function for iterating over the successors of a node\n * and applying a callback to each one\n * @returns {Array<number>} an array giving the idom for each node\n */\nexport function computeDominators<T>(nodes : Array<T>,\n                                  getNodeId: (node: T) => number,\n                                  forEachSucc: (node: T, cb: (T) => void) => void): Array<number> {\n    // TODO optimize: make this a typed array?\n    var idom : Array<number> = [];\n    // TODO optimize: don\'t use array for pred list of size 1\n    var pred: Array<Array<number>> = [];\n    idom[0] = 0;\n    var succHandler = function (i:number) {\n        return function (succ:T) {\n            var preds = pred[getNodeId(succ)];\n            if (preds) {\n                if (preds.indexOf(i) === -1) {\n                    preds.push(i);\n                }\n            } else {\n                preds = [i];\n                pred[getNodeId(succ)] = preds;\n            }\n        }\n    };\n\n    forEachSucc(nodes[0], succHandler(0));\n    // computes least common ancestor in dominator tree\n    var leastCommonAncestor = function (b1: number, b2: number): number {\n        var finger1 = b1;\n        var finger2 = b2;\n        while (finger1 != finger2) {\n            while (finger1 > finger2) {\n                finger1 = idom[finger1];\n            }\n            while (finger2 > finger1) {\n                finger2 = idom[finger2];\n            }\n        }\n        return finger1;\n    };\n\n    for (var i = 1; i < nodes.length; i++) {\n        var preds = pred[i];\n        var new_idom = preds[0];\n        for (var j = 1; j < preds.length; j++) {\n            new_idom = leastCommonAncestor(preds[j], new_idom);\n        }\n        idom[i] = new_idom;\n        forEachSucc(nodes[i], succHandler(i));\n    }\n    return idom;\n}\n';
(function () {
    (function () {
    }(TypeScript.ErrorRecoverySet = {}));
}(TypeScript = {}));
(function () {
    var BlockIntrinsics = function () {
            function BlockIntrinsics() {
            }
            return BlockIntrinsics;
        }();
    var StringHashTable = function () {
            function StringHashTable() {
                this.table = new BlockIntrinsics();
            }
            StringHashTable.prototype.add = function (key, data) {
                this.table[key] = data;
            };
            StringHashTable.prototype.lookup = function (key) {
                var data = this.table[key];
                return data;
            };
            return StringHashTable;
        }();
    TypeScript.StringHashTable = StringHashTable;
}());
var __extends = function (d, b) {
    function __() {
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};
(function () {
    var AST = function () {
            function AST() {
            }
            AST.prototype.emit = function () {
            };
            return AST;
        }();
    var ASTList = function () {
            function ASTList() {
                this.members = new Array();
            }
            ASTList.prototype.append = function (ast) {
                this.members[this.members.length] = ast;
            };
            return ASTList;
        }();
    TypeScript.ASTList = ASTList;
    var Identifier = function (_super) {
            __extends(Identifier, _super);
            function Identifier() {
            }
            Identifier.fromToken = function fromToken() {
            };
            return Identifier;
        }(AST);
    TypeScript.Identifier = Identifier;
    var MissingIdentifier = function (_super) {
            __extends(MissingIdentifier, _super);
            function MissingIdentifier() {
            }
            return MissingIdentifier;
        }(Identifier);
    TypeScript.MissingIdentifier = MissingIdentifier;
    var VarDecl = function () {
            function VarDecl() {
            }
            VarDecl.prototype.emit = function () {
                emitter.emitJavascriptVarDecl(this);
            };
            return VarDecl;
        }();
    TypeScript.VarDecl = VarDecl;
    var FuncDecl = function () {
            function FuncDecl(name, bod) {
                this.bod = bod;
            }
            FuncDecl.prototype.emit = function () {
                emitter.emitJavascriptFunction(this);
            };
            return FuncDecl;
        }();
    TypeScript.FuncDecl = FuncDecl;
    var Script = function (_super) {
            __extends(Script, _super);
            function Script() {
            }
            return Script;
        }(FuncDecl);
    TypeScript.Script = Script;
}());
(function () {
    var EmitOptions = function () {
            function EmitOptions() {
            }
            return EmitOptions;
        }();
    TypeScript.EmitOptions = EmitOptions;
    var Emitter = function () {
            function Emitter() {
                this.varListCountStack = [];
            }
            Emitter.prototype.emitInnerFunction = function (funcDecl) {
                this.emitBareJavascriptStatements(funcDecl.bod);
            };
            Emitter.prototype.emitJavascriptFunction = function (funcDecl) {
                this.emitInnerFunction(funcDecl);
            };
            Emitter.prototype.varListCount = function () {
                return this.varListCountStack[this.varListCountStack.length - 1];
            };
            Emitter.prototype.emitJavascriptVarDecl = function (varDecl) {
                {
                    this.varListCountStack.push(0);
                    this.emitJavascript(varDecl.init);
                    this.varListCountStack.pop();
                }
            };
            Emitter.prototype.emitBareJavascriptStatements = function (stmts) {
                this.emitJavascriptList(stmts);
            };
            Emitter.prototype.emitJavascriptList = function (ast) {
                {
                    var list = ast;
                    var len = list.members.length;
                    for (var i = 0; i < len; i++) {
                        var emitNode = list.members[i];
                        this.emitJavascript(emitNode);
                        if (this.varListCount() >= 0 && emitNode.nodeType) {
                        }
                    }
                }
            };
            Emitter.prototype.emitJavascript = function (ast) {
                ast.emit();
            };
            return Emitter;
        }();
    TypeScript.Emitter = Emitter;
}());
(function () {
    var Parser = function () {
            function Parser() {
                this.scanner = new TypeScript.Scanner();
            }
            Parser.prototype.createRef = function () {
            };
            Parser.prototype.parseFunctionBlock = function (errorRecoverySet, allowedElements, parentModifiers, bod) {
                this.parseStatementList(errorRecoverySet, bod);
            };
            Parser.prototype.parseFunctionStatements = function (errorRecoverySet, allowedElements, parentModifiers) {
                var bod = null;
                {
                    bod = new TypeScript.ASTList();
                    this.parseFunctionBlock(errorRecoverySet, allowedElements, parentModifiers, bod);
                }
                var funcDecl = new TypeScript.FuncDecl(name, bod);
                return funcDecl;
            };
            Parser.prototype.parseFncDecl = function () {
                {
                    name = TypeScript.Identifier.fromToken();
                    this.currentToken = this.scanner.scan();
                }
                var funcDecl = this.parseFunctionStatements();
                return funcDecl;
            };
            Parser.prototype.makeVarDecl = function () {
                var varDecl = new TypeScript.VarDecl();
                return varDecl;
            };
            Parser.prototype.parseVariableDeclaration = function () {
                var varDecl = null;
                this.scanner.scan();
                while (true) {
                    varDecl = this.makeVarDecl();
                    this.scanner.scan();
                    {
                        this.currentToken = this.scanner.scan();
                        varDecl.init = this.parseExpr();
                    }
                    return varDecl;
                }
            };
            Parser.prototype.parseTerm = function () {
                switch (this.currentToken.tokenId) {
                case TypeScript.TokenID.Function:
                    ast = this.parseFncDecl();
                }
                if (this.currentToken.tokenId == TypeScript.TokenID.Identifier)
                    ast = this.createRef();
                if (ast == null)
                    switch (this.currentToken.tokenId) {
                    default: {
                            var ident = new TypeScript.MissingIdentifier();
                            ast = ident;
                        }
                    }
            };
            Parser.prototype.parseExpr = function () {
                this.parseTerm();
                return ast;
            };
            Parser.prototype.parseStatement = function () {
                for (;;) {
                    switch (this.currentToken.tokenId) {
                    case TypeScript.TokenID.Var: {
                            var declAst = this.parseVariableDeclaration();
                            ast = declAst;
                        }
                    default: {
                            this.parseExpr();
                            this.currentToken = this.scanner.scan();
                        }
                    }
                    break;
                }
                return ast;
            };
            Parser.prototype.parseStatementList = function (errorRecoverySet, statements) {
                for (;;) {
                    if (this.currentToken.tokenId == TypeScript.TokenID.CloseBrace || this.currentToken.tokenId == TypeScript.TokenID.EndOfFile)
                        return;
                    var stmt = this.parseStatement();
                    statements.append(stmt);
                }
            };
            Parser.prototype.parse = function (sourceText) {
                this.scanner.setSourceText(sourceText);
                this.currentToken = this.scanner.scan();
                var bod = new TypeScript.ASTList();
                while (true) {
                    this.parseStatementList(TypeScript.ErrorRecoverySet.EOF, bod);
                    if (this.currentToken.tokenId === TypeScript.TokenID.EndOfFile)
                        break;
                    this.currentToken = this.scanner.scan();
                }
                var script = new TypeScript.Script();
                script.bod = bod;
                return script;
            };
            return Parser;
        }();
    TypeScript.Parser = Parser;
}());
(function () {
    TypeScript.LexCodeEQ = '='.charCodeAt();
    TypeScript.LexCodeRC = '}'.charCodeAt();
    TypeScript.LexCodeSpace = 32;
    TypeScript.LexCodeASCIIChars = 128;
    var autoToken = new Array();
    var lexIdStartTable = new Array();
    function LexInitialize() {
        TypeScript.initializeStaticTokens();
        autoToken[TypeScript.LexCodeRC] = TypeScript.staticTokens[TypeScript.TokenID.CloseBrace];
        TypeScript.LexKeywordTable = new TypeScript.StringHashTable();
        for (var i in TypeScript.TokenID._map)
            TypeScript.LexKeywordTable.add(TypeScript.TokenID._map[i].toLowerCase(), i);
        for (var j = 0; j < TypeScript.LexCodeASCIIChars; j++)
            if (LexIsIdentifierStartChar(j))
                lexIdStartTable[j] = true;
            else {
            }
    }
    function LexIsIdentifierStartChar(code) {
        return code >= 97 && code <= 122 || code >= 65 && code <= 90;
    }
    var StringSourceText = function () {
            function StringSourceText(text) {
                this.text = text;
            }
            StringSourceText.prototype.getText = function () {
                return this.text.substring();
            };
            return StringSourceText;
        }();
    TypeScript.StringSourceText = StringSourceText;
    var Scanner = function () {
            function Scanner() {
                LexInitialize();
            }
            Scanner.prototype.setSourceText = function (newSrc) {
                this.pos = 0;
                this.src = newSrc.getText();
                this.len = this.src.length;
            };
            Scanner.prototype.tokenStart = function () {
                this.startPos = this.pos;
            };
            Scanner.prototype.peekChar = function () {
                return this.src.charCodeAt(this.pos);
            };
            Scanner.prototype.nextChar = function () {
                this.pos++;
                this.ch = this.peekChar();
            };
            Scanner.prototype.scan = function () {
                this.prevTok = this.innerScan();
                return this.prevTok;
            };
            Scanner.prototype.scanIdentifier = function () {
                for (;;) {
                    while (lexIdStartTable[this.ch])
                        this.nextChar();
                    break;
                }
                var text = this.src.substring(this.startPos, this.pos);
                if (id = TypeScript.LexKeywordTable.lookup(text))
                    return TypeScript.staticTokens[id];
                else
                    return new TypeScript.IdentifierToken();
            };
            Scanner.prototype.innerScan = function () {
                start:
                    while (this.pos < this.len)
                        if (lexIdStartTable[this.ch])
                            return this.scanIdentifier();
                        else if (this.ch == TypeScript.LexCodeSpace) {
                            do
                                this.nextChar();
                            while (this.ch == TypeScript.LexCodeSpace);
                            this.tokenStart();
                        } else if (autoToken[this.ch]) {
                            var atok = autoToken[this.ch];
                            this.nextChar();
                            return atok;
                        } else
                            switch (this.ch) {
                            case TypeScript.LexCodeEQ: {
                                    this.nextChar();
                                    return TypeScript.staticTokens[TypeScript.TokenID.Equals];
                                }
                            default:
                                this.nextChar();
                            }
                return TypeScript.staticTokens[TypeScript.TokenID.EndOfFile];
            };
            return Scanner;
        }();
    TypeScript.Scanner = Scanner;
}());
(function () {
    (function (TokenID) {
        TokenID._map = [];
        TokenID._map[20] = 'Function';
        TokenID.Function = 20;
        TokenID._map[49] = 'Var';
        TokenID.Var = 49;
        TokenID.CloseBrace = 60;
        TokenID.Equals = 62;
        TokenID.EndOfFile = 104;
        TokenID.EqualsGreaterThan = 105;
        TokenID.LimFixed = TokenID.EqualsGreaterThan;
    }(TypeScript.TokenID = {}));
    var TokenID = TypeScript.TokenID;
    var Token = function () {
            function Token(tokenId) {
                this.tokenId = tokenId;
            }
            return Token;
        }();
    var IdentifierToken = function () {
            function IdentifierToken() {
            }
            return IdentifierToken;
        }();
    TypeScript.IdentifierToken = IdentifierToken;
    TypeScript.staticTokens = new Array();
    function initializeStaticTokens() {
        for (var i = 0; i <= TokenID.LimFixed; i++)
            TypeScript.staticTokens[i] = new Token(i);
    }
    TypeScript.initializeStaticTokens = initializeStaticTokens;
}());
(function () {
    var TypeScriptCompiler = function () {
            function TypeScriptCompiler() {
                this.parser = new TypeScript.Parser();
                this.scripts = new TypeScript.ASTList();
            }
            TypeScriptCompiler.prototype.timeFunction = function (funcDescription, func) {
                return TypeScript.timeFunction(this.logger, funcDescription, func);
            };
            TypeScriptCompiler.prototype.addUnit = function (prog) {
                return this.addSourceUnit(new TypeScript.StringSourceText(prog));
            };
            TypeScriptCompiler.prototype.addSourceUnit = function (sourceText) {
                var _this = this;
                return this.timeFunction('addSourceUnit(', function () {
                    var script = _this.parser.parse(sourceText);
                    _this.scripts.append(script);
                });
            };
            TypeScriptCompiler.prototype.emitUnit = function (script) {
                emitter = new TypeScript.Emitter();
                emitter.emitJavascript(script);
            };
            TypeScriptCompiler.prototype.emit = function () {
                for (var i = 0, len = this.scripts.members.length; i < len; i++) {
                    var script = this.scripts.members[i];
                    this.emitUnit(script);
                }
            };
            return TypeScriptCompiler;
        }();
    TypeScript.TypeScriptCompiler = TypeScriptCompiler;
}());
(function () {
    function timeFunction(logger, funcDescription, func) {
        var result = func();
    }
    TypeScript.timeFunction = timeFunction;
}());
runTypescript();