import { StateMachine } from './stateMachine.js';
import { sparkEffect } from './particles.js';

export class Engineer {

    constructor(app, mousePos) {

        this.app = app;
        this.mousePos = mousePos;

        // Load the base texture for the sprite sheet
        const baseTexture = PIXI.BaseTexture.from('assets/engineer.png');
        const frameSize = 32; // Standard pixel art tile size, adjust if needed

        // Define animations: Down, Up, Left, Right (matching typical 4x4 sprite sheets)
        this.animations = {
            down: this.createAnimation(baseTexture, 0, 4, frameSize),
            up: this.createAnimation(baseTexture, 1, 4, frameSize),
            left: this.createAnimation(baseTexture, 2, 4, frameSize),
            right: this.createAnimation(baseTexture, 3, 4, frameSize)
        };

        this.currentDirection = 'down';
        this.sprite = this.animations[this.currentDirection];
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(4); // Scale up for pixel art feel
        this.sprite.x = window.innerWidth / 2;
        this.sprite.y = window.innerHeight - 200;
        this.sprite.animationSpeed = 0.15;
        this.sprite.play();

        this.speed = 3;
        this.target = null;
        this.damageSpots = [];

        this.app.stage.addChild(this.sprite);

        this.stateMachine = new StateMachine("idle", {
            idle: {
                enter: () => { },
                update: () => {
                    if (this.damageSpots.length > 0) {
                        this.stateMachine.transition("moveToRepair");
                    } else {
                        this.patrol();
                    }
                }
            },

            moveToRepair: {
                enter: () => {
                    this.target = this.damageSpots[0];
                },
                update: () => {
                    if (!this.target) {
                        this.stateMachine.transition("idle");
                        return;
                    }

                    const dx = this.target.x - this.sprite.x;
                    const dy = this.target.y - this.sprite.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist > 5) {
                        this.sprite.x += (dx / dist) * this.speed;
                        this.sprite.y += (dy / dist) * this.speed;
                    } else {
                        this.stateMachine.transition("repair");
                    }
                }
            },

            repair: {
                enter: () => {
                    sparkEffect(this.app, this.sprite.x, this.sprite.y);
                    this.app.stage.removeChild(this.target);
                    this.damageSpots.shift();
                },
                update: () => {
                    this.target = null;
                    this.stateMachine.transition("idle");
                }
            }
        }, this);
    }

    createAnimation(baseTexture, row, frames, size) {
        const textures = [];
        for (let i = 0; i < frames; i++) {
            const rect = new PIXI.Rectangle(i * size, row * size, size, size);
            textures.push(new PIXI.Texture(baseTexture, rect));
        }
        return new PIXI.AnimatedSprite(textures);
    }

    setDirection(dir) {
        if (this.currentDirection === dir) return;

        const prevX = this.sprite.x;
        const prevY = this.sprite.y;

        this.app.stage.removeChild(this.sprite);
        this.currentDirection = dir;
        this.sprite = this.animations[dir];
        this.sprite.x = prevX;
        this.sprite.y = prevY;
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(4);
        this.sprite.animationSpeed = 0.15;
        this.sprite.play();
        this.app.stage.addChild(this.sprite);
    }

    update(damageSpots) {
        this.damageSpots = damageSpots;

        const prevPos = { x: this.sprite.x, y: this.sprite.y };
        this.stateMachine.update();

        this.handleCursorReaction();
        this.keepInBounds();

        // Update animation based on movement
        const dx = this.sprite.x - prevPos.x;
        const dy = this.sprite.y - prevPos.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0.1) this.setDirection('right');
            else if (dx < -0.1) this.setDirection('left');
        } else {
            if (dy > 0.1) this.setDirection('down');
            else if (dy < -0.1) this.setDirection('up');
        }

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            this.sprite.stop();
        } else {
            this.sprite.play();
        }
    }

    patrol() {
        this.sprite.x += Math.sin(Date.now() * 0.001) * 0.5;
        this.sprite.y += Math.cos(Date.now() * 0.001) * 0.5;
    }

    handleCursorReaction() {
        const dx = this.mousePos.x - this.sprite.x;
        const dy = this.mousePos.y - this.sprite.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 100) {
            this.sprite.x -= dx / dist * 1.5;
            this.sprite.y -= dy / dist * 1.5;
        }
    }

    keepInBounds() {
        this.sprite.x = Math.max(30, Math.min(window.innerWidth - 30, this.sprite.x));
        this.sprite.y = Math.max(30, Math.min(window.innerHeight - 30, this.sprite.y));
    }
}