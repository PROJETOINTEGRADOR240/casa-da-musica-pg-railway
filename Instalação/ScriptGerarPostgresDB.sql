DROP TABLE IF EXISTS alunos;

CREATE TABLE alunos (
  idaluno SERIAL PRIMARY KEY,
  cpf_cnpj VARCHAR(14),
  nome VARCHAR(45) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(33),
  data_nasc DATE,
  idade INT,
  sexo VARCHAR(10),
  genero VARCHAR(20),
  cor VARCHAR(10),
  ativo VARCHAR(3) NOT NULL CHECK (ativo IN ('SIM', 'NÃO')),
  pcd VARCHAR(3) NOT NULL CHECK (pcd IN ('SIM', 'NÃO')),
  cpf_cnpj_resp VARCHAR(14),
  nome_resp VARCHAR(45),
  cep VARCHAR(9),
  endereco VARCHAR(100),
  numero VARCHAR(15),
  bairro VARCHAR(50),
  cidade VARCHAR(50),
  estado VARCHAR(20),
  complemento VARCHAR(45),
  obs VARCHAR(145)
);

DROP TABLE IF EXISTS professores;

CREATE TABLE professores (
  idprofessor SERIAL PRIMARY KEY,
  cpf_cnpj VARCHAR(14),
  nome VARCHAR(45) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(33),
  data_nasc DATE,
  idade INT,
  sexo VARCHAR(10) NOT NULL,
  genero VARCHAR(20),
  cor VARCHAR(10),
  cep VARCHAR(9),
  endereco VARCHAR(100),
  numero VARCHAR(15),
  bairro VARCHAR(50),
  cidade VARCHAR(50),
  estado VARCHAR(20),
  complemento VARCHAR(45),
  obs VARCHAR(145)
);

DROP TABLE IF EXISTS disciplinas;

CREATE TABLE disciplinas (
  iddisciplina SERIAL PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  carga_horaria TIME NOT NULL,
  turno VARCHAR(5) NOT NULL,
  dia_semana VARCHAR(15),
  hora_aula_inicio TIME NOT NULL,
  hora_aula_fim TIME NOT NULL,
  obs VARCHAR(145)
);

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  idusuario SERIAL PRIMARY KEY,
  nome VARCHAR(70) NOT NULL,
  email VARCHAR(70) NOT NULL,
  telefone VARCHAR(20),
  senha VARCHAR(30),
  nivel INT NOT NULL CHECK (nivel >= 1),
  ativo VARCHAR(3) NOT NULL CHECK (ativo IN ('SIM', 'NÃO')),
  obs VARCHAR(145)
);

DROP TABLE IF EXISTS notas;

CREATE TABLE notas (
  idnota SERIAL PRIMARY KEY,
  aluno_id INT,
  disciplina_id INT,
  professor_id INT,
  data_nota DATE NOT NULL,
  mes_nota VARCHAR(15),
  ano_nota INT,
  nota NUMERIC(3,1) NOT NULL,
  obs VARCHAR(145),
  CONSTRAINT unique_nota UNIQUE (aluno_id, professor_id, disciplina_id, data_nota)
);

DROP TABLE IF EXISTS faltas;

CREATE TABLE faltas (
  idfalta SERIAL PRIMARY KEY,
  aluno_id INT,
  disciplina_id INT,
  professor_id INT,
  data_falta DATE NOT NULL,
  mes_falta VARCHAR(15),
  ano_falta INT,
  falta INT,
  obs VARCHAR(145),
  CONSTRAINT unique_falta UNIQUE (aluno_id, professor_id, disciplina_id, data_falta)
);

DROP TABLE IF EXISTS matriculas;

CREATE TABLE matriculas (
  idmatricula SERIAL PRIMARY KEY,
  idaluno INT NOT NULL,
  iddisciplina INT NOT NULL,
  data_matricula DATE NOT NULL,
  ativo VARCHAR(3) NOT NULL CHECK (ativo IN ('SIM', 'NÃO')),
  obs VARCHAR(145),
  CONSTRAINT unique_matricula UNIQUE (idaluno, iddisciplina)
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(30),
  password VARCHAR(255),
  email VARCHAR(70),
  level VARCHAR(45),
  status VARCHAR(10) CHECK (status IN ('ativado', 'desativado')),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  recovery_token VARCHAR(255),
  reset_token VARCHAR(64),
  reset_token_expires TIMESTAMP
);


DROP TABLE IF EXISTS vinculos;

CREATE TABLE vinculos (
  idvinculo SERIAL PRIMARY KEY,
  iddisciplina INT,
  idprofessor INT,
  data_vinculo DATE NOT NULL,
  obs VARCHAR(145),
  CONSTRAINT unique_vinculo UNIQUE (iddisciplina, idprofessor)
);

INSERT INTO users (id, username, password, email, level, status, created_at, updated_at)
VALUES (1, 'admin', '$2a$10$gscWfptKpPQbjSBzSpkb7eGEdXq5WKdW8.Gieuf9M/F58UVPKrXay', 'admin@teste.com', '1', 'ativado', '2024-12-13 10:46:08', '2024-12-13 10:46:08');


DROP TABLE IF EXISTS monitoramento;
DROP TABLE IF EXISTS salas;
DROP TABLE IF EXISTS sensores;

CREATE TABLE salas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE sensores (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL
);

CREATE TABLE monitoramento (
    id SERIAL PRIMARY KEY,
    sala_id INT NOT NULL,
    sensor_id INT NOT NULL,
    qualidade_ar INT CHECK (qualidade_ar BETWEEN 0 AND 100),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE CASCADE
);

INSERT INTO salas (nome) VALUES
('Sala 101'),
('Sala 102'),
('Laboratório de Ciências'),
('Sala 201'),
('Biblioteca');

INSERT INTO sensores (descricao) VALUES
('Sensor de CO2 - Modelo A'),
('Sensor de CO2 - Modelo B'),
('Sensor de Umidade - Modelo X'),
('Sensor de Temperatura - Modelo Y');

INSERT INTO monitoramento (sala_id, sensor_id, qualidade_ar) VALUES
(1, 1, 85),
(1, 2, 78),
(2, 1, 90),
(3, 3, 65),
(3, 4, 72),
(4, 1, 88),
(5, 2, 74),
(5, 3, 80);