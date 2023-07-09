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
        console.log("PUNKTE: " + this.game.config.userPoints)
        // grid
        this.makeAlignGrid(25, 31)
        // this.aGrid.showNumbers() // for debug

        // tree
        this.tree = this.physics.add.sprite(0, 0, 'growing_tree')
            .setScale(.7)
            .play('grow')
        this.aGrid.placeAtIndex(522, this.tree)
        this.tree.body.allowGravity = false
        this.tree.setImmovable(true)
        var frame = 17
        if(this.game.config.userPoints+1<17) {
            frame = this.game.config.userPoints+1
        }
        this.tree.setFrame(frame)

        var dekoGround = this.placeImage('ground_grass', 728, 1.05, true)
        dekoGround.body.allowGravity = false
        dekoGround.setImmovable(true)
        // player
        this.player = this.physics.add.sprite(0, 0, 'player')
            .setBounce(0.2, 0.2)
            .setCollideWorldBounds(true)
            .setScale(.6)
        this.aGrid.placeAtIndex(529, this.player)

        this.ground = this.placeImage('ground_new', 759, 1, true)
        this.ground.body.allowGravity = false
        this.ground.setImmovable(true)
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

    checkPlayer() {
        this.player.setVelocityX(0)

        if(this.cursors.right.isDown == true) {
            this.player.body.setVelocityX(360)
            this.isLeft = false
            if(!this.walkStarted) {
                this.player.play('walk-start-right')
                this.walkStarted = true
            }
            this.player.play('walk-right')
        } else if(this.cursors.left.isDown == true) {
            this.isLeft = true
            this.player.body.setVelocityX(-360)
            if(!this.walkStarted) {
                this.player.play('walk-start-left')
                this.walkStarted = true
            }
            this.player.play('walk-left')
        } else if(this.walkStarted) {
            if(this.isLeft) {
                this.player.play('walk-end-left')
            } else {
                this.player.play('walk-end-right')
            }
            this.walkStarted = false
        } else if(this.cursors.up.isDown) {
            if(this.isLeft) {
                this.player.play('jump-left')
            } else {
                this.player.play('jump')
            }
            if(this.player.body.blocked.down) {
                this.player.body.setVelocityY(-360);
                if(!this.jumpStarted) {
                    if(this.isLeft) {
                        this.player.play('walk-start-left')
                    } else {
                        this.player.play('jump-start')
                    }
                    this.jumpStarted = true
                }
            }
            
        } else if(this.jumpStarted) {
            if(this.isLeft) {
                this.player.play('walk-end-left')
            } else {
                this.player.play('jump-end')
            }
            this.jumpStarted = false
        }

    }

}