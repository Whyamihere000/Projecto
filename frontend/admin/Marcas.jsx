import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../css/Global.module.css";
import stylesMarcas from "../css/AdminMarcas.module.css";

function Marcas() {
    const [marca, setMarca] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [mensagemTipo, setMensagemTipo] = useState(''); // success ou error

    const adicionarMarca = async () => {
        if (!marca.trim()) {
            setMensagem('O nome da marca é obrigatório.');
            setMensagemTipo('error');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3001/api/marcas/nova', {
                nome: marca
            });

            if (res.data.success) {
                setMensagem('Marca adicionada com sucesso.');
                setMensagemTipo('success');
                setMarca('');
            } else {
                setMensagem('Erro ao adicionar a marca.');
                setMensagemTipo('error');
            }
        } catch (error) {
            console.error(error);
            setMensagem('Erro ao comunicar com o servidor.');
            setMensagemTipo('error');
        }
    }

    return (
        <>
            <nav className={styles.navegacao_admin}>
                <Link to="/admin/categorias" className={styles.link}>Categorias</Link>
                <Link to="/admin/marcas" className={styles.link}>Marcas</Link>
                <Link to="/admin/produtos" className={styles.link}>Produtos</Link>
                <Link to="/admin/utilizadores" className={styles.link}>Utilizadores</Link>
                <Link to="/admin/mostrar-encomendas" className={styles.link}>Encomendas</Link>
                <button className={styles.logout}>Logout</button>
            </nav>

            <div className={stylesMarcas.container}>
                <Link to="/admin">Voltar</Link>
                <h1>Adicionar Marca</h1>
               <input
                    type="text"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    placeholder="Nome da marca"
                    className={stylesMarcas.input}
                />
                <button onClick={adicionarMarca} className={stylesMarcas.button}>Adicionar</button>
                {mensagem && (
                    <p style={{ color: mensagemTipo === 'error' ? 'red' : 'green' }}>
                        {mensagem}
                    </p>
                )}
            </div>
        </>
    );
}

export default Marcas;
