import { Fragment, useEffect, useState } from "react"
import axiosClient from "../axios-client"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function Dashboard() {
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')

    useEffect(() => {
        getListings()
    }, [])

    const getListings = () => {
        setLoading(true)
        axiosClient.get('/dashboard')
            .then(({ data }) => {
                setLoading(false)
                setListings(data.data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const click = (url) => {
        console.log(url)
    }

    const search = (ev) => {
        setLoading(true)
        axiosClient.get('/dashboard', { params: { search: text } })
            .then(({ data }) => {
                setLoading(false)
                setListings(data.data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <div style={{ margin: '10px' }}>
            <div>
                <TextField
                    value={text}
                    onChange={ev => setText(ev.target.value)}
                    id="search-bar"
                    className="text"
                    label="search"
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                />
                <IconButton aria-label="search" onClick={search}>
                    <SearchIcon style={{ fill: "black" }} />
                </IconButton>
            </div>
            {loading && (<div className="text-center">Loading...</div>)}
            {!loading && listings.map((l) => (
                <Box sx={{ minWidth: 275 }} style={{ margin: '5px' }}>
                    <Card variant="outlined">
                        <Fragment>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {l.title}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {l.tags}
                                </Typography>
                                <Typography variant="body2">
                                    {l.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={ev => click(l.website)}>Learn More</Button>
                            </CardActions>
                        </Fragment>
                    </Card>
                </Box>
            ))}
        </div>
    )
}