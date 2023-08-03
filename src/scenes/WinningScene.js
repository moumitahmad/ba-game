import { Align } from '../common/util/align'
import { Database } from '../data/database'
import { BaseScene } from './BaseScene'

class WinningScene extends BaseScene {
    constructor() {
        super('WinningScene')
    }

    preload() {
        this.load.html('winningDialog', './assets/components/winningDialog.html')
    }

    create(data) {
        super.create()
        this.winningDialog = this.add.dom(0, 0).createFromCache('winningDialog')
        Align.center(this.winningDialog, this)
        this.winningDialog.addListener('click')
        this.winningDialog.on('click', (event) => {
            if (event.target.name === 'confirmationButton') {
                this.scene.start("SelectionScene");
            }
        })
    }
}

export default WinningScene