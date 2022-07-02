//Script for controlling the car

class Controls{
    constructor(type){
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch(type){
            case "KEYS":
                this.#addKeyboardListener(); //private method use # and this is used to identify key presses.
                break;
            case "DUM":
                this.forward = true;
                break; 
        }
    }

    #addKeyboardListener(){//# for private functions within the class.

        //identify when a key is pressed
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                    case "ArrowRight":
                    this.right = true;
                    break;
                    case "ArrowUp":
                    this.forward = true;
                    break;
                    case "ArrowDown":
                    this.reverse = true;
                    break;
            }
            //console.table(this);
        }

        //identify when a key is released. Above and below functions run simultaneously. 

        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                    case "ArrowRight":
                    this.right = false;
                    break;
                    case "ArrowUp":
                    this.forward = false;
                    break;
                    case "ArrowDown":
                    this.reverse = false;
                    break;
            }
            //console.table(this);
        }
    }
}