import React, { useState } from "react";

const initialDataState = {
    lights: 0,
    satellites: {
        max: 0,
        value: 0,
        price: 50
    },
    blocks: [],
    energy: {
        max: 100,
        value: 100
    }
};

const getNewPrice = (currentMax) => {
    if (currentMax === 0) {
        return 50;
    } else if (currentMax > 0 && currentMax <= 4) {
        return currentMax * 100;
    } else {
        return Math.ceil(Math.exp(currentMax / 3) * 100);
    }
};

export const GameDataContext = React.createContext(null);

export const WithGameData = ({ children }) => {
    const [gameData, setGameData] = useState(initialDataState);

    const addLights = (amount) => {
        setGameData(prevState => ({ ...prevState, lights: prevState.lights + amount }));
    };
    const chargeLights = (amount) => {
        setGameData(prevState => ({ ...prevState, lights: prevState.lights - amount }));
    };
    const incrementMaxSatellites = () => {
        setGameData(prevState => ({
            ...prevState,
            satellites: {
                ...prevState.satellites,
                max: prevState.satellites.max + 1,
                price: getNewPrice(prevState.satellites.max + 1)
            }
        }));
    };
    const addSatellite = () => {
        setGameData(prevState => ({
            ...prevState,
            satellites: {
                ...prevState.satellites,
                value: prevState.satellites.value + 1
            }
        }))
    }

    const decrementEnergy = () => {
        setGameData(prevState => ({
            ...prevState,
            energy: {
                ...prevState.energy,
                value: Math.max(prevState.energy.value - 1, 0)
            }
        }));
    };
    
    const addEnergy = (amount) => {
        setGameData(prevState => ({
            ...prevState,
            energy: {
                ...prevState.energy,
                value: Math.min(prevState.energy.value + amount, prevState.energy.max)
            }
        }))
    }
    
    const incrementBlocksCount = (type) => {
        setGameData(prevState => {
            const unchangedBlocks = prevState.blocks.filter(block => block.type !== type);
            const block = prevState.blocks.find(block => block.type === type);
            if (!block) {
                return {
                    ...prevState,
                    blocks: [...unchangedBlocks, { type, count: 1 }]
                };
            }
            const newBlock = { ...block, count: block.count + 1 };
            return {
                ...prevState,
                blocks: [...unchangedBlocks, newBlock]
            }
        });
    };

    const gameDataValue = {
        ...gameData,
        addLights,
        chargeLights,
        incrementMaxSatellites,
        addSatellite,
        decrementEnergy,
        addEnergy,
        incrementBlocksCount
    };

    return <GameDataContext.Provider value={gameDataValue}>
        {children}
    </GameDataContext.Provider>;
};