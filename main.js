//drawing the road or canvas
const canvas = document.getElementById("myCanvas");
canvas.width = 200;



//drawing a car
const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width * 0.95);
const car = new Car(road.getLaneCenter(1), 200, 30, 50, "KEYS");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUM", 2)
];

//to move the car.

animate();

function animate(){
    //to update the traffic.
    for(let i = 0; i < traffic.length; i++){
        //empty array is passed for traffic so it doesn't get damaged when interacting with obstacles.
        traffic[i].update(road.borders, []);
    }
    //traffic is passed so the car gets damaged when interacting with traffic.
    car.update(road.borders, traffic);

    canvas.height = window.innerHeight;
    
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.74);

    road.draw(ctx);
    //to draw the traffic on the canvas
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(ctx, "orange");
    }
    car.draw(ctx, "blue");

    ctx.restore();
    requestAnimationFrame(animate);
}