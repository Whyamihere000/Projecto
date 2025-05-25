import { useState, useEffect } from "react";
import axios from "axios";
import ModalErro from "../componentes/ModalErro";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../css/Global.module.css";
import stylesProdutos from "../css/adm/AdminProdutos.module.css";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Produtos() {
    const [user, setUser] = useState(null);
    const [produtoSku, setProdutoSku] = useState('');
    const [produtoNome, setProdutoNome] = useState('');
    const [produtoDescricao, setProdutoDescricao] = useState('');
    const [produtoPreco, setProdutoPreco] = useState('');
    const [produtoStock, setProdutoStock] = useState('');
    const [produtoCategoria, setProdutoCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [produtoMarca, setProdutoMarca] = useState('');  
    const [marcas, setMarcas] = useState([]);  
    const [produtoTipo, setProdutoTipo] = useState('');
    const tiposProduto = [
        "Memória", "Processador", "Placa Gráfica", 
        "Motherboard", "Armazenamento", "Fonte de Alimentação", 
        "Caixa", "Monitor", "Periféricos"
    ];
    const [produtoImagem, setProdutoImagem] = useState('');
    const [produtoEspecificacoes, setProdutoEspecificacoes] = useState({});
    const [camposEspecificacoes, setCamposEspecificacoes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [mensagemTipo, setMensagemTipo] = useState('');

    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [jsonEspecificacoesEditado, setJsonEspecificacoesEditado] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);

    const [mostrarModalImagem, setMostrarModalImagem] = useState(false);
    const [imagemUrlEditada, setImagemUrlEditada] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const user = JSON.parse(storedUser);
      if (user.tipo_utilizador === 'admin') {
        setUser(user);
      }
    }
  }, []);

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
                setProdutos(res.data);
            } catch (error) {
                console.error('Erro ao carregar produtos', error);
            }
        };

        fetchCategorias();
        fetchMarcas();
        fetchProdutos();
    }, []);

    // useEffect(() => {
    //     const verificarSku = async () => {
    //         if (!produtoSku.trim()) {
    //             setMensagem('');
    //             return;
    //         }

    //         try {
    //             const res = await axios.get('http://localhost:3001/api/produtos/buscar');
    //             const produtoExistente = res.data.some((produto) => produto.sku === produtoSku);
    //             if (produtoExistente) {
    //                 setMensagem('O SKU já existe. Por favor, escolha outro.');
    //                 setMensagemTipo('error');
    //             } else {
    //                 setMensagem('');
    //             }
    //         } catch (error) {
    //             console.error('Erro ao verificar SKU:', error);
    //             setMensagem('Erro ao verificar SKU.');
    //             setMensagemTipo('error');
    //         }
    //     };

    //     verificarSku();
    // }, [produtoSku]);

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
            const res = await axios.get('http://localhost:3001/api/produtos/buscar');
            const produtoExistente = res.data.some((produto) => produto.sku === produtoSku);
            if (produtoExistente) {
                setMensagem('O SKU já existe. Por favor, escolha outro.');
                setMensagemTipo('error');
                return;
            }

            const formData = new FormData();
            formData.append('sku', produtoSku);
            formData.append('nome', produtoNome);
            formData.append('descricao', produtoDescricao);
            formData.append('preco', produtoPreco);
            formData.append('stock', produtoStock);
            formData.append('id_categoria', produtoCategoria);
            formData.append('id_marca', produtoMarca);
            formData.append('imagem', produtoImagem);
            formData.append("tipo_produto", produtoTipo);
            formData.append('especificacoes', JSON.stringify(produtoEspecificacoes));

            const resAdd = await axios.post('http://localhost:3001/api/produtos/nova', formData);

            if (resAdd.data.success) {
                setMensagem('Produto adicionado com sucesso.');
                setMensagemTipo('success');
                setProdutoSku('');
                setProdutoNome('');
                setProdutoDescricao('');
                setProdutoPreco('');
                setProdutoStock('');
                setProdutoCategoria('');
                setProdutoMarca('');
                setProdutoImagem('');
                setProdutoTipo('');
                setProdutoEspecificacoes({});

                const produtosAtualizados = await axios.get('http://localhost:3001/api/produtos/buscar');
                setProdutos(produtosAtualizados.data);
            } else {
                setMensagem(resAdd.data.message);
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
            const especificacoesAtualizadas = typeof produto.especificacoes === 'string' 
            ? produto.especificacoes 
            : JSON.stringify(produto.especificacoes);

            const res = await axios.put(`http://localhost:3001/api/produtos/atualizar/${produto.id}`, {
                sku: produto.sku,
                nome: produto.nome,
                descricao: produto.descricao,
                preco: produto.preco,
                stock: produto.stock,
                id_categoria: produto.id_categoria,
                id_marca: produto.id_marca,
                imagem_url: produto.imagem_url,
                especificacoes: especificacoesAtualizadas
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
        { field: 'sku', headerName: 'SKU', width: 130, editable: true },
        { field: 'nome', headerName: 'Nome', width: 130, editable: true },
        {
  field: 'imagem_url',
  headerName: 'Imagem',
  width: 200,
  renderCell: (params) => (
    <img
      src={
        params.row.imagem_url
          ? params.row.imagem_url.startsWith('http://') || params.row.imagem_url.startsWith('https://')
            ? params.row.imagem_url
            : `http://localhost:3001${params.row.imagem_url}`
          : ''
      }
      alt="Imagem do produto"
      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
    />
  ),
},
{
  field: 'editarImagem',
  headerName: 'Editar Imagem',
  width: 130,
  renderCell: (params) => (
    <button onClick={() => {
      setProdutoSelecionado(params.row);
      setImagemUrlEditada(params.row.imagem_url);
      setMostrarModalImagem(true);
    }}>
      Editar
    </button>
  )
},
        { field: 'tipo_produto', headerName: 'Tipo de Produto', width: 150 },
        {field: 'especificacoes',
    headerName: 'Especificações',
    width: 300,
    editable: false,
    renderCell: (params) => {
      try {
        const espec = typeof params.value === 'object' ? params.value : JSON.parse(params.value);
        return (
          <div style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>
            {Object.entries(espec).map(([key, val]) => (
              <div key={key}><strong>{key}:</strong> {val}</div>
            ))}
          </div>
        );
      } catch {
        return <div>Sem especificações</div>;
      }
    }
  },
  {
    field: 'editar',
    headerName: 'Editar',
    width: 100,
    renderCell: (params) => (
      <button onClick={() => {
  const atual = typeof params.row.especificacoes === 'object'
    ? params.row.especificacoes
    : JSON.parse(params.row.especificacoes);
  setProdutoSelecionado(params.row);
  setJsonEspecificacoesEditado(JSON.stringify(atual, null, 2));
  setMostrarModal(true);
}}>Editar</button>
    )
  },
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
        { field: 'ações', headerName: 'Ações', width: 250, renderCell: (params) => (
            <>
                <button onClick={() => eliminarProduto(params.row.id)}>Eliminar</button>
                <button onClick={() => atualizarProduto(params.row)}>Atualizar</button>
            </>
        )},
    ];

    useEffect(() => {
        document.body.className = stylesProdutos.bodyHome;
        return () => {
            document.body.className = '';
        };
    }, []);

    const handleTipoProdutoChange = (event) => {
        setProdutoTipo(event.target.value);
        switch (event.target.value) {
          case 'Memória':
            setCamposEspecificacoes([
              { nome: 'Tipo', campo: 'tipo' },
              { nome: 'Capacidade', campo: 'capacidade' },
              { nome: 'Frequência', campo: 'frequencia' },
            ])
            break;
          case 'Placa Gráfica':
            setCamposEspecificacoes([
              { nome: 'Memória', campo: 'memoria' },
              { nome: 'GPU', campo: 'gpu' }
            ])
            break;
            case 'Processador':
      setCamposEspecificacoes([
        { nome: 'Número de Núcleos', campo: 'nucleos' },
        { nome: 'Número de Threads', campo: 'threads' },
        { nome: 'Frequência Base', campo: 'frequencia_base' },
        { nome: 'Frequência Turbo', campo: 'frequencia_turbo' },
        { nome: 'Cache', campo: 'cache' },
      ]);
      break;
    case 'Motherboard':
      setCamposEspecificacoes([
        { nome: 'Socket', campo: 'socket' },
        { nome: 'Chipset', campo: 'chipset' },
        { nome: 'Formato', campo: 'formato' },
        { nome: 'Memória Máxima Suportada', campo: 'memoria_maxima' },
      ]);
      break;
    case 'Armazenamento':
      setCamposEspecificacoes([
        { nome: 'Tipo', campo: 'tipo' },
        { nome: 'Capacidade', campo: 'capacidade' },
        { nome: 'Interface', campo: 'interface' },
        { nome: 'Velocidade de Leitura', campo: 'leitura' },
        { nome: 'Velocidade de Escrita', campo: 'escrita' },
      ]);
      break;
    case 'Fonte de Alimentação':
      setCamposEspecificacoes([
        { nome: 'Potência', campo: 'potencia' },
        { nome: 'Certificação', campo: 'certificacao' },
        { nome: 'Modular', campo: 'modular' },
      ]);
      break;
    case 'Caixa':
      setCamposEspecificacoes([
        { nome: 'Formato', campo: 'formato' },
        { nome: 'Cor', campo: 'cor' },
        { nome: 'Tipo de Painel Lateral', campo: 'painel_lateral' },
      ]);
      break;
    case 'Monitor':
      setCamposEspecificacoes([
        { nome: 'Tamanho', campo: 'tamanho' },
        { nome: 'Resolução', campo: 'resolucao' },
        { nome: 'Taxa de Atualização', campo: 'taxa_atualizacao' },
        { nome: 'Tipo de Painel', campo: 'tipo_painel' },
      ]);
      break;
    case 'Periféricos':
      setCamposEspecificacoes([
        { nome: 'Tipo', campo: 'tipo' },
        { nome: 'Conetividade', campo: 'conetividade' },
        { nome: 'Compatibilidade', campo: 'compatibilidade' },
      ]);
      break;
          default:
            setCamposEspecificacoes([])
        }
    };

    useEffect(() => {
                document.body.className = styles.bodyHomeAdmin;
                return () => {
                    document.body.className = '';
                };
            }, []);

    const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
          document.body.className = styles.bodyHome;
          return () => {
              document.body.className = ''; // Remove ao sair
          };
      }, []);

    return (
        <>
                {mostrarModal && (
  <div className={stylesProdutos.modalOverlay}>
    <div className={stylesProdutos.modalContent}>
      <h3>Editar Especificações (JSON)</h3>
      <textarea
        rows={10}
        cols={50}
        value={jsonEspecificacoesEditado}
        onChange={(e) => setJsonEspecificacoesEditado(e.target.value)}
      />
      <div className={stylesProdutos.modalButtons}>
        <button onClick={() => {
          try {
            const json = JSON.parse(jsonEspecificacoesEditado);
            atualizarProduto({ ...produtoSelecionado, especificacoes: json });
            setMostrarModal(false);
          } catch {
            alert('JSON inválido!');
          }
        }}>Guardar</button>
        <button onClick={() => setMostrarModal(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}

{mostrarModalImagem && (
  <div className={stylesProdutos.modalOverlayImagem}>
    <div className={stylesProdutos.modalContentImagem}>
      <h3>Editar URL da Imagem</h3>
      <input 
        type="text" 
        value={imagemUrlEditada} 
        onChange={(e) => setImagemUrlEditada(e.target.value)} 
        style={{ width: '100%' }}
      />
      <div className={stylesProdutos.modalButtonsImagem}>
        <button onClick={() => {
          if (!imagemUrlEditada.trim()) {
            alert('URL não pode estar vazio!');
            return;
          }
          atualizarProduto({ ...produtoSelecionado, imagem_url: imagemUrlEditada });
          setMostrarModalImagem(false);
        }}>
          Guardar
        </button>
        <button onClick={() => setMostrarModalImagem(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}


            <NavbarAdmin handleLogout={handleLogout} user={user} />

            <div className={stylesProdutos.container}>
                <h1 className={stylesProdutos.titulo}>Adicionar Produto</h1>
                <input
                    type="text"
                    placeholder="SKU do produto"
                    value={produtoSku}
                    onChange={(e) => setProdutoSku(e.target.value)}
                />
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
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProdutoImagem(e.target.files[0])}
                />
                <select value={produtoTipo} onChange={handleTipoProdutoChange}>
                    <option value="">Selecione um tipo de produto</option>
                    {tiposProduto.map((tipo) => (
                        <option key={tipo} value={tipo}>
                            {tipo}
                        </option>
                    ))}
                </select>
                {camposEspecificacoes.map((campo, index) => (
                    <div key={index}>
                        <label>{campo.nome}</label>
                        <input
                            type="text"
                            value={produtoEspecificacoes[campo.campo] || ''}
                            onChange={(e) =>
                                setProdutoEspecificacoes((prev) => ({
                                    ...prev,
                                    [campo.campo]: e.target.value
                                }))
                            }
                        />
                    </div>
                ))}
                <button onClick={adicionarProduto}>Adicionar Produto</button>
                {mensagem && <p className={mensagemTipo}>{mensagem}</p>}
                <br />
                <br />
                <br />
                <br />
                <h2 className={stylesProdutos.titulo}>Lista Produtos</h2>
                <div style={{ height: 800, width: '100%' }}>
                    <DataGrid
                        rows={produtos}
                        columns={colunas}
                        pageSize={5}
                        getRowId={(row) => row.id}
                        getRowHeight={() => 'auto'}
                        rowHeight={null}
                        sx={{
    '& .MuiDataGrid-columnHeaders': {
      '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#1976d2',
        color: '#ffffff',
        fontWeight: 'bold',
      },
    },
  }}
                    />
                </div>
            </div>
        </>
    );
}

export default Produtos
