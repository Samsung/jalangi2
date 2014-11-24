/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var World = (function(){
    var w = {
        boardTexture:{board: 'images/game_014_board.png', black: 'images/game_002_blackpc.png', white: 'images/game_003_whitepc.png', leftPieces: 'images/game_004_pcleftside.png', rightPieces: 'images/game_005_pcrightside.png', hidePieces: 'images/game_015_pcside.png', p1Image: 'images/game_011_settings1p.png', p2Image: 'images/game_010_settings2p.png'},
        board: [[],[],[],[],[],[],[],[]],
        bounder: 8,
        boardview: 'board',
        blackResultView: 'black_result',
        whiteResultView: 'white_result',
        leftPiecesView: 'left_pieces',
        rightPiecesView: 'right_pieces',
        messageview: 'message',
        result: 'result',
        isEnd: false,
        endMessage: '',
        isUserTurn: true,
        isDrawing: false,
        isLock: false,
        isInit: false,
        isConfigure: false,
        isResult: false,
        level: 3,
        playerNum: 1,
        currentColor: 'black',
        step: 4,
        point: [],
        directs: [[1,0],[1,1],[1,-1],[0,1],[0,-1],[-1,0],[-1,1],[-1,-1]],
        heap: {'nextLevel':{}},
        soundSource: {
            'snd_hint':{'src':'sounds/Hint.ogg'},
            'snd_navclick':{'src':'sounds/NavClick.ogg'},
            'snd_navmove':{ 'src':'sounds/NavMove.ogg'},
            'snd_settingsclick':{ 'src':'sounds/SettingsClick.ogg'},
            'snd_theme':{ 'src':'sounds/Theme.ogg'},
            'snd_tileflip':{ 'src':'sounds/TileFlip.ogg'},
            'snd_tileplace':{ 'src':'sounds/TilePlace.ogg'},
            'snd_victoryhorns':{ 'src':'sounds/VictoryHorns.ogg'}
        },
        init: function(play){
            this.playerNum = play || 1;
            for (var i in this.board){
                for (var j=0; j<this.bounder; j++){
                    this.board[i][j] =  'board';
                }
            }
            this.board[3][3] = 'black';
            this.board[4][4] = 'black';
            this.board[3][4] = 'white';
            this.board[4][3] = 'white';

            this.isUserTurn = true;
            this.isLock = false;
            this.isConfigure = false;
            this.isResult = false;
            this.currentColor = 'white';
            this.step = 4;
            this.level = 3;
            this.poing = [];
            this.heap = {'nextLevel':{}};
            var strLeft = '';
            var strRight = '';
            for (var i=0; i<32; i++) {
                strLeft += '<img src="'+this.boardTexture['leftPieces']+'" class="pieces" id="pc0'+i+'" />';
                strRight += '<img src="'+this.boardTexture['rightPieces']+'" class="pieces" id="pc1'+i+'" />';
            }
            $('#'+this.leftPiecesView).html(strLeft);
            $('#'+this.rightPiecesView).html(strRight);
            $('#pc00').attr('src', this.boardTexture['hidePieces']);
            $('#pc01').attr('src', this.boardTexture['hidePieces']);
            $('#pc10').attr('src', this.boardTexture['hidePieces']);
            $('#pc11').attr('src', this.boardTexture['hidePieces']);
            $('#'+this.result).addClass('display_none');
            $('div.configure_panel').addClass('display_none');
            var n = (this.playerNum == 1)?2:1;
            $('.configure_panel_newgame').removeClass('configure_panel_new'+this.playerNum+'game')
                .addClass('configure_panel_new'+n+'game').find('.configure_panel_text')
                .html(getMessage(n+'PlayerGame',n+' Player Game'));

            $('.play1_lable').html(getMessage('player', 'player')+'<span style="font-size:48pt;">1</span>');
            if (this.playerNum == 2) {
                $('.play2_lable').html(getMessage('player', 'player')+'<span style="font-size:48pt;">2</span>');
            } else {
                $('.play2_lable').html(getMessage('computer', 'comp.'));
            }
            this.isInit = true;
            $('#open').addClass('display_none');
            $('#view').removeClass('display_none');
            this.endConfigure();
            this.drawBoard();
        },
        configure: function(){
            if (!this.isLock || (this.isEnd && this.isLock && !this.isResult)) {
                this.playSound('snd_settingsclick');
                if (!this.isConfigure) {
                    this.isConfigure = true;
                    $('a.configure img').attr('src', 'images/game_007_settingsbtnrollover.png');
                    $('div.configure_panel').removeClass('display_none');
                } else {
                    this.endConfigure();
                }
            }
        },
        endConfigure: function(){
            this.isConfigure = false;
            $('div.configure_panel').addClass('display_none');
            $('a.configure img').attr('src', 'images/game_006_settingsbtn.png');
        },
        startOver: function(){
            this.playSound('snd_navclick');
            this.init(this.playerNum);
            this.endConfigure();
        },
        showHelp: function(){
            this.playSound('snd_navclick');
            this.endConfigure();
            $('#help').removeClass('display_none');
        },
        exitHelp: function(){
            this.playSound('snd_navclick');
            $('#help').addClass('display_none');
        },
        getSoundSource: function(snd){
            var ret;
            if (typeof this.soundSource[snd] != 'undefined' && typeof this.soundSource[snd]['audio'] != 'undefined') {
                var source = this.soundSource[snd];
                var p = parseInt(source['point']);
                var step = parseInt(source['audio'].length);
                ret = source['audio'][p];
                this.soundSource[snd]['point'] = (p+1)%step;
            } else {
                var src = this.soundSource[snd]['src'];
                ret = document.getElementById(snd);
                this.soundSource[snd]['audio'] = [ret, new Audio(src)];
                this.soundSource[snd]['point'] = 0;
            }
            return ret;
        },
        playSound: function(snd){
            var audio = this.getSoundSource(snd);
            if (audio.paused == false) {
                audio.pause();
                //audio.currentTime = 0;
            }
            audio.play();
        },
        actionAtPoint: function(place, color){
            var path = [];
            this.heap = this.heap['nextLevel'][String(place[0])+String(place[1])] || {};
            if (typeof this.heap['value'] != 'undefined' && this.heap['color'] == color){
                path = this.heap['path'];
            } else {
                var act = this.getRevertPath(place, color);
                path = act['path'];
                this.heap = {'color':color, 'path':path, 'place':place, 'nextLevel':{}};
            }
            this.clearTips();
            $('#pc'+this.step%2+Math.floor(this.step/2)).attr('src', this.boardTexture['hidePieces']);
            this.step += 1;
            if (this.step >= 50)
                this.level += 1;
            else if (this.setp >= 53)
                this.level += 1;
            else if (this.step >= 55)
                this.level += 2;
            this.playSound('snd_tileplace');
            this.setPoint(place, color);
            this.setBorder(place);
            this.drawPath(path, color);
        },
        setPoint: function(place, color){
            this.board[place[0]][place[1]] = color;
            this.drawPoint(place, color);
        },
        drawPoint: function(place, color){
            $('img#a'+place[0]+place[1]).attr('src', this.boardTexture[color]).removeClass('tip');
            $('a#l'+place[0]+place[1]).attr('onMouseOver','').attr('onMouseOut','');
        },
        drawPath: function(path, color){
            this.isDrawing = true;
            for (var n=0; n < path.length; n++){
                this.board[path[n][0]][path[n][1]] = color;
                var str = 'World.drawPoint(['+path[n][0]+','+path[n][1]+'],\''+color+'\')';
                setTimeout(str, 100*(n+1));
            }
            setTimeout('World.drawMessage()', 100*(path.length+1));
        },
        setBorder: function(place){
            if (this.point.length > 0){
                $('img#a'+this.point[0]+this.point[1]).removeClass('img_board_select');
                $('img#a'+this.point[0]+this.point[1]).addClass('img_board');
            }
            $('img#a'+place[0]+place[1]).removeClass('img_board');
            $('img#a'+place[0]+place[1]).addClass('img_board_select');
            this.point = place;
        },
        drawMessage: function(){
            var bc = 0;
            var wc = 0;
            if (typeof this.heap['value'] != 'undefined'){
                bc = parseInt(this.heap['black']);
                wc = parseInt(this.heap['white']);
            } else {
                var count = {black:0, white:0};
                for (var i=0; i<this.bounder; i++){
                    for (var j=0; j<this.bounder; j++){
                        count[this.board[i][j]] += parseInt(1);
                    }
                }
                bc = count['black'];
                wc = count['white'];
            }
            $('#'+this.blackResultView).html(bc);
            $('#'+this.whiteResultView).html(wc);

            var bpossible;
            var wpossible;

            if (typeof this.heap['value'] != 'undefined' && this.heap['color'] == this.currentColor){
                if (this.heap['color'] == 'white') {
                    bpossible = this.heap['upossible'];
                    wpossible = this.heap['cpossible'];
                } else {
                    wpossible = this.heap['upossible'];
                    bpossible = this.heap['cpossible'];
                }
            } else {
                wpossible = this.possiblePlace('white');
                bpossible = this.possiblePlace('black');
            }
            this.isEnd = ((bpossible.length == 0 && wpossible.length == 0) || (this.step == 64));
            if (!this.isEnd) {
                var tpossible = bpossible;
                if (this.currentColor == 'black') {
                    if (wpossible.length > 0) {
                        this.currentColor = 'white';
                        tpossible = wpossible;
                    }
                } else {
                    if (bpossible.length > 0) {
                        this.currentColor = 'black';
                    } else {
                        tpossilbe = wpossible;
                    }
                }
                $('#'+this.messageview).attr('src', this.boardTexture[this.currentColor]);
                this.possible = tpossible;
                this.setTips(this.currentColor);
                if (this.playerNum == 1 && this.currentColor == 'white') {
                    this.isUserTurn = false;
                    this.computerTurn();
                } else {
                    this.isUserTurn = true;
                }
            } else {
                var p = getMessage('player', 'player');
                var w = getMessage('win', 'Wins');
                if (bc > wc) {
                    $('.result_win_text').html(p+' 1 '+w+'!');
                } else if (bc == wc) {
                    $('.result_win_text').html(getMessage('winDraw', 'Draw!'));
                } else {
                    if (this.playerNum == 2) {
                        $('.result_win_text').html(p+' 2 '+w+'!');
                    } else {
                        $('.result_win_text').html(getMessage('winComputer', 'Computer Wins!'));
                    }
                }
                this.playSound('snd_victoryhorns');
                $('#'+this.result).removeClass('display_none');
                this.isLock = true;
                this.isResult = true;
            }
            this.isDrawing = false;
        },
        closeResult: function() {
            $('#'+this.result).addClass('display_none');
            this.isResult = false;
        },
        setTips: function(color) {
            var stone = this.boardTexture[color];
            var spare = this.boardTexture['board'];
            for (var n in this.possible) {
                var p = this.possible[n];
                if (this.board[p[0]][p[1]] == 'board') {
                    var id = 'l'+p[0]+p[1];
                    $('#'+id).attr('onMouseOver',"$('#"+id+" img').attr('src','"+stone+"').addClass('tip');")
                        .attr('onMouseOut',"$('#"+id+" img').attr('src','"+spare+"').removeClass('tip');");
                }
            }
        },
        clearTips: function() {
            var possible = this.possible;
            for (var n in possible) {
                var p = possible[n];
                var spare = this.boardTexture[this.board[p[0]][p[1]]];
                var id = 'l'+p[0]+p[1];
                $('#'+id).attr('onMouseOver','').attr('onMouseOut','').find('img').attr('src', spare).removeClass('tip');
            }
        },
        drawBoard: function(){

            var str = '';
            for (var i=0; i<this.bounder; i++){
                str += '<div>';
                for (var j=0; j<this.bounder; j++){
                    str += '<span><a onClick="javascript:World.click('+i+','+j+');" id="l'+i+j+'" class="img_style" onMouseOver="" onMouseOut="" ><img src="'+this.boardTexture[this.board[i][j]]+'" id="a'+i+j+'" class="img_board" /></a></span>';
                }
                str += '</div>';
            }
            $('#'+this.boardview).html(str);
            this.drawMessage();
        },

        click: function(i, j){
            if (this.board[i][j] === 'board' && !this.isEnd && this.isUserTurn && !this.isDrawing && !this.isLock && !this.isConfigure) {
                if (this.canRevert([i, j], this.currentColor)){
                    this.actionAtPoint([i,j], this.currentColor);
                    if (this.playerNum == 1) this.isUserTurn = false;
                } else {
                    this.playSound('snd_hint');
                }
            } else if ((this.isConfigure && !this.isEnd && !this.isDrawing && !this.isLock)
                || (this.isConfigure && this.isEnd && !this.isDrawing && this.isLock && !this.isResult)) {
                this.endConfigure();
            }
        },
        computerTurn: function(){
            if (this.isDrawing) {
                setTimeout('World.computerTurn()', 500);
                return;
            }
            var possible;

            if (typeof this.heap['value'] != 'undefined'){
                if (this.heap['color'] == 'white') {
                    possible = this.heap['cpossible'];
                } else {
                    possible = this.heap['upossible'];
                }
            } else {
                possible = this.possiblePlace('white');
            }
            var place = this.bestPlace(possible);
            if (possible.length > 0 && place.length > 0) {
                this.actionAtPoint(place, 'white');
            }
        },

        isContain: function(place, _array) {
            var heat = _array || [];
            for (var i in heat){
                if (heat[i][0] == place[0] && heat[i][1] == place[1]) {
                    return true;
                }
            }
            return false;

        },
        possiblePlace: function(color, _board){
            var ret = [];
            var tmp = {};
            var revColor = ((color == 'white')?'black':'white');
            var board = _board || this.board;
            for (var i=0; i<this.bounder; i++){
                for (var j=0; j<this.bounder; j++){
                    if (board[i][j] === revColor) {
                        for (var n in this.directs) {
                            var ni = i+parseInt(this.directs[n][0]);
                            var nj = j+parseInt(this.directs[n][1]);
                            if (ni >= 0 && ni < this.bounder && nj >= 0 && nj < this.bounder && board[ni][nj] === 'board'){
                                if (this.canRevert([ni, nj], color, board) && !this.isContain([ni, nj], ret)){
                                    ret.push([parseInt(ni), parseInt(nj)]);
                                }
                            }
                        }
                    }
                }
            }

            return ret;
        },
        canRevert: function(place, color, _board){
            var i = parseInt(place[0]);
            var j = parseInt(place[1]);
            var revColor = ((color == 'white')?'black':'white');
            var board = _board || this.board;
            for (var n in this.directs) {
                var di = parseInt(this.directs[n][0]);
                var dj = parseInt(this.directs[n][1]);
                var ni = i+di;
                var nj = j+dj;
                while (ni >= 0 && ni < this.bounder && nj >= 0 && nj < this.bounder && board[ni][nj] === revColor){
                    ni += di;
                    nj += dj;
                    if (ni >= 0 && ni < this.bounder && nj >= 0 && nj < this.bounder && board[ni][nj] === color) {
                        return true;
                    }
                }
            }
            return false;
        },
        getClone: function(obj){
            var ret = [[],[],[],[],[],[],[],[]];

            for(var i = 0; i < this.bounder; i++) {
                for(var j = 0; j < this.bounder; j++) {
                    ret[i][j] = obj[i][j];
                }
            }
            return ret;
        },

        getRevertPath: function(place, color, _board){
            var i = parseInt(place[0]);
            var j = parseInt(place[1]);
            var revColor = ((color == 'white')?'black':'white');
            var board = _board || this.board;
            var path = [];
            for (var n in this.directs) {
                var ni = i+parseInt(this.directs[n][0]);
                var nj = j+parseInt(this.directs[n][1]);
                var tpath = [];
                while (ni >= 0 && ni < this.bounder && nj >= 0 && nj < this.bounder && board[ni][nj] === revColor){
                    tpath.push([ni, nj]);
                    ni += parseInt(this.directs[n][0]);
                    nj += parseInt(this.directs[n][1]);
                    if (ni >= 0 && ni < this.bounder && nj >= 0 && nj < this.bounder && board[ni][nj] === color) {
                        path = $.merge(path, tpath);
                    }
                }
            }
            return {place: place, path: path, color: color};
        },

        doRevert: function(action, _board){
            var color = action['color'];
            var board = _board || this.board;
            var path = action['path'];
            for (var p in path){
                board[path[p][0]][path[p][1]] = color;
            }
            return board;
        },
        getValue: function(place, _board){
            var ret = 0;
            var board = _board || this.board;
            var i = parseInt(place[0]);
            var j = parseInt(place[1]);
            var mtable = {
                0:{ 0:100, 1:-50, 2:40, 3:30, 4:30, 5:40, 6:-50, 7:100},
                1:{ 0:-50, 1:-30, 2:5,  3:1,  4:1,  5:5,  6:-30, 7:-50},
                2:{ 0:40,  1:5,   2:20, 3:10, 4:10, 5:20, 6:5,   7:40},
                3:{ 0:30,  1:1,   2:10, 3:0,  4:0,  5:10, 6:1,   7:30},
                4:{ 0:30,  1:1,   2:10, 3:0,  4:0,  5:10, 6:1,   7:30},
                5:{ 0:40,  1:5,   2:20, 3:10, 4:10, 5:20, 6:5,   7:40},
                6:{ 0:-50, 1:-30, 2:5,  3:1,  4:1,  5:5,  6:-30, 7:-50},
                7:{ 0:100, 1:-50, 2:40, 3:30, 4:30, 5:40, 6:-50, 7:100}
            };
            return parseInt(mtable[i][j]);
        },
        evaluate: function(place, _color, _board, _level, _heap){
            var ret = -100000;
            var level = _level || this.level;
            var heap = _heap || this.heap;
            if (typeof heap['nextLevel'][String(place[0])+String(place[1])] == 'undefined'){
                heap['nextLevel'][String(place[0])+String(place[1])] = {};
            }
            heap = heap['nextLevel'][String(place[0])+String(place[1])];
            level = parseInt(level);
            var toEndLevel = 64-parseInt(this.step);
            level = (level>toEndLevel?toEndLevel:level);
            var nextValue = 0;
            /*
             var i = parseInt(place[0]);
             var j = parseInt(place[1]);*/

            var color = _color || 'white';
            var board = _board || this.board;
            board = this.getClone(board);
            var revColor = ((color == 'white')?'black':'white');
            var sym = ((color == 'white')?1:-1);

            board[place[0]][place[1]] = color;

            var path;
            var cp;
            var up;
            if (typeof heap['value'] != 'undefined'){
                path = heap['path'];
                ret = heap['value'];
                cp = heap['cpossible'];
                up = heap['upossible'];
                board = this.doRevert(heap, board);
            } else {
                var act = this.getRevertPath(place, color, board);
                heap['path'] = act['path'];
                heap['color'] = color;
                heap['place'] = place;
                board = this.doRevert(heap, board);
                cp = this.possiblePlace(color, board);
                up = this.possiblePlace(revColor, board);

                var cv = 0;
                var uv = 0;
                var cc = 0;
                var uc = 0;

                for (var i=0; i<this.bounder; i++){
                    for (var j=0; j<this.bounder; j++){
                        if (board[i][j] === color) {
                            cv += this.getValue([i, j], board);
                            cc++;
                        } else if (board[i][j] === revColor){
                            uv += this.getValue([i, j], board);
                            uc++;
                        }
                    }
                }

                ret = (cp.length-up.length)*10;
                ret += (cv-uv)*2;
                if (up.length == 0 && cp.length > 0) ret = 100000;
                heap['value'] = ret;
                heap['nextLevel'] = {};
                heap['cpossible'] = cp;
                heap['upossible'] = up;
                heap[color] = cc;
                heap[revColor] = uc;
            }

            if (level > 1 && (up.length > 0 || cp.length > 0)){
                if (up.length == 0){
                    up = cp;
                    revColor = color;
                }
                up = this.getBestPlaceSet(up);
                for (var p in up) {
                    nextValue += this.evaluate(up[p], revColor, board, level-1, heap);
                }
                if (up.length > 0){
                    nextValue = nextValue/up.length;
                    ret = Math.round(ret*0.5+nextValue*0.5);
                }
            }

            return ret*sym;
        },
        getBestPlaceSet: function(possible){
            var best = [];
            var middle = [];
            var ret = [];
            for (var i in possible){
                var t = this.getValue(possible[i]);
                if (t == 100) {
                    best.push(possible[i]);
                } else if (t >= 0) {
                    middle.push(possible[i]);
                }
            }

            if (best.length > 0){
                ret = best;
            } else if (middle.length > 0){
                ret = middle;
            } else {
                ret = possible;
            }
            return ret;
        },
        bestPlace: function(possible){
            if (possible.length == 0)
                console.log('Error: No possible places?!!!');
            possible = this.getBestPlaceSet(possible);

            var ret = [];
            if (possible.length > 0) {
                ret = possible[0];
                var value = this.evaluate(ret);
                for (var p=1; p<possible.length; p++) {
                    var v = this.evaluate(possible[p]);
                    if (v > value){
                        value = v;
                        ret = possible[p];
                    }
                }
            } else {
                console.log('Error: No Setting place for Computer');
            }
            return ret;
        }
    };
    return w;
})();

