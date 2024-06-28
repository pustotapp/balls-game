import { WindBallTextureConfig } from "../scenes/air-ball";
import { SimpleBallTextureConfig } from "../scenes/ball";
import { FireBallTextureConfig } from "../scenes/fire-ball";
import { FollowerBallTextureConfig } from "../scenes/follower";
import { EarthBallTextureConfig } from "../scenes/earth-ball";
import { WaterBallTextureConfig } from "../scenes/water-ball";

export const loadTextures = (scene) => {
    scene.textures.generate(SimpleBallTextureConfig.key, {
        data: SimpleBallTextureConfig.data,
        pixelWidth: 1,
        pixelHeight: 1,
        palette: SimpleBallTextureConfig.palette
    });

    scene.textures.generate(FollowerBallTextureConfig.key, {
        data: FollowerBallTextureConfig.data,
        pixelWidth: 1,
        pixelHeight: 1,
        palette: FollowerBallTextureConfig.palette
    });

    scene.textures.generate(FireBallTextureConfig.key, {
        data: FireBallTextureConfig.data,
        pixelWidth: 1,
        pixelHeight: 1,
        palette: FireBallTextureConfig.palette
    });

    scene.textures.generate(EarthBallTextureConfig.key, {
        data: EarthBallTextureConfig.data,
        pixelWidth: 1,
        pixelHeight: 1,
        palette: EarthBallTextureConfig.palette
    });

    scene.textures.generate(WaterBallTextureConfig.key, {
        data: WaterBallTextureConfig.data,
        pixelWidth: 1,
        pixelHeight: 1,
        palette: WaterBallTextureConfig.palette
    });

    scene.textures.generate(WindBallTextureConfig.key, {
        data: WindBallTextureConfig.data,
        pixelWidth: 1,
        pixelHeight: 1,
        palette: WindBallTextureConfig.palette
    });
};