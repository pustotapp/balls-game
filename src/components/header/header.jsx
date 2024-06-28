import { Box, Text, GridItem } from "@chakra-ui/react";
import { useContext } from "react";
import { GameDataContext } from "../../providers/game-data";

export const Header = () => {
    const { lights, energy, satellites, blocks } = useContext(GameDataContext);
    
    const fireBlocksCount = blocks.find(block => block.type === "fire")?.count || 0;
    const earthBlocksCount = blocks.find(block => block.type === "earth")?.count || 0;
    const waterBlocksCount = blocks.find(block => block.type === "water")?.count || 0;
    const windBlocksCount = blocks.find(block => block.type === "wind")?.count || 0;

    return (
        <>
            <GridItem area="header" colStart={1} rowStart={1}>
                <Text fontSize="sm">Lights</Text>
                <Text fontSize="sm">{lights}</Text>
            </GridItem>
            <GridItem area="header" colStart={2} rowStart={1}>
                <Text fontSize="sm">Energy</Text>
                <Text fontSize="sm">{energy.value}/{energy.max}</Text>
            </GridItem>
            <GridItem area="header" colStart={3} rowStart={1}>
                <Box>
                    <Text fontSize="sm">Satellites</Text>
                    <Text fontSize="sm">{satellites.value}/{satellites.max}</Text>
                </Box>
            </GridItem>
            <GridItem area="header" colStart={4} rowStart={1}></GridItem>
            <GridItem area="header" colStart={1} rowStart={2}>
                <Text fontSize="sm">Fire</Text>
                <Text fontSize="sm">{fireBlocksCount}</Text>
            </GridItem>
            <GridItem area="header" colStart={2} rowStart={2}>
                <Text fontSize="sm">Earth</Text>
                <Text fontSize="sm">{earthBlocksCount}</Text>
            </GridItem>
            <GridItem area="header" colStart={3} rowStart={2}>
                <Text fontSize="sm">Water</Text>
                <Text fontSize="sm">{waterBlocksCount}</Text>
            </GridItem>
            <GridItem area="header" colStart={4} rowStart={2}>
                <Text fontSize="sm">Wind</Text>
                <Text fontSize="sm">{windBlocksCount}</Text>
            </GridItem>
        </>
    );
};