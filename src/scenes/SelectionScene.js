
import { BaseScene } from './BaseScene'


class SelectionScene extends BaseScene {

    // layerDeko;

    constructor() {
        super({ key: 'SelectionScene' });
    }

    preload() {
        this.load.json('categoryData', "./assets/data/categories.json")
        this.load.json('challengeData', "./assets/data/challenges.json")
    }

    create(data) {
        super.create()
        this.setupCommonUI()

        this.restartNum = 0
        console.log(data)
        if(!data.count) {
            this.setupPlayerAnimation()
            this.player.play('blink')
        } else {
            this.restartNum = data.count
        }
        this.challengeText = "Wähle eine Herrauforderung:"
        this.categoryText = "Wähle eine Kategorie:"

        this.cloud = this.placeImage('cloud', 150, 0.2, true)
        this.cloud.body.allowGravity = false
        this.cloud.setImmovable(true)

        console.log(this.restartNum)
        if(this.restartNum == 0) {
            this.placeText(this.categoryText, 226)
            var categoryButton = this.placeImage('button', 449, .08, true)
            categoryButton.body.allowGravity = false
            this.physics.add.overlap(this.player, categoryButton, () => {
                console.log("Start Mobility")
                this.scene.restart({ count: 1 })
                
            })
        } else {
            this.placeText(this.challengeText, 224)
            // display selection choices
            var challengeData = this.cache.json.get('challengeData')
            var button
            for(var choice in challengeData) {
                // this.placeText(challengeData[choice].title, challengeData[choice].pos-31*2)
                button = this.placeImage('button', challengeData[choice].pos, .08, true)
                button.body.allowGravity = false
                button.setData({ challenge: challengeData[choice] })
                this.physics.add.collider(button, this.player, (button) => {
                    this.scene.start('ChallengeScene', { challenge: button.getData('challenge') })
                })
            }
        }


        // keyboard setup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.walkStarted = false
        this.jumpStarted = false
        this.isLeft = false
    }

    update() {
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

export default SelectionScene