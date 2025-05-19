import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
//import styles from "../css/Global.module.css";
import styles from "../css/RevisaoEncomenda.module.css";


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

  const CamposPagamento = () => {
    switch (metodoPagamento) {
      case "mbway":
        return (
          <>
            <label className={styles.revisaoLabel}>Telefone MB Way:</label>
            <input
              className={styles.revisaoInput}
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
            <label className={styles.revisaoLabel}>Email PayPal:</label>
            <input
              className={styles.revisaoInput}
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
            <label className={styles.revisaoLabel}>Nome no Cartão:</label>
            <input
              className={styles.revisaoInput}
              type="text"
              value={detalhesPagamento.nome_cartao || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, nome_cartao: e.target.value })}
              required
            />
            <label className={styles.revisaoLabel}>Tipo de Cartão:</label>
            <select
              className={styles.revisaoSelect}
              value={detalhesPagamento.cartao_tipo || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, cartao_tipo: e.target.value })}
              required
            >
              <option value="">Selecionar</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
            </select>
            <label className={styles.revisaoLabel}>Número do Cartão:</label>
            <input
              className={styles.revisaoInput}
              type="text"
              maxLength={16}
              value={detalhesPagamento.cartao_numero || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, cartao_numero: e.target.value })}
              required
            />
            <label className={styles.revisaoLabel}>Validade (MM/AA):</label>
            <input
              className={styles.revisaoInput}
              type="text"
              placeholder="MM/AA"
              value={detalhesPagamento.cartao_validade || ""}
              onChange={e => setDetalhesPagamento({ ...detalhesPagamento, cartao_validade: e.target.value })}
              required
            />
            <label className={styles.revisaoLabel}>Código Segurança (CVV):</label>
            <input
              className={styles.revisaoInput}
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
            <label className={styles.revisaoLabel}>Referência Multibanco:</label>
            <input
              className={styles.revisaoInput}
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
            <label className={styles.revisaoLabel}>Info Simulado:</label>
            <input
              className={styles.revisaoInput}
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

    if (!detalhesPagamento || Object.keys(detalhesPagamento).length === 0) return setMensagem("Erro: Detalhes de pagamento obrigatórios.");

    if (!idEncomenda) return setMensagem("Erro: Encomenda não encontrada.");

    if (metodoPagamento === "mbway") {
      if (!/^9[0-9]{8}$/.test(detalhesPagamento.telefone)) return setMensagem("Erro: Número de telemóvel errado. Deve ter 9 dígitos e começar por 9.");
    }

    if (metodoPagamento === "paypal") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(detalhesPagamento.email)) return setMensagem("Erro: Email inválido.");
    }

    if (metodoPagamento === "cartao") {
      if (!/^\d{16}$/.test(detalhesPagamento.cartao_numero)) return setMensagem("Erro: Número de cartão inválido.");
      if (!/^\d{4}$/.test(detalhesPagamento.cartao_codigo_seguranca)) return setMensagem("Erro: Código de seguranca inválido.");
      if (!/^\d{2}\/\d{2}$/.test(detalhesPagamento.cartao_validade)) return setMensagem("Erro: Validade inválida.");
    }

    if (metodoPagamento === "referencia") {
      if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(detalhesPagamento.referencia)) return setMensagem("Erro: Referência inválida.");
    }

    if (metodoPagamento === "simulado") {
      if (!detalhesPagamento.informacoes_adicionais) return setMensagem("Erro: Informações adicionais obrigatórias.");
    }

    try {
      setEmProcessamento(true);
      await axios.post(`http://localhost:3001/api/encomendas/pagar/${idEncomenda}`, {
        metodoPagamento,
        detalhesPagamento: JSON.stringify(detalhesPagamento)
      });
      navigate("/sucesso-pagamento");
    } catch (error) {
      setMensagem("Erro ao processar o pagamento.");
    } finally {
      setEmProcessamento(false);
    }
  };

  return (
    <div className={styles.revisaoContainer}>
      <h1 className={styles.revisaoTitulo}>Rever e Pagar Encomenda</h1>
      {mensagem && <p className={styles.revisaoMensagem}>{mensagem}</p>}

      {encomenda ? (
        <div>
          <p className={styles.revisaoTexto}><strong>Encomenda ID:</strong> {encomenda.id}</p>
          <p className={styles.revisaoTexto}><strong>Total:</strong> {encomenda.total ? Number(encomenda.total).toFixed(2) + "€" : "Total não disponível"}</p>

          <h3 className={styles.revisaoTitulo}>Selecionar Método de Pagamento:</h3>
          <select
            className={styles.revisaoSelect}
            value={metodoPagamento}
            onChange={e => {
              setMetodoPagamento(e.target.value);
              setDetalhesPagamento({});
            }}
            disabled={emProcessamento}
          >
            <option value="mbway">MB Way</option>
            <option value="paypal">PayPal</option>
            <option value="cartao">Cartão de Crédito/Débito</option>
            <option value="referencia">Referência Multibanco</option>
            <option value="simulado">Simulado</option>
          </select>

          <h3 className={styles.revisaoTitulo}>Detalhes de Pagamento:</h3>
          {CamposPagamento()}

          <button
            className={styles.revisaoBotao}
            onClick={handlePagamento}
            disabled={emProcessamento}
          >
            Confirmar Pagamento
          </button>
        </div>
      ) : (
        <p className={styles.revisaoTexto}>A carregar encomenda...</p>
      )}
    </div>
  );
}

export default RevisaoEncomenda;
