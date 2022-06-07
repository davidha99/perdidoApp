import PropTypes from "prop-types";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
// form
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { styled } from "@mui/material/styles";
import { collection, addDoc } from "firebase/firestore";

import { LoadingButton } from "@mui/lab";
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { doc, getFirestore, setDoc } from "firebase/firestore";

// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from "../../../components/hook-form";
import { User } from "@auth0/auth0-spa-js";
import useAuth from "src/hooks/useAuth";
import { DB } from "src/contexts/FirebaseContext";

// ----------------------------------------------------------------------

const GENDER_OPTION = [
  { label: "Men", value: "Men" },
  { label: "Women", value: "Women" },
  { label: "Kids", value: "Kids" },
];

const CATEGORY_OPTION = [
  { group: "Escolares", classify: ["Mochila", "Termo", "ID Tec", "Otros"] },
  { group: "Dispositivos", classify: ["Telefono", "Computadora", "Tablet", "Otros"] },
  // { group: "Accessories", classify: ["Shoes", "Backpacks and bags", "Bracelets", "Face masks"] },
];

const REPORT_OPTION = ["Encontrado", "Perdido"];

const TAGS_OPTION = [
  "Toy Story 3",
  "Logan",
  "Full Metal Jacket",
  "Dangal",
  "The Sting",
  "2001: A Space Odyssey",
  "Singin' in the Rain",
  "Toy Story",
  "Bicycle Thieves",
  "The Kid",
  "Inglourious Basterds",
  "Snatch",
  "3 Idiots",
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required("Name is required"),
    // description: Yup.string().required("Description is required"),
    images: Yup.array().min(0, "Images is required").max(5, "Max 5 images"),
    category: Yup.string().required("Category is required"),
    reportType: Yup.string().required("Report Type is required"),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentProduct?.title || "",
      description: currentProduct?.description || "",
      images: currentProduct?.images || [],
      category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
      reportType: currentProduct?.reportType || REPORT_OPTION[0],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const { user } = useAuth();

  const onSubmit = async () => {
    try {
      const values = getValues();
      // Add a new document in collection "cities"

      const docRef = await addDoc(collection(DB, "object"), {
        title: values.title,
        category: [values.category],
        description: values.description,
        reporter: {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
        },
        reportType: values.reportType,
        images: urls,
        createdAt: new Date(),
        createdBy: {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
        },
      });

      console.log(docRef);

      reset();
      enqueueSnackbar(!isEdit ? "Reporte creado" : "Se Actualizaron los datos");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const images = values.images || [];

      setValue("images", [
        ...images,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
    [setValue, values.images]
  );

  const handleRemoveAll = () => {
    setValue("images", []);
  };

  // create a function to upload multiple images to firebase storage
  const handleUpload = async () => {
    const images = values.images || [];
    console.log(images);
    const storage = getStorage();

    let urls = [];
    enqueueSnackbar("Subiendo imagenes...");

    images.forEach(async (image) => {
      const storageRef = ref(storage, `images/${image.name}`);
      uploadBytes(storageRef, image)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            urls.push(url);
          });
        })
        .then(() => {
          setUrls(urls);
          enqueueSnackbar("Se subieron las imagenes al servidor");
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar("Error al subir las imagenes", { variant: "error" });
        });
    });
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue("images", filteredItems);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFSelect name="reportType" label="Tipo de Reporte">
                {REPORT_OPTION.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="title" label="Titulo" />

              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" placeholder={"Describeme"} />
              </div>

              <div>
                <LabelStyle>Foto</LabelStyle>
                <RHFUploadMultiFile
                  showPreview
                  name="images"
                  accept="image/*"
                  maxSize={3145728 * 5}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  onUpload={() => handleUpload()}
                />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
                <RHFTextField name="reporter" label="Reportado Por" disabled value={user.displayName} />

                <RHFSelect name="category" label="Category">
                  {CATEGORY_OPTION.map((category) => (
                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? "Reportar" : "Actualizar"}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
