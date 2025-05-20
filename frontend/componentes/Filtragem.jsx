import { useState, useEffect } from "react";

function FiltrosProdutos({ filtros, setFiltros }) {
  const [marcas, setMarcas] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  // Carregar marcas ao montar o componente
  useEffect(() => {
    const buscarMarca = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/marcas/buscar");
        const marcasData = await response.json();
        setMarcas(marcasData);
      } catch (error) {
        console.error("Erro ao buscar marcas:", error);
      }
    };

    buscarMarca();
  }, []);

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", marginBottom: "1rem" }}>
      <h3>Filtrar Produtos</h3>

      <div>
        <label>Marca:</label>
        <select name="marca" value={filtros.marca} onChange={handleChange}>
          <option value="">Todas</option>
          {marcas.map((marca) => (
            <option key={marca.id} value={marca.nome}>
              {marca.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Preço Máximo:</label>
        <input
          type="number"
          name="precoMax"
          value={filtros.precoMax}
          onChange={handleChange}
          placeholder="€"
        />
      </div>

      {/* Podes adicionar mais filtros aqui */}
    </div>
  );
}

export default FiltrosProdutos;
