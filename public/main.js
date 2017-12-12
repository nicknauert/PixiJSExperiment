// Aliases
const   Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        TextureCache = PIXI.utils.TextureCache,
        Container = PIXI.Container
        Sprite = PIXI.Sprite;


///////////////////////////////////
// Renderer Setup
///////////////////////////////////

const width = window.innerWidth;
const height = window.innerHeight;
const app = new Application( width, height, { backgroundColor: 0x262a31})
document.body.appendChild(app.view);
app.renderer.autoResize = true;

///////////////////////////////////
// Resource Loader
///////////////////////////////////

loader
    .add('images/spaceship.png')
    .add('images/spacebg.png')
    .add('images/ufo.png')
    .add('images/laser.png')
    .add('images/missile.png')
    .on('progress', loadBarHandler)
    .load(setup)

function loadBarHandler(loader, resource){
    console.log("loading: " + resource.url)
    console.log("progress: " + loader.progress + '%')
}

let player, state, laser, laserSheet, missile, rectangle, missileFrame;
let frameCount = 0;
let ufos = [];
const baddies = new Container();

let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    spaceKey = keyboard(32);

////////////////////////////////////
// General Setup to run once loader is finished
///////////////////////////////////
function setup(){
    // Sprites
    player = new Sprite(
        loader.resources['images/spaceship.png'].texture
    )
    const bg = new Sprite(
        loader.resources['images/spacebg.png'].texture
    )

    missileSheet = TextureCache['images/missile.png'];
    missileFrame = new PIXI.Rectangle( 0, 0, missileSheet.width / 2, missileSheet.height);
    missileSheet.frame = missileFrame;
    missile = new Sprite(missileSheet);
    missile.scale.set(3);
    
    laserSheet = TextureCache['images/laser.png'];
    rectangle = new PIXI.Rectangle( 0, 0, laserSheet.width, 128);
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
    left.press = () => {
        right.release();
        player.vx = -3;
    }

    left.release = () => {
        if(!right.isDown){
            player.vx = 0;
        }
    }

    right.press = () => {
        left.release();
        player.vx = 3;
    }

    right.release = () => {
        if(!left.isDown){
            player.vx = 0;
        }
    }

    up.press = () => {
        down.release();
        player.vy = -3;
    }

    up.release = () => {
        if(!down.isDown){
            player.vy = 0;
        }
    }

    down.press = () => {
        up.release();
        player.vy = 3;
    }

    down.release = () => {
        if(!up.isDown){
            player.vy = 0;
        }
    }

    spaceKey.press = () => {
        app.ticker.remove(missileMovement);
        missile.x = player.x;
        missile.y = player.y - 50;
        missile.vy = -3;
        app.stage.addChild(missile);
        app.ticker.add(missileMovement)
    }

    spaceKey.release = () => {
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
    bg.scale.set(2);

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
        if (frameCount % 30 === 0){
            ufo.vx *= -1;
        }
        ufo.x += ufo.vx;
        if(app.stage.children.indexOf(missile) > -1){
            if(boxesIntersect(ufo, missile)){
                destroyUfo(ufo);
            }
        }
        
    })

    // Move UFOS container around as a whole
    if (frameCount === 89){
        baddies.vx *= -1;
    }
    // Update Laser position to match player position
    if(laser){
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
}

///////////////////////////////////
// Helper functions
///////////////////////////////////

function frameCounterFunction(delta){
    frameCount ++;
    if(frameCount >= 90 ){
        frameCount = 0
    }
  }
  
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

function hitTestRectangle( r1, r2) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    hit = false;

    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true;
        } else {
            hit = false;
        }
        } else {
            hit = false;
        }
    return hit;
}

function destroyUfo(ufo){ baddies.removeChild(ufo); }

function boxesIntersect(a, b){
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

function missileMovement() {
    if(missileFrame.x = 0){
        missileFrame.x = 8;
        missileSheet.frame = missileFrame;
    } else {
        missileFrame.x = 0;
        missileSheet.frame = missileFrame;
    }
    missile.y += missile.vy;
    if(missile.y < 0){
        app.stage.removeChild(missile);
        console.log(app.stage.children);
        app.ticker.remove(missileMovement);
    }
}

