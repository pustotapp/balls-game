import { Button, GridItem, useDisclosure } from "@chakra-ui/react";
import { Upgrades } from "../upgrades";

export const Footer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    return (
        <>
            <GridItem area="footer" colStart={1}>
                <Button onClick={onOpen}>Upgrades</Button>
                <Upgrades isOpen={isOpen} onClose={onClose} />
            </GridItem>
            <GridItem area="footer" colStart={2}></GridItem>
            <GridItem area="footer" colStart={3}></GridItem>
            <GridItem area="footer" colStart={4}></GridItem>
        </>
    );
};
