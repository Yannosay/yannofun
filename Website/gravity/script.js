const { Engine, Render, Runner, Bodies, World, Mouse, MouseConstraint } = Matter;

// ------------------ Engine & World ------------------
const engine = Engine.create();
engine.world.gravity.y = 1;
const world = engine.world;

// ------------------ Renderer ------------------
const canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 600;

const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: "#e6f7ff"
    }
});

// ------------------ Static Ground & Boxes ------------------
const groundHeight = 60;
const ground = Bodies.rectangle(400, 600 - groundHeight/2, 810, groundHeight, { 
    isStatic: true, 
    render: { fillStyle: "#8B4513" }
});
World.add(world, ground);

const boxes = [
    Bodies.rectangle(200, 500, 100, 20, { isStatic: true, render: { fillStyle: "#8BC34A" } }),
    Bodies.rectangle(600, 400, 120, 20, { isStatic: true, render: { fillStyle: "#8BC34A" } }),
    Bodies.rectangle(400, 300, 80, 20, { isStatic: true, render: { fillStyle: "#8BC34A" } })
];
World.add(world, boxes);

// ------------------ Invisible Walls ------------------
const wallThickness = 50;
const leftWall = Bodies.rectangle(-wallThickness/2, 300, wallThickness, 600, { isStatic: true, render: { visible: false } });
const rightWall = Bodies.rectangle(800 + wallThickness/2, 300, wallThickness, 600, { isStatic: true, render: { visible: false } });
const ceiling = Bodies.rectangle(400, -wallThickness/2, 800, wallThickness, { isStatic: true, render: { visible: false } });
World.add(world, [leftWall, rightWall, ceiling]);

// ------------------ Draggable Balls ------------------
const ballImages = ['ball1.png','ball2.png','ball3.png'];
const balls = [];

// ------------------ Spawn Ball Function ------------------
// radius = physics body radius
// yOffset = manual adjustment to fix hitbox alignment if needed
function spawnBall(x, y, radius = 30, yOffset = 0) {
    const imgSrc = ballImages[Math.floor(Math.random() * ballImages.length)];

    // Auto-align bottom if ball spawned below ground accidentally
    const spawnY = y - yOffset;
    
    const ball = Bodies.circle(x, spawnY, radius, {
        restitution: 0.7,
        render: {
            sprite: {
                texture: imgSrc,
                xScale: (radius*2)/310, // scale PNG to match radius
                yScale: (radius*2)/310
            }
        }
    });

    World.add(world, ball);
    balls.push(ball);
    return ball;
}

// ------------------ Spawn initial balls ------------------
balls.push(spawnBall(200, 50, 30));
balls.push(spawnBall(400, 50, 30));
balls.push(spawnBall(600, 50, 30));

// ------------------ Mouse Control ------------------
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
});
World.add(world, mouseConstraint);
render.mouse = mouse;

// ------------------ Run Engine & Renderer ------------------
Engine.run(engine);
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// ------------------ Key Press: Q to Spawn Ball at Mouse ------------------
document.addEventListener('keydown', e => {
    if(e.key.toLowerCase() === 'q'){
        spawnBall(mouse.position.x, mouse.position.y, 30); // use mouse position
    }
});
