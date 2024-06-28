import { GridItem } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { forwardRef, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { GameDataContext } from "../providers/game-data";
import StartGame from "./main";
import { EventBus } from "./EventBus";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

const MAX_SPEED = 400;
const MAX_ENERGY = 100;

export const PhaserGame = forwardRef(function PhaserGame({}, ref) {
    const game = useRef();
    
    const { satellites, addLights, energy, decrementEnergy, addSatellite, incrementBlocksCount } = useContext(GameDataContext);

    useLayoutEffect(() => {
        if (game.current === undefined) {
            const { width, height } = getWindowDimensions();
            const gameWidth = Math.min(width, 400);
            const gameHeight = Math.min(height - 200, 900);
            
            game.current = StartGame("game-container", { width: gameWidth, height: gameHeight });
            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
            
            game.current.MAX_SPEED = MAX_SPEED;
            game.current.MAX_ENERGY = MAX_ENERGY;
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }

        };
    }, [ref]);
    
    useEffect(() => {
        if (game.current !== undefined) {
            game.current.satellites = satellites;
        }
    }, [satellites])
    
    useEffect(() => {
        if (game.current !== undefined) {
            game.current.energy = energy;
        }
    }, [energy]);
    
    let listenersCreated = useRef(false);
    useEffect(() => {
        if (listenersCreated.current === false) {
            EventBus.on('character.bounced', ({ energy, speed }) => {
                const points = Math.floor(energy / MAX_ENERGY * speed / MAX_SPEED);
                addLights(points);
            });
            EventBus.on('character.satellite.added', () => {
                const points = 1;
                addLights(points);
                addSatellite();
            });
            EventBus.on('character.satellite.bounced', ({ energy, speed }) => {
                const points = Math.floor(energy / MAX_ENERGY * speed / MAX_SPEED);
                addLights(points);
            });
            EventBus.on('ball.destroyed', ({ type }) => {
                const points = 1;
                addLights(points);
                decrementEnergy();
                
                if (type) {
                    incrementBlocksCount(type);
                }
            });
        }
        return () => {
            listenersCreated.current = true;
        }
    }, []);

    return (
        <GridItem area='game' colSpan={4} colStart={1} rowStart={3}>
            <div id="game-container"></div>
        </GridItem>
    );

});

PhaserGame.propTypes = {
};
