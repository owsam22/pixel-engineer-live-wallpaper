import { Engineer } from './engineer.js';
import { createDamageSystem } from './damage.js';
import { MissionLog } from './missionLog.js';
import { SceneManager } from './sceneManager.js';

export const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x0f0f1a,
    antialias: true
});

document.body.appendChild(app.view);

let mousePos = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
});

const engineer = new Engineer(app, mousePos);
const damageSystem = createDamageSystem(app);
const missionLog = new MissionLog(app);
const sceneManager = new SceneManager(app, engineer, damageSystem, missionLog);

window.addEventListener("dblclick", (e) => {
    damageSystem.create(e.clientX, e.clientY);
});

app.ticker.add((delta) => {
    engineer.update(damageSystem.getDamage());
    sceneManager.update(delta);
});