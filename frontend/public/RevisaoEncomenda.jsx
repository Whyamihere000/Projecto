import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../css/Global.module.css";

function RevisaoEncomenda() {
  const [encomenda, setEncomenda] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("mbway");
  const [detalhesPagamento, setDetalhesPagamento] = useState({});
  const [emProcessamento, setEmProcessamento] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const idEncomenda = location.state?.idEncomenda;

  useEffect(() => {
    if (idEncomenda) {
      axios.get(`http://localhost:3001/api/encomendas/detalhes/${idEncomenda}`)
        .then(response => setEncomenda(response.data))
        .catch(() => setMensagem("Erro ao carregar encomenda."));
    }
  }, [idEncomenda]);

  // Função para renderizar campos adicionais conforme método
  const CamposPagamento = () => {
    switch (metodoPagamento) {
      case "mbway":
        return (
          <>
            <label>Telefone MB Way:</label>
            <input
              type="tel"
              value={detalhesPagamento.telefone || ""}
              onChange={e => setDetalhesPagamento({ telefone: e.target.value })}
              placeholder="Ex: 912345678"
              required
            />
          </>
        );
      case "paypal":
        return (
          <>
            <label>Email PayPal:</label>
            <input
              type="email"
              value={detalhesPagamento.email || ""}
              onChange={e => setDetalhesPagamento({ email: e.target.value })}
              placeholder="Ex: utilizador@email.com"
              required
            />
          </>
        );
      case "cartao":
        return (
          <>
            <label>Nome no Cartão:</label>
            <input
              type="text"
              value={detalhesPagamento.nome_cartao || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, nome_cartao: e.target.value })}
              required
            />
            <label>Tipo de Cartão:</label>
            <select
              value={detalhesPagamento.cartao_tipo || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, cartao_tipo: e.target.value })}
              required
            >
              <option value="">Selecionar</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="maestro">Maestro</option>
            </select>
            <label>Número do Cartão:</label>
            <input
              type="text"
              maxLength={16}
              value={detalhesPagamento.cartao_numero || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, cartao_numero: e.target.value })}
              required
            />
            <label>Validade (MM/AA):</label>
            <input
              type="text"
              placeholder="MM/AA"
              value={detalhesPagamento.cartao_validade || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, cartao_validade: e.target.value })}
              required
            />
            <label>Código Segurança (CVV):</label>
            <input
              type="text"
              maxLength={4}
              value={detalhesPagamento.cartao_codigo_seguranca || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, cartao_codigo_seguranca: e.target.value })}
              required
            />
          </>
        );
      case "referencia":
        return (
          <>
            <label>Referência Multibanco:</label>
            <input
              type="text"
              value={detalhesPagamento.referencia || ""}
              onChange={e => setDetalhesPagamento({ referencia: e.target.value })}
              placeholder="Ex: 1234 5678 9012 3456"
              required
            />
          </>
        );
      case "simulado":
        return (
          <>
            <label>Info Simulado:</label>
            <input
              type="text"
              value={detalhesPagamento.informacoes_adicionais || ""}
              onChange={e => setDetalhesPagamento({ informacoes_adicionais: e.target.value })}
              placeholder="Ex: teste de pagamento simulado"
              required
            />
          </>
        );
      default:
        return null;
    }
  };

  const handlePagamento = async () => {
    if (!idEncomenda) return setMensagem("Erro: Encomenda não encontrada.");

    try {
      // Envia o objeto detalhesPagamento como JSON stringificado para backend
      await axios.post(`http://localhost:3001/api/encomendas/pagar/${idEncomenda}`, {
        metodoPagamento,
        detalhesPagamento: JSON.stringify(detalhesPagamento)
      });
      navigate("/sucesso-pagamento");
    } catch (error) {
      setMensagem("Erro ao processar o pagamento.");
    }
  };

  return (
    <div className={styles.main}>
      <h1>Rever e Pagar Encomenda</h1>
      {mensagem && <p>{mensagem}</p>}

      {encomenda ? (
        <div>
          <p><strong>Encomenda ID:</strong> {encomenda.id}</p>
          <p><strong>Total:</strong> {encomenda.total ? Number(encomenda.total).toFixed(2) + "€" : "Total não disponível"}</p>

          <h3>Selecionar Método de Pagamento:</h3>
          <select value={metodoPagamento} onChange={e => {
            setMetodoPagamento(e.target.value);
            setDetalhesPagamento({});
          }} disabled={emProcessamento}>
            <option value="mbway">MB Way</option>
            <option value="paypal">PayPal</option>
            <option value="cartao">Cartão de Crédito/Débito</option>
            <option value="referencia">Referência Multibanco</option>
            <option value="simulado">Simulado</option>
          </select>

          <h3>Detalhes de Pagamento:</h3>
          {CamposPagamento()}

          <button onClick={handlePagamento} disabled={emProcessamento}>Confirmar Pagamento</button>
        </div>
      ) : (
        <p>A carregar encomenda...</p>
      )}
    </div>
  );
}

export default RevisaoEncomenda;
