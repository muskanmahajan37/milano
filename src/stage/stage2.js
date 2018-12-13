define([
  'src/constants/colors.js',
  'createjs'
], function (COLORS) {
  var stage, preload, typingValue, keyboardFontSize = 30, keyboardValues = [];
  var KEYBOARDS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '删除', '确认']
  ];

  var load = function () {
    stage = new createjs.Stage('demoCanvas');
    createjs.Touch.enable(stage);

    return new Promise(function (resolve, reject) {
      preload = new createjs.LoadQueue();
      preload.addEventListener('complete', function () {
        resolve();
      });
      preload.addEventListener('error', function () {
        reject();
      });
      preload.loadManifest({src: 'assets/manifest/stage2.manifest.json', type: 'manifest'});
    })
  };

  var handleKeyboardInput = function (event) {
    var text = event.currentTarget.children[1].text;
    if (text === '删除') {
      keyboardValues.pop();
      typingValue.x = typingValue.x + keyboardFontSize / 4;
    } else if (text === '确认') {
      finish();
    } else {
      keyboardValues.push(text);
      typingValue.x = typingValue.x - keyboardFontSize / 4;
    }
    typingValue.text = keyboardValues.join('');
    stage.update();
  };

  var createKeyboards = function () {
    var kX, kY;
    for (var charsIndex in KEYBOARDS) {
      kX = 50 + charsIndex * 10;
      kY = stage.canvas.height / 2 + charsIndex * keyboardFontSize;
      for (var index in KEYBOARDS[charsIndex]) {
        var char = KEYBOARDS[charsIndex][index];
        var keyContainer = new createjs.Container();
        var keyboardText;
        if (char === '删除' || char === '确认') {
          keyboardText = new createjs.Text(char, "12px monospace", COLORS.KEYBOARD);
        } else {
          keyboardText = new createjs.Text(char, "24px monospace", COLORS.KEYBOARD);
        }

        var bg1 = new createjs.Shape();
        bg1.graphics.beginFill(COLORS.KEYBOARD_BG).drawRoundRectComplex(kX - keyboardFontSize / 2 + 8, kY - keyboardFontSize / 2 - 5,
          keyboardFontSize - 2, keyboardFontSize - 2, 4, 4, 4, 4);

        keyboardText.x = kX;
        keyboardText.y = kY;
        keyboardText.textBaseline = "alphabetic";
        kX = kX + keyboardFontSize;

        var blurFilter = new createjs.BlurFilter(1, 1, 1);
        keyboardText.filters = [blurFilter];
        var bounds = blurFilter.getBounds();

        keyboardText.cache(-50 + bounds.x, -50 + bounds.y, 100 + bounds.width, 100 + bounds.height);

        keyContainer.addChild(bg1, keyboardText);
        keyContainer.on('click', handleKeyboardInput);
        stage.addChild(keyContainer);
      }
    }
  };

  var start = function () {
    typingValue = new createjs.Text('', '20px monospace', COLORS.SCENE_TEXT);
    typingValue.x = stage.canvas.width / 2;
    typingValue.y = 100;
    typingValue.textBaseline = "alphabetic";

    stage.addChild(typingValue);

    createKeyboards();
    stage.update();

    createjs.Ticker.on('tick', function (event) {
      stage.update();
    });
  };

  var finish = function () {
    stage.removeAllChildren();
    SceneSwitcher.nextScene();
  };

  return {
    load: load,
    start: start,
    finish: finish
  };
});
