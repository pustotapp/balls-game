const characterPalette_ = {
    0: '#ffffffff',
    1: "#efefffff",
    2: "#dfdfffff",
    3: "#cfcfffff",
    4: "#bfbfffff",
    5: "#afafffff",
    6: "#9f9fffff",
    7: "#8f8fffff",
    8: "#7f7fffff",
    9: "#6f6fd1ff",
    A: "#5f5fa7ff",
    B: "#4f4f81ff",
    C: "#3f3f5fff",
    D: "#2f2f41ff",
    E: "#1f1f27ff",
    F: "#0f0f0fff"
};

const backgroundPalette = {
    0: '#ffffffff',
    C: "#3f3f5fff",
    D: "#2f2f41ff",
    F: "#0f0f0fff"
}

const generateBackgroundData = (width, height, numberOfStars) => {
    const data = Array.from({ length: height }).map(() => {
        return Array.from({ length: width }).map(() => 'F');
    });
    
    for (let i = 0; i < numberOfStars; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        
        if (x+ 2 < width && y + 2 < height) {
            data[y][x] = 'D';
            data[y][x + 1] = 'C';
            data[y][x + 2] = 'D';
            data[y + 1][x] = 'C';
            data[y + 1][x + 1] = '0';
            data[y + 1][x + 2] = 'C';
            data[y + 2][x] = 'D';
            data[y + 2][x + 1] = 'C';
            data[y + 2][x + 2] = 'D';
        } else {
            data[y][x] = '0';
        }
    }
    
    return data;
}

export const backgroundTexture = (scene, width, height, numberOfStars) => {
    return scene.textures.generate('background', {
        data: generateBackgroundData(width, height, numberOfStars),
        pixelWidth: 1,
        pixelHeight: 1,
        palette: backgroundPalette
    });
};
