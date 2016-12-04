/**
 * Created by wanhong on 16/12/3.
 */
var max_title_count = 42;
var fieldSizeX = 6;
var fieldSizeY = 5;
var TILE_WIDTH = 120;
var TILE_HEIGHT = 120;
var ITEM_TYPE_COUNT = 6;
var selectItem;
var fieldDatas;
var level = 1;
var game;
var tileGroup;

window.onload = function () {
    game = new Phaser.Game(1280, 720, Phaser.AUTO, 'llk');
    // adding "TheGame" state
    game.state.add("TheGame", TheGame);
    // launching "TheGame" state
    game.state.start("TheGame");
}

var TheGame = function(){};

TheGame.prototype = {
    // function to be executed when the game preloads
    preload: function() {
        // load the only graphic asset in the game, a white tile which will be tinted on the fly
        game.load.image("bg", "assets/background.png");
        game.load.atlasJSONArray("atlas", "assets/atlas.png", "assets/atlas.json");
    },

    create: function (){
        // scaling the game to cover the entire screen, while keeping its ratio
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // horizontally centering the game
        game.scale.pageAlignHorizontally = true;
        // vertically centering the game
        game.scale.pageAlignVertically = true;

        game.add.sprite(0, 0, "bg");
        tileGroup = game.add.group();
        tileGroup.x = 120;
        tileGroup.y = 120;

        generateDate();
        drawField(fieldDatas)
    }
}

function generateDate() {
    fieldDatas = [];
    var tempArr = [];
    for (var i = 0; i < fieldSizeX * fieldSizeY / 2; i++) {
        var value = Math.floor(Math.random() * ITEM_TYPE_COUNT);
        tempArr.push(value, value);
    }
    Phaser.ArrayUtils.shuffle(tempArr);
    for (var i = 0; i < fieldSizeY; i++){
        fieldDatas[i] = [];
        for (var j = 0; j < fieldSizeX; j++){
            fieldDatas[i][j] = tempArr[i * fieldSizeX + j];
        }
    }
}

function drawField(datas) {
    var arr = datas.concat();
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length;j++){
            if (arr[i][j] >= 0) {
                var tile = game.add.sprite(TILE_HEIGHT * j, TILE_WIDTH * i, "atlas", "tile_" + arr[i][j]);
                tile.inputEnabled = true;
                tile.events.onInputDown.add(onItemDown, this);
                tile.value = arr[i][j];
                tile.row = i;
                tile.col = j;
                tileGroup.addChild(tile);
            }
        }
    }
}

function onItemDown(e) {
    if (!selectItem) {
        selectItem = e;
    } else {
        if (e != selectItem) {
            if (e.value != selectItem.value) {
                console.log("not some item");

            } else if (checkColLink(selectItem, e) || checkRowLink(selectItem, e)) {
                console.log("link success");
                clearItems(selectItem, e);
            } else {

            }
            selectItem = null;
        }
    }
}

function clearItems(start, end) {
    tileGroup.removeChild(start);
    tileGroup.removeChild(end);
    fieldDatas[start.row][start.col] = -1;
    fieldDatas[end.row][end.col] = -1;
    selectItem = null;
}

function resetItems() {

}

function checkColLink(start, end) {
    var startArr = getEmptyItemsInCol(start);
    var endArr = getEmptyItemsInCol(end);
    console.log("col  link");
    console.log(startArr);
    console.log(endArr);
    var result = false;
    for (var i = 0; i < startArr.length; i++){
        for (var j = 0; j < endArr.length; j++){
            if (isLineEmpty(startArr[i], endArr[j])) {
                return true;
            }
        }
    }
    return result;
}

function checkRowLink(start, end){
    var startArr = getEmptyItemsInRow(start);
    var endArr = getEmptyItemsInRow(end);
    console.log("row  link");
    console.log(startArr);
    console.log(endArr);
    var result = false;
    for (var i = 0; i < startArr.length; i++){
        for (var j = 0; j < endArr.length; j++){
            if (isLineEmpty(startArr[i], endArr[j])) {
                return true;
            }
        }
    }
    return result;
}

function checkVictory(){

}

function getEmptyItemsInCol(item) {
    var result = [{row:item.row, col:item.col}];
    var col = item.col;
    var row = item.row;
    for (var i = col - 1; i >= -1; i--) {
        if (isEmpty(row, i)) {
            result.push({row:row, col:i});
        } else {
            break;
        }
    }
    for (var i = col + 1; i <= fieldSizeX; i++) {
        if (isEmpty(row, i)) {
            result.push({row:row, col:i});
        } else {
            break;
        }
    }
    return result;
}

function getEmptyItemsInRow(item){
    var result = [{row:item.row, col:item.col}];
    var col = item.col;
    var row = item.row;
    for (var i = row - 1; i >= -1; i--) {
        if (isEmpty(i, col)) {
            result.push({row:i, col:col})
        } else {
            break;
        }
    }
    for (var i = row + 1; i <= fieldSizeY; i++) {
        if (isEmpty(i, col)) {
            result.push({row:i, col:col})
        } else {
            break;
        }
    }
    return result;
}

function isLineEmpty(start, end){
    var startRow = start.row;
    var startCol = start.col;
    var endRow = end.row;
    var endCol = end.col;
    var result = false;
    if (startCol == endCol) {
        result = true;
        var from = Math.min(startRow, endRow) + 1;
        var to = Math.max(startRow, endRow);
        for (var i = from; i < to; i++) {
            if (!isEmpty(i, startCol)) {
                result = false;
                break;
            }
        }
    } else if (startRow == endRow) {
        result = true;
        from = Math.min(startCol, endCol) + 1;
        to = Math.max(startCol, endCol);
        for (var i = from; i < to; i++) {
            if (!isEmpty(startRow, i)) {
                result = false;
                break;
            }
        }
    }
    return result;
}

function isEmpty(row, col) {
    var result = false;
    if (row <= -1 || row >= fieldSizeY) {
        result = true;
    } else if (col <= -1 || col >= fieldSizeX) {
        result = true;
    } else {
        result = fieldDatas[row][col] < 0;
    }
    return result;
}

