// Aliases
const   Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        TextureCache = PIXI.utils.TextureCache,
        Container = PIXI.Container
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
    .add('images/ufo.png')
    .add('images/laser.png')
    .on('progress', loadBarHandler)
    .load(setup)

function loadBarHandler(loader, resource){
    console.log("loading: " + resource.url)
    console.log("progress: " + loader.progress + '%')
}

let player, state, laser, laserSheet;
let rectangle;
let frameCount = 0;
let ufos = [];
const baddies = new Container();

////////////////////
// General Setup
function setup(){
    
    // Sprites
    player = new Sprite(
        loader.resources['images/spaceship.png'].texture
    )
    const bg = new Sprite(
        loader.resources['images/spacebg.gif'].texture
    )
    
    laserSheet = TextureCache['images/laser.png']
    rectangle = new PIXI.Rectangle( 0, 0, laserSheet.width, laserSheet.height / 11)
    laserSheet.frame = rectangle;
    laser = new Sprite(laserSheet);

    // Enemies Setup
    let numberOfUfos = 6,
        spacing = 100,
        speed = .25,
        direction = 1;

    for(i = 0; i <= numberOfUfos; i++){
        const ufo = new Sprite(
            loader.resources['images/ufo.png'].texture
        )
        let x = spacing * i
        let y = 100;
        
        ufo.vx = speed * direction
        ufo.scale.set(.2)
        ufo.x = x;
        ufo.y = y;
        
        direction *= -1;
        ufos.push(ufo);
        baddies.addChild(ufo);
    }

    // Movement
    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40),
        spaceKey = keyboard(32);

    left.press = () => {
        if(!right.isDown){
            player.vx = -3;
        }
    }

    left.release = () => {
        if(!right.isDown){
            player.vx = 0;
        }
    }

    right.press = () => {
        if(!left.isDown){
            player.vx = 3;
        }
    }

    right.release = () => {
        if(!left.isDown){
            player.vx = 0;
        }
    }

    up.press = () => {
        if(!down.isDown){
            player.vy = -3;
        }
    }

    up.release = () => {
        if(!down.isDown){
            player.vy = 0;
        }
    }

    down.press = () => {
        if(!up.isDown){
            player.vy = 3;
        }
    }

    down.release = () => {
        if(!up.isDown){
            player.vy = 0;
        }
    }

    spaceKey.press = () => {
        laser.rotation = degreesToRadians(-90);
        app.stage.addChild(laser);
    }

    spaceKey.release = () => {
        app.stage.removeChild(laser);
    }



    player.anchor.set(0.5);
    player.x = app.renderer.width / 2;
    player.y = app.renderer.height - 100;
    player.vx = 0;
    player.vy = 0;
    player.scale.set(.15);

    bg.anchor.set(0.5);
    bg.x = app.renderer.width / 2;
    bg.y = app.renderer.height / 2;
    bg.scale.set(4);

    baddies.x = (width / 2) - (baddies.width / 2);
    baddies.vx = 1;

    app.stage.addChild(bg);
    app.stage.addChild(player);
    app.stage.addChild(baddies);

    app.ticker.add( delta => gameLoop(delta));
    app.ticker.add( delta =>  frameCounterFunction(delta));
}

function gameLoop(delta){
    // Movement updates
    player.x += player.vx
    player.y += player.vy
    baddies.x += baddies.vx;

    // Set individual UFO position inside of container
    ufos.forEach( ufo => {
        if ( frameCount % 30 === 0 ){
            ufo.vx *= -1;
        }
        ufo.x += ufo.vx;
    })

    // Move UFOS container around as a whole
    if (frameCount === 89){
        baddies.vx *= -1;
    }

    // Update Laser position to match player position
    laser.x = player.x - 69;
    laser.y = player.y;

    // Update Laser sprite sheet frame position
    if ( rectangle.y < 1280 ){
        rectangle.y += rectangle.height
        laserSheet.frame = rectangle;
    } else {
        rectangle.y = 0;
        laserSheet.frame = rectangle;
    }


}

function frameCounterFunction(delta){
    frameCount ++;
    if(frameCount >= 90 ){
        frameCount = 0
    }
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

function keyboard(keyCode){
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //downHandler
    key.downHandler = event => {
        if(event.keyCode === key.code){
            if(key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //upHandler
    key.upHandler = event => {
        if(event.keyCode === key.code){
            if(key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        'keydown', key.downHandler.bind(key), false
    )
    window.addEventListener(
        'keyup', key.upHandler.bind(key), false
    )
    return key;
}







