import { WindBall } from "./air-ball";
import { FireBall } from "./fire-ball";
import { EarthBall } from "./earth-ball";
import { WaterBall } from "./water-ball";

const followerBallPalette = {
    0: '#ffffff00',
    1: '#3a4466ff',
    2: '#5a6988ff',
    3: '#8b9bb4aa',
    4: '#ead4aaff',
    5: '#ffffffff',
    6: '#ff0044ff',
    7: '#c0cbdcff',
    8: '#0099dbff',
    9: '#733e39ff',
};
const followerBallData = [
    '.........77.....',
    '....36..7777....',
    '..6333..777737..',
    '..336....77333..',
    '.6633......3733.',
    '6666.........37.',
    '6666...33.......',
    '.66...3553......',
    '......3553...88.',
    '.......33...8888',
    '.93.........8888',
    '.3393......3388.',
    '..33399....833..',
    '..939999..3338..',
    '....9999..83....',
    '.....99.........'
];

export const FollowerBallTextureConfig = {
    key: 'follower-ball',
    data: followerBallData,
    palette: followerBallPalette,
}

export class Follower extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, FollowerBallTextureConfig.key);

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }
    
    static fromBall(ball) {
        const follower = new Follower(ball.scene, ball.x, ball.y);
        follower.body.onCollide = true;
        follower.body.setCollideWorldBounds(true);
        follower.body.setBounce(0.8);
        
        return follower;
    }
    
    maybeCreateElement(ball) {
        const ticket = Phaser.Math.RND.integerInRange(0, 50);
        if (ticket === 1) {
            return FireBall.fromBall(ball);
        } else if (ticket === 2) {
            return EarthBall.fromBall(ball);
        } else if (ticket === 3) {
            return WaterBall.fromBall(ball);
        } else if (ticket === 4) {
            return WindBall.fromBall(ball);
        }
        return;
    }
}
