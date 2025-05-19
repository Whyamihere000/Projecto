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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrinhos`
--

LOCK TABLES `carrinhos` WRITE;
/*!40000 ALTER TABLE `carrinhos` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Componentes'),(2,'Periféricos');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encomendas`
--

LOCK TABLES `encomendas` WRITE;
/*!40000 ALTER TABLE `encomendas` DISABLE KEYS */;
/*!40000 ALTER TABLE `encomendas` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_carrinhos`
--

LOCK TABLES `items_carrinhos` WRITE;
/*!40000 ALTER TABLE `items_carrinhos` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_encomendas`
--

LOCK TABLES `items_encomendas` WRITE;
/*!40000 ALTER TABLE `items_encomendas` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcas`
--

LOCK TABLES `marcas` WRITE;
/*!40000 ALTER TABLE `marcas` DISABLE KEYS */;
INSERT INTO `marcas` VALUES (1,'AMD'),(2,'Nvidia');
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
  `data_pagamento` datetime DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamentos`
--

LOCK TABLES `pagamentos` WRITE;
/*!40000 ALTER TABLE `pagamentos` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'SKU12345','Memória Corsair Vengeance 16GB','Memória RAM Corsair Vengeance LPX DDR4 16GB (2x8GB)',299.99,50,1,1,'url_imagem_1.jpg','Memória','{\"tipo\": \"DDR4\", \"tamanho\": \"16GB\", \"latencia\": \"CL16\", \"frequencia\": \"3200MHz\"}',0,'2025-05-18 17:32:39'),(2,'SKU12346','Processador Intel i7-12700K','Processador Intel Core i7-12700K 12 núcleos, 20 threads',899.99,30,1,1,'url_imagem_2.jpg','Processador','{\"turbo\": \"5.0GHz\", \"nucleos\": \"12\", \"threads\": \"20\", \"frequencia_base\": \"3.6GHz\"}',0,'2025-05-18 17:32:39'),(3,'SKU12347','Placa Gráfica NVIDIA RTX 3070','Placa de vídeo NVIDIA GeForce RTX 3070 8GB GDDR6',2199.99,15,1,1,'url_imagem_3.jpg','Placa Gráfica','{\"DLSS\": \"Sim\", \"memoria\": \"8GB\", \"ray_tracing\": \"Sim\", \"tipo_memoria\": \"GDDR6\"}',1,'2025-05-18 17:32:39'),(4,'SKU12348','Motherboard ASUS ROG Strix Z690','Motherboard ASUS ROG Strix Z690 com suporte para DDR5 e PCIe 5.0',749.99,25,1,1,'url_imagem_4.jpg','Motherboard','{\"pcie\": \"PCIe 5.0\", \"wifi\": \"Wi-Fi 6E\", \"formato\": \"ATX\", \"suporte_ddr\": \"DDR5\"}',0,'2025-05-18 17:32:39'),(5,'SKU12349','SSD Samsung 970 EVO 1TB','SSD Samsung 970 EVO NVMe M.2 1TB',499.99,60,1,1,'url_imagem_5.jpg','Armazenamento','{\"tipo\": \"NVMe\", \"conexao\": \"M.2\", \"leitura\": \"3500MB/s\", \"capacidade\": \"1TB\"}',0,'2025-05-18 17:32:39'),(6,'SKU12350','Fonte Corsair RM850x','Fonte Corsair RM850x 850W, modular',499.99,40,1,1,'url_imagem_6.jpg','Fonte de Alimentação','{\"modular\": \"Sim\", \"potencia\": \"850W\", \"certificacao\": \"80+ Gold\"}',0,'2025-05-18 17:32:39'),(7,'SKU12351','Caixa NZXT H510','Caixa de PC NZXT H510, Mid Tower',349.99,35,1,1,'url_imagem_7.jpg','Caixa','{\"tipo\": \"Mid Tower\", \"usb_c\": \"Sim\", \"material\": \"Aço\", \"vidro_temperado\": \"Sim\"}',0,'2025-05-18 17:32:39'),(8,'SKU12352','Monitor Dell 27 UltraSharp','Monitor Dell 27\" UltraSharp U2720Q, 4K',1799.99,10,1,1,'url_imagem_8.jpg','Monitor','{\"HDR\": \"Sim\", \"tamanho\": \"27 polegadas\", \"resolucao\": \"4K\", \"tipo_painel\": \"IPS\", \"taxa_refresco\": \"60Hz\"}',1,'2025-05-18 17:32:39'),(9,'SKU12353','Teclado Logitech G Pro X','Teclado mecânico Logitech G Pro X, RGB, switches removíveis',599.99,100,1,1,'url_imagem_9.jpg','Periféricos','{\"rgb\": \"Sim\", \"tipo_switch\": \"Mecânico\", \"tipos_de_switch\": \"Linear, Táctil, Clicky\", \"switches_removiveis\": \"Sim\"}',0,'2025-05-18 17:32:39'),(10,'SKU12354','Mouse Razer DeathAdder V2','Mouse Razer DeathAdder V2, Sensor óptico 20K DPI',349.99,120,1,1,'url_imagem_10.jpg','Periféricos','{\"dpi\": \"20K\", \"rgb\": \"Sim\", \"botao\": \"8\", \"programaveis\": \"Sim\"}',0,'2025-05-18 17:32:39'),(11,'SKU12355','Memória Kingston HyperX 32GB','Memória RAM Kingston HyperX Fury 32GB (2x16GB) DDR4',529.99,40,1,1,'url_imagem_11.jpg','Memória','{\"tipo\": \"DDR4\", \"tamanho\": \"32GB\", \"frequencia\": \"3200MHz\"}',0,'2025-05-18 17:32:39'),(12,'SKU12356','Processador AMD Ryzen 9 5900X','Processador AMD Ryzen 9 5900X, 12 núcleos, 24 threads',1999.99,20,1,1,'url_imagem_12.jpg','Processador','{\"turbo\": \"4.8GHz\", \"nucleos\": \"12\", \"threads\": \"24\", \"frequencia_base\": \"3.7GHz\"}',1,'2025-05-18 17:32:39'),(13,'SKU12357','Placa Gráfica AMD RX 6800 XT','Placa de vídeo AMD Radeon RX 6800 XT, 16GB GDDR6',3599.99,8,1,1,'url_imagem_13.jpg','Placa Gráfica','{\"memoria\": \"16GB\", \"suporte_4K\": \"Sim\", \"ray_tracing\": \"Sim\", \"tipo_memoria\": \"GDDR6\"}',0,'2025-05-18 17:32:39'),(14,'SKU12358','Motherboard MSI MAG B550 TOMAHAWK','Motherboard MSI MAG B550 TOMAHAWK ATX',599.99,50,1,1,'url_imagem_14.jpg','Motherboard','{\"pcie\": \"PCIe 4.0\", \"wifi\": \"Wi-Fi 6\", \"formato\": \"ATX\", \"suporte_ddr\": \"DDR4\"}',0,'2025-05-18 17:32:39'),(15,'SKU12359','HD Seagate Barracuda 2TB','Disco rígido Seagate Barracuda 2TB 7200RPM',269.99,80,1,1,'url_imagem_15.jpg','Armazenamento','{\"rpm\": \"7200RPM\", \"conexao\": \"SATA 3\", \"capacidade\": \"2TB\"}',0,'2025-05-18 17:32:39'),(16,'SKU12360','Fonte EVGA SuperNOVA 650W','Fonte EVGA SuperNOVA 650W, Modular, 80+ Gold',359.99,55,1,1,'url_imagem_16.jpg','Fonte de Alimentação','{\"modular\": \"Sim\", \"potencia\": \"650W\", \"certificacao\": \"80+ Gold\"}',0,'2025-05-18 17:32:39'),(17,'SKU12361','Caixa Cooler Master MasterBox Q300L','Caixa Cooler Master MasterBox Q300L, Mini Tower',239.99,30,1,1,'url_imagem_17.jpg','Caixa','{\"tipo\": \"Mini Tower\", \"fluxo_Ar\": \"Otimizado\", \"design_modular\": \"Sim\"}',0,'2025-05-18 17:32:39'),(18,'SKU12362','Monitor ASUS TUF Gaming 24 144Hz','Monitor ASUS TUF Gaming 24\" Full HD 144Hz',699.99,45,1,1,'url_imagem_18.jpg','Monitor','{\"tamanho\": \"24 polegadas\", \"resolucao\": \"Full HD\", \"taxa_refresco\": \"144Hz\", \"tempo_resposta\": \"1ms\"}',0,'2025-05-18 17:32:39'),(19,'SKU12363','Teclado Corsair K95 RGB','Teclado mecânico Corsair K95 RGB, switches Cherry MX',1299.99,25,1,1,'url_imagem_19.jpg','Periféricos','{\"rgb\": \"Sim\", \"tipo_switch\": \"Cherry MX\", \"programaveis\": \"Sim\", \"teclas_macro\": \"6\"}',0,'2025-05-18 17:32:39'),(20,'SKU12364','Mouse Logitech G502 Hero','Mouse Logitech G502 Hero, Sensor de 16K DPI',389.99,150,1,1,'url_imagem_20.jpg','Periféricos','{\"dpi\": \"16K\", \"rgb\": \"Sim\", \"botao\": \"11\", \"programaveis\": \"Sim\"}',0,'2025-05-18 17:32:39');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizadores`
--

