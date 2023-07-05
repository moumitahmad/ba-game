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

    create() {
        super.create()
        this.setupCommonUI()
        this.setupPlayerAnimation()

        // db
        Database.getAllSolutions().then(
            (solutions) => {
                console.log(solutions)
                this.setupUI(solutions)
            }
        )

        // keyboard setup
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    setupUI(solutions) {
        var restartButton = this.add.dom(0, 0).createFromCache('iconButton')
        restartButton.getChildByID('icon').classList.add("fa-caret-left")
        this.aGrid.placeAtIndex(32, restartButton)
        restartButton.addListener('click')
        restartButton.on('click', (event) => {
            if(event.target.classList.item(0) === "iconButton") {
                this.scene.start("SelectionScene")
            }
        })

        this.positions = [504, 511, 518]
        this.cards = [
            this.add.dom(0, 0).createFromCache('solutionDisplay'),
            this.add.dom(0, 0).createFromCache('solutionDisplay'),
            this.add.dom(0, 0).createFromCache('solutionDisplay')
        ]
        for(var i=0; i<this.cards.length; i++){
            this.aGrid.placeAtIndex(this.positions[i], this.cards[i])
        }
        var collisionObject
        var collisions = []
        this.activeButtonID = -1
        for(var pos in this.positions) {
            collisionObject = this.placeImage('button', this.positions[pos], .05, true)
            collisionObject.body.allowGravity = false
            collisionObject.setData({ solution: {}, pos: this.positions[pos] })
            this.physics.add.overlap(collisionObject, this.player, (button) => {
                var solution = button.getData('solution')
                if(this.activeButtonID !== solution.id && solution.id !== undefined) {
                    this.resetAllCommentSections()
                    Database.getCommentsBySolutionID(solution.id).then(
                        (comments) => {
                            var commentSection = this.add.dom(0, 0).createFromCache('commentSection')
                            this.aGrid.placeAtIndex(button.getData('pos')-31*11, commentSection)
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
                                        Database.saveNewComment(comment). then(
                                            (savedComment) => {
                                                // display comment
                                                // TODO: add from top
                                                this.displayComment(savedComment, comments.length+1, commentSection)
                                            }
                                        )
                                        // update display
                                        // TODO: title
                                        commentInput.value = ""
                                    } else {
                                        //commentInput.style.border = 'red'
                                    }
                                }
                            })
                        }
                    )
                    this.activeButtonID = solution.id
                }
                
            })
            collisions.push(collisionObject)
        }

        this.solutionStart = 0
        this.setupSolutionCards(solutions.slice(this.solutionStart, 3), this.cards, collisions)
        
        if(solutions.length > 3) {
            // add gallery buttons
            this.previewButton = this.add.dom(0, 0).createFromCache('iconButton')
            this.previewButton.getChildByID('icon').classList.add("fa-caret-left")
            this.aGrid.placeAtIndex(498, this.previewButton)
            this.previewButton.setVisible(false)
            
            this.nextButton = this.add.dom(0, 0).createFromCache('iconButton')
            this.nextButton.getChildByID('icon').classList.add("fa-caret-right")
            this.aGrid.placeAtIndex(524, this.nextButton)

            // button events
            this.nextButton.addListener('click')
            this.nextButton.on('click', (event) => {
                if(event.target.classList.item(0) === "iconButton") {
                    this.solutionStart += 3
                    // display new three solutions
                    this.setupSolutionCards(solutions.slice(this.solutionStart, this.solutionStart+3), this.cards, collisions)
                    this.previewButton.setVisible(true)
                    if(this.solutionStart+3 >= solutions.length) {
                        this.nextButton.setVisible(false)
                    }
                    this.resetAllCommentSections()
                }
            })

            this.previewButton.addListener('click')
            this.previewButton.on('click', (event) => {
                if(event.target.classList.item(0) === "iconButton") {
                    this.solutionStart -= 3
                    // display last three solutions
                    this.setupSolutionCards(solutions.slice(this.solutionStart, this.solutionStart+3), this.cards, collisions)
                    this.nextButton.setVisible(true)
                    if(this.solutionStart == 0) {
                        this.previewButton.setVisible(false)
                    }
                    this.resetAllCommentSections()
                }
            })
        }
        
        
    }

    setupSolutionCards(displayedSolutions, cards, collisionObjects) {
        
        // reset display
        cards.forEach((card) => {
            card.setVisible(false)
        })
        for(var co in collisionObjects) {
            collisionObjects.at(co).setVisible(false)
            collisionObjects.at(co).setData({ solution: {} })
            this.aGrid.placeAtIndex(collisionObjects.at(co).getData('pos'), collisionObjects.at(co))
        }
        this.activeButtonID = -1

        let i = 0
        displayedSolutions.forEach((solution) => {
            // update card
            cards[i].getChildByID('solutionTitle').innerText = solution.title
            cards[i].getChildByID('solutionDescription').innerText = solution.description
            cards[i].getChildByID('likeAmount').innerText = solution.likes

            cards[i].setVisible(true)

            // setup hover event -> collision
            collisionObjects.at(i).setData({ solution: solution })

            // setup like button
            cards[i].addListener('click')
            cards[i].on('click', (event) => {
                if(event.target.classList.item(0) === "likeButton") {
                    Database.likeSolution(solution).then(
                        (s) => {
                            document.getElementById('likeAmount').innerText = s.likes
                        }
                    )
                }
            })

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

export default SolutionsScene
