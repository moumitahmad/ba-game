import { Align } from '../common/util/align'
import { Database } from '../data/database'
import { BaseScene } from './BaseScene'

class SolutionsScene extends BaseScene {
    constructor() {
        super('SolutionsScene')
    }

    preload() {
        this.load.html('solutionDisplay', './assets/components/solutionDisplay.html')
        this.load.html('iconButton', './assets/components/iconButton.html')
        this.load.html('commentButton', './assets/components/comment.html')
        this.load.html('commentSection', './assets/components/commentSection.html')
    }

    create(data) {
        super.create()
        this.setupCommonUI()
        
        this.activeSolutionID = -1
        this.physics.add.collider(this.player, this.ground, () => {
            this.activeSolutionID = -1
        })

        // db
        Database.getSolutionsByChallengeID(data.challengeID)
        .then(
            (solutions) => {
                console.log(solutions)
                this.setupUI(solutions)
            }
        )

        // keyboard setup
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.removeCapture('SPACE');
    }

    setupUI(solutions) {
        var restartButton = this.add.dom(0, 0).createFromCache('iconButton')
        restartButton.getChildByID('icon').classList.add("fa-house")
        this.aGrid.placeAtIndex(32, restartButton)
        restartButton.addListener('click')
        restartButton.on('click', (event) => {
            if(event.target.classList.item(0) === "iconButton") {
                this.scene.start("SelectionScene")
            }
        })

        var noSolutionsText = "Bisher hat leider noch niemand einen Lösungsvorschlag gemacht."
        var welcomeText = "Stöbere doch gerne in der Sammlung von Lösungsvorschläge, sie können kommentiert und bewertet werden."
        var title 
        if(solutions.length === 0) {
            title = this.placeText(noSolutionsText, 125)
            title.setScale(.8)
            return
        }
        
        title = this.placeText(welcomeText, 125)
        title.setScale(.8)

        this.positions = [442, 449, 456]
        this.cards = [
            this.add.dom(0, 0).createFromCache('solutionDisplay'),
            this.add.dom(0, 0).createFromCache('solutionDisplay'),
            this.add.dom(0, 0).createFromCache('solutionDisplay')
        ]
        for(var i=0; i<this.cards.length; i++){
            this.aGrid.placeAtIndex(this.positions[i], this.cards[i])
        }

        this.userLiked = []
        
        // PlayerClick
        this.buttonsCollidable = true
        this.commentCollisionObjects = []
        this.likeCollisionObjects = []
        for(var i=0; i<this.cards.length; i++) {
            this.setupCollisions(this.positions[i])
        }

        this.solutionStart = 0
        this.setupSolutionCards(solutions.slice(this.solutionStart, 3), this.cards)
        
        if(solutions.length > 3) {
            // add gallery buttons
            var previewPos = 436
            this.previewButton = this.add.dom(0, 0).createFromCache('iconButton')
            this.previewButton.getChildByID('icon').classList.add("fa-caret-left")
            this.aGrid.placeAtIndex(previewPos, this.previewButton)
            this.previewButton.setVisible(false)
            
            var nextPos = 462
            this.nextButton = this.add.dom(0, 0).createFromCache('iconButton')
            this.nextButton.getChildByID('icon').classList.add("fa-caret-right")
            this.aGrid.placeAtIndex(nextPos, this.nextButton)

            // player click
            var previewCollider = this.placeImage('collisionItem', previewPos, .05, true)

            var nextCollider = this.placeImage('collisionItem', nextPos, .05, true)
            nextCollider.body.allowGravity = false
            this.physics.add.overlap(nextCollider, this.player, (button) => {
                if(this.buttonsCollidable) {
                    this.solutionStart += 3
                    // display new three solutions
                    this.setupSolutionCards(solutions.slice(this.solutionStart, this.solutionStart+3), this.cards)
                    this.previewButton.setVisible(true)
                    if(this.solutionStart+3 >= solutions.length) {
                        this.nextButton.setVisible(false)
                        nextCollider.setVisible(false)
                    }
                    this.resetAllCommentSections()
                    this.buttonsCollidable = false
                }
            })

            previewCollider.body.allowGravity = false
            previewCollider.setVisible(false)
            this.physics.add.overlap(previewCollider, this.player, (button) => {
                if(this.buttonsCollidable) {
                    this.solutionStart -= 3
                    // display last three solutions
                    this.setupSolutionCards(solutions.slice(this.solutionStart, this.solutionStart+3), this.cards)
                    this.nextButton.setVisible(true)
                    if(this.solutionStart == 0) {
                        this.previewButton.setVisible(false)
                        previewCollider.setVisible(false)
                    }
                    this.resetAllCommentSections()
                    this.buttonsCollidable = false
                }
            })
        }
        
    }

