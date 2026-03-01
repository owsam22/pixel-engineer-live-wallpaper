export class SceneManager {
    constructor(app, engineer, enemySystem) {
        this.app = app;
        this.engineer = engineer;
        this.enemySystem = enemySystem;
        this.storyStep = 0;
        this.timer = 0;
        this.shakeTimer = 0;
    }

    shake(intensity = 5, duration = 30) {
        this.shakeTimer = duration;
        this.shakeIntensity = intensity;
    }

    update(delta) {
        this.timer += delta;

        if (this.storyStep === 0 && this.timer > 100) {
            this.storyStep = 1;
        }

        if (this.storyStep === 1 && this.timer > 400) {
            this.enemySystem.create(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
            this.shake(10, 40);
            this.storyStep = 2;
        }

        if (this.shakeTimer > 0) {
            this.shakeTimer--;
            this.app.stage.x = (Math.random() - 0.5) * this.shakeIntensity;
            this.app.stage.y = (Math.random() - 0.5) * this.shakeIntensity;
            if (this.shakeTimer === 0) {
                this.app.stage.x = 0;
                this.app.stage.y = 0;
            }
        }

        if (this.storyStep === 2 && this.enemySystem.getEnemies().length === 0) {
            this.storyStep = 3;
            this.timer = 0;
        }

        if (this.storyStep === 3 && this.timer > 300) {
            this.storyStep = 1;
            this.timer = 0;
        }
    }
}
