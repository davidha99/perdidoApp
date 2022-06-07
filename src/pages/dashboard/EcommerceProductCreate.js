import { useEffect } from "react";
import { paramCase } from "change-case";
import { useParams, useLocation } from "react-router-dom";
// @mui
import { Container } from "@mui/material";
// redux
import { useDispatch, useSelector } from "../../redux/store";
import { getProducts } from "../../redux/slices/product";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useSettings from "../../hooks/useSettings";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import ProductNewEditForm from "../../sections/@dashboard/e-commerce/ProductNewEditForm";

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { products } = useSelector((state) => state.product);
  const isEdit = pathname.includes("edit");
  const currentProduct = products.find((product) => paramCase(product.id) === id);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="Reportar Objeto Perdido" sx={{ py: 15 }}>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading={!isEdit ? "Reportar objeto perdido" : "Editar objecto perdido"}
          links={[
            {
              name: "Home",
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: "Nuevo Reporte" },
          ]}
        />

        <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
