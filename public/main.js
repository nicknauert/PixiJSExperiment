// Aliases
const   Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        TextureCache = PIXI.utils.TextureCache
        Sprite = PIXI.Sprite;


////////////////////
// Renderer Setup

const width = window.innerWidth;
const height = window.innerHeight;
const app = new Application( width, height, { backgroundColor: 0x262a31})
document.body.appendChild(app.view);
app.renderer.autoResize = true;

////////////////////
// Resource Loader

loader
    .add('images/spaceship.png')
    .add('images/spacebg.gif')
    .add('images/spaceSprites.png')
    .on('progress', loadBarHandler)
    .load(setup)

function loadBarHandler(loader, resource){
    console.log("loading: " + resource.url)
    console.log("progress: " + loader.progress + '%')
}

let player;

////////////////////
// General Setup
function setup(){
    
    // Sprites
    const sheet = new Sprite(
        loader.resources['images/spaceSprites.png'].texture
    )
    player = new Sprite(
        loader.resources['images/spaceship.png'].texture
    )
    const bg = new Sprite(
        loader.resources['images/spacebg.gif'].texture
    )

    player.anchor.set(0.5);
    player.x = app.renderer.width / 2;
    player.y = app.renderer.height / 2;
    player.vx = 0;
    player.vy = 0;
    player.scale.set(.15);

    bg.anchor.set(0.5);
    bg.x = app.renderer.width / 2;
    bg.y = app.renderer.height / 2;
    bg.scale.set(3);

    app.stage.addChild(bg);
    app.stage.addChild(player);

    app.ticker.add( delta => gameLoop(delta));
}

function gameLoop(delta){
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
        if( e.keyCode === 32){
            changeSomething();
        }
    })

    window.addEventListener('keyup', (e) => {
        if( e.keyCode === 37){
            player.vx = 0;
            player.vy = 0;
        }
    })

    function moveLeft(e){   player.vx -= 1 }
    function moveRight(e){  player.vx += 1 }
    function moveUp(e){     player.vy -= 1 }
    function moveDown(e){   player.vy += 1 }

    player.x += player.vx;
    player.y += player.vy;

}




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







