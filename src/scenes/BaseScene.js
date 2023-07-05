import { Align } from "../common/util/align"
import { AlignGrid } from "../common/util/alignGrid"
import { Background } from "../common/comps/background"


export class BaseScene extends Phaser.Scene {
    constructor(key) {
        super(key)
    }
    preload() {}
    create() {        
    }
    setupCommonUI() {
        // grid
        this.makeAlignGrid(25, 31)
        // this.aGrid.showNumbers() // for debug

        // player
        this.player = this.physics.add.sprite(0, 0, 'player')
            .setBounce(0.2, 0.2)
            .setCollideWorldBounds(true)
            .setScale(.6)

        this.aGrid.placeAtIndex(622, this.player)

        this.ground = this.placeImage('ground_new', 759, 1, true)
        this.ground.body.allowGravity = false
        this.ground.setImmovable(true)

        // collisions
        this.physics.add.collider(this.player, this.ground)
    }
    //
    //set a background image
    //
    setBackground(key) {
        let bg = new Background({
            scene: this,
            key: key
        });
        return bg;
    }
    //
    //place an image on the stage, and scale it
    //
    placeImage(key, pos, scale, physics = false) {
        let image
        if (physics == false) {
            image = this.add.sprite(0, 0, key);
        } else {
            image = this.physics.add.sprite(0, 0, key);
        }
        if (isNaN(pos)) {
            this.aGrid.placeAt(pos.x, pos.y, image);
        } else {
            this.aGrid.placeAtIndex(pos, image);
        }
        if (scale != -1) {
            Align.scaleToGameW(image, scale, this);
        }
        return image;
    }
    //
    //place text on the stage and style it
    //
    placeText(text, pos, x=3) {
        var textObj = this.add.dom(0, 0).createFromCache('title')
        this.aGrid.placeAtIndex(pos, textObj)
        textObj.getChildByID('title').innerHTML = text
        textObj.getChildByID('title').style.fontSize = x + 'rem'
        return textObj;
    }
    //
    //place an object on the grid by index
    //
    placeAtIndex(pos, item) {
        this.aGrid.placeAtIndex(pos, item, this);
    }
    //
    //place an object on the grid by x and y position
    //
    placeAt(xx, yy, item) {
        this.aGrid.placeAt(xx, yy, item, this);
    }
    //
    //make an align grid
    //
    makeAlignGrid(r = 11, c = 11) {
        this.aGrid = new AlignGrid({
            scene: this,
            rows: r,
            cols: c
        });
    }
    update() {}

    setupPlayerAnimation() {
        this.anims.create({
            key: 'walk-start-right',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 12 }),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 13, end: 13 }),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'walk-end-right',
            frames: this.anims.generateFrameNumbers('player', { start: 14, end: 14 }),
            frameRate: 2,
            repeat: 0
        });
        this.anims.create({
            key: 'walk-start-left',
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 15 }),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 16 }),
            frameRate: 4,
            repeat: 0
        });
        this.anims.create({
            key: 'walk-end-left',
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 15 }),
            frameRate: 2,
            repeat: 0
        });

        this.anims.create({
            key: 'blink',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'jump-start',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'jump-end',
            frames: this.anims.generateFrameNumbers('player', { start: 2, end: 2 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'jump-left',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
    }
}