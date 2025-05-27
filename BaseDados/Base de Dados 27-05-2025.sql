-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sitepap
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS sitepap;
USE sitepap;

--
-- Table structure for table `carrinhos`
--

DROP TABLE IF EXISTS `carrinhos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrinhos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `total` decimal(10,2) DEFAULT '0.00',
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ativo','finalizado','abandonado') DEFAULT 'ativo',
  PRIMARY KEY (`id`),
  KEY `id_utilizador` (`id_utilizador`),
  CONSTRAINT `carrinhos_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrinhos`
--

LOCK TABLES `carrinhos` WRITE;
/*!40000 ALTER TABLE `carrinhos` DISABLE KEYS */;
INSERT INTO `carrinhos` VALUES (1,1,899.99,'2025-05-18 18:39:16','finalizado'),(2,1,499.99,'2025-05-18 18:45:21','finalizado'),(3,1,12839.88,'2025-05-18 18:55:37','finalizado'),(4,1,899.99,'2025-05-19 12:18:49','finalizado'),(5,1,749.99,'2025-05-19 12:19:04','finalizado'),(6,1,899.99,'2025-05-19 12:20:31','finalizado'),(7,1,749.99,'2025-05-19 12:30:15','finalizado'),(8,1,749.99,'2025-05-19 13:32:48','finalizado'),(9,1,749.99,'2025-05-19 15:48:20','finalizado'),(10,1,899.99,'2025-05-19 15:49:12','finalizado'),(12,1,1906.95,'2025-05-21 22:25:42','finalizado'),(14,1,489.98,'2025-05-23 16:33:29','finalizado'),(15,1,306.99,'2025-05-25 16:52:56','finalizado'),(16,1,299.99,'2025-05-25 16:56:51','finalizado'),(17,1,6656.90,'2025-05-25 19:29:34','ativo'),(18,20,920.97,'2025-05-25 19:32:20','finalizado'),(19,20,0.00,'2025-05-25 19:33:00','ativo');
/*!40000 ALTER TABLE `carrinhos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Componentes'),(2,'Periféricos'),(6,'Monitores'),(7,'Armazenamento');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactos`
--

DROP TABLE IF EXISTS `contactos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mensagem` text NOT NULL,
  `data_envio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactos`
--

