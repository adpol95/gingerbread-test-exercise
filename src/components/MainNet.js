import React, {useEffect, useState} from "react";
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
    const [changerState, setChangerState] = useState(false);
    const [newLineState, setNewLineState] = useState(false);
    const [newLine, setNewLine] = useState([...new Array(6).fill(""), new Date().toISOString().substring(0, 10), new Date().toISOString().substring(0, 10)]);

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
        const readySetData = {
            "documentStatus": dataReady === "new" ? newLine[0] : curChange[1],
            "employeeNumber":dataReady === "new" ? newLine[1]  : curChange[2],
            "documentType": dataReady === "new" ? newLine[2]  : curChange[3],
            "documentName": dataReady === "new" ? newLine[3]  : curChange[4],
            "companySignatureName": dataReady === "new" ? newLine[4] : curChange[5],
            "employeeSignatureName": dataReady === "new" ? newLine[5] : curChange[6],
            "employeeSigDate":  dataReady === "new" ? newLine[6] + "T00:00:00.000Z" : curChange[7],
            "companySigDate": dataReady === "new" ? newLine[7] + "T00:00:00.000Z" : curChange[8],
            }
        if (!changerState && dataReady === "change") {
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
            })
                .then(res => res.json())
                .then(response => {
                    console.log(response);
                    setCurChange([...data.filter(el => el.id !== curChange)]);
                    setData([...data.filter(el => el.id !== curChange)]);
                })
                .catch(err => {
                    console.log(err);
                    alert("Something goes wrong. Try again later")
                })
        }
        if (dataReady === "new") {
            fetch(process.env.REACT_APP_STATE1 + "/ru/data/v3/testmethods/docs/userdocs/create", {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                    "Content-Type": "application/json",
                    "x-auth": token,
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify(readySetData)
            })
                .then(res => res.json())
                .then(response => {
                    console.log(response);
                    setCurChange([...data, {id: response.data.id, ...readySetData}]);
                    setData([...data, {id: response.data.id, ...readySetData}]);
                })
                .catch(err => {
                    console.log(err);
                    alert("Something goes wrong. Try again later")
                })
        }
        setDataReady("");
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
                                <TableCell align="right">{changerState ? <b> Подтвердить</b> : <b>Изменить</b>}</TableCell>
                                <TableCell align="right">{changerState ? <b> Закрыть </b> : <b>Удалить</b>}</TableCell>
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
                                                    <TextField type={i > 6 ? "date" : "text"} id="standard-basic" variant="standard" value={i > 6 ? curChange[i].toString().substring(0, 10) : curChange[i]} onChange={(event) => {
                                                                   setCurChange(curChange.map((elm, idx) => {
                                                                       if (i === idx) return i > 6 ? event.target.value + "T00:00:00.000Z" : event.target.value
                                                                       else return elm
                                                                   }));
                                                            }}/> :
                                            <Typography>{i > 6 ? el.substring(0, 10) : el}</Typography>}
                                    </TableCell>)}

                                    <TableCell align="right">
                                        <Button type={curChange[0] === row.id ? "submit" : ""} variant="outlined" disabled={changerState && curChange[0] !== row.id} onClick={() => {
                                                    if (!changerState) setCurChange(Object.values(curChange.find(el => row.id === el.id)));
                                                    else setDataReady("change");
                                                    setChangerState(!changerState);
                                                }}>
                                            {changerState && curChange[0] === row.id ? <div>&#10003;</div>  : <div>&#9998;</div>}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" disabled={changerState && curChange[0] !== row.id} onClick={() => {
                                                    if (changerState) {
                                                        setCurChange([...data]);

                                                    } else {
                                                        setCurChange(row.id)
                                                        setDataReady("delete");
                                                    }
                                                    setChangerState(false);
                                                    }}>
                                            &#10006;
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                                {newLineState ?
                                    <TableRow
                                        key={2}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            {newLine.map((el, i) => <TableCell align={i < 1 ? "left" : "right"}>
                                                <TextField type={i > 5 ? "date" : "text"} id="standard-basic" variant="standard" value={newLine[i]} onChange={(event) => {
                                                          setNewLine(newLine.map((elm, idx) => {
                                                            if (i === idx) return event.target.value
                                                            else return elm}));
                                                           }}/>
                                            </TableCell>
                                            )}
                                            <TableCell align="right">
                                                <Button type="submit" variant="outlined" onClick={() => {
                                                            setDataReady("new");
                                                            setNewLineState(false)
                                                        }}>
                                                    &#10003;
                                                </Button>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button variant="contained" onClick={() => setNewLineState(false)}>
                                                    &#10006;
                                                </Button>
                                            </TableCell>
                                        </TableRow> :
                                        <TableCell align="right">
                                        <Button variant="contained" onClick={() => setNewLineState(true)}>
                                            <Typography>Добавить запись</Typography>
                                        </Button>
                                        </TableCell>
                                }
                        </TableBody>
                    </Table> : <div> Wait</div>}
            </TableContainer>
        </Container>
    )
}

export default MainNet;

