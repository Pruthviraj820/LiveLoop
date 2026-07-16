import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import { redirect } from "react-router-dom";
import { use } from "react";

const neoBrutalistTheme = createTheme({
  palette: {
    primary: {
      main: "#ff6b00",
    },
    secondary: {
      main: "#00c6ff",
    },
    background: {
      default: "#ffeeda",
      paper: "#fffaf0",
    },
    text: {
      primary: "#111111",
      secondary: "#444444",
    },
  },
  typography: {
    fontFamily: "'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h5: {
      fontWeight: 800,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: "0.06em",
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "4px solid #111111",
          boxShadow: "6px 6px 0 #111111",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: "#111111",
          boxShadow: "6px 6px 0 #111111",
          "&:hover": {
            boxShadow: "9px 9px 0 #111111",
            transform: "translate(-2px, -2px)",
          },
          "&:active": {
            boxShadow: "2px 2px 0 #111111",
            transform: "translate(2px, 2px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#fffaf0",
            boxShadow: "6px 6px 0 #111111",
            borderRadius: 14,
            "& fieldset": {
              borderWidth: 3,
              borderColor: "#111111",
            },
            "&:hover fieldset": {
              borderColor: "#ff6b00",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#f94d92",
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "3px solid #111111",
          boxShadow: "4px 4px 0 #111111",
          backgroundColor: "#ffb347",
          color: "#111111",
        },
      },
    },
  },
});

export default function Authentication() {

    const [username , setUsername] = React.useState();
    const [password , setPassword] = React.useState();
    const [name , setName] = React.useState();
    const [error , setError] = React.useState();
    const [message , setMessage] = React.useState();

    // formState → stores the current form type . setFormState() → function used to update the form type
    const [formState , setFormState] = React.useState(0);
    const [open , setOpen] = React.useState(false);

    const {handleRegister , handleLogin} = React.useContext(AuthContext);
    let  handleAuth = async ()=>{
      try{
        //0 = Login Form
        //1 = Register Form

        // User clicks login
        //         ↓
        // handleAuth()
        //         ↓
        // handleLogin()
        //         ↓
        // Backend login API
        //         ↓
        // Token returned
        //         ↓
        // Token stored in localStorage
          if(formState === 0){
            let result = await handleLogin(username , password);

          }

          if(formState === 1){
            let result = await handleRegister(name , username , password);
            console.log(result);
            setUsername("");//Clears the form inputs.
            setMessage(result);
            setOpen(true);//Shows Snackbar popup
            setError("");//Clear errors
            setFormState(0);//Switch back to Login form . register zala ata login kara
            setPassword("");//Clears the form inputs.
          }

      }catch(error){
        let message = (error.response.data.message);
        setError(message);
      }
    }

  return (
    <ThemeProvider theme={neoBrutalistTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          backgroundColor: "var(--nb-bg)",
        }}
      >
        <CssBaseline />

        {/* Left Image Section */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundColor: "#ffd25f",
            borderRight: "4px solid var(--nb-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              px: 4,
              py: 3,
              backgroundColor: "var(--nb-surface)",
              borderRadius: "var(--nb-radius)",
              border: "4px solid var(--nb-border)",
              boxShadow: "6px 6px 0 #111111",
              maxWidth: 420,
            }}
          >
            <Typography variant="h5" component="h1" gutterBottom>
              LiveLoop
            </Typography>
            <Typography>
              Bold, fast and friendly video calls with a playful neo-brutalist twist.
            </Typography>
          </Box>
        </Grid>

        {/* Right Form Section */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={0}
          square
          sx={{
            backgroundColor: "var(--nb-surface)",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >

            <Avatar sx={{ m: 1 }}>
              <LockOutlinedIcon />
            </Avatar>

            <div style={{ marginTop: "0.8rem", marginBottom: "0.8rem" }}>
                <Button
                  variant= {formState === 0 ? "contained": "outlined"}
                  onClick={()=> {setFormState(0)}}
                  sx={{ mr: 1 }}
                >
                    Sign In
                </Button>
                <Button
                  variant={formState === 1 ? "contained" : "outlined"}
                  onClick={() => {setFormState(1)}}
                >
                    Sign Up
                </Button>
            </div>

            <Box component="form" noValidate  sx={{ mt: 1 }}>

                {formState === 1 ? <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Full Name"
                    name="username" 
                    value={name}
                    autoFocus
                    onChange={(e)=>setName(e.target.value)}
              /> : <></>} 
           
                

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username" 
                value={username}
                autoFocus
                onChange={(e)=>setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                value={password}
                type="password"
                id="password"
                onChange={(e)=>setPassword(e.target.value)}
              />

              <p style={{color : "red"}}>{error}</p>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>


            </Box>
          </Box>
        </Grid>

      </Grid>

                  <Snackbar
                    open = {open}
                    autoHideDuration={4000}
                    message={message}
                  />
    </ThemeProvider>
  );
}