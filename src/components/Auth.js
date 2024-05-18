import {useState} from "react";
import {Button, Container, TextField} from "@mui/material";

function Auth() {
    const [loginIn, setLoginIn] = useState('');
    const [passwordIn, setPasswordIn] = useState('');

    const submiter = (event) => {event.preventDefault();
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
                document.cookie = "token=" + response.data.token + ";path=/" + ";expires=Tue, 19 Jan 2038 03:14:07 GMT";
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                alert("Something goes wrong. Try again later")
            })
    }
    console.log();
    return (
        <Container sx={{
                       height: "100vh",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center",
                       background: "rgba(0,0,0,.5)"
                   }}>
        <form onSubmit={submiter} >
                <div>
                    <label>
                        <TextField id="filled-basic" label="Логин" variant="filled"
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