LOCK TABLES `utilizadores` WRITE;
/*!40000 ALTER TABLE `utilizadores` DISABLE KEYS */;
INSERT INTO `utilizadores` VALUES (1,'Manuel','Testado','teste@teste.com','$2b$10$7Z4uhDmk4lyGwImOsHbjnuJskJIRdmOQNkJRv7DY7HfNB5S4afOty','999999999','2025-05-12 23:03:49','cliente','Rua Amarela 21 4º Esq.','Seixal','5555-555','Portugal','2025-05-15 21:58:01'),(2,'TesteAdmin','AdminTeste','admin@admin.com','Adm1n@1234',NULL,'2025-05-13 22:38:02','admin','asdas',NULL,NULL,NULL,'2025-05-15 23:06:51'),(14,'Rui','Manuel','manu@pcg.pt','$2b$10$ezHd5r3.qFzqXFnofIS8cemJQLjLDUl1at5p8g62FFQV53StlpO..','999888777','2025-05-16 08:07:50','admin','Rua Antônio','Lisboa','5555-888','Portugal','2025-05-16 08:07:50'),(15,'Carlos','Fernandes','carlosfernandes@pcg.pt','$2b$10$Guc.XFsaLe3LqQXCmtFWYu3SMaVjdlu8K0XjeLuIJss7HxP5KmVhG','775588774','2025-05-16 20:13:33','admin','Rua Antônio Sacramento','Seixal','2844-555','Portugal','2025-05-16 20:13:33'),(16,'Antônio','Manuel','antoniomanuel@pcg.pt','$2b$10$X3PiNkmbecgYlY7g/J6mv.0syvBX8q6/hjgjyRAzUkLYVFQQdbCHW','998877582','2025-05-16 20:19:10','admin','Rua do Carmo','Lisboa','8745-698','Portugal','2025-05-16 20:19:10');
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

-- Dump completed on 2025-05-18 17:49:50
