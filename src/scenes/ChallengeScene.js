import { Align } from '../common/util/align'
import { Database } from '../data/database'
import { BaseScene } from './BaseScene'

class ChallengeScene extends BaseScene {
    constructor() {
        super('ChallengeScene')
    }

    init(data) {
        console.log(data)
        this.data = data.challenge
    }

    preload() {
        this.load.html('inputForm', './assets/components/inputForm.html')
        this.load.html('dialogModal', './assets/components/dialog.html')
        this.load.html('iconButton', './assets/components/iconButton.html')
    }

    create() {
        super.create()
        this.setupCommonUI()

        var restartButton = this.add.dom(0, 0).createFromCache('iconButton')
        restartButton.getChildByID('icon').classList.add("fa-caret-left")
        this.aGrid.placeAtIndex(32, restartButton)
        restartButton.addListener('click')
        restartButton.on('click', (event) => {
            if(event.target.classList.item(0) === "iconButton") {
                this.scene.start("SelectionScene")
            }
        })

        // TIMER
        this.timerText = this.placeText("0:00", 60)
        this.timerText.setScale(2)
        this.timedEvent = this.time.addEvent({
            delay: 30000, // 180000, // TODO: Change time
            callback: this.timerOut, 
            callbackScope: this
        }) 
        this.timedEvent.paused = true

        // DIALOG MODAL
        this.dialogModal = this.add.dom(0, 0).createFromCache('dialogModal')
        this.dialogModal.getChildByID("messageContent").textContent = this.data.title + ": " + this.data.description
        Align.center(this.dialogModal, this)
        // this.dialogModal.setVisible(false)

        // INPUT FORM
        this.inputForm = this.add.dom(0, 0).createFromCache('inputForm')
        // this.aGrid.placeAtIndex(71, this.inputForm);
        Align.center(this.inputForm, this)
        this.inputForm.setVisible(false)

        
        // ONCLICK EVENTS
        let count = 0
        this.dialogModal.addListener('click')
        this.dialogModal.on('click', (event) => {
            if (event.target.name === 'confirmationButton') {
                if(count == 0) {
                    var newMessage = "Häufig kann man unter Zeitdruck besser Lösungen finden. \n Sie haben nun drei Minuten, um möglichst viele Lösungen zu finden. Die Qualität der Lösungen ist dabei zweitrangig. \n Später können Sie gerne noch Fotos oder Skizzen einfügen. \n Fröhliches Sammeln!"
                    this.dialogModal.getChildByID('messageTitle').textContent = "Was passiert nun?"
                    this.dialogModal.getChildByID('messageContent').textContent = newMessage
                    this.dialogModal.getChildByID('confirmationButton').innerHTML = "Start"
                    document.getElementById('cancelButton').style.display = 'none'
                    this.aGrid.placeAtIndex(355, this.dialogModal)
                    count = 1
                } else if(count == 1) {
                    this.dialogModal.setVisible(false)
                    // open inputForms
                    this.inputForm.setVisible(true)
                    // start timer
                    this.timedEvent.paused = false
                    // reset
                    this.dialogModal.removeAllListeners()
                } else if(count == 2) {
                    this.scene.start("SolutionsScene")
                }
            } else if(event.target.name === 'cancelButton') {
                if(count == 0) {
                    var newMessage = "Schade, wollen Sie sich die Lösungen anderer Teilnehmer ansehen?"
                    this.dialogModal.getChildByID('messageTitle').textContent = ""
                    this.dialogModal.getChildByID('messageContent').textContent = newMessage
                    this.dialogModal.getChildByID('confirmationButton').innerHTML = "Ja, gerne!"
                    this.dialogModal.getChildByID('cancelButton').innerHTML = "Nein, zurück"
                    this.aGrid.placeAtIndex(386, this.dialogModal)
                    count = 2
                } else if(count == 2) {
                    this.scene.start("SelectionScene", { count: 0 });
                }
                
            }
        }) 


        this.solutions = []
        this.activeTabKey = 0 // key value of active  tab
        this.error = document.getElementById('solutionError')
        this.inputForm.addListener('click')
        this.inputForm.on('click', (event) => {
            if(event.target.name === 'moreButton') {
                var inputTitle = this.inputForm.getChildByName('titleInput')
                var inputSolution = this.inputForm.getChildByName('solutionInput')                
                if (inputSolution.value !== "") {
                    // save solution
                    this.saveSolutionInLocalArray(this.activeTabKey, inputTitle.value, inputSolution.value)
                    // reset input
                    inputTitle.value = ""
                    inputSolution.value = ""

                    
                    // create new tab
                    // update activ tab key
                    this.activeTabKey = this.solutions.length
                    var newInnerTab = document.createElement('a')
                    newInnerTab.innerText = "Lösungsvorschlag " + (this.activeTabKey + 1)
                    newInnerTab.setAttribute("name", "tabButton")
                    newInnerTab.setAttribute("key", this.activeTabKey)
                    var newTab = document.createElement('li')

                    // switch to new tab
                    this.resetActiveClass()
                    newTab.appendChild(newInnerTab)
                    newTab.classList.add("is-active")
                    document.getElementById('tab-container').appendChild(newTab)

                    // disable more button
                    if(this.activeTabKey == 4) {
                        document.getElementById('moreButton').disabled = true
                    }
                    
                    // remove error
                    this.error.style.display = 'none'
                } else {
                    // show error
                    this.error.style.display = 'block'
                }

            } else if(event.target.name === 'tabButton') {

                const inputTitle = this.inputForm.getChildByName('titleInput')
                const inputSolution = this.inputForm.getChildByName('solutionInput')
                if (inputSolution.value !== '') {
                    // switch to choosen tab
                    var clickedTabKey = event.target.attributes.key.value
                    if(clickedTabKey != this.activeTabKey) { // clicked tab is not already selected
                        this.resetActiveClass()
                        event.target.parentElement.classList.add("is-active")

                        // save solution
                        this.saveSolutionInLocalArray(this.activeTabKey, inputTitle.value, inputSolution.value)

                        // update active tab key
                        this.activeTabKey = clickedTabKey
                        // change text displayed
                        inputTitle.value = this.solutions.at(this.activeTabKey).title
                        inputSolution.value = this.solutions.at(this.activeTabKey).description

                        // remove error
                        this.error.style.display = 'none'
                    }
                } else {
                        // show error
                        this.error.style.display = 'block'
                }
            } else if(event.target.name === 'doneButton') {
                const inputTitle = this.inputForm.getChildByName('titleInput')
                const inputSolution = this.inputForm.getChildByName('solutionInput')
                if (inputSolution.value !== '') {
                    // remove error
                    this.error.style.display = 'none'

                    // save solution
                    var activeTabKeyValue = document.getElementsByClassName('is-active').item(0).firstChild.attributes.key.value
                    this.saveSolutionInLocalArray(activeTabKeyValue, inputTitle.value, inputSolution.value)
                    console.log(this.solutions)
                    
                    this.inputForm.removeListener('click')
                    this.inputForm.setVisible(false)
                    
                    this.timedEvent.paused = true

                    // save in database
                    Database.saveNewSolutions(this.solutions).then(
                        () => {
                            console.log(this.solutions + " erfolgreich gespeichert.")
                            // switch to solution scene
                            this.scene.start("SolutionsScene")
                        }
                    )

                    
                } else {
                    // show error
                    this.error.style.display = 'block'
                }
            } 
        })
    }

