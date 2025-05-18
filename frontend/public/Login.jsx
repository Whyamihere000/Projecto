import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Styles from '../css/Login.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Preencha todos os campos.')
      setMessageType('error')
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

        if (response.data.user.tipo_utilizador === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/'
        }
      } else {
        setMessage(response.data.message)
        setMessageType('error')
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setMessage('Erro ao efetuar o login.')
      setMessageType('error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#eef1f4'
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
        
        <Link to="/" style={{ marginTop: '10px', textAlign: 'center', color: '#007bff' }}>Voltar</Link>
        
        

        {message && (
          <p className={messageType === 'success' ? Styles.success : Styles.error}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default Login
