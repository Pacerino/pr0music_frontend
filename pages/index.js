import * as React from "react";
import Box from "@mui/material/Box";
import { createStyles, makeStyles } from '@mui/styles';
import { useQuery, gql } from "@apollo/client";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const useStyles = makeStyles((theme) => createStyles({
    hideOnMobile: {
        [theme.breakpoints.down("md")]: {
            display: "none",
        },
    },
    hideOnDesktop: {
      [theme.breakpoints.up("md")]: {
        display: "none"
      },
    },
    selectIcon: {
      fill: "white",
  },
}));

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        color="inherit"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        color="inherit"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        color="inherit"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        color="inherit"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

const HomePage = function HomePage(props) {
  const classes = useStyles();
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const SEL_AND_COUNT_ITEMS = gql`
    query Items($limit: Int!, $offset: Int!) {
        pr0music_items(limit: $limit, offset: $offset, order_by: {id: desc}, where: { title: { _neq: "" } }) {
            item_id
            title
            album
            artist
            url
            comments {
              up
              down
            }
        }
        pr0music_items_aggregate(where: {title: {_neq: ""}}) {
          aggregate {
            count
          }
        }
    }
`;

  const { data, loading, error } = useQuery(SEL_AND_COUNT_ITEMS, {
    variables: {
     "limit": rowsPerPage,
     "offset": (page * rowsPerPage)
    }
  });
  
  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (error) {
      console.error(error);
      return <Alert severity='error'>{error.message}</Alert>
  } else {
    return (
        <Box sx={{ p: 2, height: "100%", width: "100%" }}>
          <TableContainer className={classes.hideOnDesktop}>
            <Table >
              <TableBody>
              {data.pr0music_items.map((row) => (
                  <TableRow key={row.item_id}>
                    <Card sx={{ mt:2 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item>
                            <Typography sx={{ fontSize: 12, opacity: 0.54 }}>Item ID</Typography>
                            <Typography sx={{ fontSize: 13 }}><a href={"https://pr0gramm.com/new/" + row.item_id} target="_blank" rel="noreferrer">{row.item_id}</a></Typography>
                          </Grid>
                          <Grid item>
                            <Typography sx={{ fontSize: 12, opacity: 0.54 }}>Titel</Typography>
                            <Typography sx={{ fontSize: 13 }}>{row.title}</Typography>
                          </Grid>
                          <Grid item>
                            <Typography sx={{ fontSize: 12, opacity: 0.54 }}>Album</Typography>
                            <Typography sx={{ fontSize: 13 }}>{row.album}</Typography>
                          </Grid>
                          <Grid item>
                            <Typography sx={{ fontSize: 12, opacity: 0.54 }}>Artist</Typography>
                            <Typography sx={{ fontSize: 13 }}>{row.artist}</Typography>
                          </Grid>
                          <Grid item>
                            <Typography sx={{ fontSize: 12, opacity: 0.54 }}>Benis</Typography>
                            <Typography sx={{ fontSize: 13 }}>{(row.comments ? row.comments.up - row.comments.down : 0)}</Typography>
                          </Grid>
                          <Grid item>
                            <Typography sx={{ fontSize: 12, opacity: 0.54 }}>URL</Typography>
                            <Typography sx={{ fontSize: 13 }}><a href={row.url} target="_blank" rel="noreferrer">{row.url}</a></Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20, 25]}
                    count={data.pr0music_items_aggregate.aggregate.count}
                    rowsPerPage={rowsPerPage}
                    component="div"
                    page={page}
                    labelRowsPerPage={"Items"}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    sx={{color: "secondary"}}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} className={classes.hideOnMobile}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Post ID</TableCell>
                    <TableCell align="right">Titel</TableCell>
                    <TableCell align="right">Album</TableCell>
                    <TableCell align="right">Artist</TableCell>
                    <TableCell align="right">Benis</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.pr0music_items.map((row) => (
                    <TableRow key={row.item_id}>
                      <TableCell align="right"><a href={"https://pr0gramm.com/new/" + row.item_id} target="_blank" rel="noreferrer">{row.item_id}</a></TableCell>
                      <TableCell align="right">{row.title}</TableCell>
                      <TableCell align="right">{row.album}</TableCell>
                  <TableCell align="right">{row.artist}</TableCell>
                  <TableCell align="right">{(row.comments ? row.comments.up - row.comments.down : 0)}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="delete" target="_blank" sx={{p:0}} href={row.url} color="inherit">
                      <OpenInNewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 15, 20, 25]}
                  count={data.pr0music_items_aggregate.aggregate.count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  labelRowsPerPage={"Items pro Seite"}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                      classes: {
                        icon: classes.selectIcon
                      }
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
          </TableContainer>
      </Box>
    );
  }
};

export default HomePage;
