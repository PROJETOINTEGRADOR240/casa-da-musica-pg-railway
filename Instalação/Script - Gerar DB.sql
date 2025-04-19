-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema casadamusica
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `casadamusica` ;

-- -----------------------------------------------------
-- Schema casadamusica
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `casadamusica` DEFAULT CHARACTER SET utf8 ;
USE `casadamusica` ;

-- -----------------------------------------------------
-- Table `casadamusica`.`alunos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`alunos` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`alunos` (
  `idaluno` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cpf_cnpj` VARCHAR(14) NULL,
  `nome` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(20) NULL,
  `email` VARCHAR(33) NULL,
  `data_nasc` DATE NULL,
  `idade` INT NULL,
  `sexo` VARCHAR(10) NULL,
  `genero` VARCHAR(20) NULL,
  `cor` VARCHAR(10) NULL,
  `ativo` ENUM("SIM", "NÃO") NOT NULL,
  `pcd` ENUM("SIM", "NÃO") NOT NULL,
  `cpf_cnpj_resp` VARCHAR(14) NULL,
  `nome_resp` VARCHAR(45) NULL,
  `cep` VARCHAR(9) NULL,
  `endereco` VARCHAR(100) NULL,
  `numero` VARCHAR(15) NULL,
  `bairro` VARCHAR(50) NULL,
  `cidade` VARCHAR(50) NULL,
  `estado` VARCHAR(20) NULL,
  `complemento` VARCHAR(45) NULL,
  `obs` VARCHAR(145) NULL,
  PRIMARY KEY (`idaluno`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`professores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`professores` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`professores` (
  `idprofessor` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cpf_cnpj` VARCHAR(14) NULL,
  `nome` VARCHAR(45) NOT NULL,
  `telefone` VARCHAR(20) NULL,
  `email` VARCHAR(33) NULL,
  `data_nasc` DATE NULL,
  `idade` INT NULL,
  `sexo` VARCHAR(10) NOT NULL,
  `genero` VARCHAR(20) NULL,
  `cor` VARCHAR(10) NULL,
  `cep` VARCHAR(9) NULL,
  `endereco` VARCHAR(100) NULL,
  `numero` VARCHAR(15) NULL,
  `bairro` VARCHAR(50) NULL,
  `cidade` VARCHAR(50) NULL,
  `estado` VARCHAR(20) NULL,
  `complemento` VARCHAR(45) NULL,
  `obs` VARCHAR(145) NULL,
  PRIMARY KEY (`idprofessor`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`disciplinas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`disciplinas` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`disciplinas` (
  `iddisciplina` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `carga_horaria` TIME NOT NULL,
  `turno` VARCHAR(5) NOT NULL,
  `dia_semana` VARCHAR(15) NULL,
  `hora_aula_inicio` TIME NOT NULL,
  `hora_aula_fim`    TIME NOT NULL,
  `obs` VARCHAR(145) NULL,
  PRIMARY KEY (`iddisciplina`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`usuarios` (
  `idusuario` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(70) NOT NULL,
  `email` VARCHAR(70) NOT NULL,
  `telefone` VARCHAR(20) NULL,
  `senha` VARCHAR(30) NULL,
  `nivel` INT(1) NOT NULL,
  `ativo` ENUM("SIM", "NÃO") NOT NULL,
  `obs` VARCHAR(145) NULL,
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`notas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`notas` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`notas` (
  `idnota` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `aluno_id` INT NULL,
  `disciplina_id` INT NULL,
  `professor_id` INT NULL,
  `data_nota` DATE NOT NULL,
  `mes_nota` VARCHAR(15) NULL,
  `ano_nota` INT NULL,
  `nota` DECIMAL(3,1) NOT NULL,
  `obs` VARCHAR(145) NULL,
  CONSTRAINT `unique_nota` UNIQUE (`aluno_id`, `professor_id`, `disciplina_id`, `data_nota`),
  PRIMARY KEY (`idnota`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`faltas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`faltas` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`faltas` (
  `idfalta` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `aluno_id` INT NULL,
  `disciplina_id` INT NULL,
  `professor_id` INT NULL,
  `data_falta` DATE NOT NULL,
  `mes_falta` VARCHAR(15) NULL,
  `ano_falta` INT NULL,
  `falta` INT NULL,
  `obs` VARCHAR(145) NULL,
  CONSTRAINT `unique_falta` UNIQUE (`aluno_id`, `professor_id`, `disciplina_id`, `data_falta`),
  PRIMARY KEY (`idfalta`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`matriculas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`matriculas` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`matriculas` (
  `idmatricula` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idaluno` INT NOT NULL,
  `iddisciplina` INT NOT NULL,
  `idprofessor` INT NOT NULL, 
  `data_matricula` DATE NOT NULL,
  `ativo` ENUM("SIM", "NÃO") NOT NULL,
  `obs` VARCHAR(145) NULL,
  CONSTRAINT `unique_matricula` UNIQUE (`idaluno`, `iddisciplina`),
  PRIMARY KEY (`idmatricula`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`users` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`users` (
  `id` INT NOT NULL,
  `username` VARCHAR(30) NULL,
  `password` VARCHAR(255) NULL,
  `email` VARCHAR(70) NULL,
  `level` VARCHAR(45) NULL,
  `status` ENUM('ativado', 'desativado') NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  `recovery_token` VARCHAR(255) NULL,
  `reset_token` VARCHAR(64) NULL,
  `reset_token_expires` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`vinculos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`vinculos` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`vinculos` (
  `idvinculo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `iddisciplina` INT NULL,
  `idprofessor` INT NULL,
  `data_vinculo` DATE NOT NULL,
  `obs` VARCHAR(145) NULL,
  CONSTRAINT `unique_vinculo` UNIQUE (`iddisciplina`, `idprofessor`),
  PRIMARY KEY (`idvinculo`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


USE casadamusica;
INSERT INTO users (id, username, password, email, level, status, created_at, updated_at)
VALUES (1, 'admin', '$2a$10$gscWfptKpPQbjSBzSpkb7eGEdXq5WKdW8.Gieuf9M/F58UVPKrXay', 'admin@teste.com', 1, 'ativado', '2024-12-13 10:46:08', '2024-12-13 10:46:08');


-- -----------------------------------------------------
-- Excluir a tabela `monitoramento` primeiro para evitar erro de chave estrangeira
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`monitoramento`;

-- -----------------------------------------------------
-- Excluir as tabelas `salas` e `sensores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`salas`;
DROP TABLE IF EXISTS `casadamusica`.`sensores`;

-- -----------------------------------------------------
-- Criar a tabela `salas`
-- -----------------------------------------------------
CREATE TABLE `casadamusica`.`salas` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- -----------------------------------------------------
-- Criar a tabela `sensores`
-- -----------------------------------------------------
CREATE TABLE `casadamusica`.`sensores` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL
);

-- -----------------------------------------------------
-- Criar a tabela `monitoramento` após as tabelas dependentes
-- -----------------------------------------------------
CREATE TABLE `casadamusica`.`monitoramento` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sala_id INT NOT NULL,
    sensor_id INT NOT NULL,
    qualidade_ar INT CHECK (qualidade_ar BETWEEN 0 AND 100),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sala_id) REFERENCES `casadamusica`.`salas`(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES `casadamusica`.`sensores`(id) ON DELETE CASCADE
);

-- Inserir dados de exemplo na tabela Salas
INSERT INTO salas (nome) VALUES
('Sala 101'),
('Sala 102'),
('Laboratório de Ciências'),
('Sala 201'),
('Biblioteca');

-- Inserir dados de exemplo na tabela Sensores
INSERT INTO sensores (descricao) VALUES
('Sensor de CO2 - Modelo A'),
('Sensor de CO2 - Modelo B'),
('Sensor de Umidade - Modelo X'),
('Sensor de Temperatura - Modelo Y');

-- Inserir dados de exemplo na tabela Monitoramento
INSERT INTO monitoramento (sala_id, sensor_id, qualidade_ar) VALUES
(1, 1, 85),
(1, 2, 78),
(2, 1, 90),
(3, 3, 65),
(3, 4, 72),
(4, 1, 88),
(5, 2, 74),
(5, 3, 80);
