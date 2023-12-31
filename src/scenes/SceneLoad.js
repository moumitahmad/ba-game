import { BaseScene } from "./BaseScene"
import { Bar } from "../common/comps/bar"
import { Align } from "../common/util/align"
import { Database } from "../data/database";
// import { OpenAI } from "../chatGPT/openAIConnection"

export default class SceneLoad extends BaseScene {
    constructor() {
        super('SceneLoad');
    }

    preload() {
        this.common = "./assets/";
        this.imagePath = "./assets/images/";
        this.mapPath = "./assets/map/";
        this.htmlPath = "./assets/components/";
        this.videoPath = "./assets/video/";
        
        this.load.json('challengeData', "./assets/data/challenges.json")
        
        /**
         *
         * make the loading bars
         *
         */
        this.bar2 = new Bar({
            scene: this,
            height: this.sys.game.config.height * .1,
            width: this.sys.game.config.width * .8,
            color: 0xffffff
        });
        this.bar = new Bar({
            scene: this,
            height: this.sys.game.config.height * .1,
            width: this.sys.game.config.width * .8
        });
        Align.center(this.bar, this);
        Align.center(this.bar2, this);
        /*
           set up the progress
         */
        this.load.on('progress', this.onProgress, this);

        /**
         *
         *LOAD THE ASSETS
         * 
         */

        //
        //game png
        //
        let pngArray = ['treeInstruction', 'base-tiles', 'ground_new', 'button', 'cloud', 'collisionItem', 'diaper', 'wheelchair', 'vacation', 'applications', 'ground_grass', 'bett'];
        for (let i = 0; i < pngArray.length; i++) {
            this.loadPng(pngArray[i], this.imagePath);
        }

        //
        //game png
        //
        let jpgArray = ['sky'];
        for (let i = 0; i < jpgArray.length; i++) {
            this.loadJpg(jpgArray[i], this.imagePath);
        }

        //
        // game sprite
        //
        let spriteArray = [
            {
                name: 'player',
                width: 103,
                height: 150
            },
            {
                name: 'growing_tree',
                width: 500,
                height: 720
            }
        ]
        for(let i=0; i<spriteArray.length; i++) {
            this.setupSprite(spriteArray[i].name, spriteArray[i].width, spriteArray[i].height)
        }
        

        //
        //game json
        //
        let jsonArray = ['test-map'];
        for (let i = 0; i < jsonArray.length; i++) {
            this.loadJson(jsonArray[i], this.mapPath);
        }

        let htmlArray = ['title']
        for(let i=0; i < htmlArray.length; i++) {
            this.loadHtml(htmlArray[i], this.htmlPath)
        }
        let videoArray = ['intruction']
        for(let i=0; i < videoArray.length; i++) {
            this.loadVideo(videoArray[i], this.videoPath)
        }

        // Database
        var database = new Database()
        //var ai = new OpenAI()
        //OpenAI.test()
        
        
    }

    setupSprite(name, width, height) {
        this.load.spritesheet(name, "./assets/images/" + name + ".png", {
            frameWidth: width, 
            frameHeight: height
        })
    }

    onProgress(value) {
        let per = Math.floor(value * 100);
        this.bar.setPercent(value);
    }

    create() {
        this.setupPlayerAnimation()
        this.setupTreeAnimation()
        //var challengeData = this.cache.json.get('challengeData')
        //this.scene.start("ChallengeScene", { challenge: challengeData["challenge1"] });
        this.scene.start("WelcomeScene");
        // this.scene.start("SelectionScene");
        
        // this.scene.start("SolutionsScene", { challengeID:  0});
    }

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

    setupTreeAnimation() {
        this.anims.create({
            key: 'grow',
            frames: this.anims.generateFrameNumbers('growing_tree', { start: 17, end: 17 }),
            frameRate: .5,
            repeat: 0
        });
        this.anims.create({
            key: 'celebrate',
            frames: this.anims.generateFrameNumbers('growing_tree', { start: 0, end: 16 }),
            frameRate: .5,
            repeat: 0
        });
    }
    
    loadJpg(key, mainPath = "") {
        if (mainPath == "") {
            mainPath = this.imagePath;
        }
        this.load.image(key, mainPath + key + ".jpg");
    }
    loadPng(key, mainPath = "") {
        if (mainPath == "") {
            mainPath = this.imagePath;
        }
        this.load.image(key, mainPath + key + ".png");
    }
    loadGif(key, mainPath = "") {
        if (mainPath == "") {
            mainPath = this.imagePath;
        }
        this.load.image(key, mainPath + key + ".gif");
    }
    loadJson(key, mainPath = "") {
        if(mainPath == "") {
            mainPath = this.imagePath
        }
        this.load.tilemapTiledJSON(key, mainPath + key + ".json")
    }
    loadHtml(key, mainPath = "") {
        if (mainPath == "") {
            mainPath = this.htmlPath;
        }
        this.load.html(key, mainPath + key + ".html")
    }
    loadVideo(key, mainPath = "") {
        if (mainPath == "") {
            mainPath = this.videoPath;
        }
        this.load.video(key, mainPath + key + ".mp4")
    }
    update() {}
}