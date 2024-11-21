import React, { useState } from "react";
import loginImage from "../assets/loginImageNew.png";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { loginAPI } from "../services/allAPI";
import { useNavigate } from "react-router-dom";
import {Atom} from 'react-loading-indicators'

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      toast.error("Please enter username and password");
      return;
    }
    setLoading(true); // Show spinner
    try {
      const response = await loginAPI({ username, password });
      if (response.status === 200) {
        toast.success("Login Successful");
        const { token } = response.data;
        sessionStorage.setItem("token", JSON.stringify(token));
        setUsername("");
        setPassword("");
        navigate("/home");
      } else {
        toast.error(response?.response?.data || "Login Failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <>
      <div className="container-fluid p-5">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center shadow border border-light rounded-2">
          <div className="col-12 col-md-6 p-3">
            <img
              src={loginImage}
              alt="loginImage"
              width={"100%"}
              height={"100%"}
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div
            className="col-12 col-md-6 p-3 d-flex flex-column justify-content-center align-items-center"
            style={{
              height: "50vh",
              backgroundColor: "#db7734",
              borderRadius: "8px",
            }}
          >
            <h3 className="text-white text-center my-2">Login</h3>
            {loading ? <Atom size={50} color="#fff" /> : <>
            <TextField
              variant="outlined"
              label="Username"
              value={username}
              fullWidth
              className="my-2"
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "whitesmoke",
                  "&.Mui-focused": {
                    color: "whitesmoke",
                  },
                },
                "& .MuiInputBase-root": {
                  color: "whitesmoke",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "whitesmoke",
                  },
                  "&:hover fieldset": {
                    borderColor: "whitesmoke",
                  },
                  "&.Mui-focused fieldset": {
                    color: "whitesmoke",
                    borderColor: "whitesmoke",
                  },
                },
                "& .MuiInputBase-input": {
                  "&.Mui-focused": {
                    color: "whitesmoke",
                  },
                },
              }}
            />
            <TextField
              variant="outlined"
              label="Password"
              value={password}
              type={showPassword ? "text" : "password"}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              className="my-2"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "whitesmoke",
                  "&.Mui-focused": {
                    color: "whitesmoke",
                  },
                },
                "& .MuiInputBase-root": {
                  color: "whitesmoke",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "whitesmoke",
                  },
                  "&:hover fieldset": {
                    borderColor: "whitesmoke",
                  },
                  "&.Mui-focused fieldset": {
                    color: "whitesmoke",
                    borderColor: "whitesmoke",
                  },
                },
                "& .MuiInputBase-input": {
                  "&.Mui-focused": {
                    color: "whitesmoke",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: "whitesmoke" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="my-2"
              onClick={handleLogin}
            >
              Login
            </Button>
            </>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
