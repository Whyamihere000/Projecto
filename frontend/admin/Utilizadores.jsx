import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../css/Global.module.css";
import stylesUtilizadores from "../css/adm/Utilizadores.module.css";
import ModalGlobal from "../componentes/ModalGlobal";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Utilizadores() {
  const [user, setUser] = useState(null);
  const [utilizadores, setUtilizadores] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [primeiro_nome, setPrimeiroNome] = useState('')
  const [ultimo_nome, setUltimoNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [telefone, setTelefone] = useState('')
  const [rua, setRua] = useState('')
  const [cidade, setCidade] = useState('')
  const [codigo_postal, setCodigoPostal] = useState('')
  const [pais, setPais] = useState('')

  const [mensagem, setMensagem] = useState("");
  const [mensagemTipo, setMensagemTipo] = useState("");  
  const [errors, setErrors] = useState({})

  const navigate = useNavigate();

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarPassword = (password) => {
    // Pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'admin') {
        setUser(user);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUtilizadores = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/utilizadores/buscar");
        setUtilizadores(res.data);
      } catch (error) {
        console.error("Erro ao carregar utilizadores", error);
      }
    };

    fetchUtilizadores();
  }, []);

  const atualizarUtilizador = async (utilizador) => {
    try {
      const primeiro_nome_normalizado = normalizarEspacos(utilizador.primeiro_nome);
      const ultimo_nome_normalizado = normalizarEspacos(utilizador.ultimo_nome);
      const email_normalizado = normalizarEspacos(utilizador.email);
      const telefone_normalizado = normalizarEspacos(utilizador.telefone);
      const rua_normalizada = normalizarEspacos(utilizador.rua);
      const cidade_normalizada = normalizarEspacos(utilizador.cidade);
      const codigo_postal_normalizado = normalizarEspacos(utilizador.codigo_postal);
      const pais_normalizado = normalizarEspacos(utilizador.pais);

      const res = await axios.put(
        `http://localhost:3001/api/utilizadores/atualizar/${utilizador.id}`,
        {
          primeiro_nome: primeiro_nome_normalizado,
          ultimo_nome: ultimo_nome_normalizado,
          email: email_normalizado,
          password_hash: utilizador.password_hash,
          telefone: telefone_normalizado,
          tipo_utilizador: utilizador.tipo_utilizador,
          rua: rua_normalizada,
          cidade: cidade_normalizada,
          codigo_postal: codigo_postal_normalizado,
          pais: pais_normalizado,
        }
      );

      if (res.data.success) {
        setUtilizadores((prevUtilizadores) =>
          prevUtilizadores.map((u) =>
            u.id === utilizador.id ? res.data.utilizador : u
          )
        );
        setMensagem(res.data.message);
        setMensagemTipo("success");
      } else {
        console.error("Erro ao atualizar utilizador");
        setMensagem(res.data.message);
        setMensagemTipo("error");
      }
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao comunicar com o servidor");
      setMensagemTipo("error");
    }
  };

  const eliminarUtilizador = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/utilizadores/eliminar/${id}`
      );

      if (response.status === 200) {
        setUtilizadores(
          utilizadores.filter((utilizador) => utilizador.id !== id)
        );
        setMensagem("Utilizador eliminado com sucesso");
        setMensagemTipo("success");
      } else {
        setMensagem("Erro ao eliminar utilizador");
        setMensagemTipo("error");
      }
    } catch (error) {
      console.error("Erro na requisição Axios:", error);
      setMensagem("Erro ao comunicar com o servidor");
      setMensagemTipo("error");
    }
  };

  const colunas = [
  { field: "id", headerName: "ID", minWidth: 70 },
  { field: "primeiro_nome", headerName: "Primeiro Nome", minWidth: 150, editable: true },
  { field: "ultimo_nome", headerName: "Ultimo Nome", minWidth: 150, editable: true },
  { field: "email", headerName: "Email", minWidth: 200, editable: true },
  { field: "password_hash", headerName: "Password", minWidth: 200, },
  { field: "telefone", headerName: "Telefone", minWidth: 150, editable: true,     
    renderEditCell: (params) => (
      <input
        type="text"
        value={params.value}
        onChange={(e) => {
          const newValue = e.target.value.slice(0, 9); // Limita diretamente a 9 caracteres
          params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
        }}
      />
    ),
  },
  { field: "data_registo", headerName: "Data Registo", minWidth: 150 },
  { field: "data_atualizacao", headerName: "Data Atualizacao", minWidth: 150 },
  { field: "tipo_utilizador", headerName: "Tipo", minWidth: 100, editable: true },
  { field: "rua", headerName: "Rua", minWidth: 200, flex: 1, editable: true },
  { field: "cidade", headerName: "Cidade", minWidth: 150, editable: true },
  { field: "codigo_postal", headerName: "Codigo Postal", minWidth: 150, editable: true },
  { field: "pais", headerName: "Pais", minWidth: 150, editable: true },
  {
    field: "ações",
    headerName: "Ações",
    minWidth: 220,
    renderCell: (params) => (
      <>
        <button style={{ backgroundColor: "red", color: "white" }} onClick={() => eliminarUtilizador(params.row.id)}>Eliminar</button>
        <button onClick={() => atualizarUtilizador(params.row)}>Atualizar</button>
      </>
    ),
  },
];

function normalizarEspacos(str) {
  return str
    .trim()
    .replace(/\s+/g, ' ');
}

const handleRegisto = async () => {
    const errors = {}

    const primeiro_nome_normalizado = normalizarEspacos(primeiro_nome);
    const ultimo_nome_normalizado = normalizarEspacos(ultimo_nome);
    const email_normalizado = normalizarEspacos(email);
    const rua_normalizada = normalizarEspacos(rua);
    const cidade_normalizada = normalizarEspacos(cidade);
    const pais_normalizado = normalizarEspacos(pais);
    const codigo_postal_normalizado = normalizarEspacos(codigo_postal);
    const telefone_normalizado = normalizarEspacos(telefone);

    if (!primeiro_nome_normalizado) {
      errors.primeiro_nome = 'O primeiro nome é obrigatório.'
    }

    if (!ultimo_nome_normalizado) {
      errors.ultimo_nome = 'O ultimo nome é obrigatório.'
    }

    if (!email_normalizado) {
      errors.email = 'O email é obrigatório.'
    } else if (!validarEmail(email)) {
      errors.email = 'Formato de email inválido.'
    }

    if (!password) {
      errors.password = 'A palavra-passe é obrigatória.'
    } else if (!validarPassword(password)) {
      errors.password = 'A palavra-passe deve ter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um símbolo.'
    }

    if (password !== password_confirmation) {
      errors.password_confirmation = 'A palavra-passe e a confirmação não coincidem.'
    }

    if (!telefone_normalizado) {
      errors.telefone = 'O telefone é obrigatório.'
    }

    if (!rua_normalizada) {
      errors.rua = 'A rua é obrigatória.'
    }

    if (!cidade_normalizada) {
      errors.cidade = 'A cidade é obrigatória.'
    }

    if (!codigo_postal_normalizado) {
      errors.codigo_postal = 'O codigo postal é obrigatório.'
    }

    if (!pais_normalizado) {
      errors.pais = 'O pais é obrigatório.'
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      const primeiroErro = Object.values(errors)[0];
    setMensagem(primeiroErro);
    setMensagemTipo('error');
    setMostrarModal(true);
      return
    }
    
    const regexCodigoPostal = /^[0-9]{4}-[0-9]{3}$/;
    if (!regexCodigoPostal.test(codigo_postal_normalizado)) {
      setMensagem('Código postal inválido.');
      setMensagemTipo('error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/utilizadores/registo', {
        primeiro_nome: primeiro_nome_normalizado,
        ultimo_nome: ultimo_nome_normalizado,
        email: email_normalizado,
        password: password,
        telefone: telefone_normalizado,
        rua: rua_normalizada,
        cidade: cidade_normalizada,
        codigo_postal: codigo_postal_normalizado,
        pais: pais_normalizado
      })

      if (response.data.success) {
        setMensagem('Registo efetuado com sucesso.')
        setMensagemTipo('success')
        setPrimeiroNome('')
        setUltimoNome('')
        setEmail('')
        setPassword('')
        setPasswordConfirmation('')
        setTelefone('')
        setRua('')
        setCidade('')
        setCodigoPostal('')
        setPais('')
        
        setUtilizadores((prevUtilizadores) => [...prevUtilizadores, response.data.user]);
      } else {
        setMensagem(response.data.message)
        setMensagemTipo('error')
      }
    } catch (error) {
        console.error('Erro no registo:', error.response?.data || error.message)
        setMensagem(error.response?.data?.message || 'Ocorreu um erro ao fazer o registo.')
        setMensagemTipo('error')
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

  const closeModal = () => {
    setMostrarModal(false);
  };

  return (
    <>
    {mostrarModal && (
        <ModalGlobal mensagem={mensagem} onClose={closeModal} />
      )}

      <NavbarAdmin handleLogout={handleLogout} user={user} />

      <div className={stylesUtilizadores.container}>
        <h1>Registo Colaborador</h1>
      <input type="text" placeholder="Primeiro Nome" onChange={(e) => setPrimeiroNome(e.target.value)} />
      {/* {errors.primeiro_nome && <p style={{ color: 'red' }}>{errors.primeiro_nome}</p>} */}

      <input type="text" placeholder="Ultimo Nome" onChange={(e) => setUltimoNome(e.target.value)} />
      {/* {errors.ultimo_nome && <p style={{ color: 'red' }}>{errors.ultimo_nome}</p>} */}

      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      {/* {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>} */}

      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      {/* {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>} */}

      <input type="password" placeholder="Confirm Password" onChange={(e) => setPasswordConfirmation(e.target.value)} />
      {/* {errors.password_confirmation && <p style={{ color: 'red' }}>{errors.password_confirmation}</p>} */}

      <input type="text" placeholder="Telefone" onChange={(e) => setTelefone(e.target.value)} />
      {/* {errors.telefone && <p style={{ color: 'red' }}>{errors.telefone}</p>} */}

      <input type="text" placeholder="Rua" onChange={(e) => setRua(e.target.value)} />
      {/* {errors.rua && <p style={{ color: 'red' }}>{errors.rua}</p>} */}

      <input type="text" placeholder="Cidade" onChange={(e) => setCidade(e.target.value)} />
      {/* {errors.cidade && <p style={{ color: 'red' }}>{errors.cidade}</p>} */}

      <input type="text" placeholder="Codigo Postal" onChange={(e) => setCodigoPostal(e.target.value)} />
      {/* {errors.codigo_postal && <p style={{ color: 'red' }}>{errors.codigo_postal}</p>} */}

      <input type="text" placeholder="Pais" onChange={(e) => setPais(e.target.value)} />
      {/* {errors.pais && <p style={{ color: 'red' }}>{errors.pais}</p>} */}

      <button onClick={handleRegisto}>Registar</button>
      <br />

        <div style={{ height: 400, width: "100%" }}>
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