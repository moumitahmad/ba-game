
import { BaseScene } from './BaseScene'


class SelectionScene extends BaseScene {

    // layerDeko;

    constructor() {
        super({ key: 'SelectionScene' });
    }

    preload() {
        this.load.json('categoryData', "./assets/data/categories.json")
        this.load.json('challengeData', "./assets/data/challenges.json")
        this.load.html('challengeDisplay', './assets/components/challengeDisplay.html')

    }

    create(data) {
        super.create()
        this.setupCommonUI()
        this.physics.add.collider(this.player, this.ground)

        this.restartNum = 1
        console.log(data)
        if(!data.count) {
            this.player.play('blink')
        } else {
            this.restartNum = data.count
        }
        this.challengeText = "Wähle eine Herausforderung:"
        this.categoryText = "Wähle eine Kategorie:"

        this.cloudOne = this.placeImage('cloud', 150, 0.2, true)
        this.cloudOne.body.allowGravity = false
        this.cloudOne.setImmovable(true)
        this.cloudOne.setVelocityX(-5)
        this.cloudTwo = this.placeImage('cloud', 319, 0.2, true)
        this.cloudTwo.body.allowGravity = false
        this.cloudTwo.setImmovable(true)
        this.cloudTwo.setVelocityX(-8)

        if(this.restartNum == 0) {
            var title = this.placeText(this.categoryText, 226)
            var categoryButton = this.placeImage('button', 449, .08, true)
            categoryButton.body.allowGravity = false
            this.physics.add.overlap(this.player, categoryButton, () => {
                categoryButton.setVisible(false)
                title.setVisible(false)
                this.setupChallageSelection()
            })
        } else {
            this.setupChallageSelection()
        }


        // keyboard setup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.removeCapture('SPACE');
        this.walkStarted = false
        this.jumpStarted = false
        this.isLeft = false
    }

    setupChallageSelection() {
        this.placeText(this.challengeText, 224)
            // display selection choices
            var challengeData = this.cache.json.get('challengeData')
            var challengeDisplay
            var button
            var count = 0
            for(var choice in challengeData) {
                if(count < 4) {
                    challengeDisplay = this.add.dom(0, 0).createFromCache('challengeDisplay')
                    challengeDisplay.getChildByID('title').innerHTML = challengeData[choice].title
                    challengeDisplay.getChildByID('image').src = '/ba-game/assets/images/' + challengeData[choice].image+'.png'
                    this.placeAtIndex(challengeData[choice].pos, challengeDisplay)

                    button = this.placeImage('collisionItem', challengeData[choice].pos, .08, true)
                    button.body.allowGravity = false
                    button.setData({ challenge: challengeData[choice] })
                    this.physics.add.collider(button, this.player, (button) => {
                        this.scene.start('ChallengeScene', { challenge: button.getData('challenge') })
                    })

                    count++
                }
            }
    }

    update() {
        this.checkPlayer()
        if(this.cloudTwo.x < -90) {
            this.cloudTwo.x = 1100
        }
        if(this.cloudOne.x < -90) {
            this.cloudOne.x = 1100
        }
    }
}

export default SelectionScene