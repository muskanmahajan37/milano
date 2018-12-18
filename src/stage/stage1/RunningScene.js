define([
  'src/services/CharacterServices.js',
  'createjs',
], function (CharacterServices) {
  var stage, preload, sceneContainer, cloud1, cloud2, character, tree1, tree2, ground;
  var stageWidth, stageHeight, target, clockShape;

  function RunningScene(s, p) {
    stage = s;
    preload = p;
    sceneContainer = new createjs.Container();

    stageWidth = stage.canvas.width;
    stageHeight = stage.canvas.height;

    this.init();
  }

  RunningScene.prototype.init = function () {
    var bg2 = new createjs.Shape();
    bg2.graphics.beginFill('#000000').drawRect(0, stageHeight / 2, stageWidth, stageHeight / 2);
    bg2.graphics.alpha = 1;
    sceneContainer.addChild(bg2);

    var groundImg = preload.getResult("ground");
    ground = new createjs.Shape();
    ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, stageWidth + groundImg.width, groundImg.height);
    ground.tileW = groundImg.width;
    ground.y = stageHeight - groundImg.height;

    tree1 = new createjs.Bitmap(preload.getResult("tree1"));
    tree1.setTransform(Math.random() * stageWidth, stageHeight - tree1.image.height - groundImg.height + 10, 1, 1);
    tree2 = new createjs.Bitmap(preload.getResult("tree2"));
    tree2.setTransform(Math.random() * stageWidth, stageHeight - tree2.image.height - groundImg.height + 10, 1, 1);

    cloud1 = new createjs.Bitmap(preload.getResult("cloud1"));
    cloud1.setTransform(Math.random() * stageWidth, stageHeight - cloud1.image.height - groundImg.height - 100, 0.5, 0.5);
    cloud1.alpha = 1;

    character = new CharacterServices(preload.getResult("grant"), {x: 0, y: stageHeight / 2 + 110});

    sceneContainer.addChild(tree1, tree2, cloud1);
    sceneContainer.addChild(ground);
    character.addToStage(sceneContainer);

    target = sceneContainer.addChild(new createjs.Shape());
    target.graphics.beginFill("red").drawCircle(0, 0, 30);
    target.x = stageWidth - 60;
    target.y = stageHeight - 240;
    target.addEventListener('click', function () {
      character.playAnimation("jump");
    });

    sceneContainer.addChild(target);

    createClockLine();
  };

  function createClockLine() {
    if (clockShape) {
      sceneContainer.removeChild(clockShape);
    }
    clockShape = sceneContainer.addChild(new createjs.Shape());
    clockShape.graphics
      .beginFill(createjs.Graphics.getHSL(Math.random() * 360, 100, 50))
      .drawCircle(0, 0, 15);
    clockShape.x = stageWidth;
    clockShape.y = stageHeight - 120 + Math.random() * 50;
  }

  RunningScene.prototype.tick = function (event) {
    var deltaS = event.delta / 1000;
    tree1.x = (tree1.x - deltaS * 30);
    if (tree1.x + tree1.image.width * tree1.scaleX <= 0) {
      tree1.x = stageWidth;
    }
    tree2.x = (tree2.x - deltaS * 45);
    if (tree2.x + tree2.image.width * tree2.scaleX <= 0) {
      tree2.x = stageWidth;
    }
    cloud1.x = (cloud1.x - deltaS * 15);
    if (cloud1.x + cloud1.image.width * cloud1.scaleX <= 0) {
      cloud1.x = stageWidth;
    }

    if (character) {
      var position = character.getX() + 50 * deltaS;
      character.setX((position >= stageWidth + character.getWidth()) ? -character.getWidth() : position);
    }

    clockShape.x = clockShape.x - 6;
    var pt = character.getObj().localToLocal(120, 240, clockShape);
    var hitTest = clockShape.hitTest(pt.x, pt.y);
    if (hitTest) {
      console.log(hitTest);
    }

    if(clockShape.x <= 0) {
      createClockLine();
    }
  };

  RunningScene.prototype.action = function () {
    return sceneContainer;
  };

  return RunningScene;
});
