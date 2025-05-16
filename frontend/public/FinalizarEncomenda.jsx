import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../css/Global.module.css";

function FinalizarEncomenda() {
    const [form, setForm] = useState({
        rua: "",
        cidade: "",
        codigo_postal: "",
        pais: "",
        email: "",
        telefone: "",
        nif: "",
    });
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const idCarrinho = location.state?.idCarrinho;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!idCarrinho) return setMensagem("Erro: Carrinho não encontrado.");

        try {
            const response = await axios.post("http://localhost:3001/api/encomendas/nova", {
                id_carrinho: idCarrinho,
                ...form,
            })

            navigate("/revisao-encomenda", { state: { idEncomenda: response.data.id } });
        } catch (error) {
            console.error("Erro ao criar encomenda:", error);
            setMensagem("Erro ao criar encomenda.");
        }
    }

    return (
        <div className={styles.container}>
            <h1>Finalizar Encomenda</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="rua">Rua:</label>
                <input type="text" id="rua" name="rua" value={form.rua} onChange={handleChange} required />
                <label htmlFor="cidade">Cidade:</label>
                <input type="text" id="cidade" name="cidade" value={form.cidade} onChange={handleChange} required />
                <label htmlFor="codigo_postal">Código Postal:</label>
                <input type="text" id="codigo_postal" name="codigo_postal" value={form.codigo_postal} onChange={handleChange} required />
                <label htmlFor="pais">País:</label>
                <input type="text" id="pais" name="pais" value={form.pais} onChange={handleChange} required />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
                <label htmlFor="telefone">Telefone:</label>
                <input type="tel" id="telefone" name="telefone" value={form.telefone} onChange={handleChange} required />
                <label htmlFor="nif">NIF:</label>
                <input type="text" id="nif" name="nif" value={form.nif} onChange={handleChange} required />
                <button type="submit">Finalizar Encomenda</button>
            </form>
            {mensagem && <p>{mensagem}</p>}
            <Link to="/carrinho">Voltar ao carrinho</Link>
        </div>
    )
}

export default FinalizarEncomenda