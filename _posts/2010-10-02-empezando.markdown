---
layout: post
title: Empezando, instalando cosas, creando cuentas y configurando
---

###La clase en unos pocos párrafos###

¡Bienvenidos a progra cuatro! Como ya les debí mencionar, esta clase se trata de desarrollo web. Mi único fin es que al final de estos tres meses se *sepan* capaces de crear una aplicación web de verdad en el lenguaje/framework que deseen. Para este fin, ustedes van a **elegir una idea de una aplicación simple, pero útil** y deberán desarrollar un [producto mínimo viable](http://en.wikipedia.org/wiki/Minimum_viable_product) en **grupos por afinidad de, máximo, tres personas**.

Durante el curso vamos a estar usando el lenguaje de programación [ruby](http://www.ruby-lang.org/es/); para explorar los conceptos preliminares usaremos el framework [sinatra](http://www.sinatrarb.com) y para el proyecto de la clase, un framework más maduro y hecho para sitios más grandes: [ruby on rails](http://rubyonrails.org/). 

Vamos a usar control de versiones, en concreto, [git](http://git-scm.com/). Los proyectos del grupo van a tener repositorios remotos privados de github asignados en la [página de github de la clase](http://github.com/progra4) en la que encontrarán, además, los proyectos de muestra en sinatra y RoR y este blog.

Todos los links que mencione en el curso estarán disponibles en [mi cuenta de delicious](http://delicious.com/lfborjas/progra4).

###Cuentas en internet qué crear###

* Para estarnos comunicando (sílabo, tareas, nuevas entradas en este nerdlog, etc) vamos a estar usando [class.io](http://my.class.io). Sí, es la onda que Jorge García, Fernando Escher, yo y los tipos de [icoms technologies](http://demos.icomstec.com/) estamos haciendo. Así que siéntanse libres de dar retroalimentación, aún está en súper beta. **Creen una cuenta con su correo de unitec.edu**
* Para administrar el código, tenemos una [organización de github](http://github.com/progra4). Ahí estaré supervisando el progreso en sus proyectos (pista: piensen en eso como su backup, no como el lugar donde entregan cosas cada vez que se piden, espero ver commits diarios, no semanales o mensuales). **Así que creen una cuenta ahí y me avisan para agregarlos a la org, de preferencia, agreguen un avatar y sigan a mi usuario (lfborjas) por conveniencia y porque soy narcisista**
* Para tener los proyectos en internerd, vamos a usar [heroku](https://api.heroku.com/signup), **así que, también, creen una cuenta ahí** .

###Requerimientos técnicos y guía de instalación###

Deberán tener:
* Un sistema operativo linux, de preferencia [ubuntu](http://www.ubuntu.com/), versión **10.04**
* El sistema de gestión de versiones [git](http://git-scm.com/)
* El lenguaje de programación [ruby](http://www.ruby-lang.org/es/), versión **1.8.7** o **1.9.2** **la versión 1.9.1 es incompatible con algunos gems de ruby y causa `segmentation faults`**
* El gestor de paquetes de ruby, [rubygems](http://docs.rubygems.org/), versión **1.3.7**
* El sistema de bases de datos para desarrolladores [sqlite](http://www.sqlite.org/) 
* Los gems de `sinatra`, `heroku` para empezar (trataré de poner acá o en algún lado todo gem que vayamos instalando).

A continuación, un poco de detalle de cómo instalar cada cosa (excepto ubuntu, ya deberían tenerlo o al menos saber instalarlo):

Para instalar git:

    sudo apt-get install git-core
    
También **deberán generar una llave pública y toda la onda**, todo ese proceso está [documentado en github](http://help.github.com/).
Y ya que estén en eso, [RTFM](http://gitref.org/)

Para instalar ruby y el intérprete de ruby, irb, ejecútese la siguiente instrucción en terminal:

    sudo apt-get install ruby irb rdoc

Para instalar rubygems, aunque está disponible como paquete de aptitude (instalable desde synaptic o con apt-get) lo haremos desde el código fuente, porque, al menos para ubuntu 10.04, la versión del sistema está desactualizada, así que ejecuten lo siguiente (yo debería explicarles en clase qué significa cada instrucción):

    wget http://rubyforge.org/frs/download.php/70696/rubygems-1.3.7.tgz
    tar xzf rubygems-1.3.7.tgz
    cd rubygems-1.3.7
    sudo ruby setup.rb

Para instalar sqlite:

    sudo apt-get install sqlite

Para instalar `sinatra`, o cualquier otro gem, se correrá

    sudo gem install sinatra
    o
    sudo gem install CUALQUIER_OTRO_GEM

Un asunto importante, es que en muchos lugares de internet con código en ruby verán la siguiente instrucción `require 'rubygems'` lo que eso hace es ordenarle al intérprete que use ciertos lugares de gems por defecto, pero [no todo mundo usa rubygems como gestor de paquetes de ruby](http://gist.github.com/54177) así que, para crear scripts más portables, vamos a establecer en nuestras computadoras rubygems como gestor de ruby local, agregando la siguiente línea al final del archivo *~/.bashrc*

    export RUBYOPT="rubygems"

Ahora, los hackers de verdad usan [vim compilado con ruby](http://www.ozmox.com/2010/08/22/compile-your-own-vim/), pero si por alguna razón desean quedarse en clase o algo así, pueden revisar los IDEs que [los tipos de rails recomiendan](http://rubyonrails.org/download).


Bueno, se acabó lo aburrido. 
