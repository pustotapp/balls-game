import { useRef, useState } from "react";

import Phaser from "phaser";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { PhaserGame } from "./game/PhaserGame";
import { FollowersContext } from "./providers/followers";
import { ScoreContext } from "./providers/score";

function App() {
    const phaserRef = useRef();

    const [score, setScore] = useState(0);
    const [maxFollowers, setMaxFollowers] = useState(0);
    const [addFollowerPrice, setAddFollowerPrice] = useState(50);

    return (
        <div id="app">
            <Layout>
                <ScoreContext.Provider value={{ score, setScore }}>
                    <FollowersContext.Provider value={{ maxFollowers, setMaxFollowers, addFollowerPrice, setAddFollowerPrice }}>
                        <Header />
                        <PhaserGame ref={phaserRef} score={score} maxFollowers={maxFollowers} />
                    </FollowersContext.Provider>
                </ScoreContext.Provider>
            </Layout>
        </div>
    );
}

export default App;
