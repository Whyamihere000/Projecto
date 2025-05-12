import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Categorias() {
    const [categoria, setCategoria] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [mensagemTipo, setMensagemTipo] = useState(''); // success ou error

    const adicionarCategoria = async () => {
        if (!categoria.trim()) {
            setMensagem('O nome da categoria é obrigatório.');
            setMensagemTipo('error');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3001/api/categorias/nova', {
                nome: categoria
            });

            if (res.data.success) {
                setMensagem('Categoria adicionada com sucesso.');
                setMensagemTipo('success');
                setCategoria('');
            } else {
                setMensagem('Erro ao adicionar a categoria.');
                setMensagemTipo('error');
            }
        } catch (error) {
            console.error(error);
            setMensagem('Erro ao comunicar com o servidor.');
            setMensagemTipo('error');
        }
    }

    return (
        <div>
            <Link to="/admin">Voltar</Link>
            <h1>Adicionar Categoria</h1>
            <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Nome da categoria"
            />
            <button onClick={adicionarCategoria}>Adicionar</button>

            {mensagem && (
                <p style={{ color: mensagemTipo === 'error' ? 'red' : 'green' }}>
                    {mensagem}
                </p>
            )}
        </div>
    );
}

export default Categorias;
