export class SceneManager {
    constructor(app, engineer, damageSystem, missionLog) {
        this.app = app;
        this.engineer = engineer;
        this.damageSystem = damageSystem;
        this.missionLog = missionLog;
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
            this.missionLog.log("SECTOR 7-G: ROUTINE MAINTENANCE IN PROGRESS...");
            this.storyStep = 1;
        }

        if (this.storyStep === 1 && this.timer > 400) {
            this.missionLog.log("WARNING: MICRO-METEORITE IMPACT DETECTED!");
            this.damageSystem.create(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
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

        if (this.storyStep === 2 && this.damageSystem.getDamage().length === 0) {
            this.missionLog.log("IMPACT AREA SECURED. CALIBRATING SENSORS...");
            this.storyStep = 3;
            this.timer = 0;
        }

        if (this.storyStep === 3 && this.timer > 300) {
            this.missionLog.log("ALL SYSTEMS NOMINAL. GREAT JOB, ENGINEER.");
            this.storyStep = 4;
        }
    }
}
