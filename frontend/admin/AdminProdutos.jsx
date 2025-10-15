import { useState, useEffect } from "react";
import axios from "axios";
import ModalGlobal from "../componentes/ModalGlobal";
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
    const [produtos, setProdutos] = useState(
        Array.isArray(JSON.parse(localStorage.getItem('produtosCache'))) 
            ? JSON.parse(localStorage.getItem('produtosCache')) 
            : []
    );
    const [mensagem, setMensagem] = useState('');
    const [mensagemTipo, setMensagemTipo] = useState('');

    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [jsonEspecificacoesEditado, setJsonEspecificacoesEditado] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editarModal, setEditarModal] = useState(false);

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

    useEffect(() => {
        const verificarSku = async () => {
            if (!produtoSku.trim()) {
                setMensagem('');
                return;
            }

            try {
                const res = await axios.get('http://localhost:3001/api/produtos/buscar');
                const produtoExistente = res.data.some((produto) => produto.sku === produtoSku);
                if (produtoExistente) {
                    setMensagem('O SKU já existe. Por favor, escolha outro.');
                    setMensagemTipo('error');
                    setMostrarModal(true);
                    return;
                } else {
                    setMensagem('');
                }
            } catch (error) {
                console.error('Erro ao verificar SKU:', error);
                setMensagem('Erro ao verificar SKU.');
                setMensagemTipo('error');
            }
        };

        verificarSku();
    }, [produtoSku]);

    function normalizarEspacos(str) {
        return str
            .trim()
            .replace(/\s+/g, ' ');
    }

    const adicionarProduto = async () => {
        const produtoNomeFormatado = normalizarEspacos(produtoNome);
        const produtoDescricaoFormatada = normalizarEspacos(produtoDescricao);

        if (!produtoNomeFormatado) {
            setMensagem('O nome do produto é obrigatório.');
            setMensagemTipo('error');
            setMostrarModal(true);
            return;
        }

        setProdutos(produtoNomeFormatado);

        const skuFormatado = produtoSku.toUpperCase();
        if (!/^SKU\d{4,16}$/.test(skuFormatado)) {
            setMensagem('O SKU deve começar com "SKU" em maiúsculas e conter 4 a 16 dígitos.');
            setMensagemTipo('error');
            setMostrarModal(true);
            return;
        }

        if (!produtoPreco) {
            setMensagem('O preço do produto é obrigatório.');
            setMensagemTipo('error');
            setMostrarModal(true);
            return;
        }

        if (!produtoStock) {
            setMensagem('O stock do produto é obrigatório.');
            setMensagemTipo('error');
            setMostrarModal(true);
            return;
        }

        if (!produtoCategoria) {
            setMensagem('A categoria do produto é obrigatória.');
            setMensagemTipo('error');
            setMostrarModal(true);
            return;
        }

        if (!produtoMarca) {
            setMensagem('A marca do produto é obrigatória.');
            setMensagemTipo('error');
            setMostrarModal(true);
            return;
        }

        try {
            const res = await axios.get('http://localhost:3001/api/produtos/buscar');
            const produtoExistente = res.data.some((produto) => produto.sku === produtoSku);
            if (produtoExistente) {
                setMensagem('O SKU já existe. Por favor, escolha outro.');
                setMensagemTipo('error');
                setMostrarModal(true);
                return;
            }

            const formData = new FormData();
            formData.append('sku', produtoSku);
            formData.append('nome', produtoNomeFormatado);
            formData.append('descricao', produtoDescricaoFormatada);
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
                setMostrarModal(true);
            } else {
                setMensagem(resAdd.data.message);
                setMensagemTipo('error');
                setMostrarModal(true);
            }
        } catch (error) {
            console.error(error);
            setMensagem('Erro ao comunicar com o servidor.');
            setMensagemTipo('error');
        }
    }

    const atualizarProduto = async (produto) => {
        const nome_normalizado = normalizarEspacos(produto.nome);
        const descricao_normalizada = normalizarEspacos(produto.descricao);

        try {
            const especificacoesAtualizadas = typeof produto.especificacoes === 'string'
                ? produto.especificacoes
                : JSON.stringify(produto.especificacoes);

            const res = await axios.put(`http://localhost:3001/api/produtos/atualizar/${produto.id}`, {
                sku: produto.sku,
                nome: nome_normalizado,
                descricao: descricao_normalizada,
                preco: produto.preco,
                stock: produto.stock,
                id_categoria: produto.id_categoria,
                id_marca: produto.id_marca,
                imagem_url: produto.imagem_url,
                tipo_produto: produto.tipo_produto,
                especificacoes: especificacoesAtualizadas
            });

            if (res.data.success) {
                setProdutos(produtos.map(p => p.id === produto.id ? { ...p, ...produto } : p));
                setMensagem('Produto atualizado com sucesso.');
                setMensagemTipo('success');
                setMostrarModal(true);
            } else {
                setMensagem('Erro ao atualizar o produto.');
                setMensagemTipo('error');
                setMostrarModal(true);
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
                setMostrarModal(true);
            } else {
                setMensagem('Erro ao eliminar produto.');
                setMensagemTipo('error');
                setMostrarModal(true);
            }
        } catch (error) {
            console.error('Erro na requisição Axios:', error);
            setMensagem('Erro ao comunicar com o servidor.');
            setMensagemTipo('error');
        }
    };

    const colunas = [
        { field: 'id', headerName: 'ID', width: 70, flex: 1 },
        { field: 'sku', headerName: 'SKU', width: 130, editable: true, flex: 1 },
        { field: 'nome', headerName: 'Nome', width: 130, editable: true, flex: 1 },
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
            flex: 2,
            renderCell: (params) => (
                <button onClick={() => {
                    setProdutoSelecionado(params.row);
                    setImagemUrlEditada(params.row.imagem_url);
                    setMostrarModalImagem(true);
                }}>
                    Editar
                </button>
            ),
        },
        {
            field: 'tipo_produto',
            headerName: 'Tipo de Produto',
            width: 150,
            flex: 1,
            editable: true,
            renderEditCell: (params) => {
                const handleChange = (event) => {
                    const newValue = event.target.value;
                    params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue });
                };

                return (
                    <select
                        value={params.value || ''}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    >
                        <option value="">Selecione um tipo</option>
                        {tiposProduto.map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                );
            },
        },
        {
            field: 'especificacoes',
            headerName: 'Especificações',
            width: 300,
            flex: 1,
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
            },
        },
        {
            field: 'editar',
            headerName: 'Editar',
            width: 100,
            flex: 1,
            renderCell: (params) => (
                <button onClick={() => {
                    const atual = typeof params.row.especificacoes === 'object'
                        ? params.row.especificacoes
                        : JSON.parse(params.row.especificacoes);
                    setProdutoSelecionado(params.row);
                    setJsonEspecificacoesEditado(JSON.stringify(atual, null, 2));
                    setEditarModal(true);
                }}>Editar</button>
            ),
        },
        { field: 'descricao', headerName: 'Descrição', width: 130, flex: 1, editable: true },
        { field: 'preco', headerName: 'Preço', width: 130, flex: 1, editable: true },
        { field: 'stock', headerName: 'Stock', width: 130, flex: 1, editable: true },
        {
            field: 'id_categoria',
            headerName: 'Categoria',
            width: 130,
            flex: 1,
            editable: true,
            renderCell: (params) => {
                const categoria = categorias.find(cat => cat.id === params.row.id_categoria);
                return categoria ? categoria.nome : '';
            },
        },
        {
            field: 'id_marca',
            headerName: 'Marca',
            width: 130,
            flex: 1,
            editable: true,
            renderCell: (params) => {
                const marca = marcas.find(marca => marca.id === params.row.id_marca);
                return marca ? marca.nome : '';
            },
        },
        {
            field: 'ações',
            headerName: 'Ações',
            width: 250,
            flex: 2,
            renderCell: (params) => (
                <>
                    <button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => eliminarProduto(params.row.id)}>Eliminar</button>
                    <button onClick={() => atualizarProduto(params.row)}>Atualizar</button>
                </>
            ),
        },
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

    const closeModal = () => {
        setMostrarModal(false);
    };

    return (
        <>
            {mostrarModal && (
                <ModalGlobal mensagem={mensagem} onClose={closeModal} />
            )}

            {editarModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Editar Especificações (JSON)</h3>
                        <textarea
                            rows={10}
                            cols={50}
                            value={jsonEspecificacoesEditado}
                            onChange={(e) => setJsonEspecificacoesEditado(e.target.value)}
                        />
                        <div className={styles.modalButtons}>
                            <button onClick={() => {
                                try {
                                    const json = JSON.parse(jsonEspecificacoesEditado);
                                    atualizarProduto({ ...produtoSelecionado, especificacoes: json });
                                    setEditarModal(false);
                                } catch {
                                    alert('JSON inválido!');
                                }
                            }}>Guardar</button>
                            <button onClick={() => setEditarModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {mostrarModalImagem && (
                <div className={stylesProdutos.modalOverlayImagem}>
                    <div className={stylesProdutos.modalContentImagem}>
                        <h3>Alterar Imagem do Produto</h3>
                        <div className={stylesProdutos.fileUpload} style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="file"
                                id="editarImagemProduto"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setImagemUrlEditada(URL.createObjectURL(file));
                                    }
                                }}
                                className={stylesProdutos.fileInput}
                            />
                            <label htmlFor="editarImagemProduto" className={stylesProdutos.fileLabel}>
                                {imagemUrlEditada ? 'Alterar ficheiro...' : 'Selecionar ficheiro...'}
                            </label>
                        </div>
                        {imagemUrlEditada && (
                            <div className={stylesProdutos.imagePreview} style={{ margin: '0 auto' }}>
                                <img 
                                    src={imagemUrlEditada} 
                                    alt="Pré-visualização" 
                                    className={stylesProdutos.previewImage}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </div>
                        )}
                        <div className={stylesProdutos.modalButtonsImagem}>
                            <button onClick={() => {
                                if (!imagemUrlEditada) {
                                    alert('Por favor, selecione uma imagem!');
                                    return;
                                }
                                atualizarProduto({ 
                                    ...produtoSelecionado, 
                                    imagem_url: imagemUrlEditada 
                                });
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

            <div className={stylesProdutos.containerForm}>
                <h1 className={stylesProdutos.titulo}>Adicionar Produto</h1>
                <div className={stylesProdutos.formGrid}>
                    <div className={stylesProdutos.formGroup}>
                        <label>SKU do produto</label>
                        <input
                            type="text"
                            value={produtoSku}
                            onChange={(e) => setProdutoSku(e.target.value)}
                            className={stylesProdutos.inputField}
                        />
                    </div>
                    
                    <div className={stylesProdutos.formGroup}>
                        <label>Nome do produto</label>
                        <input
                            type="text"
                            value={produtoNome}
                            onChange={(e) => setProdutoNome(e.target.value)}
                            className={stylesProdutos.inputField}
                        />
                    </div>

                    <div className={stylesProdutos.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label>Descrição do produto</label>
                        <textarea
                            value={produtoDescricao}
                            onChange={(e) => setProdutoDescricao(e.target.value)}
                            className={stylesProdutos.textareaField}
                            rows="3"
                        />
                    </div>

                    <div className={stylesProdutos.formGroup}>
                        <label>Preço (€)</label>
                        <input
                            type="number"
                            value={produtoPreco}
                            onChange={(e) => setProdutoPreco(e.target.value)}
                            className={stylesProdutos.inputField}
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className={stylesProdutos.formGroup}>
                        <label>Stock</label>
                        <input
                            type="number"
                            value={produtoStock}
                            onChange={(e) => setProdutoStock(e.target.value)}
                            className={stylesProdutos.inputField}
                            min="0"
                        />
                    </div>

                    <div className={stylesProdutos.formGroup}>
                        <label>Categoria</label>
                        <select 
                            value={produtoCategoria} 
                            onChange={(e) => setProdutoCategoria(e.target.value)}
                            className={stylesProdutos.selectField}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={stylesProdutos.formGroup}>
                        <label>Marca</label>
                        <select 
                            value={produtoMarca} 
                            onChange={(e) => setProdutoMarca(e.target.value)}
                            className={stylesProdutos.selectField}
                        >
                            <option value="">Selecione uma marca</option>
                            {marcas.map((marca) => (
                                <option key={marca.id} value={marca.id}>
                                    {marca.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={stylesProdutos.formGroup}>
                        <label>Tipo de Produto</label>
                        <select 
                            value={produtoTipo} 
                            onChange={handleTipoProdutoChange}
                            className={stylesProdutos.selectField}
                        >
                            <option value="">Selecione um tipo</option>
                            {tiposProduto.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={stylesProdutos.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label>Imagem do Produto</label>
                        <div className={stylesProdutos.fileUpload}>
                            <input
                                type="file"
                                id="imagemProduto"
                                accept="image/*"
                                onChange={(e) => setProdutoImagem(e.target.files[0])}
                                className={stylesProdutos.fileInput}
                            />
                            <label htmlFor="imagemProduto" className={stylesProdutos.fileLabel}>
                                {produtoImagem ? produtoImagem.name : 'Escolher ficheiro...'}
                            </label>
                        </div>
                        {produtoImagem && (
                            <div className={stylesProdutos.imagePreview}>
                                <img 
                                    src={URL.createObjectURL(produtoImagem)} 
                                    alt="Pré-visualização" 
                                    className={stylesProdutos.previewImage}
                                />
                            </div>
                        )}
                    </div>

                    {camposEspecificacoes.length > 0 && (
                        <div className={stylesProdutos.specsSection} style={{ gridColumn: '1 / -1' }}>
                            <h3>Especificações do Produto</h3>
                            <div className={stylesProdutos.specsGrid}>
                                {camposEspecificacoes.map((campo, index) => (
                                    <div key={index} className={stylesProdutos.formGroup}>
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
                                            className={stylesProdutos.inputField}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={stylesProdutos.formGroup} style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
                        <button 
                            onClick={adicionarProduto} 
                            className={stylesProdutos.submitButton}
                        >
                            Adicionar Produto
                        </button>
                    </div>
                </div>
            </div>

            <div className={stylesProdutos.container}>
                <div className={stylesProdutos.tableHeader}>
                    <h2 className={stylesProdutos.titulo}>Lista de Produtos</h2>
                    <div className={stylesProdutos.tableActions}>
                        <span className={stylesProdutos.productCount}>
                            {Array.isArray(produtos) ? (
                                <>{produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} encontrados</>
                            ) : 'Carregando produtos...'}
                        </span>
                    </div>
                </div>
                <div className={stylesProdutos.tableContainer}>
                    <DataGrid
                        rows={Array.isArray(produtos) ? produtos.map((produto, index) => ({
                            ...produto,
                            // Ensure every row has a unique ID
                            id: produto.id || `temp-${index}`
                        })) : []}
                        columns={colunas}
                        pageSize={10}
                        getRowId={(row) => row.id}
                        disableSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f5f7fa',
                                '& .MuiDataGrid-columnHeader': {
                                    backgroundColor: '#f5f7fa',
                                    color: '#2d3748',
                                    fontWeight: '600',
                                    fontSize: '0.875rem'
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default Produtos
