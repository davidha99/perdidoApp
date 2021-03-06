import { useEffect, useState } from "react";
import orderBy from "lodash/orderBy";
// form
import { useForm } from "react-hook-form";
// @mui
import { Container, Typography, Stack, TextField, MenuItem } from "@mui/material";
// redux
import { useDispatch, useSelector } from "../../redux/store";
import { getProducts, filterProducts } from "../../redux/slices/product";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { FormProvider } from "../../components/hook-form";
// sections
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar,
  ShopProductSearch,
} from "../../sections/@dashboard/e-commerce/shop";
import CartWidget from "../../sections/@dashboard/e-commerce/CartWidget";
import Select from "src/theme/overrides/Select";

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);

  const { products, sortBy, filters } = useSelector((state) => state.product);

  const filteredProducts = applyFilter(products, sortBy, filters);

  const defaultValues = {
    gender: filters.gender,
    category: filters.category,
    colors: filters.colors,
    priceRange: filters.priceRange,
    rating: filters.rating,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  let [searchType, setSearchType] = useState("Todos");

  const isDefault =
    !values.priceRange &&
    !values.rating &&
    values.gender.length === 0 &&
    values.colors.length === 0 &&
    values.category === "All";

  useEffect(() => {
    dispatch(getProducts(searchType));
  }, [dispatch, searchType]);

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  const handleRemoveGender = (value) => {
    const newValue = filters.gender.filter((item) => item !== value);
    setValue("gender", newValue);
  };

  const handleRemoveCategory = () => {
    setValue("category", "All");
  };

  const handleRemoveColor = (value) => {
    const newValue = filters.colors.filter((item) => item !== value);
    setValue("colors", newValue);
  };

  const handleRemovePrice = () => {
    setValue("priceRange", "");
  };

  const handleRemoveRating = () => {
    setValue("rating", "");
  };

  const handleChange = (e) => {
    setSearchType(e.target.value);
  };

  return (
    <Page title="Ecommerce: Shop">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="Objetos Perdidos"
          links={[
            // { name: 'Dashboard', href: PATH_DASHBOARD.root },

            { name: "Catalogo" },
          ]}
        />

        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <ShopProductSearch reportType={searchType} />

          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}></Stack>
        </Stack>
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <TextField
            select={true}
            label="hello"
            sx={{ mt: 2, width: "15rem" }}
            onChange={(e) => handleChange(e)}
            value={searchType}
          >
            <MenuItem value="Perdido">Perdido</MenuItem>
            <MenuItem value="Encontrado">Encontrado</MenuItem>
            <MenuItem value="Todos">Todos</MenuItem>
          </TextField>
        </Stack>

        {filteredProducts.length > 0 ? (
          <ShopProductList products={filteredProducts} loading={!products.length && isDefault} />
        ) : (
          <Typography sx={{ mt: 4, textAlign: "center" }} variant="h5">
            No hay resultados
          </Typography>
        )}
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, sortBy, filters) {
  // SORT BY
  if (sortBy === "featured") {
    products = orderBy(products, ["sold"], ["desc"]);
  }
  if (sortBy === "newest") {
    products = orderBy(products, ["createdAt"], ["desc"]);
  }
  if (sortBy === "priceDesc") {
    products = orderBy(products, ["price"], ["desc"]);
  }
  if (sortBy === "priceAsc") {
    products = orderBy(products, ["price"], ["asc"]);
  }
  // FILTER PRODUCTS
  if (filters.gender.length > 0) {
    products = products.filter((product) => filters.gender.includes(product.gender));
  }
  if (filters.category !== "All") {
    products = products.filter((product) => product.category === filters.category);
  }
  if (filters.colors.length > 0) {
    products = products.filter((product) => product.colors.some((color) => filters.colors.includes(color)));
  }
  if (filters.priceRange) {
    products = products.filter((product) => {
      if (filters.priceRange === "below") {
        return product.price < 25;
      }
      if (filters.priceRange === "between") {
        return product.price >= 25 && product.price <= 75;
      }
      return product.price > 75;
    });
  }
  if (filters.rating) {
    products = products.filter((product) => {
      const convertRating = (value) => {
        if (value === "up4Star") return 4;
        if (value === "up3Star") return 3;
        if (value === "up2Star") return 2;
        return 1;
      };
      return product.totalRating > convertRating(filters.rating);
    });
  }
  return products;
}
