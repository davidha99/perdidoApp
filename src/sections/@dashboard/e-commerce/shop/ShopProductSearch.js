import { useState } from "react";
import { paramCase } from "change-case";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { useNavigate } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { Link, Typography, Autocomplete, InputAdornment, Popper } from "@mui/material";
// hooks
import useIsMountedRef from "../../../../hooks/useIsMountedRef";
// utils
import axios from "../../../../utils/axios";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import Image from "../../../../components/Image";
import Iconify from "../../../../components/Iconify";
import InputStyle from "../../../../components/InputStyle";
import SearchNotFound from "../../../../components/SearchNotFound";

import { collection, query, where, getDocs, startAt, endAt, limit } from "firebase/firestore";
import { DB } from "src/contexts/FirebaseContext";
import { endsWith, orderBy, startsWith } from "lodash";
import { start } from "nprogress";

// ----------------------------------------------------------------------

const PopperStyle = styled((props) => <Popper placement="bottom-start" {...props} />)({
  width: "280px !important",
});

// ----------------------------------------------------------------------

export default function ShopProductSearch({ reportType }) {
  const navigate = useNavigate();

  const isMountedRef = useIsMountedRef();

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const handleChangeSearch = async (value) => {
    try {
      setSearchQuery(value);
      if (value) {
        let results = [];
        const ref = collection(DB, "object");

        let q = "";
        if (reportType === "Todos") {
          q = query(ref);
        } else {
          q = query(ref, where("reportType", "==", reportType));
        }

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          results.push({
            id: doc.id,
            key: doc.id,
            ...doc.data(),
          });
        });

        setSearchResults(results);
        console.log("searching", results);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (id) => {
    navigate(PATH_DASHBOARD.eCommerce.view(id));
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      handleClick(searchQuery);
    }
  };

  return (
    <Autocomplete
      size="small"
      autoHighlight
      popupIcon={null}
      PopperComponent={PopperStyle}
      options={searchResults}
      onInputChange={(event, value) => handleChangeSearch(value)}
      getOptionLabel={(product) => product.title}
      noOptionsText={<SearchNotFound searchQuery={searchQuery} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <InputStyle
          {...params}
          stretchStart={200}
          placeholder="Buscar objeto perdido"
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={"eva:search-fill"} sx={{ ml: 1, width: 20, height: 20, color: "text.disabled" }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, product, { inputValue }) => {
        const { title, images, id } = product;
        const matches = match(title, inputValue);
        const parts = parse(title, matches);

        return (
          <li {...props}>
            <Image
              alt={images[0]}
              src={images[0]}
              sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0, mr: 1.5 }}
            />
            <Link underline="none" onClick={() => handleClick(id)}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  variant="subtitle2"
                  color={part.highlight ? "primary" : "textPrimary"}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}
