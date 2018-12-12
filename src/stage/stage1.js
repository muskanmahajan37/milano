define([
  'src/constants/colors.js',
  'createjs'
], function (COLORS) {
  var stage, preload, hill1, hill2, stageWidth, stageHeight, ground;

  var load = function () {
    stage = new createjs.Stage('demoCanvas');
    stageWidth = stage.canvas.width;
    stageHeight = stage.canvas.height;

    return new Promise(function (resolve, reject) {
      preload = new createjs.LoadQueue();
      preload.addEventListener('complete', function () {
        resolve();
      });
      preload.addEventListener('error', function () {
        reject();
      });
      preload.loadManifest({src: 'assets/manifest/stage1.manifest.json', type: 'manifest'});
    })
  };

  function updateHill(event) {
    var deltaS = event.delta / 1000;
    hill1.x = (hill1.x - deltaS * 30);
    if (hill1.x + hill1.image.width * hill1.scaleX <= 0) {
      hill1.x = stageWidth;
    }
    hill2.x = (hill2.x - deltaS * 45);
    if (hill2.x + hill2.image.width * hill2.scaleX <= 0) {
      hill2.x = stageWidth;
    }
  }

  function createBackground() {
    var groundImg = preload.getResult("ground");
    ground = new createjs.Shape();
    ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, stageWidth + groundImg.width, groundImg.height);
    ground.tileW = groundImg.width;
    ground.y = stageHeight - groundImg.height;

    hill1 = new createjs.Bitmap(preload.getResult("hill1"));
    hill1.setTransform(Math.random() * stageWidth, stageHeight - hill1.image.height * 4 - groundImg.height, 4, 4);
    hill1.alpha = 0.5;
    hill2 = new createjs.Bitmap(preload.getResult("hill2"));
    hill2.setTransform(Math.random() * stageWidth, stageHeight - hill2.image.height * 3 - groundImg.height, 3, 3);

    stage.addChild(hill1, hill2);
    stage.addChild(ground);
  }

  function createSun() {
    var shape = new createjs.Shape().set({x: 100, y: 100});
    var blurFilter = new createjs.BlurFilter(50, 50, 1);
    var bounds = blurFilter.getBounds();

    shape.graphics.beginFill(COLORS.NORMAL_SUN).drawCircle(0, 0, 20);
    shape.filters = [blurFilter];

    shape.cache(-50 + bounds.x, -50 + bounds.y, 100 + bounds.width, 100 + bounds.height);
    stage.addChild(shape);
    shape.addEventListener('click', function () {
      finish();
    });
    createjs.Tween.get(shape).to({x: stageWidth - 100}, 50000, createjs.Ease.getPowIn(2.2));
  }

  var start = function () {
    createBackground();
    createSun();

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on('tick', handleTick);

    function handleTick(event) {
      updateHill(event);
      stage.update();
    }
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
