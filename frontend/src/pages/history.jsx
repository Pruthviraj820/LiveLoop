import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';

import { IconButton } from '@mui/material';
export default function History() {


    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([])


    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }

        fetchHistory();
    }, [])

    let formatDate = (dateString) => {

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`

    }

    const neoCardSx = {
        mb: 2,
        backgroundColor: 'var(--nb-surface)',
        border: '3px solid var(--nb-border)',
        borderRadius: 'var(--nb-radius)',
        boxShadow: 'var(--nb-shadow)'
    };

    const neoHomeButtonSx = {
        m: 2,
        borderRadius: '999px',
        border: '3px solid var(--nb-border)',
        backgroundColor: 'var(--nb-secondary)',
        boxShadow: 'var(--nb-shadow)',
        '& svg': {
            color: '#111111'
        },
        '&:hover': {
            backgroundColor: '#4ee0ff',
            transform: 'translate(-2px, -2px)',
            boxShadow: '9px 9px 0 var(--nb-border)'
        },
        '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '2px 2px 0 var(--nb-border)'
        }
    };

    return (
        <div style={{ padding: "1.5rem 2rem" }}>

            <IconButton onClick={() => {
                routeTo("/home")
            }} sx={neoHomeButtonSx}>
                <HomeIcon />
            </IconButton >
            {
                (meetings.length !== 0) ? meetings.map((e, i) => {
                    return (

                        <Card key={i} variant="outlined" sx={neoCardSx}>

                            <CardContent>
                                <Typography sx={{ fontSize: 14, fontWeight: 700 }} gutterBottom>
                                    Code: {e.meetingCode}
                                </Typography>

                                <Typography sx={{ mb: 1.5 }}>
                                    Date: {formatDate(e.date)}
                                </Typography>

                            </CardContent>


                        </Card>
                    )
                }) : <></>

            }

        </div>
    )
}