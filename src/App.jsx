import { useRef } from "react";
import {
    ChakraBaseProvider,
    extendBaseTheme,
    theme as chakraTheme,
    Box
} from "@chakra-ui/react";

import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Layout } from "./components/layout";
import { PhaserGame } from "./game/PhaserGame";
import { WithGameData } from "./providers/game-data";

const theme = extendBaseTheme({
    components: {
        Button: chakraTheme.components.Button,
        Box: chakraTheme.components.Box,
        Grid: chakraTheme.components.Grid,
        GridItem: chakraTheme.components.GridItem,
        Modal: chakraTheme.components.Modal,
        ModalBody: chakraTheme.components.ModalBody,
        ModalCloseButton: chakraTheme.components.ModalCloseButton,
        ModalContent: chakraTheme.components.ModalContent,
        ModalFooter: chakraTheme.components.ModalFooter,
        ModalHeader: chakraTheme.components.ModalHeader,
        ModalOverlay: chakraTheme.components.ModalOverlay,
        Text: chakraTheme.components.Text,
    }
});

function App() {
    const phaserRef = useRef();

    return (
        <div id="app">
            <ChakraBaseProvider theme={theme}>
                <WithGameData>
                    <Layout>
                        <Header />
                        <PhaserGame ref={phaserRef} />
                        <Footer />
                    </Layout>
                </WithGameData>
            </ChakraBaseProvider>
        </div>
    );
}

export default App;
