import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ModalErro from '../componentes/ModalGlobal'
import Styles from '../css/Login.module.css'
import Navbar from "../componentes/Navbar";

function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [openModal, setOpenModal] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  })
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === "cliente") {
        setUser(user);
      }
    }
  }, []);

  // Atualiza os critérios da password ao digitar
  useEffect(() => {
    setPasswordValidation({
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    })
  }, [password])

  const handleLogout = async () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Preencha todos os campos.')
      setMessageType('error')
      setOpenModal(true)
      return
    }

    const { lowercase, uppercase, number, specialChar } = passwordValidation
    if (!lowercase || !uppercase || !number || !specialChar) {
      setMessage('A password não cumpre todos os critérios.')
      setMessageType('error')
      setOpenModal(true)
      return
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      })

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setMessage('Login efetuado com sucesso.')
        setMessageType('success')
        setOpenModal(true)

        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';

        if (response.data.user.tipo_utilizador === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = redirectPath
        }
      } else {
        setMessage(response.data.message)
        setMessageType('error')
        setOpenModal(true)
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setMessage('Erro ao efetuar o login.')
      setMessageType('error')
      setOpenModal(true)
    }
  }

  useEffect(() => {
    document.body.className = Styles.bodyHome;
    return () => {
      document.body.className = "";
    };
  }, []);

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Navbar
          user={user}
          handleLogout={handleLogout}
        />
    <div style={{
 
    }}>
     
      <div className={Styles.login}>
        
        <h1>Login</h1>

        <label className={Styles.label}>Introduza o Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={Styles.input}
          placeholder="Email"
        />

        <label className={Styles.label}>Coloque a password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={Styles.input}
          placeholder="Password"
        />

        {/* Checklist de verificação */}
        <ul className={Styles.checklist}>
          <li className={passwordValidation.lowercase ? Styles.valid : Styles.invalid}>Letra minúscula</li>
          <li className={passwordValidation.uppercase ? Styles.valid : Styles.invalid}>Letra maiúscula</li>
          <li className={passwordValidation.number ? Styles.valid : Styles.invalid}>Número</li>
          <li className={passwordValidation.specialChar ? Styles.valid : Styles.invalid}>Caractere especial</li>
        </ul>

        <label className={Styles.errorMessage}>Problemas ao iniciar login?</label>

        <div className={Styles.buttonContainer}>
          <button type="button" onClick={handleLogin} className={Styles.button}>Login</button>
        </div>
        <br />
        <label className={Styles.errorMessage}>Não tem conta criada? Faça já o registo:</label>

        <div className={Styles.buttonContainer}>
          <button type="button" onClick={() => window.location.href = '/registo'} className={Styles.button}>Registo</button>
        </div>
        <br />

        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{ color: '#007bff' }}>Voltar</Link>
        </div>
      </div>
    </div>
    {openModal && (
          <ModalErro mensagem={message} onClose={closeModal} />
        )}
    </>
  )
}

export default Login
