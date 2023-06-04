import { Link } from "react-router-dom"
import { useState } from "react"
import axiosClient from "../axios-client"
import { useStateContext } from "../contexts/ContextProvider"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from "@mui/material";

export default function Login() {
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const { setUser, setToken } = useStateContext()

    const defaultTheme = createTheme();

    const onSubmit = (ev) => {
        ev.preventDefault()
        setLoading(true)
        const data = new FormData(ev.currentTarget);
        const payload = {
            email: data.get('email'),
            password: data.get('password'),
        }
        setErrors(null)
        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setToken(data.token)
                setUser(data.user)
            })
            .catch(err => {
                setLoading(false)
                const response = err.response
                if (response && response.status == 422) {
                    if (response.data.errors) {
                        setErrors(response.data.errors)
                    } else {
                        setErrors({ email: [response.data.message] })
                    }
                }
            })
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {loading && (<div className="text-center">Loading...</div>)}
                    {errors && <Alert severity="error">
                        {Object.keys(errors).map(key =>
                            (<p key={key}>{errors[key][0]}</p>))}
                    </Alert>
                    }
                    {!loading && <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>}
                </Box>
            </Container>
        </ThemeProvider>
    )
}