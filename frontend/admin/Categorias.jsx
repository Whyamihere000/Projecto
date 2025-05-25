import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../css/Global.module.css";
import stylesCategorias from "../css/adm/AdminCategorias.module.css";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Categorias() {
    const [user, setUser] = useState(null);
    const [categoria, setCategoria] = useState('');
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

    const adicionarCategoria = async () => {
        if (!categoria.trim()) {
            setMensagem('O nome da categoria é obrigatório.');
            setMensagemTipo('error');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3001/api/categorias/nova', {
                nome: categoria
            });

            if (res.data.success) {
                setMensagem('Categoria adicionada com sucesso.');
                setMensagemTipo('success');
                setCategoria('');
            } else {
                setMensagem('Erro ao adicionar a categoria.');
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

  useEffect(() => {
          document.body.className = styles.bodyHome;
          return () => {
              document.body.className = ''; // Remove ao sair
          };
      }, []);

    return (
        <>
            <NavbarAdmin handleLogout={handleLogout} user={user} />

            <div className={stylesCategorias.container}>
               <h1>Adicionar Categoria</h1>
                <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Nome da categoria"
                    className={stylesCategorias.input}
                />
                <button onClick={adicionarCategoria} className={stylesCategorias.button}>Adicionar</button>

                {mensagem && (
                    <p style={{ color: mensagemTipo === 'error' ? 'red' : 'green' }}>
                        {mensagem}
                    </p>
                )}
            </div>
        </>        
    );
}

export default Categorias;
