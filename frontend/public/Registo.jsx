import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../css/public/Registo.module.css";
import Navbar from "../componentes/Navbar";

function Registo() {
  const [formData, setFormData] = useState({
    primeiro_nome: "",
    ultimo_nome: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/.test(password);

  const handleRegisto = async () => {
    const errors = {};

    if (!formData.primeiro_nome) errors.primeiro_nome = "O primeiro nome é obrigatório.";
    if (!formData.ultimo_nome) errors.ultimo_nome = "O último nome é obrigatório.";
    if (!formData.email) {
      errors.email = "O email é obrigatório.";
    } else if (!validarEmail(formData.email)) {
      errors.email = "Formato de email inválido.";
    }

    if (!formData.password) {
      errors.password = "A palavra-passe é obrigatória.";
    } else if (!validarPassword(formData.password)) {
      errors.password = "A palavra-passe deve ter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um símbolo.";
    }

    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "A palavra-passe e a confirmação não coincidem.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setMessage("Verifique os erros.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/auth/registo", {
        primeiro_nome: formData.primeiro_nome,
        ultimo_nome: formData.ultimo_nome,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setMessage("Registo efetuado com sucesso.");
        setMessageType("success");

        if (response.data.user.tipo_utilizador === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        setMessage(response.data.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erro no registo:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Ocorreu um erro ao fazer o registo.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    document.body.className = styles.bodyHome;
    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <div className={styles.container}>
        <Navbar user={null} handleLogout={null} pesquisa={null} setPesquisa={null} />

        <h1 className={styles.title}>Registo</h1>

        <input
          type="text"
          name="primeiro_nome"
          placeholder="Primeiro Nome"
          onChange={handleChange}
          className={styles.input}
        />
        {errors.primeiro_nome && <p className={styles.errorText}>{errors.primeiro_nome}</p>}

        <input
          type="text"
          name="ultimo_nome"
          placeholder="Último Nome"
          onChange={handleChange}
          className={styles.input}
        />
        {errors.ultimo_nome && <p className={styles.errorText}>{errors.ultimo_nome}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className={styles.input}
        />
        {errors.email && <p className={styles.errorText}>{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className={styles.input}
        />
        {errors.password && <p className={styles.errorText}>{errors.password}</p>}

        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirmar Password"
          onChange={handleChange}
          className={styles.input}
        />
        {errors.password_confirmation && <p className={styles.errorText}>{errors.password_confirmation}</p>}

        <button onClick={handleRegisto} className={styles.button}>Registar</button>

        {message && (
          <div className={styles.message} style={{ color: messageType === "error" ? "red" : "green" }}>
            {message}
          </div>
        )}

        <Link to="/" style={{ marginTop: "10px", textAlign: "center", color: "#007bff" }}>Voltar</Link>
      </div>
    </>
  );
}

export default Registo;