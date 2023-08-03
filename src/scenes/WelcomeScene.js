import { Align } from '../common/util/align'
import { BaseScene } from './BaseScene'

class WelcomeScene extends BaseScene {
    constructor() {
        super('WelcomeScene')
    }

    preload() {
        this.load.html('welcomeDialog', './assets/components/welcomeDialog.html')
    }

    create() {
        super.create()

        // grid
        this.makeAlignGrid(25, 31)
        // this.aGrid.showNumbers() // for debug

        // welcome text
        this.welcomeDialog = this.add.dom(0, 0).createFromCache('welcomeDialog')
        Align.center(this.welcomeDialog, this)

        var count = 1

        this.welcomeDialog.addListener('click')
        this.welcomeDialog.on('click', (event) => {
            if (event.target.name === 'startButton') {
                if(count == 1) {
                    // display instructions
                    var instructionText = "Eine Besonderheit der Anwendung ist die Bedienung. Sowohl Buttons als auch Elemente können mit dem kleinen Avatar ausgelöst werden. Die Steuerung funktioniert mit den Pfeiltasten. <br/>Das obere Video zeigt wie es geht."
                    this.welcomeDialog.getChildByID('cardText').innerHTML = instructionText
                    this.welcomeDialog.getChildByID('cardTitle').style.display = 'none'
                    this.welcomeDialog.getChildByID('confirmationButton').innerHTML = 'Okay'
                    this.aGrid.placeAtIndex(666, this.welcomeDialog)
                    this.gif = this.add.video(100, 200, 'intruction')
                    this.gif.setScale(.5)
                    this.gif.play(true)
                    this.aGrid.placeAtIndex(294, this.gif)


                    count = 2
                } else if(count == 2) {
                    var goalInstructions = "Auch erhalten Sie einen kleinen Samen. Wenn Sie Lösungsideen und Kommentaren angeben, kann aus dem Samen ein großer Baum wachsen."
                    this.welcomeDialog.getChildByID('cardText').innerHTML = goalInstructions
                    // change image
                    this.gif.setVisible(false)
                    var image = this.placeImage('treeInstruction', 294, .5, true)
                    image.body.allowGravity = false

                    count = 3
                } else if(count == 3) {
                    this.scene.start("SelectionScene");
                }
                
            }
        })
    }
}

export default WelcomeScene