LOCK TABLES `contactos` WRITE;
/*!40000 ALTER TABLE `contactos` DISABLE KEYS */;
/*!40000 ALTER TABLE `contactos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encomendas`
--

DROP TABLE IF EXISTS `encomendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encomendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `id_carrinho` int NOT NULL,
  `data` datetime DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('pendente','pago','enviado','entregue','cancelado') DEFAULT 'pendente',
  `rua` varchar(100) DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `nif` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_utilizador` (`id_utilizador`),
  KEY `id_carrinho` (`id_carrinho`),
  CONSTRAINT `encomendas_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id`),
  CONSTRAINT `encomendas_ibfk_2` FOREIGN KEY (`id_carrinho`) REFERENCES `carrinhos` (`id`),
  CONSTRAINT `encomendas_chk_1` CHECK (((`codigo_postal` is null) or regexp_like(`codigo_postal`,_utf8mb4'^[0-9]{4}-[0-9]{3}$')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encomendas`
--

LOCK TABLES `encomendas` WRITE;
/*!40000 ALTER TABLE `encomendas` DISABLE KEYS */;
INSERT INTO `encomendas` VALUES (1,1,16,'2025-05-25 16:57:12',299.99,'pago','Rua Amarela 21 4º Esq.','Lisboa','2432-323','Portugal','f************3@gmail.com','999666333','3213123'),(2,20,18,'2025-05-25 19:32:42',920.97,'pago','Rua Amarela 21 4º Esq.','Almada','2432-323','Portugal','f************3@gmail.com','999666333','3213123'),(3,1,17,'2025-05-25 21:48:10',306.99,'pendente','Rua Amarela 21 4º Esq.','Lisboa','2432-323','Portugal','f************3@gmail.com','999666333','3213123');
/*!40000 ALTER TABLE `encomendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_utilizador` int NOT NULL,
  `id_produto` int NOT NULL,
  `data_adicionado` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unq_favorito_utilizador_produto` (`id_utilizador`,`id_produto`),
  KEY `index_favoritos_utilizador` (`id_utilizador`),
  KEY `index_favoritos_produto` (`id_produto`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `utilizadores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (3,1,4,'2025-05-23 00:19:52'),(5,1,3,'2025-05-23 00:19:57'),(7,1,5,'2025-05-23 00:26:37'),(8,1,17,'2025-05-23 16:33:40'),(9,1,10,'2025-05-23 16:33:42'),(10,1,18,'2025-05-23 16:33:45'),(11,1,6,'2025-05-23 16:33:50');
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_carrinhos`
--

DROP TABLE IF EXISTS `items_carrinhos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_carrinhos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_carrinho` int NOT NULL,
  `id_produto` int NOT NULL,
  `quantidade` int NOT NULL DEFAULT '1',
  `preco` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_carrinho` (`id_carrinho`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `items_carrinhos_ibfk_1` FOREIGN KEY (`id_carrinho`) REFERENCES `carrinhos` (`id`),
  CONSTRAINT `items_carrinhos_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_carrinhos`
--

LOCK TABLES `items_carrinhos` WRITE;
/*!40000 ALTER TABLE `items_carrinhos` DISABLE KEYS */;
INSERT INTO `items_carrinhos` VALUES (1,1,2,1,899.99),(2,2,5,1,499.99),(3,3,3,2,2199.99),(4,3,4,2,749.99),(5,3,5,1,499.99),(6,3,2,1,899.99),(7,3,1,1,299.99),(8,3,15,2,269.99),(9,3,14,1,599.99),(10,3,13,1,3599.99),(11,3,6,1,499.99),(12,4,2,1,899.99),(13,5,4,1,749.99),(14,6,3,1,899.99),(15,7,4,1,749.99),(16,8,4,1,749.99),(17,9,4,1,749.99),(19,10,2,1,899.99),(65,12,1,1,299.99),(66,12,8,1,299.99),(67,12,12,1,306.99),(70,12,5,2,499.99),(71,14,10,1,349.99),(72,14,17,1,139.99),(73,15,12,1,306.99),(74,16,8,1,299.99),(75,18,12,3,306.99),(76,17,12,1,306.99),(77,17,6,2,499.99),(78,17,5,1,499.99),(79,17,10,1,349.99),(80,17,3,5,899.99);
/*!40000 ALTER TABLE `items_carrinhos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_encomendas`
--

DROP TABLE IF EXISTS `items_encomendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_encomendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_encomenda` int NOT NULL,
  `id_produto` int NOT NULL,
  `quantidade` int NOT NULL DEFAULT '1',
  `preco_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_encomenda` (`id_encomenda`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `items_encomendas_ibfk_1` FOREIGN KEY (`id_encomenda`) REFERENCES `encomendas` (`id`),
  CONSTRAINT `items_encomendas_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_encomendas`
--

LOCK TABLES `items_encomendas` WRITE;
/*!40000 ALTER TABLE `items_encomendas` DISABLE KEYS */;
INSERT INTO `items_encomendas` VALUES (1,1,8,1,299.99),(2,2,12,3,306.99),(4,3,12,1,306.99);
/*!40000 ALTER TABLE `items_encomendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcas`
--

LOCK TABLES `marcas` WRITE;
/*!40000 ALTER TABLE `marcas` DISABLE KEYS */;
INSERT INTO `marcas` VALUES (1,'AMD'),(2,'Nvidia'),(3,'Intel'),(4,'Corsair'),(5,'NOX'),(8,'Zolyd'),(9,'Lian Li');
/*!40000 ALTER TABLE `marcas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamentos`
--

DROP TABLE IF EXISTS `pagamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_encomenda` int NOT NULL,
  `metodo` enum('mbway','paypal','cartao','referencia','simulado') NOT NULL,
  `estado` enum('pendente','pago','falhado','em_analise','reembolsado','simulado') DEFAULT 'pendente',
  `referencia` varchar(100) DEFAULT NULL,
  `data_pagamento` datetime DEFAULT CURRENT_TIMESTAMP,
  `informacoes_adicionais` text,
  `nome_cartao` varchar(100) DEFAULT NULL,
  `cartao_tipo` enum('visa','mastercard','maestro') DEFAULT NULL,
  `cartao_numero` varchar(16) DEFAULT NULL,
  `cartao_validade` date DEFAULT NULL,
  `cartao_codigo_seguranca` varchar(4) DEFAULT NULL,
  `cartao_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_encomenda` (`id_encomenda`),
  CONSTRAINT `pagamentos_ibfk_1` FOREIGN KEY (`id_encomenda`) REFERENCES `encomendas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamentos`
--

LOCK TABLES `pagamentos` WRITE;
/*!40000 ALTER TABLE `pagamentos` DISABLE KEYS */;
INSERT INTO `pagamentos` VALUES (1,1,'mbway','pago',NULL,'2025-05-25 16:57:17','{\"telefone\":\"963258741\"}',NULL,NULL,NULL,NULL,NULL,NULL),(2,2,'mbway','pago',NULL,'2025-05-25 19:32:55','{\"telefone\":\"984512336\"}',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pagamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sku` varchar(50) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `descricao` varchar(500) DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `id_categoria` int DEFAULT NULL,
  `id_marca` int DEFAULT NULL,
  `imagem_url` varchar(255) DEFAULT NULL,
  `tipo_produto` varchar(100) DEFAULT NULL,
  `especificacoes` json DEFAULT NULL,
  `destaques` tinyint(1) DEFAULT '0',
  `data_registo` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_marca` (`id_marca`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  CONSTRAINT `produtos_ibfk_2` FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'SKU12345','Memória Corsair Vengeance 16GB','Memória RAM Corsair Vengeance LPX DDR4 16GB (2x8GB)',299.99,50,1,1,'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/CMW16GX4M2C3200C16/Gallery/Vengeance_RGB_Pro_01.webp','Memória','{\"tipo\": \"DDR4\", \"tamanho\": \"16GB\", \"latencia\": \"CL16\", \"frequencia\": \"3200MHz\"}',0,'2023-05-18 17:32:39'),(2,'SKU12346','Processador Intel i7-12700K','Processador Intel Core i7-12700K 12 núcleos, 20 threads',899.99,30,1,1,'https://img.pccomponentes.com/articles/57/574294/1716-intel-core-i7-12700kf-50-ghz.jpg','Processador','{\"turbo\": \"5.0GHz\", \"nucleos\": \"12\", \"threads\": \"20\", \"frequencia_base\": \"3.6GHz\"}',0,'2024-05-18 17:32:39'),(3,'SKU12347','Placa Gráfica NVIDIA RTX 3070 Ti','Placa de vídeo NVIDIA GeForce RTX 3070 TI 8GB GDDR6',899.99,15,1,2,'https://imgs.search.brave.com/HDtZbDSHysD5zpQYoglvei9mQDnkuTN-BTGrd4omMHg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzgxODZRKzBFLWZM/LmpwZw','Placa Gráfica','{\"DLSS\": \"Sim\", \"memoria\": \"8GB\", \"ray_tracing\": \"Sim\", \"tipo_memoria\": \"GDDR6\"}',1,'2023-05-18 17:32:39'),(4,'SKU12348','Motherboard ASUS ROG Strix Z690','Motherboard ASUS ROG Strix Z690 com suporte para DDR5 e PCIe 5.0',749.99,25,1,1,'https://imgs.search.brave.com/oALxtQWCOllFkjYf42gNzZsweFgdafAn0QABmdsyot4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzYxZ211UStxYjVM/LmpwZw','Motherboard','{\"pcie\": \"PCIe 5.0\", \"wifi\": \"Wi-Fi 6E\", \"formato\": \"ATX\", \"suporte_ddr\": \"DDR5\"}',0,'2024-05-18 17:32:39'),(5,'SKU12349','SSD Samsung 970 EVO 1TB','SSD Samsung 970 EVO NVMe M.2 1TB',499.99,60,1,1,'https://imgs.search.brave.com/nN7_wdmerJ8kBoIY61z1wCCcMp4PHw7mPRgI8MYfjQI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFaTDlRcG8xLUwu/anBn','Armazenamento','{\"tipo\": \"NVMe\", \"conexao\": \"M.2\", \"leitura\": \"3500MB/s\", \"capacidade\": \"1TB\"}',1,'2025-05-18 17:32:39'),(6,'SKU12350','Fonte Corsair RM850x','Fonte Corsair RM850x 850W, modular',499.99,40,1,1,'https://imgs.search.brave.com/Fxy5rYV_1_AzJbO5wMbkQCKpkyrabSRh6iM3eY_rkI0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF82/NzMxNzctTUxVNzI3/MDAzNTY4MTlfMTEy/MDIzLU8ud2VicA','Fonte de Alimentação','{\"modular\": \"Sim\", \"potencia\": \"850W\", \"certificacao\": \"80+ Gold\"}',0,'2025-05-18 17:32:39'),(7,'SKU12351','Caixa NZXT H510','Caixa de PC NZXT H510, Mid Tower',349.99,35,1,2,'https://img.pccomponentes.com/articles/1080/10803577/140-nzxt-h6-flow-rgb-mid-tower-cristal-templado-usb-c-blanca.jpg','Caixa','{\"tipo\": \"Mid Tower\", \"usb_c\": \"Sim\", \"material\": \"Aço\", \"vidro_temperado\": \"Sim\"}',0,'2025-05-18 17:32:39'),(8,'SKU12352','Monitor MSI 27  G272QPF','MSI G272QPF E2 27 Inch WQHD Gaming Monitor',299.99,9,1,1,'https://imgs.search.brave.com/KS-APAV6Y6DngzJBfXEGJmqvzGQ7mhn1JIzQmt_99ss/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFmVVI4amMxc0wu/anBn','Monitor','{\"HDR\": \"Sim\", \"tamanho\": \"27 polegadas\", \"resolucao\": \"2K\", \"tipo_painel\": \"IPS\", \"taxa_refresco\": \"180Hz\"}',1,'2025-05-18 17:32:39'),(9,'SKU12353','Teclado Logitech G Pro X','Teclado mecânico Logitech G Pro X, RGB, switches removíveis',599.99,100,1,2,'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-tkl/gallery-2-pro-x-tkl-black-lightspeed-gaming-keyboard.png.png?v=1',NULL,'{\"rgb\": \"Sim\", \"tipo_switch\": \"Mecânico\", \"tipos_de_switch\": \"Linear, Táctil, Clicky\", \"switches_removiveis\": \"Sim\"}',0,'2025-05-18 17:32:39'),(10,'SKU12354','Mouse Razer DeathAdder V2','Mouse Razer DeathAdder V2, Sensor óptico 20K DPI',349.99,119,1,1,'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS2YBCB3UyEZ2Re7Q01Zfl3a3w4wEiW1VFjIk5NFIOvexN3AChWj5V-PF1QIH1XawyDkSqfQanye2HEF83BBDfLNIvoKliMxw','Periféricos','{\"dpi\": \"20K\", \"rgb\": \"Sim\", \"botao\": \"8\", \"programaveis\": \"Sim\"}',0,'2025-05-18 17:32:39'),(11,'SKU12355','Memória Kingston HyperX 32GB','Memória RAM Kingston HyperX Fury 32GB (2x16GB) DDR4',529.99,40,1,1,'https://img.pccomponentes.com/articles/43/432765/1892-kingston-fury-beast-rgb-ddr4-3200-mhz-16gb-2x8gb-cl16.jpg','Memória','{\"tipo\": \"DDR4\", \"tamanho\": \"32GB\", \"frequencia\": \"3200MHz\"}',0,'2023-05-18 17:32:39'),(12,'SKU12356','Processador AMD Ryzen 9 5900XT','Processador AMD Ryzen 9 5900XT, 12 núcleos, 24 threads',306.99,16,1,2,'https://m.media-amazon.com/images/I/51cCp1eCm5L._AC_SL1333_.jpg','Processador','{\"turbo\": \"4.8GHz\", \"nucleos\": \"12\", \"threads\": \"24\", \"frequencia_base\": \"3.7GHz\"}',1,'2023-05-18 17:32:39'),(13,'SKU12357','Placa Gráfica AMD RX 9070 XT','Placa de vídeo AMD Radeon RX 9070 XT, 16GB GDDR6',999.99,8,1,2,'https://img.pccomponentes.com/articles/1086/10867516/1527-gigabyte-amd-radeon-rx-9070-xt-gaming-oc-16gb-gddr6.jpg','Placa Gráfica','{\"memoria\": \"16GB\", \"suporte_4K\": \"Sim\", \"ray_tracing\": \"Sim\", \"tipo_memoria\": \"GDDR6\"}',1,'2025-05-18 17:32:39'),(14,'SKU12358','Motherboard MSI MAG B850 EDGE','Motherboard MSI MAG B550 EDGE ATX',999.99,50,1,2,'https://m.media-amazon.com/images/I/81EgTNUMGlL._SL1500_.jpg','Motherboard','{\"pcie\": \"PCIe 4.0\", \"wifi\": \"Wi-Fi 7\", \"formato\": \"ATX\", \"suporte_ddr\": \"DDR5\"}',0,'2025-05-18 17:32:39'),(15,'SKU12359','HD Seagate Barracuda 2TB','Disco rígido Seagate Barracuda 2TB 7200RPM',269.99,80,1,2,'https://www.mhr.pt/files/products/207107_0.jpg','Armazenamento','{\"rpm\": \"7200RPM\", \"conexao\": \"SATA 3\", \"capacidade\": \"2TB\"}',0,'2025-03-11 17:32:39'),(16,'SKU12360','Fonte de Alimentação ATX Lian Li 1300W Platinum','Fonte de Alimentação ATX Lian Li Edge 1300W ATX 3.1/PCIe 5.1 80 Plus Platinum Full Modular Branca',259.99,55,1,1,'https://www.worten.pt/i/140e7ccd5a1eda0b4ba6eabf7ab6114653cb1733','Fonte de Alimentação','{\"modular\": \"Sim\", \"potencia\": \"1300W\", \"certificacao\": \"80+ Plat\"}',0,'2025-05-18 17:32:39'),(17,'SKU12361','Caixa ATX MSI MAG Pano','Caixa ATX MSI MAG Pano 100R PZ ARGB Tempered Glass Branca',139.99,29,1,2,'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT_NBSJg2ywRPM73pCpwprLurNW3dOm493B8BpPTXRUYBoCQQlcIMX_PDZFaBio39prWN8lo7J_38QYz5yvdiDEFuhiv1rFTlJHDE4SaJcOWLyvt2KqJ0v4kA','Caixa','{\"tipo\": \"Mini Tower\", \"fluxo_Ar\": \"Otimizado\", \"design_modular\": \"Sim\"}',0,'2025-05-18 17:32:39'),(18,'SKU12362','Monitor ASUS TUF Gaming 27 165Hz','Monitor Asus TUF Gaming VG27UQ1A IPS 27\" 4K UHD 16:9 160Hz FreeSync Premium / G-SYNC Compatible',399.99,45,1,2,'https://m.media-amazon.com/images/I/71ifg9fVjQL._AC_SX679_.jpg','Monitor','{\"tamanho\": \"27 polegadas\", \"resolucao\": \"Full UHD\", \"taxa_refresco\": \"165Hz\", \"tempo_resposta\": \"1ms\"}',0,'2025-05-18 17:32:39'),(19,'SKU12363','Teclado Corsair K95 RGB','Teclado mecânico Corsair K95 RGB, switches Cherry MX',1299.99,25,1,1,'https://m.media-amazon.com/images/I/71+t3yIyoOL._AC_SL1500_.jpg','Periféricos','{\"rgb\": \"Sim\", \"tipo_switch\": \"Cherry MX\", \"programaveis\": \"Sim\", \"teclas_macro\": \"6\"}',0,'2025-01-12 17:32:39'),(20,'SKU12364','Mouse Logitech G502 Hero','Mouse Logitech G502 Hero, Sensor de 16K DPI',389.99,150,1,1,'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg','Periféricos','{\"dpi\": \"16K\", \"rgb\": \"Sim\", \"botao\": \"11\", \"programaveis\": \"Sim\"}',0,'2024-01-28 17:32:39'),(21,'SKU123123','Processador Intel I9-12900K','Processador Intel I9-12900K',499.99,50,1,1,NULL,'Processador','{\"nucleos\": \"20\", \"threads\": \"26\", \"frequencia_base\": \"2.85GHz\"}',0,'2025-05-26 08:12:48');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilizadores`
--

DROP TABLE IF EXISTS `utilizadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilizadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `primeiro_nome` varchar(50) NOT NULL,
  `ultimo_nome` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `data_registo` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo_utilizador` enum('cliente','admin') DEFAULT 'cliente',
  `rua` varchar(100) DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `data_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `utilizadores_chk_1` CHECK (((`codigo_postal` is null) or regexp_like(`codigo_postal`,_utf8mb4'^[0-9]{4}-[0-9]{3}$')))
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizadores`
--

LOCK TABLES `utilizadores` WRITE;
/*!40000 ALTER TABLE `utilizadores` DISABLE KEYS */;
INSERT INTO `utilizadores` VALUES (1,'Manuel','Testado','teste@teste.com','$2b$10$sTyf7hX7pLi/D5o.T0xFEulhv9k2P1BgJhGShYsZsk3LxKN3kHaF2','999999999','2025-05-12 23:03:49','cliente','Rua Amarela 21 4º Esq.','Seixal','5555-555','Portugal','2025-05-26 17:44:58'),(14,'Rui','Manuel','manu@pcg.pt','$2b$10$ezHd5r3.qFzqXFnofIS8cemJQLjLDUl1at5p8g62FFQV53StlpO..','999888777','2025-05-16 08:07:50','admin','Rua Antônio','Lisboa','5555-888','Portugal','2025-05-16 08:07:50'),(15,'Carlos','Fernandes','carlosfernandes@pcg.pt','$2b$10$Guc.XFsaLe3LqQXCmtFWYu3SMaVjdlu8K0XjeLuIJss7HxP5KmVhG','775588774','2025-05-16 20:13:33','admin','Rua Antônio Sacramento','Seixal','2844-555','Portugal','2025-05-16 20:13:33'),(16,'Antônio','Manuel','antoniomanuel@pcg.pt','$2b$10$X3PiNkmbecgYlY7g/J6mv.0syvBX8q6/hjgjyRAzUkLYVFQQdbCHW','998877582','2025-05-16 20:19:10','admin','Rua do Carmo','Lisboa','8745-698','Portugal','2025-05-16 20:19:10'),(18,'Admin','Admin','admin@admin.com','$2b$10$6y.wV3rEeb9IilLz5Q8wgeAvyC/drgJIRIMbLlLiqOZiXxpbLvl8W','','2025-05-23 13:53:29','admin','','','2995-058','','2025-05-23 13:53:29'),(20,'Carlos','Antônio','carlosantonio@gmail.com','$2b$10$NNQcAavoYj8GDSwlNO.0suwX47w9s2HJSJ.fo7GN8cQznHCJzCJ5C',NULL,'2025-05-25 19:31:52','cliente',NULL,NULL,NULL,NULL,'2025-05-25 19:31:52'),(21,'Miguel','Manuel','miguel@pcg.pt','$2b$10$X4PyXnHs5qW9GW7ZKWQfE.aehJ7/GCNcv8M6Z7gQbf9B7L2.2..Je','987456321','2025-05-26 07:50:38','admin','Rua dos Antônios','Lisboa','7777-998','Portugal','2025-05-26 07:50:38');
/*!40000 ALTER TABLE `utilizadores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-27 11:19:16
