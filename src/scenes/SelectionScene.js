
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
        this.physics.add.collider(this.player, this.ground)

        this.restartNum = 0
        console.log(data)
        if(!data.count) {
            this.player.play('blink')
        } else {
            this.restartNum = data.count
        }
        this.challengeText = "Wähle eine Herauforderung:"
        this.categoryText = "Wähle eine Kategorie:"

        this.cloud = this.placeImage('cloud', 150, 0.2, true)
        this.cloud.body.allowGravity = false
        this.cloud.setImmovable(true)

        if(this.restartNum == 0) {
            this.placeText(this.categoryText, 226)
            var categoryButton = this.placeImage('button', 449, .08, true)
            categoryButton.body.allowGravity = false
            this.physics.add.overlap(this.player, categoryButton, () => {
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
        this.input.keyboard.removeCapture('SPACE');
        this.walkStarted = false
        this.jumpStarted = false
        this.isLeft = false
    }

    update() {
        this.checkPlayer()    
    }
}

export default SelectionScene