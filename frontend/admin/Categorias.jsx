import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../css/Global.module.css";
import stylesCategorias from "../css/adm/AdminCategorias.module.css";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Categorias() {
    const [user, setUser] = useState(null);
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
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

      function normalizarEspacos(str) {
  return str
    .trim()
    .replace(/\s+/g, ' ');
}

const buscarCategorias = async () => {
  try {
    const res = await axios.get("http://localhost:3001/api/categorias/buscar");
    setCategorias(res.data);
  } catch (error) {
    console.error(error);
    setMensagem("Erro ao obter as categorias.");
    setMensagemTipo("error");
  }
};

useEffect(() => {
  buscarCategorias();
}, []);

    const adicionarCategoria = async () => {
        const categoria_normalizada = normalizarEspacos(categoria);

  if (!categoria_normalizada) {
    setMensagem('O nome da categoria é obrigatório.');
    setMensagemTipo('error');
    return;
  }

  setCategoria(categoria_normalizada);

        try {
            const res = await axios.post('http://localhost:3001/api/categorias/nova', {
                nome: categoria_normalizada
            });

            if (res.data.success) {
                setMensagem('Categoria adicionada com sucesso.');
                setMensagemTipo('success');
                setCategoria('');
                buscarCategorias();	
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

    const atualizarCategoria = async (id, novoNome) => {
  const nome_normalizado = normalizarEspacos(novoNome);

  if (!nome_normalizado) {
    setMensagem('O nome da categoria é obrigatório.');
    setMensagemTipo('error');
    return;
  }

  try {
    const res = await axios.put(`http://localhost:3001/api/categorias/atualizar/${id}`, {
      nome: nome_normalizado
    });

    if (res.data.success) {
      setMensagem('Categoria atualizada com sucesso.');
      setMensagemTipo('success');
      setCategorias((prevCategorias) =>
        prevCategorias.map((c) => (c.id === id ? { ...c, nome: nome_normalizado } : c))
      );
    } else {
      setMensagem(res.data.message || 'Erro ao atualizar a categoria.');
      setMensagemTipo('error');
    }
  } catch (error) {
    console.error(error);
    setMensagem('Erro ao comunicar com o servidor.');
    setMensagemTipo('error');
  }
};


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

    <div className={stylesCategorias.container}>
      <h1>Gerir Categorias</h1>

      <div>
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          placeholder="Nova categoria"
          className={stylesCategorias.input}
        />
        <button
          onClick={adicionarCategoria}
          className={stylesCategorias.button}
        >
          Adicionar
        </button>
      </div>

      <h2>Categorias Existentes</h2>
      <ul className={stylesCategorias.listaCategorias}>
        {categorias.map((cat) => (
          <li key={cat.id} className={stylesCategorias.itemCategoria}>
            <input
              type="text"
              value={cat.nome}
              onChange={(e) => {
                const novoNome = e.target.value;
                setCategorias((prevCategorias) =>
                  prevCategorias.map((c) =>
                    c.id === cat.id ? { ...c, nome: novoNome } : c
                  )
                );
              }}
              className={stylesCategorias.input}
            />
            <button
              onClick={() => atualizarCategoria(cat.id, cat.nome)}
              className={stylesCategorias.buttonEditar}
            >
              Guardar
            </button>
          </li>
        ))}
      </ul>

      {mensagem && (
        <p
          style={{
            color: mensagemTipo === "error" ? "red" : "green",
            marginTop: "1rem",
          }}
        >
          {mensagem}
        </p>
      )}
    </div>
  </>
);

}

export default Categorias;
