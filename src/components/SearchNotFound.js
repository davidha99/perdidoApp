import PropTypes from "prop-types";
import { Paper, Typography } from "@mui/material";

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = "", ...other }) {
  return searchQuery ? (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Not found
      </Typography>
      <Typography variant="body2" align="center">
        No hay resultados para la busqueda &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Intenta con otra palabra.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2"> Escribe una busqueda</Typography>
  );
}
