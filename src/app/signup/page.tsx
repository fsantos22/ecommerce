"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignUp() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const userSchema = z
    .object({
      firstName: z
        .string()
        .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
        .max(30, { message: "O nome deve ter no máximo 30 caracteres" }),
      lastName: z
        .string()
        .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
        .max(60, { message: "O nome deve ter no máximo 60 caracteres" }),
      email: z.string().email({ message: "E-mail inválido" }),
      password: z
        .string()
        .min(5, { message: "O nome deve ter pelo menos 5 caracteres" })
        .max(15, { message: "O nome deve ter no máximo 15 caracteres" }),
      confirmPassword: z
        .string()
        .min(5, { message: "O nome deve ter pelo menos 5 caracteres" })
        .max(15, { message: "O nome deve ter no máximo 15 caracteres" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não são iguais",
      path: ["confirmPassword"],
    });

  type UserSchema = z.infer<typeof userSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });

  const handleSubmitUser = async (data: UserSchema) => {
    try {
      const endpoint = "/api/users";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(endpoint, options);
      if (response.ok) {
        setIsAlertOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isAlertOpen && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={isAlertOpen}
            autoHideDuration={2000}
            onClose={() => setIsAlertOpen(false)}
          >
            <Alert severity="success" color="success" sx={{ width: "100%" }}>
              Cadastro realizado com sucesso!
            </Alert>
          </Snackbar>
        )}
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cadastrar acesso
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(handleSubmitUser)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                fullWidth
                id="firstName"
                label="Nome"
                {...register("firstName")}
                error={errors.firstName ? true : false}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Sobrenome"
                {...register("lastName")}
                error={errors.lastName ? true : false}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="E-mail"
                {...register("email")}
                error={errors.email ? true : false}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Senha"
                type="password"
                id="password"
                {...register("password")}
                error={errors.password || errors.confirmPassword ? true : false}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirmar senha"
                type="confirmPassword"
                id="confirmPassword"
                {...register("confirmPassword")}
                error={errors.confirmPassword ? true : false}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar conta
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Já tem registro? Entrar
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
