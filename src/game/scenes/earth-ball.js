import { Ball } from "./ball.js";

const earthBallPalette = {
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
const earthBallData = [
    '......1991......',
    '....11299211....',
    '...1222992221...',
    '..122339933221..',
    '.12233499433221.',
    '.12334999943321.',
    '1223499999943221',
    '9999999999999999',
    '9999999999999999',
    '1223499999943221',
    '.12334999943321.',
    '.12233499433221.',
    '..122339933221..',
    '...1222992221...',
    '....11299211....',
    '......1991......',
];

export const EarthBallTextureConfig = {
    key: 'earth-ball',
    data: earthBallData,
    palette: earthBallPalette,
}

export class EarthBall extends Ball {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.kind = 'earth';
        
        this.setTexture(EarthBallTextureConfig.key);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }
    
    static fromBall(ball) {
        const element = new EarthBall(ball.scene, ball.x, ball.y);
        
        return element;
    }
}