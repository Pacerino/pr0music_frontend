import * as React from "react"

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const ChangelogPage = class ChangelogPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    handleChange = (panel) => (event, isExpanded) => {
        this.setState({
            expanded: (isExpanded ? panel : false)
        })
    };

    render() {
        
        return(
            <>
                <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                    <Box>
                        <Accordion expanded={this.state.expanded === 'panel1'} onChange={this.handleChange('panel1')} sx={{ m: 1}}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                            >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                v1.0.0
                            </Typography>
                            <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                                Aliquam eget maximus est, id dignissim quam.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Grid>
            </>
        )
    }
}

export default ChangelogPage