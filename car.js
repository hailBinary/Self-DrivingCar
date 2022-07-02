//Building a car with javascript

class Car{
    constructor(x, y, width, height, controlType, maxSpeed = 4){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        //so that there's different speeds for the dummy and the car.
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        //equip car with sensors that are not a dummy.
        if(controlType != "DUM"){
            this.sensor = new Sensor(this); 
            //adding a neural network to the car.
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 7, 4]//putting the number of input/output neurons for each level.You can add more layers of neural net.
            );
        }
        this.controls = new Controls(controlType);
    }

    //Update car position when the keys are pressed.
    update(roadBorders, traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        //only update if the sensor exists.
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            //check how the far the object sensed by the sensor is.
            const offsets = this.sensor.readings.map(
                //if s isn't touched s == null so 0 and for the other one get lower values as far as you are.
                s => s == null ? 0 : 1 - this.sensor.offsets
            );
            //neural net outputs.
            const outputs = NeuralNetwork.feedForward
        }
    }

    //asseses when the car intersects with obstacles
    #assessDamage(roadBorders, traffic){
        for(let i = 0; i < roadBorders.length; i++){
            if(polysInstersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        for(let i = 0; i < traffic.length; i++){
            if(polysInstersect(this.polygon, traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    //to know the corners of the car since after we move the context we don't actually know where the actual corners of the car are.
    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        }); 
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        }); 
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }
    //Move the car with appropriate physics.
    #move(){
        //speed controls.
        if (this.controls.forward){
        this.speed += this.acceleration;
        }

        if (this.controls.reverse){
            this.speed -= this.acceleration;
        }

        //to ensure the car doesn't go too far.
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }

        //so that the car slows down when the key is not pressed.
        if(this.speed > 0){
            this.speed -= this.friction;
        }

        if (this.speed < 0){
            this.speed += this.friction;
        }

        //Car comes to a complete stop instead of moving ever so slowly.
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        //for car movements at an angle.
        if (this.speed != 0){
            //ensure the car doesn't change directions while moving in the opposite directions.
            const flip = this.speed>0?1: -1;
            
             //Car turns at an angle
            if(this.controls.left){
                this.angle += 0.025 * flip;
            }

            if(this.controls.right){
                this.angle -= 0.025 * flip; 
            }
        }

        //changing positions in x and y co-ordinate with the diagonal forces being resolved.
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }
    
    //drawing a car on the canvas.
    draw(ctx, color){
        //to change to grey if car is damaged.
        if(this.damaged){
            ctx.fillStyle = "red";
        }else{
            ctx.fillStyle = color;
        }
       //using the #createPolygon function to draw the car (as we can also know the corners after drawing)
       ctx.beginPath();
       ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
       for( let i = 1; i < this.polygon.length; i++){
        ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
       }
       ctx.fill();

       //draw only if it has a sensor.
       if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}