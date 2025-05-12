import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../css/Global.module.css";
import stylesProdutos from "../css/Produtos.module.css";

function Produtos() {
  const [produtoNome, setProdutoNome] = useState('');
  const [produtoDescricao, setProdutoDescricao] = useState('');
  const [produtoPreco, setProdutoPreco] = useState('');
  const [produtoStock, setProdutoStock] = useState('');
  const [produtoCategoria, setProdutoCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [produtoMarca, setProdutoMarca] = useState('');  
  const [marcas, setMarcas] = useState([]);  
  const [produtoImagem, setProdutoImagem] = useState('');
  const [produtoEspecificacoes, setProdutoEspecificacoes] = useState('');

  const [produtos, setProdutos] = useState([]);

  const [mensagem, setMensagem] = useState('');
  const [mensagemTipo, setMensagemTipo] = useState('');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/categorias/buscar');
        setCategorias(res.data);
      } catch (error) {
        console.error('Erro ao carregar categorias', error);
      }
    };
  
    const fetchMarcas = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/marcas/buscar');
        setMarcas(res.data);
      } catch (error) {
        console.error('Erro ao carregar marcas', error);
      }
    };

    const fetchProdutos = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/produtos/buscar');        
        console.log(produtos)
        setProdutos(res.data);
      } catch (error) {
        console.error('Erro ao carregar produtos', error);
      }
    };
  
    fetchCategorias();
    fetchMarcas();
    fetchProdutos();
  }, []);

  const adicionarProduto = async () => {
    if (!produtoNome.trim()) {
      setMensagem('O nome do produto é obrigatório.');
      setMensagemTipo('error');
      return;
    }
    if (!produtoPreco) {
      setMensagem('O preço do produto é obrigatório.');
      setMensagemTipo('error');
      return;
    }
    if (!produtoStock) {
      setMensagem('O stock do produto é obrigatório.');
      setMensagemTipo('error');
      return;
    }
    if (!produtoCategoria) {
      setMensagem('A categoria do produto é obrigatória.');
      setMensagemTipo('error');
      return;
    }
    if (!produtoMarca) {
      setMensagem('A marca do produto é obrigatória.');
      setMensagemTipo('error');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/api/produtos/nova', {
        nome: produtoNome,
        descricao: produtoDescricao,
        preco: produtoPreco,
        stock: produtoStock,
        id_categoria: produtoCategoria,
        id_marca: produtoMarca,
        imagem_url: produtoImagem,
        especificacoes: produtoEspecificacoes
      });

      if (res.data.success) {
        setMensagem('Produto adicionado com sucesso.');
        setMensagemTipo('success');
        setProdutoNome('');
        setProdutoDescricao('');
        setProdutoPreco('');
        setProdutoStock('');
        setProdutoCategoria('');
        setProdutoMarca('');
        setProdutoImagem('');
        setProdutoEspecificacoes('');

        const produtosAtualizados = await axios.get('http://localhost:3001/api/produtos/buscar');
        setProdutos(produtosAtualizados.data);
      } else {
        setMensagem('Erro ao adicionar o produto.');
        setMensagemTipo('error');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao comunicar com o servidor.');
      setMensagemTipo('error');
    }
  }

  const atualizarProduto = async (produto) => {
    try {
      const res = await axios.put(`http://localhost:3001/api/produtos/atualizar/${produto.id}`, {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        stock: produto.stock,
        id_categoria: produto.id_categoria,
        id_marca: produto.id_marca,
        imagem_url: produto.imagem_url,
        especificacoes: produto.especificacoes
      });

      if (res.data.success) {
        setProdutos(produtos.map(p => p.id === produto.id ? { ...p, ...produto } : p));
        setMensagem('Produto atualizado com sucesso.');
        setMensagemTipo('success');
      } else {
        setMensagem('Erro ao atualizar o produto.');
        setMensagemTipo('error');
      }
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao comunicar com o servidor.');
      setMensagemTipo('error');
    }
  }

  const eliminarProduto = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:3001/api/produtos/eliminar/${id}`);
    console.log(response.data); // Verifica a resposta da API
    
    if (response.status === 200) {
      setProdutos(produtos.filter(produto => produto.id !== id));
      setMensagem('Produto eliminado com sucesso.');
      setMensagemTipo('success');
    } else {
      setMensagem('Erro ao eliminar produto.');
      setMensagemTipo('error');
    }
  } catch (error) {
    console.error('Erro na requisição Axios:', error);
    setMensagem('Erro ao comunicar com o servidor.');
    setMensagemTipo('error');
  }
};

  const colunas = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome', width: 130, editable: true },
    { field: 'descricao', headerName: 'Descrição', width: 130, editable: true },
    { field: 'preco', headerName: 'Preço', width: 130, editable: true },
    { field: 'stock', headerName: 'Stock', width: 130, editable: true },
    { field: 'id_categoria', headerName: 'Categoria', width: 130, editable: true, 
      renderCell: (params) => {
        const categoria = categorias.find(cat => cat.id === params.row.id_categoria);
        return categoria ? categoria.nome : '';
      }
    },
    { field: 'id_marca', headerName: 'Marca', width: 130, editable: true, 
      renderCell: (params) => {
        const marca = marcas.find(marca => marca.id === params.row.id_marca);
        return marca ? marca.nome : '';
      }
    },    
    { field: 'ações', headerName: 'Ações', width: 200, renderCell: (params) => (
      <>
        <button onClick={() => eliminarProduto(params.row.id)}>Eliminar</button>
        <button onClick={() => atualizarProduto(params.row)}>Atualizar</button>
      </>
    )},
  ]

  useEffect(() => {
      document.body.className = stylesProdutos.bodyHome;
      return () => {
          document.body.className = ''; // Remove ao sair
      };
  }, []);
  
  return (
    <>
      <nav className={styles.navegacao_admin}>
        <Link to="/admin/categorias" className={styles.link}>Categorias</Link>
        <Link to="/admin/marcas" className={styles.link}>Marcas</Link>
        <Link to="/admin/produtos" className={styles.link}>Produtos</Link>
        <Link to="/admin/utilizadores" className={styles.link}>Utilizadores</Link>
        <button className={styles.logout}>Logout</button>
      </nav>

      <div className={stylesProdutos.container}>
        <h1>Adicionar Produto</h1>
        <input
          type="text"
          placeholder="Nome do produto"
          value={produtoNome}
          onChange={(e) => setProdutoNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição do produto"
          value={produtoDescricao}
          onChange={(e) => setProdutoDescricao(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço do produto"
          value={produtoPreco}
          onChange={(e) => setProdutoPreco(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock do produto"
          value={produtoStock}
          onChange={(e) => setProdutoStock(e.target.value)}
        />
        <select value={produtoCategoria} onChange={(e) => setProdutoCategoria(e.target.value)}>
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
        <select value={produtoMarca} onChange={(e) => setProdutoMarca(e.target.value)}>
          <option value="">Selecione uma marca</option>
          {marcas.map((marca) => (
            <option key={marca.id} value={marca.id}>
              {marca.nome}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Imagem do produto"
          value={produtoImagem}
          onChange={(e) => setProdutoImagem(e.target.value)}
        />
        <input
          type="text"
          placeholder="Especificacoes do produto"
          value={produtoEspecificacoes}
          onChange={(e) => setProdutoEspecificacoes(e.target.value)}
        />
        <button onClick={adicionarProduto}>Adicionar Produto</button>
        {mensagem && <p className={mensagemTipo}>{mensagem}</p>}
        <br />
        <br />
        <br />
        <br />
        <h2>Lista Produtos</h2>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={produtos}
            columns={colunas}
            pageSize={5}
            getRowId={(row) => row.id}
          />
        </div>
      </div>
    </>
  );
}

export default Produtos;