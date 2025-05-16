import {useState} from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../css/Global.module.css'
// import stylesFinalizarEncomendas from '../css/FinalizarEncomendas.module.css'

function FinalizarEncomendas() {
  const [morada, setMorada] = useState({
    rua: '',
    localidade: '',
    codigoPostal: '',
    pais: ''
  });

  const [metodoPagamento, setMetodoPagamento] = useState("mbway");
  const [cartao, setCartao] = useState({
    nome: "",
    tipo: "",
    numero: "",
    validade: "",
    codigo_seguranca: ""
  });

  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const navigate = useNavigate();

  const handleMoradaChange = (e) => {
    setCartao({
      ...cartao,
      [e.target.name]: e.target.value
    });
  };

  const handleCartaoChange = (e) => {
    setCartao({
      ...cartao,
      [e.target.name]: e.target.value
    });
  };

  const validarMorada = () => {
    return morada.rua.trim() && morada.localidade.trim() && morada.codigoPostal.trim() && morada.pais.trim();
  };

  const validarCartao = () => {
    if (metodoPagamento !== 'cartao') return true; // Não valida se não for cartão

    return (
      cartao.nome.trim() &&
      cartao.tipo.trim() &&
      cartao.numero.trim() &&
      cartao.validade.trim() &&
      cartao.codigo_seguranca.trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");

    if (!validarMorada()) {
      setMensagemErro("Por favor, preencha todos os campos da morada.");
      return;
    }

    if (!validarCartao()) {
      setMensagemErro("Por favor, preencha todos os dados do cartão.");
      return;
    }

    // Junta a morada num texto (podes adaptar para o formato que preferires)
    const moradaTexto = `${morada.rua}, ${morada.localidade}, ${morada.codigoPostal}, ${morada.pais}`;

    try {
      // Supomos que tens um endpoint para criar encomenda que aceita estes dados
      const resposta = await axios.post('http://localhost:3001/api/encomendas/nova', {
        // Aqui tens de passar o id_carrinho (podes buscar do localStorage, contexto ou backend)
        // Vou assumir que vais buscar do localStorage, ajusta conforme precisares
        id_carrinho: JSON.parse(localStorage.getItem("carrinhoId")),
        morada: moradaTexto,
        metodo_pagamento: metodoPagamento,
        dados_cartao: metodoPagamento === 'cartao' ? cartao : null,
      });

      if (resposta.data.success) {
        setMensagemSucesso("Encomenda finalizada com sucesso!");
        // Redireciona após 2 segundos para a página das encomendas ou home
        setTimeout(() => navigate("/encomendas"), 2000);
      } else {
        setMensagemErro(resposta.data.message || "Erro ao finalizar encomenda.");
      }
    } catch (error) {
      setMensagemErro("Erro na comunicação com o servidor.");
    }
  };

  return (
    <div>
      <h1>Finalizar Encomenda</h1>

      {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>}
      {mensagemSucesso && <p style={{ color: 'green' }}>{mensagemSucesso}</p>}

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Morada de Envio</legend>
          <label>
            Rua:<br />
            <input type="text" name="rua" value={morada.rua} onChange={handleMoradaChange} />
          </label>
          <br />
          <label>
            Localidade:<br />
            <input type="text" name="localidade" value={morada.localidade} onChange={handleMoradaChange} />
          </label>
          <br />
          <label>
            Código Postal:<br />
            <input type="text" name="codigoPostal" value={morada.codigoPostal} onChange={handleMoradaChange} />
          </label>
          <br />
          <label>
            País:<br />
            <input type="text" name="pais" value={morada.pais} onChange={handleMoradaChange} />
          </label>
        </fieldset>

        <fieldset style={{ marginTop: '20px' }}>
          <legend>Método de Pagamento</legend>

          <label>
            <input
              type="radio"
              name="metodoPagamento"
              value="mbway"
              checked={metodoPagamento === "mbway"}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            /> MB Way
          </label>
          <br />

          <label>
            <input
              type="radio"
              name="metodoPagamento"
              value="paypal"
              checked={metodoPagamento === "paypal"}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            /> PayPal
          </label>
          <br />

          <label>
            <input
              type="radio"
              name="metodoPagamento"
              value="cartao"
              checked={metodoPagamento === "cartao"}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            /> Cartão
          </label>
          <br />

          {/* Só mostra dados do cartão se o método selecionado for cartão */}
          {metodoPagamento === "cartao" && (
            <div style={{ marginTop: "10px" }}>
              <label>
                Nome no Cartão:<br />
                <input type="text" name="nome" value={cartao.nome} onChange={handleCartaoChange} />
              </label>
              <br />
              <label>
                Tipo de Cartão:<br />
                <select name="tipo" value={cartao.tipo} onChange={handleCartaoChange}>
                  <option value="">Selecionar</option>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="maestro">Maestro</option>
                </select>
              </label>
              <br />
              <label>
                Número do Cartão:<br />
                <input type="text" name="numero" value={cartao.numero} onChange={handleCartaoChange} maxLength={16} />
              </label>
              <br />
              <label>
                Validade (MM/AA):<br />
                <input type="text" name="validade" value={cartao.validade} onChange={handleCartaoChange} placeholder="MM/AA" maxLength={5} />
              </label>
              <br />
              <label>
                Código de Segurança (CVV):<br />
                <input type="text" name="codigo_seguranca" value={cartao.codigo_seguranca} onChange={handleCartaoChange} maxLength={4} />
              </label>
            </div>
          )}
        </fieldset>

        <button type="submit" style={{ marginTop: '20px' }}>Finalizar Encomenda</button>
      </form>
    </div>
  );
}

export default FinalizarEncomendas;

