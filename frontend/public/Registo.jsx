import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Registo() {
  const [primeiro_nome, setPrimeiroNome] = useState('')
  const [ultimo_nome, setUltimoNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [errors, setErrors] = useState({})

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarPassword = (password) => {
    // Pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
    return regex.test(password);
  };
  

  const handleRegisto = async () => {
    const errors = {}

    if (!primeiro_nome) {
      errors.primeiro_nome = 'O primeiro nome é obrigatório.'
    }

    if (!ultimo_nome) {
      errors.ultimo_nome = 'O ultimo nome é obrigatório.'
    }

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
        primeiro_nome: primeiro_nome,
        ultimo_nome: ultimo_nome,
        email: email,
        password: password
      })

      if (response.data.success) {
        // Primeiro guarda o user no localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user))

        setMessage('Registo efetuado com sucesso.')
        setMessageType('success')

        // Só depois redireciona para a rota correta
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

  return (
    <div>
      
      <h1>Registo</h1>
      <input type="text" placeholder="Primeiro Nome" onChange={(e) => setPrimeiroNome(e.target.value)} />
      {errors.primeiro_nome && <p style={{ color: 'red' }}>{errors.primeiro_nome}</p>}

      <input type="text" placeholder="Ultimo Nome" onChange={(e) => setUltimoNome(e.target.value)} />
      {errors.ultimo_nome && <p style={{ color: 'red' }}>{errors.ultimo_nome}</p>}

      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <input type="password" placeholder="Confirm Password" onChange={(e) => setPasswordConfirmation(e.target.value)} />
      {errors.password_confirmation && <p style={{ color: 'red' }}>{errors.password_confirmation}</p>}

      <button onClick={handleRegisto}>Registar</button>

      {message && (
        <div
            style={{
                color: messageType === 'error' ? 'red' : 'green',
                marginBottom: '10px',
            }}
        >
            {message}
        </div>
      )}

      <Link to="/">Voltar</Link>

    </div>
  )
}

export default Registo

