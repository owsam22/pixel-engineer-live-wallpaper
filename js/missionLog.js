export class MissionLog {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0.7);
        this.bg.drawRect(0, 0, window.innerWidth, 60);
        this.bg.endFill();
        this.bg.y = window.innerHeight - 60;
        this.container.addChild(this.bg);

        const style = new PIXI.TextStyle({
            fontFamily: 'Courier New',
            fontSize: 18,
            fill: '#00ff00',
            wordWrap: true,
            wordWrapWidth: window.innerWidth - 40
        });

        this.text = new PIXI.Text('SYSTEM INITIALIZED...', style);
        this.text.x = 20;
        this.text.y = window.innerHeight - 45;
        this.container.addChild(this.text);

        this.messageQueue = [];
        this.isTyping = false;

        window.addEventListener('resize', () => {
            this.bg.width = window.innerWidth;
            this.bg.y = window.innerHeight - 60;
            this.text.y = window.innerHeight - 45;
        });
    }

    log(message) {
        this.messageQueue.push(message);
        if (!this.isTyping) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.messageQueue.length === 0) {
            this.isTyping = false;
            return;
        }

        this.isTyping = true;
        const msg = this.messageQueue.shift();
        this.text.text = '> ';

        for (let char of msg) {
            this.text.text += char;
            await new Promise(r => setTimeout(r, 30));
        }

        await new Promise(r => setTimeout(r, 2000));
        this.processQueue();
    }
}
