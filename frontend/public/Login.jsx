import { useState } from 'react'
import axios from 'axios'
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
        email: email,
        password: password
      })

      if (response.data.success) {
        // Primeiro guarda o user no localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
  
        setMessage('Login efetuado com sucesso.');
        setMessageType('success');
  
        // Só depois redireciona para a rota correta
        if (response.data.user.tipo_utilizador === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        setMessage(response.data.message);
        setMessageType('error');
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setMessage('Erro ao efetuar o login.')
      setMessageType('error')
    }
}

  return (
    <div className={Styles.login}>
      <h1>Login</h1>
      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={Styles.input}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={Styles.input}
      />
      <button type='button' onClick={handleLogin}>Login</button>
      <button type='button' onClick={() => window.location.href = '/registo'}>Registo</button>

      {message && (
        <p className={messageType === 'success' ? Styles.success : Styles.error}>
          {message}
        </p>
      )}
    </div>
  )
}

export default Login