    setupCollisions(cardPos) {
        var collisionComment = this.placeImage('collisionItem', cardPos+31*2-2, .05, true)
        collisionComment.body.allowGravity = false
        this.physics.add.overlap(collisionComment, this.player, (button) => {
            if(this.buttonsCollidable) {
                var solution = button.getData('solution')
                console.log("COMMENT: " + solution.description)
                if(this.activeSolutionID !== solution.id && solution.id !== undefined) {
                    this.resetAllCommentSections()
                    Database.getCommentsBySolutionID(solution.id).then(
                        (comments) => {
                            var commentSection = this.add.dom(0, 0).createFromCache('commentSection')
                             commentSection.getChildByID('completeSolution').innerHTML = solution.description
                            //Align.center(commentSection, this)
                            //this.aGrid.placeAtIndex(button.getData('pos')-31*11, commentSection)
                            this.commentLenght = 1
                            comments.forEach((comment) => {
                                this.displayComment(comment, this.commentLenght, commentSection)
                                this.commentLenght++
                            })
                            commentSection.addListener('click')
                            commentSection.on('click', (event) => {
                                if(event.target.name === 'saveButton') {
                                    var commentInput = commentSection.getChildByID('commentInput')
                                    if(commentInput.value !== ""){
                                        var comment = {
                                            message: commentInput.value,
                                            solutionID: solution.id
                                        }
                                        // save comment
                                        Database.saveNewComment(comment, comments.length). then(
                                            (savedComment) => {
                                                // display comment
                                                this.displayComment(savedComment, comments.length+1, commentSection)
                                                this.game.config.userPoints += 1
                                                console.log("tree grows!")
                                                // update tree
                                                var frame = 17
                                                if(this.game.config.userPoints+1<17) {
                                                    frame = this.game.config.userPoints+1
                                                } else if(this.game.config.userPoints == 17) {
                                                    this.scene.start("WinningScene");
                                                }
                                                this.tree.setFrame(frame)
                                            }
                                        )
                                        // update display
                                        // TODO: title
                                        commentInput.value = ""
                                    } else {
                                        //commentInput.style.border = 'red'
                                    }
                                } else if(event.target.classList.item(0) === 'modal-background') {
                                    commentSection.setVisible(false)
                                    // TODO: update commentAmount
                                    this.buttonsCollidable = true
                                }
                            })
                        }
                    )
                    this.activeSolutionID = solution.id
                }
                this.buttonsCollidable = false
            }
        })
        this.commentCollisionObjects.push(collisionComment)

        
        var collisionLike = this.placeImage('collisionItem', cardPos+31*2+2, .05, true)
        collisionLike.body.allowGravity = false
        this.physics.add.overlap(collisionLike, this.player, (button) => {
            if(this.buttonsCollidable) {
                var solution = button.getData('solution')
                console.log("LIKE: " + solution.description)
                this.buttonsCollidable = false
                if(!button.getData('liked')) {
                    Database.likeSolution(solution).then(
                        (s) => {
                            var displayButton = this.cards[button.getData('index')]
                            var icon = displayButton.getChildByID('likeIcon')
                            icon.classList.remove("fa-regular")
                            icon.classList.add("fa-solid")
                            displayButton.getChildByID('likeAmount').innerText = s.likes
                            button.setData({ 'liked': true })
                            this.userLiked.push(solution.id)
                        }
                    )
                } else {
                    Database.unlikeSolution(solution).then(
                        (s) => {
                            var displayButton = this.cards[button.getData('index')]
                            var icon = displayButton.getChildByID('likeIcon')
                            icon.classList.add("fa-regular")
                            icon.classList.remove("fa-solid")
                            displayButton.getChildByID('likeAmount').innerText = s.likes
                            button.setData({ 'liked': false })
                            var index = this.userLiked.indexOf(solution.id)
                            if (index > -1) { 
                                this.userLiked.splice(index, 1);
                            }
                        }
                    )
                }
            }
        })
        this.likeCollisionObjects.push(collisionLike)
    }

    setupSolutionCards(displayedSolutions, cards) {
        
        // TODO: reset display
        cards.forEach((card) => {
            card.setVisible(false)
        })
        this.commentCollisionObjects.forEach((collision) => {
            collision.setVisible(false)
        })
        this.likeCollisionObjects.forEach((collision) => {
            collision.setVisible(false)
        })
    
        this.activeSolutionID = -1

        let i = 0
        displayedSolutions.forEach((solution) => {
            // update card
            cards[i].getChildByID('solutionDescription').innerText = solution.description
            cards[i].getChildByID('likeAmount').innerText = solution.likes
            cards[i].getChildByID('commentAmount').innerText = solution.commentAmount

            if(this.userLiked.indexOf(solution.id) > -1) { // solution was liked
                var icon = cards[i].getChildByID('likeIcon')
                icon.classList.remove("fa-regular")
                icon.classList.add("fa-solid")
            } else {
                var icon = cards[i].getChildByID('likeIcon')
                icon.classList.add("fa-regular")
                icon.classList.remove("fa-solid")
            }

            cards[i].setVisible(true)

            // setup collision event
            this.commentCollisionObjects.at(i).setVisible(true)
            this.likeCollisionObjects.at(i).setVisible(true)
            this.commentCollisionObjects.at(i).setData({ solution: solution, index: i })
            this.likeCollisionObjects.at(i).setData({ solution: solution, liked: false, index: i })

            // update index
            i++

        })
    }

    
    resetAllCommentSections() {
        var elements = document.getElementsByClassName('commentCard')
        for(var i=0; i<elements.length; i++) {
            elements[i].parentNode.parentNode.removeChild(elements[i].parentNode)
        }
    }

    displayComment(comment, index, section) {
        var commentTitle = document.createElement('div')
        commentTitle.classList.add("heading")
        commentTitle.innerText = "Kommentar " + index
        var commentMessage = document.createElement('div')
        commentMessage.innerText = comment.message
        var content = document.createElement('div')
        content.classList.add("timeline-content")
        content.appendChild(commentTitle)
        content.appendChild(commentMessage)
        var marker = document.createElement('div')
        marker.classList.add("timeline-marker")
        var newItem = document.createElement('div')
        newItem.classList.add("timeline-item")
        newItem.appendChild(marker)
        newItem.appendChild(content)
        var parent = section.getChildByID('itemContainer')
        parent.insertBefore(newItem, parent.firstChild)
    }

    update() {
        this.checkPlayer()
        if(this.player.y > 670) {
            this.buttonsCollidable = true
        }
    }
}

export default SolutionsScene
