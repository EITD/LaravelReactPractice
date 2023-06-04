import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axios-client"
import { useStateContext } from "../contexts/ContextProvider"
import { Alert, Box, Button, Container, CssBaseline, TextField, ThemeProvider, Typography, createTheme } from "@mui/material"

export default function UserForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { setNotification } = useStateContext()
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const defaultTheme = createTheme();

    const [errors, setErrors] = useState(null)

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setUser(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault()
        setLoading(true)
        setErrors(null)
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification("User was successfully updated")
                    navigate('/users')
                })
                .catch(err => {
                    setLoading(false)
                    const response = err.response
                    if (response && response.status == 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post('/users', user)
                .then(() => {
                    setNotification("User was successfully created")
                    navigate('/users')
                })
                .catch(err => {
                    setLoading(false)
                    const response = err.response
                    if (response && response.status == 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
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
                    {user.id && <Typography component="h1" variant="h5">Update User: {user.name}</Typography>}
                    {!user.id && <Typography component="h1" variant="h5">New User</Typography>}
                    {loading && (<div className="text-center">Loading...</div>)}
                    {errors &&
                        <Alert severity="error">
                            {Object.keys(errors).map(key =>
                                (<p key={key}>{errors[key][0]}</p>))}
                        </Alert>
                    }
                    {!loading &&
                        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                value={user.name}
                                onChange={ev => setUser({ ...user, name: ev.target.value })}
                                margin="normal"
                                required
                                fullWidth
                                label="Name"
                                autoComplete="name"
                                autoFocus
                            />
                            <TextField
                                value={user.email}
                                onChange={ev => setUser({ ...user, email: ev.target.value })}
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                onChange={ev => setUser({ ...user, password: ev.target.value })}
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                            />
                            <TextField
                                onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })}
                                margin="normal"
                                required
                                fullWidth
                                label="Password Confirmation"
                                type="password"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Save
                            </Button>
                        </Box>}
                </Box>
            </Container>
        </ThemeProvider>
    )
}