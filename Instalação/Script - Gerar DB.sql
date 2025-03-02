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
  `cpf_cnpj_resp` VARCHAR(14) NULL,
  `nome_resp` VARCHAR(45) NULL,
  `cep` VARCHAR(9) NULL,
  `endereco` VARCHAR(45) NULL,
  `numero` VARCHAR(15) NULL,
  `bairro` VARCHAR(30) NULL,
  `cidade` VARCHAR(30) NULL,
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
  `endereco` VARCHAR(45) NULL,
  `numero` VARCHAR(15) NULL,
  `bairro` VARCHAR(13) NULL,
  `cidade` VARCHAR(30) NULL,
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
  PRIMARY KEY (`idfalta`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `casadamusica`.`matriculas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `casadamusica`.`matriculas` ;

CREATE TABLE IF NOT EXISTS `casadamusica`.`matriculas` (
  `idmatricula` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idaluno` INT NOT NULL,
  `nome_aluno` VARCHAR(45) NULL,
  `iddisciplina` INT NOT NULL,
  `nome_disciplina` VARCHAR(45) NULL,
  `data_matricula` DATE NOT NULL,
  `ativo` ENUM("Sim", "Não") NOT NULL,
  `obs` VARCHAR(145) NULL,
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
  UNIQUE (iddisciplina, idprofessor),
  PRIMARY KEY (`idvinculo`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


USE casadamusica;
INSERT INTO users (id, username, password, email, level, status, created_at, updated_at)
VALUES (1, 'admin', '$2a$10$gscWfptKpPQbjSBzSpkb7eGEdXq5WKdW8.Gieuf9M/F58UVPKrXay', 'admin@teste.com', 1, 'ativado', '2024-12-13 10:46:08', '2024-12-13 10:46:08');
