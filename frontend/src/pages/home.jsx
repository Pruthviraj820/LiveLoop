import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    const neoIconButtonSx = {
        borderRadius: '999px',
        border: '3px solid var(--nb-border)',
        backgroundColor: 'var(--nb-secondary)',
        boxShadow: 'var(--nb-shadow)',
        mr: 1,
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

    const neoPrimaryButtonSx = {
        borderRadius: '999px',
        border: '3px solid var(--nb-border)',
        backgroundColor: 'var(--nb-primary)',
        color: '#111111',
        fontWeight: 700,
        textTransform: 'none',
        px: 3,
        py: 1,
        boxShadow: 'var(--nb-shadow)',
        '&:hover': {
            backgroundColor: 'var(--nb-primary-soft)',
            transform: 'translate(-2px, -2px)',
            boxShadow: '9px 9px 0 var(--nb-border)'
        },
        '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '2px 2px 0 var(--nb-border)'
        }
    };

    const neoTextFieldSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--nb-radius)',
            backgroundColor: '#fffaf0',
            boxShadow: 'var(--nb-shadow)',
            '& fieldset': {
                borderWidth: 3,
                borderColor: 'var(--nb-border)'
            },
            '&:hover fieldset': {
                borderColor: 'var(--nb-primary)'
            },
            '&.Mui-focused fieldset': {
                borderColor: 'var(--nb-accent)'
            }
        },
        '& .MuiInputLabel-root': {
            fontWeight: 600
        }
    };

    return (
        <>

            <div className="navBar">

                <div style={{ display: "flex", alignItems: "center" }}>

                    <h2>LiveLoop</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        onClick={
                            () => {
                                navigate("/history")
                            }
                        }
                        sx={neoIconButtonSx}
                    >
                        <RestoreIcon />
                    </IconButton>
                    <p style={{ fontWeight: 700, marginRight: '1.2rem' }}>History</p>

                    <Button
                        onClick={() => {
                            localStorage.removeItem("token")
                            navigate("/auth")
                        }}
                        sx={neoPrimaryButtonSx}
                    >
                        Logout
                    </Button>
                </div>


            </div>


            <div className="meetContainer">
                <div className="leftPanel">
                    <div className="neo-card">
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>

                        <div style={{ display: 'flex', gap: "10px", marginTop: "1.4rem" }}>

                            <TextField
                                onChange={e => setMeetingCode(e.target.value)}
                                id="outlined-basic"
                                label="Meeting Code"
                                variant="outlined"
                                sx={neoTextFieldSx}
                            />
                            <Button
                                onClick={handleJoinVideoCall}
                                variant='contained'
                                sx={neoPrimaryButtonSx}
                            >
                                Join
                            </Button>

                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/logo3.png' alt="" />
                </div>
            </div>
        </>
    )
}


export default withAuth(HomeComponent)