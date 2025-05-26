import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../css/Global.module.css";
import stylesMarcas from "../css/adm/AdminMarcas.module.css";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Marcas() {
    const [user, setUser] = useState('');
    const [marca, setMarca] = useState('');
    const [marcas, setMarcas] = useState([]);
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

const buscarMarcas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/marcas/buscar");
      setMarcas(res.data);
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao obter as marcas.");
      setMensagemTipo("error");
    }
  };

   useEffect(() => {
    buscarMarcas();
  }, []);

    const adicionarMarca = async () => {
        const marca_normalizada = normalizarEspacos(marca);

        if (!marca_normalizada) {
            setMensagem('O nome da marca é obrigatório.');
            setMensagemTipo('error');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3001/api/marcas/nova', {
                nome: marca_normalizada
            });

            if (res.data.success) {
                setMensagem('Marca adicionada com sucesso.');
                setMensagemTipo('success');
                setMarca('');
                buscarMarcas();
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

    const atualizarMarca = async (id, nome) => {
    const nome_normalizado = normalizarEspacos(nome);

    if (!nome_normalizado) {
      setMensagem("O nome da marca é obrigatório.");
      setMensagemTipo("error");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:3001/api/marcas/atualizar/${id}`,
        { nome: nome_normalizado }
      );

      if (res.data.success) {
        setMensagem("Marca atualizada com sucesso.");
        setMensagemTipo("success");
        setMarcas((prevMarcas) =>
        prevMarcas.map((m) => (m.id === id ? { ...m, nome: nome_normalizado } : m))
      );
      } else {
        setMensagem(res.data.message || "Erro ao atualizar a marca.");
        setMensagemTipo("error");
      }
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao comunicar com o servidor.");
      setMensagemTipo("error");
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

      <div className={stylesMarcas.container}>
        <h1>Gerir Marcas</h1>

        <div>
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Nova marca"
            className={stylesMarcas.input}
          />
          <button
            onClick={adicionarMarca}
            className={stylesMarcas.button}
          >
            Adicionar
          </button>
        </div>

        <h2>Marcas Existentes</h2>
        <ul className={stylesMarcas.listaMarcas}>
          {marcas.map((m) => (
            <li key={m.id} className={stylesMarcas.itemMarca}>
              <input
                type="text"
                value={m.nome}
                onChange={(e) => {
                  const novoNome = e.target.value;
                  setMarcas((prevMarcas) =>
                    prevMarcas.map((marca) =>
                      marca.id === m.id
                        ? { ...marca, nome: novoNome }
                        : marca
                    )
                  );
                }}
                className={stylesMarcas.input}
              />
              <button
                onClick={() => atualizarMarca(m.id, m.nome)}
                className={stylesMarcas.buttonEditar}
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

export default Marcas;
