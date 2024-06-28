import { IconButton, Text, HStack, Spacer } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { GameDataContext } from "../../providers/game-data/index.js";

export const Satellites = () => {
    const { lights, satellites, chargeLights, incrementMaxSatellites } = useContext(GameDataContext);
    const onAddSatellite = () => {
        if (lights < satellites.price) {
            return;
        }
        chargeLights(satellites.price);
        incrementMaxSatellites();
    };

    return (
        <HStack>
            <Text>Max satellites</Text>
            <Text>{satellites.max}</Text>
            <Spacer />
            <Text>{satellites.price}</Text>
            <IconButton
                aria-label="increase satellites count"
                icon={<AddIcon />}
                onClick={onAddSatellite}
            />
        </HStack>
    );
};