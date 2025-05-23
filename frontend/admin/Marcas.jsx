import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../css/Global.module.css";
import stylesMarcas from "../css/AdminMarcas.module.css";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Marcas() {
    const [user, setUser] = useState('');
    const [marca, setMarca] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [mensagemTipo, setMensagemTipo] = useState(''); // success ou error

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
          const user = JSON.parse(storedUser);
          if (user.tipo_utilizador === 'admin') {
            setUser(user);
          }
        }
      }, []);

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

    useEffect(() => {
            document.body.className = styles.bodyHomeAdmin;
            return () => {
                document.body.className = '';
            };
        }, []);

    const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

    return (
        <>
            <NavbarAdmin handleLogout={handleLogout} user={user} />

            <div className={stylesMarcas.container}>
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
