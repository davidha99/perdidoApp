import PropTypes from "prop-types";
import { paramCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { Box, Card, Link, Typography, Stack, Button } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// utils
import { fCurrency } from "../../../../utils/formatNumber";
// components
import Label from "../../../../components/Label";
import Image from "../../../../components/Image";
import { ColorPreview } from "../../../../components/color-utils";

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { title, id, reporter, images, reportType, category, status, place_found } = product;
  let { id: reporterId, displayName } = reporter;

  const linkTo = PATH_DASHBOARD.eCommerce.view(id);

  return (
    <Card>
      <Box sx={{ position: "relative" }}>
        {status && (
          <Label
            variant="filled"
            color={(status === "sale" && "error") || "info"}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: "absolute",
              textTransform: "uppercase",
            }}
          >
            {status}
          </Label>
        )}

        <Image alt={title} src={images[0]} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="overline" sx={{ color: "text.disabled" }}>
            {category}
          </Typography>

          <Stack direction="row" spacing={0.5}></Stack>
          <Typography variant="caption" noWrap>
            {reportType}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
