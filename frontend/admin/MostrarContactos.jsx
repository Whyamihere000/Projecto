import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../css/Global.module.css";
import stylesEncomendas from "../css/MostrarEncomendas.module.css";
import NavbarAdmin from "../componentes/NavbarAdmin";

function MostrarContactos() {
  const [user, setUser] = useState(null);
  const [contactos, setContactos] = useState([]);
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

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/contactos/tudo`);
        console.log("Resposta API:", res.data);

        const dadosComId = res.data.map((linha, index) => ({
          ...linha,
          id: index
        }));

        setContactos(dadosComId);
      } catch (error) {
        console.error("Erro ao carregar contactos", error);
      }
    };

    fetchContactos();
  }, []);

  const colunas = [
    { field: "id", headerName: "Encomenda Nº", width: 110 },
    { field: "nome", headerName: "Cliente", width: 130 },
    { field: "email", headerName: "Email", width: 130 },
    { field: "mensagem", headerName: "Mensagem", width: 130 },
    { field: "data_envio", headerName: "Data Envio", width: 130 },    
  ];

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

    <div className={stylesEncomendas.container}>
      {contactos.length === 0 ? (
        <p>Sem contactos para mostrar.</p>
      ) : (
        <DataGrid
          rows={contactos}
          columns={colunas}
          pageSize={10}
        />
      )}
    </div>    
    </>
  );
}

export default MostrarContactos;
