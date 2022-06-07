import PropTypes from "prop-types";
import { sentenceCase } from "change-case";
import { useNavigate } from "react-router-dom";
// form
import { Controller, useForm } from "react-hook-form";
// @mui
import { useTheme, styled } from "@mui/material/styles";
import { Box, Link, Stack, Button, Rating, Divider, IconButton, Typography } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// utils
import { fShortenNumber, fCurrency } from "../../../../utils/formatNumber";
// components
import Label from "../../../../components/Label";
import Iconify from "../../../../components/Iconify";
import SocialsButton from "../../../../components/SocialsButton";
import { ColorSinglePicker } from "../../../../components/color-utils";
import { FormProvider, RHFSelect } from "../../../../components/hook-form";
import Markdown from "src/components/Markdown";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  product: PropTypes.shape({
    images: PropTypes.array,
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    place_found: PropTypes.string,
    category: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default function ProductDetailsSummary({ cart, product, onAddCart, onGotoStep, ...other }) {
  const theme = useTheme();

  const navigate = useNavigate();

  const { id, title, images, category, place_found, description } = product;

  const alreadyProduct = cart.map((item) => item.id).includes(id);

  const defaultValues = {
    id,
    title,
    images,
    category,
    place_found,
    description,
  };

  const methods = useForm({
    defaultValues,
  });

  const { watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      if (!alreadyProduct) {
        onAddCart({
          ...data,
          subtotal: data.price * data.quantity,
        });
      }
      onGotoStep(0);
      navigate(PATH_DASHBOARD.eCommerce.checkout);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = async () => {
    try {
      onAddCart({
        ...values,
        subtotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyle {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5" paragraph>
          {title}
        </Typography>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
          <Markdown>{description}</Markdown>
          <Typography variant="overline">{category}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="overline">Encontrado en: {place_found}</Typography>
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="caption">Favor de ir fisicamente al edifico A2-300 para reclamar su articulo</Typography>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrementQuantity: PropTypes.func,
  onDecrementQuantity: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrementQuantity, onDecrementQuantity }) {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        borderColor: "grey.50032",
      }}
    >
      <IconButton size="small" color="inherit" disabled={quantity <= 1} onClick={onDecrementQuantity}>
        <Iconify icon={"eva:minus-fill"} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 40, textAlign: "center" }}>
        {quantity}
      </Typography>

      <IconButton size="small" color="inherit" disabled={quantity >= available} onClick={onIncrementQuantity}>
        <Iconify icon={"eva:plus-fill"} width={14} height={14} />
      </IconButton>
    </Box>
  );
}
