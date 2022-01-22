import * as React from "react";
import Box from "@mui/material/Box";
import next from "next";

export default class Spotify extends React.PureComponent  {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box>
                { this.props.spotifyLink.length > 0 && <iframe src={this.props.spotifyLink} style={{ border: 0 }} width="300" height="380" allowtransparency="true"></iframe> }
            </Box>
        )
    }
}
