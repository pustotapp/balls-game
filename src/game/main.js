import Phaser from 'phaser';
import { Space } from "./scenes/Space.js";

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Space
    ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const StartGame = (parent, { width, height }) => {
    return new Phaser.Game({ ...config, width, height, parent });
}

export default StartGame;
