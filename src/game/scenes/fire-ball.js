import { Ball } from "./ball.js";

const fireBallPalette = {
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
const fireBallData = [
    '......1661......',
    '....11266211....',
    '...1222662221...',
    '..122336633221..',
    '.12233466433221.',
    '.12334666643321.',
    '1223466666643221',
    '6666666666666666',
    '6666666666666666',
    '1223466666643221',
    '.12334666643321.',
    '.12233466433221.',
    '..122336633221..',
    '...1222662221...',
    '....11266211....',
    '......1661......',
];

export const FireBallTextureConfig = {
    key: 'fire-ball',
    data: fireBallData,
    palette: fireBallPalette,
}

export class FireBall extends Ball {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.kind = 'fire';
        
        this.setTexture(FireBallTextureConfig.key);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }
    
    static fromBall(ball) {
        const element = new FireBall(ball.scene, ball.x, ball.y);
        
        return element;
    }
}