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
        let pngArray = ['star','base-tiles', 'ground', 'ground_new', 'button', 'cloud'];
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
        this.setupSprite()

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

        // Database
        var database = new Database()
        //var ai = new OpenAI()
        //OpenAI.test()
        
        
    }

    setupSprite() {
        this.load.spritesheet('player', "./assets/images/player.png", {
            frameWidth: 103, 
            frameHeight: 150
        })
    }

    onProgress(value) {
        let per = Math.floor(value * 100);
        this.bar.setPercent(value);
    }

    create() {
        //var challengeData = this.cache.json.get('challengeData')
        //this.scene.start("ChallengeScene", { challenge: challengeData["challenge1"] });
        this.scene.start("SelectionScene");
        
        // this.scene.start("SolutionsScene");
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
    update() {}
}