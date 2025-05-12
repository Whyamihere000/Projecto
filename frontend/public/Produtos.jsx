import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/produtos/buscar');
                setProdutos(res.data);
            } catch (error) {
                console.error('Erro ao carregar produtos', error);
                setMensagem('Erro ao carregar produtos.');
            }
        }

        fetchProdutos();
    }, []);

    const adicionarAoCarrinho = async (produtoID, quantidade = 1) => {
        try {
            await axios.post('http://localhost:3001/api/carrinho/adicionar', {
                produtoID,
                quantidade
            });
            setMensagem('Produto adicionado ao carrinho.');
            navigate('/carrinho');
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho', error);
            setMensagem('Erro ao adicionar ao carrinho.');
        }
    }

    return (
        <div>
            <h1>Produtos</h1>
            {mensagem && <p>{mensagem}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {produtos.length > 0 ? (
                    produtos.map((produto) => (
                        <div key={produto.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                            <h3>{produto.nome}</h3>
                            <p>{produto.descricao}</p>
                            <p>{produto.preco}€</p>
                            <button onClick={() => adicionarAoCarrinho(produto.id)}>Adicionar ao carrinho</button>
                        </div>
                    ))
                ) : (
                    <p>Nenhum produto disponível.</p>
                )}
            </div>
        </div>
    )
}

export default Produtos;