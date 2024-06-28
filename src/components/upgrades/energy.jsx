import { AddIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Spacer, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { GameDataContext } from "../../providers/game-data";

export const Energy = () => {
    const { energy, addEnergy } = useContext(GameDataContext);
    const onAddEnergy = () => {
        addEnergy(1000)
    };
    
    return (
        <HStack>
            <Text fontSize="sm">Energy</Text>
            <Text fontSize="sm">{energy.value}</Text>
            <Spacer />
            <IconButton
                aria-label="restore energy"
                icon={<AddIcon />}
                onClick={onAddEnergy}
            />
        </HStack>
    )
};