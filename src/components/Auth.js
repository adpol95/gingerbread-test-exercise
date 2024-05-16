import {useState} from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import {useNavigate} from "react-router";
import {Button, Container, TextField} from "@mui/material";

function Auth() {
    const [loginIn, setLoginIn] = useState('');
    const [passwordIn, setPasswordIn] = useState('');
    const signIn = useSignIn()
    const navigate = useNavigate();

    const submiter = (event) => {
        event.preventDefault();
        fetch(process.env.REACT_APP_STATE1 + "/ru/data/v3/testmethods/docs/login", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({username: loginIn, password: passwordIn}), // body data type must match "Content-Type" header
        })
            .then(res => res.json())
            .then(response => {
                if (signIn({
                    auth: {
                        token: response.token,
                        type: 'Bearer',
                    },
                    // refresh: response.refToken,
                    userState: {...response.profile}
                })) {
                    navigate("/main");
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something goes wrong. Try again later")
            })
    }
    return (
        <Container sx={{
                       height: "100vh",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center"
                   }}>
        <form onSubmit={submiter} >
                <div>
                    <label>
                        <TextField id="filled-basic" label="Логин?" variant="filled"
                            type="text"
                            value={loginIn}
                            onChange={(event) => setLoginIn(event.target.value)}
                            placeholder="User name"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <TextField id="filled-basic" label="Пароль" variant="filled"
                            type="password"
                            value={passwordIn}
                            onChange={(event) => setPasswordIn(event.target.value)}
                            placeholder="Password"
                        />
                    </label>
                </div>
            <Button type="submit"  variant="contained">
                Submit
            </Button>
        </form>
    </Container>
    )
}

export default Auth;