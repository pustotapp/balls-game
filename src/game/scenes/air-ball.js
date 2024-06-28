import { Ball } from "./ball.js";

const windBallPalette = {
    0: '#ffffff00',
    1: '#3a4466ff',
    2: '#5a6988ff',
    3: '#8b9bb4ff',
    4: '#ead4aaff',
    5: '#ffffffff',
    6: '#ff0044ff',
    7: '#c0cbdcff',
    8: '#0099dbff',
    9: '#733e39ff',
};
const windBallData = [
    '......1771......',
    '....11277211....',
    '...1222772221...',
    '..122337733221..',
    '.12233477433221.',
    '.12334777743321.',
    '1223477777743221',
    '7777777777777777',
    '7777777777777777',
    '1223477777743221',
    '.12334777743321.',
    '.12233477433221.',
    '..122337733221..',
    '...1222772221...',
    '....11277211....',
    '......1771......',
];

export const WindBallTextureConfig = {
    key: 'wind-ball',
    data: windBallData,
    palette: windBallPalette,
}

export class WindBall extends Ball {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.kind = 'wind';
        
        this.setTexture(WindBallTextureConfig.key);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }
    
    static fromBall(ball) {
        const element = new WindBall(ball.scene, ball.x, ball.y);
        
        return element;
    }
}