import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Grid,
    Link
} from "@mui/material";
import {
    Security,
    Info
} from "@mui/icons-material";

const Footer = () => <>
        {/* <Grid container justify="center" style={{minHeight: "212px"}}>
            <Grid container item sm={6} xs={11} justify="space-between">
                <Grid item sm={5} xs={12}>
                    <Security color="action" />
                    <Typography paragraph>
                        The donations made on this site are sent through a secured connection and processed by Stripe. This site is compliant with the Payment Card Industry and Data Security Standard. Read more about Stripe security <Link href="https://stripe.com/docs/security/stripe" target="_blank" alt="Stripe">here</Link>.
                    </Typography>
                </Grid>
                <Grid item sm={5} xs={11}>
                    <Info color="action" />
                    <Typography paragraph>
                        This Web App is fully responsive. Made in <Link href="https://reactjs.org/" target="_blank">ReactJS</Link>, using <Link href="https://material-ui.com" target="_blank">Material-UI</Link> and <Link href="https://stripe.com/docs/stripe-js/react" target="_blank">React Stripe</Link>. Its given free of use by <Link href="https://angeloron.com" target="_blank">Ange loron</Link>. react-material-ui-stripe-payment is under the MIT license and can be dowloaded <Link href="https://gitlab.com/angeloron/react-material-ui-stripe-payment" target="_blank">here</Link>.
                    </Typography>
                </Grid>
            </Grid>
        </Grid> */}
        <AppBar position="static" elevation={0} component="footer">
            <Toolbar style={{ justifyContent: "center" }}>
                <Typography variant="caption">©2021-2022 <a href="https://pr0sauce.info/">pr0sauce.info</a> - Helix [helix@pr0sauce.info] - Commit: {(process.env.NEXT_PUBLIC_GO_REVISION ? process.env.NEXT_PUBLIC_GO_REVISION : "null")}</Typography>
            </Toolbar>
        </AppBar>
    </>

export default Footer;