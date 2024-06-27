const particlePalette = {
    0: '#ffffff00',
    1: '#ffffff32',
    2: '#ffffff66',
    3: '#ffffff96',
    4: '#ffffffcc',
    5: '#ffffffff'
};
const particleData = [
    '....1....',
    '....2....',
    '...232...',
    '..23432..',
    '123454321',
    '..23432..',
    '...232...',
    '....2....',
    '....1....'
];

export const getParticleTexture = (scene) => {
    return scene.textures.generate('particle', {
        data: particleData,
        pixelWidth: 0.5,
        pixelHeight: 0.5,
        palette: particlePalette
    });
}
