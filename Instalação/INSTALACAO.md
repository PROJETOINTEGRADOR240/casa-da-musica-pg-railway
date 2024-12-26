# Integrado Oficial

1 - Se VSCode não estiver instalado no seu computador

    1.1 - Entrar no SITE oficial da ferramenta e seguir as orientações/instruções do SITE
        para instalação.



2 - Se Mysql não estiver instalado no seu computador

    2.1 - Entrar no SITE oficial da ferramenta e seguir as orientações/instruções do SITE
    para instalação.
    2.2 - Entrar no mysql e criar a conexão sem senha (senha em branco).
    2.3 - Abrir o arquivo chamado Script - Gerar DB.sql que está na pasta chamada INSTALACAO do projeto.
    2.4 - Copiar o conteudo desse arquivo, colar no Mysql e executar para gerar o DB e as tabelas necessárias para aplicação.



3 - Verificar no prompt/cmd do Windows qual a versão do NODE instalada no seu computador, se a versão for menor que 20(vinte) ou se não existir entrar no SITE oficial da ferramenta e seguir as orientações/instruções do SITE para instalação.

ATENÇÃO INSTALAR SEMPRE A ÚLTIMA VERSÃO DO NODE (LTS).

    3.1 - Comando para ver a versão do NODE no prompt/CMD do Windows.

          node --v ou node -v



4 - Instalar as dependencias. 

    4.1 - Entrar no VSCode abrir um terminal e digitar os comandos abaixo:

                npm init -y
                npm install
                npm install express mysql2 ejs body-parser chart.js pdfkit
                npm install express-validator
                npm install dotenv express-session nodemailer connect-flash 
                npm install bcrypt bcryptjs canvas method-override connect-mysql



5 - Para entrar na aplicação:

    Dentro do seu VSCode abrir um terminal e digitar:
    node app
    No seu navegador digitar localhost:3000


6 - Dados para entrar na aplicação WEB

    Usuário = admin
    Senha = senha123
