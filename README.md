<h1>Sobre o Edumetria</h1>

O projeto <strong>Edumetria</strong> tem como objetivo implementar um sistema web para previsão de evasão escolar, transformando dados escolares "mortos" em alertas de risco, através de previsões geradas por um modelo de aprendizado supervisionado baseado em árvores de decisão.

<dl>
<dt>Tecnologias:</dt>
<dt>Backend</dt>
<dd>Linguagem: Python</dd>
<dd>Framework: Django</dd>
<dt>Frontend</dt>
<dd>Linguagem: Javascript</dd>
<dd>Framework: NextJS, React, TailwindCSS</dd>
<dt>Banco de dados</dt>
<dd>Banco de dados relacional: PostgreSQL</dd>
</dl>

O sistema utiliza o <strong>Docker</strong> para a containerização dos serviços, permitindo a criação e execução de aplicações em ambientes isolados e consistentes.

O <strong>Redis</strong> é responsável pela fila de tarefas assíncronas relacionadas à execução do modelo de inteligência artificial.

<h2>Criar e iniciar Redis no Docker:</h2>
docker run -d -p 6379:6379 --name redis redis


