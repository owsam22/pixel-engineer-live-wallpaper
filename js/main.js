import { Engineer } from './engineer.js';
import { createEnemySystem } from './enemyManager.js';
import { MissionLog } from './missionLog.js';
import { SceneManager } from './sceneManager.js';

export const app = new PIXI.Application({
    resizeTo: window,
    backgroundAlpha: 0, // Transparent canvas to show CSS background
    antialias: true
});

app.view.id = 'pixi-canvas';
document.body.appendChild(app.view);

let mousePos = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
});

const engineer = new Engineer(app, mousePos);
const enemySystem = createEnemySystem(app);
const missionLog = new MissionLog(app);
const sceneManager = new SceneManager(app, engineer, enemySystem, missionLog);

window.addEventListener("dblclick", (e) => {
    enemySystem.create(e.clientX, e.clientY);
});

app.ticker.add((delta) => {
    engineer.update(enemySystem.getEnemies());
    sceneManager.update(delta);
});