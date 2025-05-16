import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../css/Global.module.css";

function RevisaoEncomenda() {
  const [encomenda, setEncomenda] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("mbway");
  const navigate = useNavigate();
  const location = useLocation();

  const idEncomenda = location.state?.idEncomenda;

  useEffect(() => {
    if (idEncomenda) {
      axios.get(`http://localhost:3001/api/encomendas/${idEncomenda}`)
        .then(response => setEncomenda(response.data))
        .catch(() => setMensagem("Erro ao carregar encomenda."));
    }
  }, [idEncomenda]);

  const handlePagamento = () => {
    if (!idEncomenda) return setMensagem("Erro: Encomenda não encontrada.");

    navigate("/pagamento", { state: { idEncomenda, metodoPagamento } });
  };

  return (
    <div className={styles.main}>
      <h1>Rever Encomenda</h1>
      {mensagem && <p>{mensagem}</p>}

      {encomenda ? (
        <div>
          <p><strong>Encomenda ID:</strong> {encomenda.id}</p>
          <p><strong>Total:</strong> {encomenda.total.toFixed(2)}€</p>

          <h3>Selecionar Método de Pagamento:</h3>
          <select value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)}>
            <option value="mbway">MB Way</option>
            <option value="paypal">PayPal</option>
            <option value="cartao">Cartão de Crédito/Débito</option>
            <option value="referencia">Referência Multibanco</option>
            <option value="simulado">Simulado</option>
          </select>

          <button onClick={handlePagamento}>Confirmar Pagamento</button>
        </div>
      ) : (
        <p>A carregar encomenda...</p>
      )}
    </div>
  );
}

export default RevisaoEncomenda;
