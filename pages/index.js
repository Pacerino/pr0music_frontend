import * as React from "react";
import Box from "@mui/material/Box";
import { withStyles } from "@mui/styles";
import { useQuery, gql, makeVar } from "@apollo/client";

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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';


const styles = (theme) => ({
    hideOnMobile: {
        [theme.breakpoints.down("sm")]: {
            display: "none",
        },
    },
});

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
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

const HomePage = function HomePage(props) {

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
        pr0music_items_aggregate {
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
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="secondary"/>
      </Box>
    );
  } else if (error) {
      console.error(error);
      return <Alert severity='error'>{error.message}</Alert>
  } else {
    return (
      <div>
          <Box sx={{ p: 2, height: "100%", width: "100%" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Post ID</TableCell>
                    <TableCell align="right">Titel</TableCell>
                    <TableCell align="right">Album</TableCell>
                    <TableCell align="right">Artist</TableCell>
                    <TableCell align="right">Benis</TableCell>
                    <TableCell align="right">URL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.pr0music_items.map((row) => (
                    <TableRow key={row.item_id}>
                      <TableCell align="right">{row.item_id}</TableCell>
                      <TableCell align="right">{row.title}</TableCell>
                      <TableCell align="right">{row.album}</TableCell>
                      <TableCell align="right">{(row.comments ? row.comments.up - row.comments.down : 0)}</TableCell>
                      <TableCell align="right">{row.artist}</TableCell>
                      <TableCell align="right">
                        <a href={row.url} target="_blank" rel="noreferrer">{row.url}</a>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 15, 20, 25]}
                      count={data.pr0music_items_aggregate.aggregate.count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      labelRowsPerPage={"Items pro Seite"}
                      SelectProps={{
                        inputProps: {
                          'aria-label': 'rows per page',
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
      </div>
    );
  }
};

export default withStyles(styles)(HomePage);