    saveSolutionInLocalArray(id, newTitle, newSolution) {
        var action = " gespeichert."
        if(this.solutions[id] == undefined) {
            this.solutions.push({
                title: newTitle,
                description: newSolution,
                challengeID: this.data.id 
            })
        } else {
            this.solutions[id] = {
                title: newTitle,
                description: newSolution,
                challengeID: this.data.id 
            }
            action = " aktualisiert."
        }
        console.log("Lösungsvorschlag: " + newTitle + action)
    }

    resetActiveClass() {
        const list = document.getElementsByTagName('li')
        Array.from(list).forEach((element) => {
            element.classList.remove("is-active")
        })
    }


    update() {
        this.timerText.setText(this.formatTime(this.timedEvent.getRemainingSeconds().toString().substring(3,0)));
    }

    formatTime(seconds){
        // Minutes
        var minutes = Math.floor(seconds/60);
        // Seconds
        var partInSeconds = seconds%60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2,'0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }

    timerOut() {
        console.log("TIMER OUT")
        // finish last solution
        // display message
        var title = "Die Zeit ist abgelaufen!"
        var content = "Nun haben Sie nur noch etwas Zeit, um ihre letzte Lösung auszuformulieren."
        this.dialogModal.setVisible(true)
        this.inputForm.setVisible(false)
        this.dialogModal.getChildByID('messageTitle').innerHTML = title
        this.dialogModal.getChildByID('messageContent').innerHTML = content
        this.dialogModal.getChildByID('confirmationButton').innerHTML = "Okay"

        this.dialogModal.addListener('click')
        this.dialogModal.on('click', (event) => {
            if (event.target.name === 'confirmationButton') {
                this.dialogModal.setVisible(false)
                this.dialogModal.removeAllListeners()

                // lock input form
                document.getElementById('moreButton').disabled = true
                this.inputForm.setVisible(true)
            }
        })

    }

    openForm () {
        this.inputForm.setVisible(true)
    }
}

export default ChallengeScene