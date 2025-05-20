import { useState, useEffect } from "react";
import axios from 'axios'
import { Link } from 'react-router-dom'
import styles from '../css/Registo.module.css'

function Registo() {
  const [primeiro_nome, setPrimeiroNome] = useState('')
  const [ultimo_nome, setUltimoNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [errors, setErrors] = useState({})

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validarPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/.test(password)

  const handleRegisto = async () => {
    const errors = {}

    if (!primeiro_nome) errors.primeiro_nome = 'O primeiro nome é obrigatório.'
    if (!ultimo_nome) errors.ultimo_nome = 'O último nome é obrigatório.'
    if (!email) {
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

    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      setMessage('Verifique os erros.')
      setMessageType('error')
      return
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/registo', {
        primeiro_nome,
        ultimo_nome,
        email,
        password
      })

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setMessage('Registo efetuado com sucesso.')
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
    } catch (error) {
      console.error('Erro no registo:', error.response?.data || error.message)
      setMessage(error.response?.data?.message || 'Ocorreu um erro ao fazer o registo.')
      setMessageType('error')
    }
  }

     useEffect(() => {
        document.body.className = styles.bodysHome;
        return () => {
          document.body.className = "";
        };
      }, []);

  return (
    <>


    <div className={styles.container}>
      <h1 className={styles.title}>Registo</h1>

      <input type="text" placeholder="Primeiro Nome" onChange={(e) => setPrimeiroNome(e.target.value)} className={styles.input} />
      {errors.primeiro_nome && <p className={styles.errorText}>{errors.primeiro_nome}</p>}

      <input type="text" placeholder="Último Nome" onChange={(e) => setUltimoNome(e.target.value)} className={styles.input} />
      {errors.ultimo_nome && <p className={styles.errorText}>{errors.ultimo_nome}</p>}

      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className={styles.input} />
      {errors.email && <p className={styles.errorText}>{errors.email}</p>}

      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className={styles.input} />
      {errors.password && <p className={styles.errorText}>{errors.password}</p>}

      <input type="password" placeholder="Confirmar Password" onChange={(e) => setPasswordConfirmation(e.target.value)} className={styles.input} />
      {errors.password_confirmation && <p className={styles.errorText}>{errors.password_confirmation}</p>}

      <button onClick={handleRegisto} className={styles.button}>Registar</button>

      {message && (
        <div className={styles.message} style={{ color: messageType === 'error' ? 'red' : 'green' }}>
          {message}
        </div>
      )}

      <Link to="/" style={{ marginTop: '10px', textAlign: 'center', color: '#007bff' }}>Voltar</Link>
    </div>
    </>
  )
}

export default Registo
