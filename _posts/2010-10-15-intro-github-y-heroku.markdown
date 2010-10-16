---
title: Introducción a trabajo en grupo con github.com y heroku.com
layout: post
---

En esta corta guía trataré de cubrir lo que hablamos el viernes 15 de octubre de 2010. En suma, aprendimos a usar [git](http://git-scm.com) en conjunto con [github.com](http://github.com) para administrar los cambios de nuestro código y trabajar en equipo ordenadamente. También aprendimos sobre [heroku](http://heroku.com): una webapp que permite publicar nuestras aplicaciones web gestionadas con git a internet en *dos sencillos pasos*. 

**Como ejercicio**: para practicar todo lo de git, deberán cambiar el código en su repositorio para que use layouts y sirva las vistas como plantillas de erb, en lugar de ser páginas estáticas de html. Deberían repartirse el trabajo para poder practicar el hacer `push` y `pull`.

##Prerrequisitos##

Para seguir exitosamente esta guía, se debe tener creada una cuenta en [github.com](http://github.com) y se debe haber agregado la llave pública ssh al perfil de github personal. Aquí hay una guía para [crear y agregar la llave pública](http://help.github.com/linux-key-setup/). Evidentemente, se asume que se tiene ya instalado git (se instala con `sudo apt-get git-core`).

Se presupone, además, que se cuenta con la versión adecuada del lenguaje de programación ruby y que [rubygems](https://rubygems.org/pages/download) se encuentra instalado y el comando `gem`, disponible (a algunos les ha pasado que se les instala como `gem1.8` en lugar de `gem`, en cualquier caso, si al ejecutar el comando `gem -v` o `gem1.8 -v` sale en terminal `1.3.7`, estamos bien).

Por último se requiere que se tenga creada una cuenta en [heroku.com](http://heroku.com) y se tenga instalado el gem de heroku: `sudo gem install heroku`.

Para familiarizarse con git, se puede leer este [tutorial/sitio de referencia](http://gitref.org/) escrito por uno de los creadores de github.com.

##Encontrando el repositorio de tu grupo##

En esta guía estaremos trabajando sobre el contexto de progra4: cuando uno entra a github.com se encuentra con un *dashboard* o "pizarra", para los que lo tienen en español. Ese dashboard corresponde a nuestra cuenta, tiene una lista de nuestros repositorios, noticias de programadores que seguimos, etc. **Pero**, vamos a querer cambiarnos de contexto, para, en vez de ver nuestras cosas personales, ver lo de progra 4: así que al entrar a github, veríamos una pantalla así:

![Entrando a github](http://farm5.static.flickr.com/4145/5085547406_b35fa924c4.jpg)

Si damos click en progra4, estaríamos cambiándonos de contexto y veríamos algo así:

![Cambio de contexto](http://farm5.static.flickr.com/4083/5084974167_81c2e72035.jpg)

Como se ve en la imagen, ahora podés ver noticias de lo que pase en la [organización](http://github.com/blog/674-introducing-organizations) progra4 y una lista de los repositorios a los que tenés acceso. Da click en el repositorio que tenga el nombre de tu grupo (en la imagen, el grupo era `ejemplo_heroku`) de modo que si das click en el nombre de éste verás lo siguiente:

![Viendo el repositorio del grupo](http://farm5.static.flickr.com/4109/5085602426_65881b84f3.jpg)

En este y en cualquier repositorio que tengás acceso podés notar dos cosas:

1. Hay un botón que te permite **hacer una copia (fork)** del repositorio, eso implica poner un nuevo repositorio *a tu nombre* basado en el que estas viendo. 
2. Hay una **url de protocolo git**, con esta, podés *agregar el repositorio que estás viendo como un remoto* y así poder hacer `pull` y hasta `push` (si tenés permiso, como es el caso del repositorio de tu grupo).

##Paso 1: crear tu propia copia remota del repositorio del grupo##

Ahora que ya encontraste el repositorio de tu grupo, harás una copia remota: de esta manera, tendrás tu propia versión del repositorio original sobre la cual podrás hacer cambios (teniendo el respaldo en internet) sin preocuparte por *arruinar el código para los demás*. Esa es una de las ventajas de git: **permite trabajar de manera no centralizada** (a diferencia de [otros sistemas de control de versiones](http://whygitisbetterthanx.com/#distributed)).

Para hacer la copia remota, das click en el botón de `fork` (o `hacer copia`) y verás algo como esto:

![Luego de un fork](http://farm5.static.flickr.com/4103/5085045531_2654de18b3.jpg)

##Paso 2: crear una copia local del fork que acabás de hacer##

Ok, ya tenés tu copia remota del repositorio original de tu grupo. Pero aquí lo más que podés hacer es ver código y el historial de cambios, y vos lo que querés es ¡comenzar a trabajar!. Excelente. Hagamos una copia local.

Como verás en la foto de arriba, hay una url de git ahí donde hiciste el fork, copiala al portapapeles. Luego, andate en tu terminal a una carpeta donde querás hacer el clon (en el caso de este usuario, será `/home/lfborjas/johngalt`) y ahí ejecutá lo siguiente:

    git clone git@github.com:jgalt/ejemplo_heroku.git

Si todo sale bien, debería aparecer algo muy similar a esto:

    Initialized empty Git repository in /home/lfborjas/johngalt/ejemplo_heroku/.git/
    remote: Counting objects: 39, done.
    remote: Compressing objects: 100% (21/21), done.
    remote: Total 39 (delta 15), reused 39 (delta 15)
    Receiving objects: 100% (39/39), 6.53 KiB, done.
    Resolving deltas: 100% (15/15), done.

Ahora vas a tener una carpeta llamada igual que el repositorio que acabás de clonar (en este ejemplo, la carpeta es `ejemplo_heroku`). Andate a ella: **es tu nueva copia local de tu proyecto, de ahora en adelante, todos los comandos se asumirá que los ejecutás dentro de ésta**.

##Paso 3: agregar a tus compañeros como remotos##

Una vez que tenés tu copia local, si ejecutás esto
    
    git remote

Te saldría lo siguiente
    
    origin

Esto quiere decir que tenés un apuntador a un repositorio remoto: tu propia copia remota. Pero esto de remote es más poderoso que eso: podés tener apuntadores a las **copias remotas de tus compañeros y al mismísimo repositorio original**. 

En el ejemplo que estamos viendo, hay dos miembros en el grupo: John Galt y Luis Borjas. Digamos que el apodo de Luis Borjas es `luisfelipe` y el de John Galt es `galt`. Estas dos personas quieren tener en su lista de repositorios remotos al otro. SiLuis Felipe quisiera hacerlo, ejecutaría algo como esto:

    git remote add galt git@github.com:jgalt/ejemplo_heroku.git

Y, al ejecutar `git remote` para listar sus remotos, vería algo como esto:

    origin
    galt

Y John Galt (y cualquier otro miembro del grupo) podría hacer eso para cuantas personas quiera. Nótese que el último parámetro del comando es una **URI de copia**, como la que vimos en la foto del fork.

## Paso 4: hacer tus propios cambios, actualizar tu copia remota con ellos y traer los cambios de otros##

El flujo de trabajo de git es sencillo

1. Editás uno o varios archivos: estos cambios se mantienen en algo conocido como `directorio de trabajo`
2. Ves qué cambios has hecho con `git status` y qué ha cambiado con `git diff`
3. Cuando creás que los cambios que hiciste sobre uno o más archivos están bien, hacés un `git add`: en esta etapa pasarán a una etapa conocida como `índice`: le estás diciendo a git que esté pendiente de esos cambios.
4. Cuando querás "guardar" en el historial permantente (en terminología de git, se conoce como el `repositorio`), ejecutarás n `git commit`: los cambios se hacen definitivos y se agregan a tu historia de cambios.
5. Cuando querás actualizar el historial de tu copia remota -todos los commits que has hecho en una sesión de trabajo- vas a ejecutar un `git push`: de esta manera sincronizarás los cambios locales con el historial remoto.
6. Cuando querás traer los cambios de otros a tu copia local, hacés `git pull`

###Haciendo cambios y guardándolos en el historial###

Por ejemplo, John Galt, quien hizo su propia copia local del repositorio `jgalt/ejemplo_heroku`, decide editar el archivo `app.rb`. Cuando termina de editarlo, ejecuta `git status` y ve algo como esto:

    # On branch master
    # Changed but not updated:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #   modified:   app.rb
    #
    no changes added to commit (use "git add" and/or "git commit -a")

Resulta que John Galt es algo olvidadizo y no se acuerda qué cambió en el archivo `app.rb`, para recordarlo, ejecuta `git diff` y ve algo como esto: 

    diff --git a/app.rb b/app.rb
    index a5d800f..ea4e33a 100644
    --- a/app.rb
    +++ b/app.rb
    @@ -11,5 +11,11 @@ get('/'){send_file "index.html"}
     Esta otra linea
      =end
       
       -get('/'){erb :index}
       -eval %w[/hackernotes /codewar /mailmaniac].collect{
       |idea| "get('#{idea}'){@title = '#{idea.capitalize}'; erb :#{idea[1..-1]}
       +get '/' do
       +    erb :index
       +end
       +
       +get '/*' do 
       +    erb params[:splat][0].to_sym
       +end
       +


Como se puede observar, las líneas precedidas por el signo menos (`-`) son lo que él quitó y las precedidas por el signo mas (`+`), lo que él agregó. Decide que ese cambio es algo de lo que git debería estar al tanto, así que ejecuta `git add app.rb`.
Si volviese a ejecutar `git status`, esto es lo que vería:

    # On branch master
    # Changes to be committed:
    #   (use "git reset HEAD <file>..." to unstage)
    #
    #   modified:   app.rb
    #

Nótese que ahora git sabe que son cambios que se deben considerar, pero no los ha agregado al historial.

John Galt decide que esos cambios están listos, y antes de seguir trabajando, decide "guardar su progreso" (pensá en los commits de git como los checkpoints de los juegos). Galt ejecuta esto:

    git commit -m "Cambié app.rb porque el código de Luis era una afrenta a la sanidad"

Y la terminal le devuelve esto:

    [master 48a6d64] Cambié app.rb porque el código de Luis era una afrenta a la sanidad
    1 files changed, 10 insertions(+), 0 deletions(-)

Nótese que se usó el parámetro `-m` para agregar un mensaje: siempre es recomendable agregar mensajes descriptivos a los commits, para que los otros sepan qué hicimos sin tener que leer el código.

En cualquier momento de la sesión de trabajo, se puede ejecutar `git log` para ver el historial de todos los commits que se han hecho (con autor, fecha y todo).

###Actualizando tu copia remota con los cambios de tu copia local ###

Ahora, John Galt está a punto de apagar su computadora porque el trabajo fue extenuante, de modo que antes quiere dejar sincronizada sus copia local y remotas. Para eso, ejecuta el comando `git push origin master` y ve algo como esto:

    Counting objects: 9, done.
    Delta compression using up to 2 threads.
    Compressing objects: 100% (7/7), done.
    Writing objects: 100% (7/7), 923 bytes, done.
    Total 7 (delta 4), reused 0 (delta 0)
    To git@github.com:jgalt/ejemplo_heroku.git
       625f15a..7e59ec1  master -> master

### Actualizando tu copia local con los cambios de las copias remotas de tus compañeros ###

En la madrugada, ve en el newsfeed de github.com que Luis Borjas hizo un push a su copia remota, revisa los cambios y se da cuenta que son importantes. Así que ejecuta lo siguiente

    git pull luisfelipe

Y en la terminal ve algo como esto:

    remote: Counting objects: 7, done.
    remote: Compressing objects: 100% (4/4), done.
    remote: Total 4 (delta 3), reused 0 (delta 0)
    Unpacking objects: 100% (4/4), done.
    From github:lfborjas/ejemplo_heroku
     * branch            master     -> FETCH_HEAD
    Merge made by recursive.
        views/layout.erb |    2 +-
        1 files changed, 1 insertions(+), 1 deletions(-)


Luis Borjas cambió otro archivo y ahora John Galt **actualizó su copia local** con lo que Luis Felipe hizo en su copia remota. Ahora ambos tienen la misma versión del código.

###Resumen del flujo de trabajo###

El flujo de trabajo se puede ver gráficamente así:

![Git workflow](http://www.gliffy.com/pubdoc/2280486/L.png)

###Resolución de conflictos###

Pero no todo es felicidad en el mundo de git: a veces más de una persona trabaja en un archivo y todo se pone ... interesante.

Digamos que esta vez Luis Borjas decide trabajar en el archivo `app.rb` y hace un commit de sus cambios. Pero, hace unos párrafos, vimos que John Galt también había trabajado en ese archivo, y, para colmo, Luis Borjas no ha actualizado su copia local con los cambios que John hizo. Se da cuenta que John Galt hizo esos cambios y decide ejecutar esto:

    git pull galt master

Pero ve, muy a su disgusto, que en la terminal aparece lo siguiente:

    remote: Counting objects: 12, done.
    remote: Compressing objects: 100% (10/10), done.
    remote: Total 10 (delta 5), reused 0 (delta 0)
    Unpacking objects: 100% (10/10), done.
    From github.com:jgalt/ejemplo_heroku
     * branch            master     -> FETCH_HEAD
     Auto-merging app.rb
     CONFLICT (content): Merge conflict in app.rb
     Automatic merge failed; fix conflicts and then commit the result.

¡Oh no! hubo un conflicto y git dice que sucedió en el archivo `app.rb`. Si Luis ejecutase un `git status`, vería esto:

    # On branch master
    # Unmerged paths:
    #   (use "git add/rm <file>..." as appropriate to mark resolution)
    #
    #   both modified:      app.rb
    #
    no changes added to commit (use "git add" and/or "git commit -a")

En efecto, git le está diciendo que ambos tocaron ese archivo y le está pidiendo que lo revise. Luis abre el archivo con `vim` (porque otros editores de texto, como `gedit` le dan acidez y depresión) y se encuentra con algo así:

    <<<<<<< HEAD
    get('/'){erb :index}
    eval %w[/hackernotes /codewar /mailmaniac].collect{
    |idea| "get('#{idea}'){@title = '#{idea.capitalize}'; erb :#{idea[1..-1]
    =======
    get '/' do
        erb :index
    end

    get '/*' do 
        erb params[:splat][0].to_sym
    end
    >>>>>>> 858397fb3cc403b39921d2bcdf445c9ecaed0b18

Como se ve, todo lo que está entre separadores etiquetado como `HEAD` es lo que Luis hizo. Y lo que está en la otra porción, lo que John Galt hizo. Luis acepta que el código de Galt es mejor, así que decide borrar la porción suya y dejar la de Galt. Para terminar, hace un `commit` para decirle a git que ya resolvió el conflicto y todo está bien otra vez.

##Paso 5: publicar tu aplicación a heroku##

Ok, ya hemos trabajado y todo está bien, uno de los miembros del grupo tiene los últimos cambios y estamos listos para publicar nuestra webapp en internet.

Fácil.

Siempre dentro de la carpeta de tu aplicación (asumiendo que tenés cuenta en heroku.com y el gem de heroku instalado), ejecutás lo siguiente
(En este ejemplo, el equipo se llama `fountainheads`, el parámetro del comando `create` es el nombre que le querés poner a tu aplicación): 

    heroku create fountainheads

Si todo sale bien (quizá te pida que te autentiqués a heroku si es la primera vez), verías algo como esto:

    Creating fountainheads.... done
    Created http://fountainheads.heroku.com/ | git@heroku.com:fountainheads.git
    Git remote heroku added

Lo que acaba de pasar es que creamos *otro repositorio remoto*, pero esta vez, está guardado en heroku.com. Si John Galt, que es quien corrió este comando, ejecutase `git remote`, vería esto:

    origin
    heroku
    luisfelipe

Estamos a un paso de publicar nuestra aplicación hecha en sinatra a heroku.com. Pero nos falta una cosa: crear dos archivos que heroku necesita para detectar que lo que subamos es una aplicación web hecha en sinatra.

El primer archivo se debe llamar `config.ru` y contener esto:

    require 'app' #porque el nombre del script en ruby es app.rb en este caso
    run Sinatra::Application

Este archivo dice qué script de ruby contiene nuestra aplicación.

El siguiente se debe llamar `.gems` y contener esto:

    sinatra

Este archivo declara *de qué gems de ruby depende nuestra aplicación*. Que, en el caso precedente, sólo depende de la gem `sinatra`.

Agregamos ambos archivos a nuestro repositorio y hacemos un nuevo commit:
    
    git add .gems config.ru
    git commit -m "¡Listos para heroku!"

Hacemos otro push común y corriente, pero esta vez la terminal nos dirá algo distinto:

    Counting objects: 61, done.
    Delta compression using up to 2 threads.
    Compressing objects: 100% (42/42), done.
    Writing objects: 100% (61/61), 9.18 KiB, done.
    Total 61 (delta 27), reused 36 (delta 15)

    -----> Heroku receiving push
    -----> Sinatra app detected

    -----> Installing gem sinatra from http://rubygems.org
           Successfully installed sinatra-1.0
           1 gem installed

           Compiled slug size is 236K
    -----> Launching.... done
           http://fountainheads.heroku.com deployed to Heroku

    To git@heroku.com:fountainheads.git
     * [new branch]      master -> master
   

Nótese cómo nos dice que se detectó una app de sinatra y que la puso en la dirección <http://fountainheads.heroku.com>. ¡Listo! ¡Ahora todo mundo puede ver nuestra aplicación!





