import React, { createContext, useState, useEffect, use } from "react";

export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState([]);

    useEffect(() => {
        const carrinhoStorage = localStorage.getItem('carrinho');
        if (carrinhoStorage) {
            setCarrinho(JSON.parse(carrinhoStorage));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }, [carrinho]);

    const adicionarAoCarrinho = (produto) => {
        setCarrinho((prevCarrinho) => {
            const produtoExistente = prevCarrinho.find((item) => item.id === produto.id);
            if (produtoExistente) {
                return prevCarrinho.map((item) =>
                    item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
                );
            } else {
                return [...prevCarrinho, { ...produto, quantidade: 1 }];
            }
        });
    };

    const removerDoCarrinho = (produtoID) => {
        setCarrinho((prevCarrinho) => prevCarrinho.filter((item) => item.id !== produtoID));
    };

    return (
        <CarrinhoContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho }}>
            {children}
        </CarrinhoContext.Provider>
    );
}