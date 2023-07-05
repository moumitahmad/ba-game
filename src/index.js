import 'phaser'
import '../index.css'

import SelectionScene from './scenes/SelectionScene'
import ChallengeScene from './scenes/ChallengeScene'
import SolutionsScene from './scenes/SolutionsScene'
import SceneLoad from './scenes/SceneLoad'

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    scale: {
        parent: 'game',
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1600,
            height: 1200
        },
        zoom: 1
    },
    backgroundColor: "#65BBE6",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    dom: {
        createContainer: true
    },
    audio: {
        disableWebAudio: true
    },
    scene: [SceneLoad, SelectionScene, ChallengeScene, SolutionsScene],
};

window.game = new Phaser.Game(config);