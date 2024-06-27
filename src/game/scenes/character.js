const characterPalette = Array.from({ length: 16 }, (_, i) => i.toString(16))
    .reduce((acc, key, i) => {
        const r = (255 - i * 16).toString(16).padStart(2, '0');
        const g = (255 - i * 16).toString(16).padStart(2, '0');
        const b = (i > 8 ? 255 - (i-8) * 32 : 255).toString(16).padStart(2, '0');
        const a = (i > 8 ? 255 - (i-8) * 32 : 255).toString(16).padStart(2, '0');

        return { ...acc, [key.toUpperCase()]: `#${r}${g}${b}${a}` };
    }, {});

const characterData = Array.from({ length: 16 }).reduce((acc, _, i) => {
    const length = Math.ceil(((4 - Math.sqrt(i))**2));
    
    const halfRow = Array.from({ length }, (_, j) => (i+j).toString(16).toUpperCase()).join('').padEnd(16, '.');
    const row = halfRow.split('').reverse().join('') + halfRow;
    
    acc.push(row);
    acc.unshift(row);
    
    return acc;
}, []);

export const getCharacterTexture = (scene) => {
    return scene.textures.generate('character', {
        data: characterData,
        pixelWidth: 1,
        pixelHeight: 1,
        palette: characterPalette
    });
}