import { useEffect, useState } from "react"
import axiosClient from "../axios-client"
import { Link } from "react-router-dom"
import { useStateContext } from "../contexts/ContextProvider"
import { Button, Pagination } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const { setNotification } = useStateContext()
    const [last_page, setLastPage] = useState(1)

    useEffect(() => {
        getUsers(1)
    }, [])

    const onDelete = (u) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return
        }
        setLoading(true)
        axiosClient.delete(`/users/${u.id}`)
            .then(() => {
                setNotification("User was successfully deleted")
                getUsers()
            })
    }

    const handleChange = (ev, value) => {
        setPage(value)
        getUsers(value)
    }

    const getUsers = (page) => {
        setLoading(true)
        axiosClient.get(`/users?page=${page}`)
            .then(({ data }) => {
                setLoading(false)
                setUsers(data.data)
                setLastPage(data.meta.last_page)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Users</h1>
                <Link to="/users/new"><Button variant="contained" style={{ backgroundColor: '#00a762' }}>Add New</Button></Link>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Create Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {loading &&
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        </TableBody>}
                    {!loading &&
                        <TableBody>
                            {users.map((u) => (
                                <TableRow
                                    key={u.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {u.id}
                                    </TableCell>
                                    <TableCell align="center">{u.name}</TableCell>
                                    <TableCell align="center">{u.email}</TableCell>
                                    <TableCell align="center">{u.created_at}</TableCell>
                                    <TableCell align="center">
                                        <Link to={'/users/' + u.id}><Button variant="contained" style={{ backgroundColor: '#5b08a7' }}>Edit</Button></Link>
                                        &nbsp;
                                        <Button onClick={ev => onDelete(u)} variant="contained" style={{ backgroundColor: '#b72424' }}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>}
                </Table>
            </TableContainer>
            {!loading && 
            <Pagination count={last_page} variant="outlined"
                style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}
                page={page} onChange={handleChange} />
            }
        </div>
    )
}