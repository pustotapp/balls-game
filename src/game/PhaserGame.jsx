import PropTypes from "prop-types";
import { forwardRef, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { ScoreContext } from "../providers/score/index.js";
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

export const PhaserGame = forwardRef(function PhaserGame({ score, maxFollowers }, ref) {
    const game = useRef();
    const { setScore } = useContext(ScoreContext);

    useLayoutEffect(() => {
        if (game.current === undefined) {
            const { width, height } = getWindowDimensions();
            const gameWidth = Math.min(width, 400);
            const gameHeight = Math.min(height - 100, 900);
            
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
            game.current.maxFollowers = maxFollowers;
        }
    }, [maxFollowers, ref])
    
    useEffect(() => {
        EventBus.on('character.bounced', ({ energy, speed }) => {
            const points = Math.floor(energy / MAX_ENERGY * speed / MAX_SPEED);
            setScore(prevScore => prevScore + points );
        });
        EventBus.on('character.follower.added', () => {
            setScore((prevScore) => prevScore + 9);
        });
        EventBus.on('character.follower.bounced', ({ energy, speed }) => {
            const points = Math.floor(energy / MAX_ENERGY * speed / MAX_SPEED);
            setScore(prevScore => prevScore + points);
        });
        EventBus.on('ball.destroyed', () => {
            setScore((prevScore) => prevScore + 1);
        });
    }, [ref]);

    return (
        <div id="game-container"></div>
    );

});

PhaserGame.propTypes = {
    score: PropTypes.number.isRequired,
    maxFollowers: PropTypes.number.isRequired
};
