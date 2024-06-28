import { Ball } from "./ball.js";

const waterBallPalette = {
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
const waterBallData = [
    '......1881......',
    '....11288211....',
    '...1222882221...',
    '..122338833221..',
    '.12233488433221.',
    '.12334888843321.',
    '1223488888843221',
    '8888888888888888',
    '8888888888888888',
    '1223488888843221',
    '.12334888843321.',
    '.12233488433221.',
    '..122338833221..',
    '...1222882221...',
    '....11288211....',
    '......1881......',
];

export const WaterBallTextureConfig = {
    key: 'water-ball',
    data: waterBallData,
    palette: waterBallPalette,
}

export class WaterBall extends Ball {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.kind = 'water';
        
        this.setTexture(WaterBallTextureConfig.key);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }
    
    static fromBall(ball) {
        const element = new WaterBall(ball.scene, ball.x, ball.y);
        
        return element;
    }
}