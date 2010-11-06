---
layout: post
title: "Desarrollo de afuera hacia adentro en rails, parte 1: creación del proyecto"
---

## Pre-requisitos:

* Un sistema `*nix` (de preferencia ubuntu-linux)
* El lenguaje de programación ruby, de preferencia la versión 1.8.7 (ejecutar `ruby -v` debería imprimir `1.8.7`)
* El gestor de paquetes de ruby, `rubygems`, en la versión `1.3.7` (ejecutar `gem -v` o `gem1.8 -v` debería imprimir `1.3.7`)
* El sistema de gestión de código `git`.
* Un editor de texto (se recomiendan [vim compilado con ruby](http://www.ozmox.com/2010/08/22/compile-your-own-vim/), [kate](http://kate-editor.org/about-kate/) o [textmate](http://macromates.com/) para los que cuentan con una mac).
* Sqlite, para bases de datos, instalable con `sudo apt-get install sqlite3 libsqlite3-ruby libsqlite3-dev`
* El paquete de encabezados en C para ruby, para ciertos gems que requieren extensiones nativas, instalable con `sudo apt-get install ruby-dev`
* Instalar [ruby on rails](http://rubyonrails.org/), mediante `sudo gem install rails`; Después de ello, introducir `rails -v` en una terminal debería resultar en `3.0.x` (donde `x` es cualquier dígito).
* **Opcional**: una cuenta en [github.com](https://github.com) para tener una copia propia del proyecto.
* **Opcional**: una cuenta en [heroku.com](http://heroku.com/) para publicar la aplicación en internet

## Introducción

Desarrollaremos una aplicación de retos de código: una persona pone un reto y varias personas ofrecen sus soluciones, visibles hasta la fecha límite impuesta por el autor del reto.

Todos los cambios importantes se guardarán en `commit`s de git, de modo que, para ver el estado del proyecto en cada fase (y una comparación de los cambios hechos entre etapas), sólo deberá ir a <https://github.com/lfborjas/coderumble> y dar click en "commits" (como se ilustra a continuación)

![git history](http://farm5.static.flickr.com/4064/5152071063_58a3bbe095.jpg)

Para el desarrollo de esta aplicación utilizaremos [desarrollo orientado a comportamiento](http://en.wikipedia.org/wiki/Behavior_Driven_Development), que consiste en concretar primero en alto nivel **qué** hará el software y luego hacer el trabajo necesario para que se haga (implementar el **cómo**). ["Cucumber Backgrounder"](https://github.com/aslakhellesoy/cucumber/wiki/Cucumber-Backgrounder) es un excelente artículo introductorio a esta técnica de desarrollo. 

El ciclo que usaremos será el siguiente: definir las *características* de la aplicación y luego definir las unidades (*modelos, controladores y vistas*) que las harán posibles.

Vamos a usar `git` para llevar control de los cambios en la aplicación y cada vez que logremos un hito, la publicaremos en internet mediante heroku.

En los ejemplos referentes a la terminal, el signo de dolar (`$`) se refiere al *prompt* de la terminal y **no debe escribirse**.

## Parte 1: Creación del proyecto 

Como desarolladores, lo primero que haremos será crear el proyecto de ruby on rails, al cual llamaremos `coderumble`

    $ rails new coderumble

Lo cual creará una carpeta llamada `coderumble`. Si nos cambiamos a ella y vemos su contenido, veremos el esqueleto de una aplicación en rails:

{%highlight console%}
$ cd coderumble
$ ls
app  config  config.ru  db  doc  Gemfile  lib  log  public  Rakefile
README  script  test  tmp  vendor
{%endhighlight%}

En este momento, le diremos a git que gestione nuestro proyecto:

{%highlight console%}    
$ git init
Initialized empty Git repository in ~/coderumble/.git/
{%endhighlight%}

Existen ciertos archivos temporales o auto-generados que vamos a querer tener respaldados por git, así que editamos el archivo especial  `.gitignore` que está dentro de nuestro proyecto:

{%highlight console%}
$ cat >>.gitignore <<EOF
*~
*.sw[op]
EOF
{%endhighlight%}

Ahora estamos listos para el primer commit: antes de hacer un commit, usamos el comando  `add` para agregar los cambios que deseemos. En unix, el nombre especial `.` (punto) denota al directorio actual, así que la instrucción `git add .` agregará todos los archivos del directorio actual a los cambios que git conoce y están listos para guardarse.

{%highlight console%}
$ git add .
$ git commit -m "creado un esqueleto de rails y agregados todos los archivos a git"
{%endhighlight%}

Es buena idea tener un respaldo remoto de nuestro código, así que podemos valernos de [github.com](https://github.com) para crear ahí una copia remota del proyecto, si se dispone de una cuenta en github.com, se puede hacer lo siguiente (nótese que el nombre de usuario del autor es "lfborjas", por eso muchas porciones de los ejemplos contienen eso) :

![crear repo](http://farm2.static.flickr.com/1417/5152626186_ccfa570c91.jpg)

Veremos el siguiente formulario:

![github form](http://farm5.static.flickr.com/4072/5152636382_bcb19f49cd.jpg)

El cual, una vez llenado, nos llevará a una página como esta:

![github home](http://farm2.static.flickr.com/1186/5152651516_f8ed04b3d5.jpg)

Como se puede ver, esa última página nos da instrucciones de qué hacer; puesto que nuestro repositorio local ya está creado y ya estamos dentro de esa carpeta, sólo nos toca agregar una referencia local a nuestra copia remota -que acabamos de crear- y actualizar los cambios que tenemos localmente en ésta:

{%highlight console%}
$ git remote add origin git@github.com:lfborjas/coderumble.git
$ git push origin master
{%endhighlight%}

Si todo sale bien, nuestra terminal debería imprimir algo como lo siguiente:

    Counting objects: 62, done.
    Delta compression using up to 2 threads.
    Compressing objects: 100% (48/48), done.
    Writing objects: 100% (62/62), 85.58 KiB, done.
    Total 62 (delta 2), reused 0 (delta 0)
    To git@github.com:lfborjas/coderumble.git
     * [new branch]      master -> master

¡Listo! El primer commit de nuestro proyecto/tutorial está hecho, y se puede encontrar aquí: <https://github.com/lfborjas/coderumble/commit/2d4f312dc7afd614261687779bc69938c2633a1a>

En la siguiente fase, agregaremos autenticación de usuarios al proyecto.
