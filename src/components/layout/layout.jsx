import { Grid } from "@chakra-ui/react";

export const Layout = ({ children }) => {
    return (
        <Grid
            templateAreas={
                `"header header header header"
                 "header header header header"
                 "game game game game"
                 "footer footer footer footer"
                `}
            gridTemplateRows={'50px 50px auto 100px'}
            gridTemplateColumns={'1fr 1fr 1fr 1fr'}
            height="100vh"
        >
            {children}
        </Grid>
    );
};