import { getNextId } from '../utils.js';

const {Between, RandomXY} = Phaser.Math;

const simpleBallPalette = {
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
const simpleBallData = [
    '......1551......',
    '....11255211....',
    '...1222552221...',
    '..122335533221..',
    '.12233455433221.',
    '.12334667743321.',
    '1223466677743221',
    '5555566677755555',
    '5555599988855555',
    '1223499988843221',
    '.12334998843321.',
    '.12233455433221.',
    '..122335533221..',
    '...1222552221...',
    '....11255211....',
    '......1551......',
];

export const SimpleBallTextureConfig = {
    key: 'simple-ball',
    data: simpleBallData,
    palette: simpleBallPalette,
}

export class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, SimpleBallTextureConfig.key);

        this.name = `ball-${getNextId()}`;
        this.energy = scene.game.MAX_ENERGY;

        if (!x) {
            this.setRandomPosition(0, 0, scene.cameras.main.width, scene.cameras.main.height);
        }

        scene.add.existing(this);
        scene.physics.add.existing(this, false);
    }
}