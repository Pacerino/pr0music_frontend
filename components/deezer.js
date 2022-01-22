import * as React from "react";
import Box from "@mui/material/Box";
import next from "next";

export default class Deezer extends React.PureComponent  {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box>
                { this.props.deezerLink.length > 0 && <iframe src={this.props.deezerLink} style={{ border: 0 }} width="300" height="380" allowtransparency="true"></iframe> }
            </Box>
        )
    }
}
