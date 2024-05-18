import {useEffect, useState} from "react";
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    TextField
} from "@mui/material";

function MainNet() {
    const cookie = decodeURIComponent(document.cookie);
    const token = cookie.slice(cookie.indexOf("token=") + 6);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState(false);
    const [curChange, setCurChange] = useState([]);
    const [dataReady, setDataReady] = useState("");
    useEffect(() => {
        fetch(process.env.REACT_APP_STATE1 + "/ru/data/v3/testmethods/docs/userdocs/get", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "x-auth": token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(res => res.json())
            .then(response => {
                setData(response.data);
                setCurChange(response.data);
                setStatus(true)
            })
            .catch(err => {
                console.log(err);
                alert("Something goes wrong. Try again later")
            })
    }, [])

    useEffect(() => {
        if (curChange.length > 2 && dataReady === "change") {
            const readySetData = {
                "documentStatus": curChange[1],
                "employeeNumber": curChange[2],
                "documentType": curChange[3],
                "documentName": curChange[4],
                "companySignatureName": curChange[5],
                "employeeSignatureName": curChange[6],
                "employeeSigDate":  curChange[7] + "\t",
                "companySigDate": curChange[8] + "\t",
                }
        fetch(process.env.REACT_APP_STATE1 + "/ru/data/v3/testmethods/docs/userdocs/set/" + curChange[0], {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                "Content-Type": "application/json",
                "x-auth": token
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(readySetData), // body data type must match "Content-Type" header
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                setCurChange([...data.map(el => el.id === curChange[0] ? {id: curChange[0], ...readySetData} : el)]);
                setData([...data.map(el => el.id === curChange[0] ? {id: curChange[0], ...readySetData,} : el)]);
            })
            .catch(err => {
                console.log(err);
                alert("Something goes wrong. Try again later")
            })
        }
        if (dataReady === "delete") {
            fetch(process.env.REACT_APP_STATE1 + "/ru/data/v3/testmethods/docs/userdocs/delete/" + curChange, {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                    "Content-Type": "application/json",
                    "x-auth": token
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify(), // body data type must match "Content-Type" header
            })
                .then(res => res.json())
                .then(response => {
                    console.log(response);
                    setCurChange([...data.filter(el => el.id === curChange)]);
                    setData([...data.filter(el => el.id === curChange)]);
                })
                .catch(err => {
                    console.log(err);
                    alert("Something goes wrong. Try again later")
                })
        }
    }, [dataReady])
    return (
        <Container maxWidth="xl" sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.3)",

        }}>
            <TableContainer component={Paper}>
                {status ?
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Статус</b></TableCell>
                                <TableCell align="right"><b>Номер работника</b></TableCell>
                                <TableCell align="right"><b>Тип документа</b></TableCell>
                                <TableCell align="right"><b>Наименование документа</b></TableCell>
                                <TableCell align="right"><b>Подписанный документ со стороны компании</b></TableCell>
                                <TableCell align="right"><b>Подписанный документ со стороны работника</b></TableCell>
                                <TableCell align="right"><b>Дата подписания со стороны компании</b></TableCell>
                                <TableCell align="right"><b>Дата подписания со стороны работника</b></TableCell>
                                <TableCell align="right">{curChange.length > 2 ? <b> Подтвердить</b> : <b>Изменить</b>}</TableCell>
                                <TableCell align="right">{curChange.length > 2 ? <b> Закрыть </b> : <b>Удалить</b>}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    {Object.values(row).map((el, i) => i < 1 ? "" :
                                            <TableCell align={i < 2 ? "left" : "right"}>
                                                {curChange[0] === row.id ?
                                                    <TextField type={i > 6 ? "date" : "text"} id="standard-basic" variant="standard" value={i > 6 ? curChange[i].toString().substring(0, 10) : curChange[i]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                   setCurChange(curChange.map((elm, idx) => {
                                                                       if (i === idx) return i > 6 ? event.target.value + "T00:00:00.000Z" : event.target.value
                                                                       else return elm
                                                                   }));
                                                            }}/> :
                                            <Typography>{i > 6 ? el.substring(0, 10) : el}</Typography>}
                                    </TableCell>)}

                                    <TableCell align="right">
                                        <Button type={curChange[0] === row.id ? "submit" : ""} variant="outlined" disabled={curChange.length !== 2 && curChange[0] !== row.id ? true : false} onClick={() => {
                                                    if (curChange.length === 2) setCurChange(Object.values(curChange.find(el => row.id === el.id)));
                                                    else setDataReady("change");
                                                }}>
                                            {curChange[0] === row.id ? <div>&#10003;</div>  : <div>&#9998;</div>}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" disabled={curChange.length !== 2 && curChange[0] !== row.id ? true : false} onClick={() => {
                                                    if (curChange.length > 2) setCurChange([...data]);
                                                    else {
                                                        setCurChange(row.id)
                                                        setDataReady("delete");
                                                    };
                                                    }}>
                                            &#10006;
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableCell align="right">
                                <Button variant="contained">
                                    Добавить запись
                                </Button>
                            </TableCell>
                        </TableBody>
                    </Table> : <div> Wait</div>}
            </TableContainer>
        </Container>
    )
}

export default MainNet;

