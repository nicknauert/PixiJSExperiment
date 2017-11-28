////////////////////
// Setup
function setup(){
    const width = window.innerWidth;
    const height = window.innerHeight;
    const app = new PIXI.Application( width, height, { backgroundColor: 0x262a31})
    document.body.appendChild(app.view);
    
    ////////////////////
    // Characters

    const player = PIXI.Sprite.fromImage('./images/spaceship.png', true)

    player.anchor.set(0.5);
    player.x = app.renderer.width / 2;
    player.y = app.renderer.height - 60;
    player.scale.set(.15);
    player.rotation = degreesToRadians(180);

    app.stage.addChild(player);


    ////////////////////
    // Movement

    window.addEventListener('keydown', (e) => {
        if( e.keyCode === 37){
            moveLeft();
        }
        if( e.keyCode === 38){
            moveUp();
        }
        if( e.keyCode === 39){
            moveRight();
        }
        if( e.keyCode === 40){
            moveDown();
        }
    })
    function moveLeft(e){   player.x -= 10 }
    function moveRight(e){  player.x += 10 }
    function moveUp(e){     player.y -= 10 }
    function moveDown(e){   player.y += 10 }
}

setup();

////////////////////
// Helper functions

// Radian -> Degrees
function radToDegrees( radian ){
    return radian * ( 180 / Math.PI );
}

// Degrees -> Radian
function degreesToRadians( degrees ){
    return degrees * ( Math.PI / 180 );
}







