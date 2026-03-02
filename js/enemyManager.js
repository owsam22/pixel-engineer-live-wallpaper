export function createEnemySystem(app) {

    let enemies = [];

    function create(x, y) {
        const padding = 60;
        const skyLimit = window.innerHeight * 0.10;

        // Clamp coordinates to safe area
        const clampedX = Math.max(padding, Math.min(window.innerWidth - padding, x));
        const clampedY = Math.max(skyLimit, Math.min(window.innerHeight - padding, y));

        const texture = PIXI.Texture.from('assets/enemy.png');
        const enemy = new PIXI.Sprite(texture);

        enemy.anchor.set(0.5);
        enemy.x = clampedX;
        enemy.y = clampedY;

        // Randomize scale for variety (Smaller than character)
        enemy.scale.set(0.08 + Math.random() * 0.04);

        // Simple vibration animation for enemies
        app.ticker.add(function wobble() {
            if (!enemies.includes(enemy)) {
                app.ticker.remove(wobble);
                return;
            }
            enemy.rotation = Math.sin(Date.now() * 0.02) * 0.1;
        });

        app.stage.addChild(enemy);
        enemies.push(enemy);
    }

    function getEnemies() {
        return enemies;
    }

    return { create, getEnemies };
}