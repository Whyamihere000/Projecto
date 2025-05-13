--DROP DATABASE IF EXISTS SitePAP;

CREATE DATABASE IF NOT EXISTS SitePAP;
USE SitePAP;

-- Tabela de utilizadores
CREATE TABLE `utilizadores` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `primeiro_nome` VARCHAR(50) NOT NULL,
  `ultimo_nome` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(20),
  `data_registo` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `tipo_utilizador` ENUM('cliente', 'admin') DEFAULT 'cliente',
  `rua` VARCHAR(100),
  `cidade` VARCHAR(50),
  `codigo_postal` VARCHAR(20),
  `pais` VARCHAR(50),
  CHECK (`codigo_postal` IS NULL OR `codigo_postal` REGEXP '^[0-9]{4}-[0-9]{3}$')
);

-- Tabela de categorias de produtos
CREATE TABLE `categorias` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL
);

-- Tabela de marcas
CREATE TABLE `marcas` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL
);

-- Tabela de produtos
CREATE TABLE `produtos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `sku` VARCHAR(50) UNIQUE NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `descricao` VARCHAR(500),
  `preco` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `id_categoria` INT NULL,
  `id_marca` INT NULL,
  `imagem_url` VARCHAR(255),
  `especificacoes` JSON,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id`) ON DELETE SET NULL
);

-- Tabela de carrinhos de compras
CREATE TABLE `carrinhos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `id_utilizador` INT NOT NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` ENUM('ativo', 'finalizado', 'abandonado') DEFAULT 'ativo',
  FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id`)
);

-- Itens de cada carrinho (produto + quantidade)
CREATE TABLE `items_carrinhos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `id_carrinho` INT NOT NULL,
  `id_produto` INT NOT NULL,
  `quantidade` INT NOT NULL DEFAULT 1,
  FOREIGN KEY (`id_carrinho`) REFERENCES `carrinhos` (`id`),
  FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id`)
);

-- Tabela de encomendas
CREATE TABLE `encomendas` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `id_utilizador` INT NOT NULL,
  `data` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `total` DECIMAL(10,2) NOT NULL,
  `estado` ENUM('pendente', 'pago', 'enviado', 'entregue', 'cancelado') DEFAULT 'pendente',
  FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id`)
);

-- Itens de cada encomenda
CREATE TABLE `items_encomendas` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `id_encomenda` INT NOT NULL,
  `id_produto` INT NOT NULL,
  `quantidade` INT NOT NULL DEFAULT 1,
  `preco_unitario` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`id_encomenda`) REFERENCES `encomendas` (`id`),
  FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id`)
);

-- Tabela de pagamentos (com melhorias para simulação)
CREATE TABLE `pagamentos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `id_encomenda` INT NOT NULL,
  `metodo` ENUM('mbway', 'paypal', 'cartao', 'referencia', 'simulado') NOT NULL,
  `estado` ENUM('pendente', 'pago', 'falhado', 'em_analise', 'reembolsado', 'simulado') DEFAULT 'pendente',
  `referencia` VARCHAR(100),
  `data_pagamento` DATETIME,
  `informacoes_adicionais` TEXT,

  `nome_cartao` VARCHAR(100),
  `cartao_tipo` ENUM('visa', 'mastercard', 'maestro') DEFAULT NULL,
  `cartao_numero` VARCHAR(16),
  `cartao_validade` DATE,
  `cartao_codigo_seguranca` VARCHAR(4),
  `cartao_token` VARCHAR(255),

  FOREIGN KEY (`id_encomenda`) REFERENCES `encomendas` (`id`)
);



-- Índices adicionais para performance
CREATE INDEX `index_produtos_categoria` ON `produtos` (`id_categoria`);
CREATE INDEX `index_produtos_marca` ON `produtos` (`id_marca`);
CREATE INDEX `index_carrinhos_utilizador` ON `carrinhos` (`id_utilizador`);
CREATE INDEX `index_items_carrinhos_carrinhos` ON `items_carrinhos` (`id_carrinho`);
CREATE INDEX `index_items_carrinhos_produtos` ON `items_carrinhos` (`id_produto`);
CREATE INDEX `index_encomendas_utilizador` ON `encomendas` (`id_utilizador`);
CREATE INDEX `index_items_encomendas_encomenda` ON `items_encomendas` (`id_encomenda`);
CREATE INDEX `index_items_encomendas_produto` ON `items_encomendas` (`id_produto`);