function getMessage(key, alter) {
    var ret = alter || '';
    if (window.chrome && window.chrome.i18n && window.chrome.i18n.getMessage) {
        ret = chrome.i18n.getMessage(key);
    } else {
        if (typeof this.messages == 'undefined') {
            $.getJSON("_locales/en/messages.json", function(data){
                this.messages = data;
            }).error(function(){
                    return ret;
                });
        }
        if (this.messages && (this.messages.hasOwnProperty(key)) && (this.messages[key].hasOwnProperty('message'))) {
            ret = this.messages[key].message;
        }
    }
    return ret;
}

$(document).ready(function(){
    license_init("license", "open");
    $('title').html(getMessage('name', 'Annex'));
    $('#open1').html(getMessage('1PlayerGame', '1 Player Game'));
    $('#open2').html(getMessage('2PlayerGame', '2 Player Game'))
    $('#open_help').html(getMessage('howtoPlay', 'How to Play'));
    $('#open_exit').html(getMessage('exit', 'Exit'));
    $('.play1_pieces_lable').html(getMessage('pieces', 'pieces'));
    $('.play2_pieces_lable').html(getMessage('pieces', 'pieces'));
    $('#turn').html(getMessage('turn', "'s Turn"));
    $('.result_new_p1').html(getMessage('newOneGame', 'New 1P Game'));
    $('.result_new_p2').html(getMessage('newTwoGame', 'New 2P Game'));
    $('.result_exit').html(getMessage('exit', 'Exit'));
    $('.help_title').html(getMessage('howtoPlay', 'How to Play'));
    $('.help_contain').html(getMessage('help', "Play a piece on the board so that one or more of your opponent’s pieces are between two of your pieces. All of the opponent’s pieces between your own turn over and become your color.<br>The player with the most pieces on the board at the end of the game wins!"));
    $('.help_exit').html(getMessage('goBack', 'Go Back'));
    $('#license').html(getMessage('license', 'License'));
    $('#readme').html(getMessage('readme', 'Readme'));
    $('.configure_panel_startover').click(function(){
        World.startOver();
    }).hover(function(){
            $(this).css('background-color','#222222');
            World.playSound('snd_navmove');
        },function(){
            $(this).css('background-color','#000000');
        }).find('.configure_panel_text').html(getMessage('startover','Start over'));

    $('.configure_panel_newgame').hover(function(evt){
        $(this).css('background-color','#222222');
        World.playSound('snd_navmove');
    },function(evt){
        $(this).css('background-color','#000000');
    }).click(function(){
            var n = 1;
            if ($(this).hasClass('configure_panel_new2game')){
                n = 2;
            }
            World.playSound('snd_navclick');
            World.init(n);
        });

    $('.configure_panel_help').click(function(){
        World.showHelp();
    }).hover(function(){
            $(this).css('background-color','#222222');
            World.playSound('snd_navmove');
        },function(){
            $(this).css('background-color','#000000');
        }).find('.configure_panel_text').html(getMessage('rules','Rules'));

    $('.configure_panel_exit').click(function(){
        window.close();
    }).hover(function(){
            $(this).css('background-color','#222222');
            World.playSound('snd_navmove');
        },function(){
            $(this).css('background-color','#000000');
        }).find('.configure_panel_text').html(getMessage('exit','Exit'));

    World.playSound('snd_theme');
});
