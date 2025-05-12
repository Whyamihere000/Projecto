import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../css/Global.module.css";
import stylesUtilizadores from "../css/Utilizadores.module.css";

function Utilizadores() {
    // const [utilizadoresPrimeiroNome, setUtilizadoresPrimeiroNome] = useState('');
    // const [utilizadoresUltimoNome, setUtilizadoresUltimoNome] = useState('');
    // const [utilizadoresEmail, setUtilizadoresEmail] = useState('');
    // const [utilizadoresPassword, setUtilizadoresPassword] = useState('');
    // const [utilizadoresTelefone, setUtilizadoresTelefone] = useState('');
    // const [utilizadoresDataRegisto, setUtilizadoresDataRegisto] = useState('');
    // const [utilizadoresTipo, setUtilizadoresTipo] = useState('');
    // const [utilizadoresRua, setUtilizadoresRua] = useState('');
    // const [utilizadoresCidade, setUtilizadoresCidade] = useState('');
    // const [utilizadoresCodigoPostal, setUtilizadoresCodigoPostal] = useState('');
    // const [utilizadoresPais, setUtilizadoresPais] = useState('');

    const [utilizadores, setUtilizadores] = useState([]);

    // const [mensagem, setMensagem] = useState('');
    // const [mensagemTipo, setMensagemTipo] = useState('');

    useEffect(() => {
        const fetchUtilizadores = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/utilizadores/buscar');
                setUtilizadores(res.data);
            } catch (error) {
                console.error('Erro ao carregar utilizadores', error);
            }
        };

        fetchUtilizadores();
    }, []);

    const colunas = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'primeiro_nome', headerName: 'Primeiro Nome', width: 150 },
        { field: 'ultimo_nome', headerName: 'Ultimo Nome', width: 150 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'password_hash', headerName: 'Password', width: 150 },
        { field: 'telefone', headerName: 'Telefone', width: 150 },
        { field: 'data_registo', headerName: 'Data Registo', width: 150 },
        { field: 'tipo_utilizador', headerName: 'Tipo', width: 150 },
        { field: 'rua', headerName: 'Rua', width: 150 },
        { field: 'cidade', headerName: 'Cidade', width: 150 },
        { field: 'codigo_postal', headerName: 'Codigo Postal', width: 150 },
        { field: 'pais', headerName: 'Pais', width: 150 },
        { field: 'ações', headerName: 'Ações', width: 200, renderCell: (params) => (
            <>
                <button onClick={() => eliminarProduto(params.row.id)}>Eliminar</button>
                <button onClick={() => atualizarProduto(params.row)}>Atualizar</button>
            </>
        )},
    ]

    return (
        <>
        <nav className={styles.navegacao_admin}>
            <Link to="/admin/categorias" className={styles.link}>Categorias</Link>
            <Link to="/admin/marcas" className={styles.link}>Marcas</Link>
            <Link to="/admin/produtos" className={styles.link}>Produtos</Link>
            <Link to="/admin/utilizadores" className={styles.link}>Utilizadores</Link>
            <button className={styles.logout}>Logout</button>
        </nav>

        <div className={stylesUtilizadores.container}>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={utilizadores}
                    columns={colunas}
                    pageSize={5}
                    getRowId={(row) => row.id}
                />
            </div>
        </div>
        </>
    );
}

export default Utilizadores;