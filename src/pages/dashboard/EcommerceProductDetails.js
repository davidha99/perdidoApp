import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// @mui
import { alpha, styled } from "@mui/material/styles";
import { Box, Tab, Card, Grid, Divider, Container, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// redux
import { useDispatch, useSelector } from "../../redux/store";
import { getProduct, addCart, onGotoStep } from "../../redux/slices/product";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import Markdown from "../../components/Markdown";
import { SkeletonProduct } from "../../components/skeleton";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections
import {
  ProductDetailsSummary,
  ProductDetailsReview,
  ProductDetailsCarousel,
} from "../../sections/@dashboard/e-commerce/product-details";
import CartWidget from "../../sections/@dashboard/e-commerce/CartWidget";

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
  {
    title: "100% Original",
    description: "Chocolate bar candy canes ice cream toffee cookie halvah.",
    icon: "ic:round-verified",
  },
  {
    title: "10 Day Replacement",
    description: "Marshmallow biscuit donut dragée fruitcake wafer.",
    icon: "eva:clock-fill",
  },
  {
    title: "Year Warranty",
    description: "Cotton candy gingerbread cake I love sugar sweet.",
    icon: "ic:round-verified-user",
  },
];

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  justifyContent: "center",
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState("1");
  const { id = "" } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  return (
    <Page title="Ecommerce: Product Details" sx={{ py: 15 }}>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[{ name: "Home", href: PATH_DASHBOARD.root }, { name: id.replace("-", " ") }]}
        />

        {/*<CartWidget />*/}

        {product && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel product={product} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ProductDetailsSummary
                    product={product}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  />
                </Grid>
              </Grid>
            </Card>

            <Card>
              <TabContext value={value}>
                <TabPanel value="1"></TabPanel>
                <TabPanel value="2">
                  <ProductDetailsReview product={product} />
                </TabPanel>
              </TabContext>
            </Card>
          </>
        )}

        {!product && <SkeletonProduct />}

        {/*{error && <Typography variant="h6">404 Product not found</Typography>}*/}
      </Container>
    </Page>
  );
}
