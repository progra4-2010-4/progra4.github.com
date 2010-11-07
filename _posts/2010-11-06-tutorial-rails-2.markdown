---
layout: post
title: "Desarrollo de afuera hacia adentro en rails parte 2: escenarios y páginas estáticas"
---

Cuando uno hace software, lo primero que hace es preguntarse **qué** hará el producto terminado. Algunos programadores sencillamente consideramos qué retos técnicos habrían, hacemos un poco de [programación exploratoria](http://en.wikipedia.org/wiki/Exploratory_programming) y después seguimos el *instinto* y hacemos código, probándolo manualmente de vez en cuando, hasta que lo que tenemos se parece a la idea original. 
Para proyectos pequeños, esa idea no es tan mala, pero cuando nuestro software tiene muchas características (*features*), dejamos de divertirnos programándolo y comenzamos a temerle: a temer todo lo que hemos hecho y cómo puede "quebrarse"

Otras personas se van a otro extremo: pasan semanas y hasta meses planificando, haciendo documentos, diagramas y reuniones sin escribir una línea de código. Ese enfoque, aunque organizado, no es realista: no toma en cuenta la dinamicidad del código ni el proceso de ingeniería, que es creativo por antonomasia.

Existe un equilibrio para esto: el [desarrollo orientado a comportamiento](https://github.com/aslakhellesoy/cucumber/wiki/Cucumber-Backgrounder), donde uno se dedica a redactar la funcionalidad esperada del producto de una manera concisa y suficientemente flexible, y luego pasa a hacer esto funcionar. 

Algo así estaremos haciendo aquí: antes de hacer código, haremos **pruebas** que digan **qué** deberíamos hacer y no **cómo**.

###Paso 1: Instalar cucumber

Para redactar las características del proyecto, usaremos cucumber, así que debemos agregar lo siguiente a nuestro `Gemfile` (aquí se administran todas las dependencias del proyecto):

    {%highlight ruby%}
    group :development, :test do 
      gem 'cucumber-rails'
      gem 'capybara'
    end
    {%endhighlight%}

Luego, instalamos todas las dependencias
    {%highlight console%}
    $ sudo bundle install
    {%endhighlight%}

Si todo sale bien, deberíamos ver el siguiente mensaje
    
    Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.


Ahora bien, cuando agregamos nueva funcionalidad que interactuará con nuestro proyecto en rails, las más de las veces nos tocará instalar un *plugin*. La sintaxis de instalación de plugins en rails 3 es siempre similar a `rails generate PLUGIN:install [OPCIONES ...]` En el caso de cucumber, nosotros lo instalaremos en español con el simulador [capybara](https://github.com/jnicklas/capybara) así:

    {%highlight console%}
    $ rails generate cucumber:install es --capybara 
    {%endhighlight%}

Si todo sale bien (rails imprimirá algunos resultados en verde), ejecutar `git status` debería resultar en algo como esto:

    {%highlight console%}
    $ git status
    # On branch master
    # Changed but not updated:
    #   (use "git add <file>..." to update what will be committed)
    #   (use "git checkout -- <file>..." to discard changes in working directory)
    #
    #   modified:   config/database.yml
    #
    # Untracked files:
    #   (use "git add <file>..." to include in what will be committed)
    #
    #   config/cucumber.yml
    #   features/
    #   lib/tasks/cucumber.rake
    #   script/cucumber
    {%endhighlight%}

Haremos un commit acá:

    {%highlight console%}
    $ git add .
    $ git commit -m "Instalado cucumber en español, usando capybara"
    {%endhighlight%}

El estado de este proyecto de ejemplo hasta este punto se puede encontrar aquí <https://github.com/lfborjas/coderumble/commit/5425937e479204ab76cda3b1dd1ba9941bba9533>

###Paso 2: redactar nuestra primera característica

Como había dicho, lo primero que deberíamos hacer es pensar **qué** hará la aplicación. El propósito es que un usuario pueda proponer retos de programación con una fecha límite opcional y que otros puedan aportar sus soluciones. De aquí se deduce que lo primero que nuestra aplicación debería poder hacer es **identificar y autenticar usuarios**, así que haremos eso.

Para redactar características usaremos un lenguaje especial llamado [Gherkin](https://github.com/aslakhellesoy/cucumber/wiki/Gherkin), que se parece mucho al lenguaje natural. 

cucumber crea una carpeta llamada `features` en nuestro proyecto: ahí redactaremos las características. La primera característica será la autenticación de usuarios, así que crearemos el archivo de característica así:

    {%highlight console%}
    $ touch features/autenticar.feature
    {%endhighlight%}

Nótese la terminación especial del archivo: cuando hagamos nuestras pruebas, cucumber considerará todos los archivos terminados en `.feature`.

La escencia de las características es pensar el valor que aportan a la aplicación. Para redactarlas, debemos titularlas, decir para qué sirven, a quién le sirven y qué se lo permitirá. En este caso, escribiremos lo siguiente en el archivo `features/autenticar.feature`

    {%highlight cucumber%}
    #language: es
    Característica: Autenticar usuarios
        Para poder crear retos
        Como un participante
        Quiero estar identificado y autenticado
    {%endhighlight%}

Nótese que en la primera línea especificamos el lenguaje en el que está escrita la característica, porque uno puede escribir características en varios idiomas. Las tres primeras líneas dicen **qué meta** para **quién** mediante **qué comportamiento** ofrece la característica. Como nota marginal, existe un plugin para vim que permite [coloreo de sintaxis de cucumber](https://github.com/tpope/vim-cucumber).

La parte clave de una característica son los [**escenarios**](https://github.com/aslakhellesoy/cucumber/wiki/Given-When-Then). Definidos por las palabras clave *Dado*, *Cuando* y *Entonces*. Éstas definen cosas puntuales que se harían en la aplicación, en términos de **condiciones previas (Dado)**, **acciones clave (Cuando)** y **resultados esperados (Entonces)**.

Redactaremos (agregándolo al archivo `features/autenticar.feature`), por ejemplo, un escenario en el cual un usuario no autenticado entra a nuestra aplicación:

    {%highlight cucumber%}
      Escenario: Un usuario no autenticado entra
        Dado que no estoy autenticado
        Cuando voy a la página raíz
        Entonces debería ver "Login"
        Y debería ver "Register"
    {%endhighlight%}

Cada una de las líneas dentro del escenario se conocen como [**pasos**](https://github.com/aslakhellesoy/cucumber/wiki/Step-Definitions). Éstos se escriben en lenguaje natural y se traducen en acciones que cucumber tomará para probar nuestra aplicación. Si revisamos el archivo `features/step_definitions/*_steps.rb` veremos que ya hay varias acciones en español que cucumber sabe intepretar como acciones de prueba (por ejemplo, la expresión "debería ver" es entendida por cucumber como que en la página el texto en comillas debería existir en algún lugar). 

###Paso 3: crear definiciones de pasos

Todo el punto del desarrollo de afuera hacia adentro es ir haciendo estos escenarios funcionar poco a poco. Para probar nuestros escenarios, escribimos:

    {%highlight console%}
    $ rake cucumber
    {%endhighlight%}

Probablemente nos encontremos con el siguiente error:
    
    /home/lfborjas/teachspace/IV_2010/progra4/coderumble/db/schema.rb doesn't exist yet. Run "rake db:migrate" to create it then try again. If you do not intend to use a database, you should instead alter /home/lfborjas/teachspace/IV_2010/progra4/coderumble/config/boot.rb to limit the frameworks that will be loaded

Lo cual significa que aún no tenemos una base de datos creada. Como veremos más adelante, el comando `rake db:migrate` sirve para actualizar la estructura de la base de datos y se usa mucho en rails. Usémoslo por primera vez, entonces:

    
    {%highlight console%}
    $ rake db:migrate
    $ rake cucumber
    {%endhighlight%}

Ahora sí, cucumber ejecutará nuestros escenarios y nos dará una advertencia: hay algunos pasos en el escenario que no sabe cómo llevar a cabo:

![cucumber complaint 1](http://farm5.static.flickr.com/4126/5152945392_3f51e0cae5.jpg)

Como podemos ver, cucumber nos advierte de los pasos indefinidos -en amarillo- y nos provee un esqueleto de cómo definirlos. Las definiciones de los pasos se deben guardar en la carpeta `features/step_definitions` en archivos terminados en `_steps.rb`. De modo que creamos un nuevo archivo en esa carpeta:

    {%highlight console%}
    $ touch features/step_definitions/autenticar_steps.rb
    {%endhighlight%}

Y, con nuestro editor de texto preferido, agregamos lo siguiente:

    {%highlight ruby%}
    Dado /^que no estoy autenticado$/ do
        #debería haber una ruta en nuestra aplicación a la cual ir para
        #des-autenticarse. Asumamos que existe y es /users/sign_out
        visit "/users/sign_out"
    end
    {%endhighlight%}

El progreso hasta este punto está aquí: <https://github.com/lfborjas/coderumble/commit/11fe5a27079063102e8bbca4293095e0cab1e1fe>

### Paso 4: definir rutas 

Si volvemos a ejecutar el escenario (con `rake cucumber`), veremos lo siguiente:
    
![cucumber complaint 2](http://farm2.static.flickr.com/1241/5152981304_64db78925b.jpg)

Esta vez, el error es *rojo*. Cucumber ya sabe que cuando decimos "voy a ..." nos estamos refiriendo a visitar una página de nuestra aplicación. El problema es que no sabe a qué página nos estamos refiriendo con "la página raíz". Para poder decirle a qué página ir cuando le digamos "la página raíz", **cucumber mismo nos dice que** editemos el archivo `features/support/paths.rb`:

    {%highlight ruby%}
    #aquí hay más código...
    .
    .
    .
    def path_to(page_name)
        case page_name
           when /the home\s?page/
            '/'
           when /la página raíz/
            '/'
    #y aquí hay más código
    .
    .
    .
    {%endhighlight%}
    
Lo que hicimos fue agregar el caso `when /la página raíz/` para decirle a cucumber que, cuando se encuentre esa frase, visite la raíz de nuestras rutas (`'/'`).

El commit para este paso está aquí: <https://github.com/lfborjas/coderumble/commit/c913302243715da7d9dfa2206cb32692d5244903>

Si volvemos a ejecutar `rake cucumber`, veremos algo como esto:

![cucumber complaint 3](http://farm2.static.flickr.com/1438/5153023468_a5b6071377.jpg)

Esta vez, cucumber sí pudo ir a la página raíz. Pero no encontró la palabra "login" por ningún lado. ¿Qué habrá en la página raíz de nuestra aplicación? Veámoslo: para ejecutar nuestra aplicación en rails, corremos `rails server`, y luego accedemos a `http://localhost:3000/` para ver nuestra página raíz

    {%highlight console%}
      $  rails server
      => Booting WEBrick
      => Rails 3.0.1 application starting in development on http://0.0.0.0:3000
      => Call with -d to detach
      => Ctrl-C to shutdown server
      [2010-11-06 19:37:24] INFO  WEBrick 1.3.1
      [2010-11-06 19:37:24] INFO  ruby 1.8.7 (2010-01-10) [i486-linux]
      [2010-11-06 19:37:32] INFO  WEBrick::HTTPServer#start: pid=9510 port=3000

    {%endhighlight%}

*Como nota marginal, he encontrado que WEBrick es un servidor web muy lento, así que instalé [thin]() (que es el mismo que usan en heroku). Dado que nuestra aplicación tiene un archivo `config.ru`, es ejecutable por thin, así que puedo ejecutar `thin start` en lugar de `rails server` para verla en mi web browser.*

Si entramos en un web-browser a `http://localhost:3000/`, veremos la siguiente página:

![default rails page](http://farm2.static.flickr.com/1087/5153048312_b49d5d6a55.jpg)

¿¡De dónde salió eso, si no hemos hecho **nada** de desarrollo!? La respuesta tiene dos partes: cualquier archivo que pongamos en la carpeta `public` de un proyecto de rails será servido sin necesidad de una ruta (pronto veremos qué es eso), y si en esa carpeta hay un archivo llamado "index.html", éste lo pondrá rails en la ruta raíz de la aplicación. Por consiguiente, lo que estamos viendo ahí es el archivo `public/index.html`. (Los curiosos pueden ir a verlo, si quieren, yo espero).

Ok, ¡hoy sí nos toca empezar a desarrollar! Lo primero: quitar ese archivo, porque definitivamente no queremos que la gente ande por ahí creyendo que dejamos las cosas por defecto. Para borrarlo, ejecutamos lo siguiente:

    {%highlight console%}
    $ rm public/index.html
    {%endhighlight%}

Bueno, pero eso sólo arruina más las cosas: ahora ¡ni siquiera tenemos algo en nuestra ruta raíz! Ok, arreglemos eso:

En ruby on rails, como en cualquier aplicación web, accedemos a *recursos* mediante URLs (que son un caso especial de un [URI](http://en.wikipedia.org/wiki/Uniform_Resource_Identifier) ). Como sabremos, una url tiene la sintaxis:

    protocolo :// host /ruta

Una aplicación web funciona bajo el protocolo **http**, así que la primera parte es o `http` o `https`. Como la aplicación estará en un solo *host*, usualmente las rutas con las que trabajamos son la parte desde después del nombre del host. En ruby on rails, estos "mapeos" (asociar una ruta con una acción de nuestro programa), se encuentran en el archivo `config/routes.rb`

Si lo examinamos, veremos un montón de comentarios (los cuales son muy informativos, léanlos, yo espero), pero en esencia, está esto:

    {%highlight ruby%}
    Coderumble::Application.routes.draw do
        #blah blah blah
    end
    {%endhighlight%}

Como podemos ver en los comentarios o en la **[guía oficial sobre rutas](http://guides.rubyonrails.org/routing.html)**, hay una función llamada `root` que recibe un hash con una llave con el símbolo `:to` a la cual se asocia la acción que tomará nuestra aplicación cuando un cliente solicite el recurso de la ruta raíz.**Téngase presente que no siempre la raíz de nuestra aplicación será la ruta vacía ("/"), por lo que la siguiente línea**

    {%highlight ruby%}
        match "/" => "algo#algo"
    {%endhighlight%}

**No es necesariamente equivalente a**
    
    {%highlight ruby%}
        root :to => "algo#algo"
    {%endhighlight%}

Dejando eso claro, nos damos cuenta de algo, podríamos agregar una llamada a la función `root` y así tener una página raíz (que cucumber sigue esperando que creemos bien). Con lo que sabemos, nuestro archivo `config/routes.rb` se podría ver así:


    {%highlight ruby%}
    Coderumble::Application.routes.draw do
        root :to => #??????
    end
    {%endhighlight%}

**¡Un problema!** si bien sabemos que la ruta raíz debería **pasarle el control** a *algo*, no sabemos a *qué*. Aquí entra la siguiente etapa:

Un commit con este mísero cambio que hicimos está acá: <https://github.com/lfborjas/coderumble/commit/2598f22669b0d95c0693f69927df4fb3c7c42ea3>

###Paso 5: definir controladores

Una aplicación en ruby on rails sigue un modelo de arquitectura conocido como MVC: cuando recibe una solicitud HTTP mediante uno de los cuatro verbos básicos (GET, POST, PUT y DELETE), el **enrutador** determina una **acción** que tomar (en base a la ruta **y** el método http). Esta acción en realidad corresponde a un método dentro de un **controlador**: el componente central de la arquitectura, representado como una clase en ruby con varios métodos (los cuales, como dije, se asocian con rutas). El controlador puede o no interactuar con **modelos** que abstraen, mediante clases escritas en ruby *datos persistentes* (como usuarios, retos o respuestas a retos, en nuestro caso). Una vez que un controlador cambia, lee, actualiza o borra información de la base de datos mediante los *métodos* de un modelo, puede interactuar con una **vista**: una vista es una página escrita en un lenguaje de plantillas (siendo [haml](http://haml-lang.com/) y [erb](http://ruby-doc.org/stdlib/libdoc/erb/rdoc/classes/ERB.html)), el cual genera, mediante una combinación de código en ruby y html, un documento que nuestra aplicación puede devolver al cliente (a veces se pueden devolver documentos en xml, json, texto plano o lo que sea, pero en esos casos *no* es necesario interactuar con vistas). El valor de retorno de un método en un controlador -usualmente una llamada al método `respond_to`- será la respuesta al cliente que hizo la solicitud HTTP.*Si una función dentro de un controlador __NO__ tiene valor de retorno, rails buscará una vista con el mismo nombre que la función y la devolverá*.  Un método de instancia, en ruby, se documenta con la expresión "clase#método". **Es una expresión como esta la que asociaremos a la ruta**.

Ahora bien, es obvio, según la explicación precedente, que necesitamos un **controlador** al cual pasarle el mando desde el enrutador. Usualmente la página raíz de una aplicación es una página estática, así que creemos un controlador llamado `static` , para controlar las solicitudes a aquellas partes de nuestra aplicación que no serán más que documentos no-dinámicos:

    {%highlight console%}
    $ rails g controller static index
    {%endhighlight%}

Lo que hicimos fue llamar a la función generadora de rails (pudimos haber escrito `rails generate...` pero existe el atajo `rails g`). El primer parámetro es **qué queremos generar**, en este caso, un controlador. El siguiente parámetro es el nombre del controlador, en este caso, le llamamos `static`. El último parámetro es un número variable de funciones que este controlador podrá manejar, en este caso, sólo habrá una función: la que muestre la página principal; a ésta le pusimos `index`

Notemos que rails generó varios archivos:
    
      create  app/controllers/static_controller.rb
       route  get "static/index"
      invoke  erb
      create    app/views/static
      create    app/views/static/index.html.erb
      invoke  test_unit
      create    test/functional/static_controller_test.rb
      invoke  helper
      create    app/helpers/static_helper.rb
      invoke    test_unit
      create      test/unit/helpers/static_helper_test.rb

Si revisamos el [commit](https://github.com/lfborjas/coderumble/commit/9b08172d63a0c70f04cf351c833d6c55a4d6bebd) de este punto, veremos que, además del controlador en sí (el archivo`app/controllers/static_controller.rb`) también agregó una ruta al **enrutador** (`config/routes.rb`), además de un archivo llamado `app/views/static/index.html.erb` y unas cuantas pruebas.

La carpeta más importante de una aplicación en rails es `app`. Si la revisamos, veremos que tiene, entre otras, tres subcarpetas: `views`, `controllers` y `models`. En éstas estará guardado todo el código núcleo de nuestra aplicación: clases para los **controladores**, que en sus métodos responden a solicitudes e interactuúan con **modelos**, definidos en clases de ruby, que en sus métodos escriben, leen, actualizan o destruyen información en la base de datos; y **vistas**, organizadas en una carpeta por cada controlador generado, que son utilizadas por los mismos controladores para generar documentos que serán retornados al cliente.

Ok. Si ya creamos un controlador y en éste hay un método llamado `index` y ya hay una vista llamada `index.html.erb` ¿ya podremos ir a la ruta raíz y ver **algo**? No, pero, si los curiosos revisaron el archivo de rutas (`config/routes.rb)`, existe una ruta nueva: una que llama al método `get` y lo asocia a `static/index`. Bueno, pero eso no es lo que queríamos, queríamos una ruta **a la raíz de la aplicación** así que editamos el archivo `config/routes.rb` y lo dejamos así:

    {%highlight ruby%}
      Coderumble::Application.routes.draw do
          get "static/index"
          root :to => "static#index"
      end
    {%endhighlight%}

Rails nos provee de ciertas **tareas de administración** ejecutables mediante el comando `rake` (para ver las tareas existentes, ejecute `rakes -T`). Una de esas tareas es  `rake routes`, que nos dice todas las rutas que nuestra aplicación conoce (y a las que, por tanto, puede responder). La ejecución de `rake routes` resulta en una lista de la forma
    
    nombre_de_ruta VERBO_HTTP ruta/propiamente/dicha {:action=>"método que la maneja", :controller=>"controlador"} 

Una ejecución de `rake routes` en este punto resultaría en:

    {%highlight console%}
    $ rake routes
    static_index GET /static/index(.:format) {:action=>"index", :controller=>"static"}
            root     /(.:format)             {:action=>"index", :controller=>"static"}
    {%endhighlight%}

Como podemos ver, en [este momento](https://github.com/lfborjas/coderumble/commit/35a433f47ec107acd17f95f2570a2407a85871ec) hay **dos** maneras de ver la página devuelta por `static#index` (el método `index` en el controlador `static`). Podríamos dejarlo así, pero no es buen diseño tener dos maneras de llegar al mismo lugar, así que editemos el enrutador para que sólo haya una: la solicitud a la ruta raíz:


    {%highlight ruby%}
      Coderumble::Application.routes.draw do
          root :to => "static#index"
      end
    {%endhighlight%}

Bueno, descansemos un rato. Corramos el servidor (con `rails s`, un atajo para `rails server `) a ver qué hace nuestra aplicación cuando entramos a la ruta raíz:

![auto-root](http://farm2.static.flickr.com/1341/5152633899_5c73487aba.jpg)

¡Y eso, ¿de dónde salió?! Cuando corrimos el generador, rails, además de generar la clase del controlador, generó una vista asociada a ésta y le puso algo de html por defecto. Pero antes dijimos que una vista **sólo puede ser usada por un controlador para responder a una solicitud con un archivo html**. Así que eso significa que algo ha de haber en el controlador... Si vemos el archivo `app/controllers/static_controller.rb`, veremos lo siguiente:

    {%highlight ruby%}
    class StaticController < ApplicationController
      def index
        end
    end
    {%endhighlight%}

¡Una clase con un método vacío! Pero, como dijimos antes, **si un método de un controlador está vacío, se devolverá la vista asociada a este controlador que tenga el mismo nombre que el método**. En efecto: existe un archivo llamado `app/views/static/index.html.erb` que contiene, como podríamos esperar:

    {%highlight html%}
    <h1>Static#index</h1>
    <p>Find me in app/views/static/index.html.erb</p>
    {%endhighlight%}

Ahora, ese definitivamente ¡*no* es un documento html completo! Pero, si vemos la fuente en el browser, podríamos ver que sí  lo está (con `doctype` y `head` y todo) ¿De dónde sale lo demás? Rails construye los documentos html de nuestra aplicación a partir de **dos** partes: la vista en sí y un *layout*: que no es más que código html **común** a todas las páginas de la aplicación. Podemos poner en *layouts*  código que sea común a varias páginas. Por defecto, rails utiliza un layout llamado `application.html.erb`, y lo podemos encontrar en `app/views/layouts/application.html.erb`:

    {%highlight html%}
    <!DOCTYPE html>
    <html>
        <head>
            <title>Coderumble</title>
            <%= stylesheet_link_tag :all %>
            <%= javascript_include_tag :defaults %>
            <%= csrf_meta_tag %>
        </head>
        <body>
            <%= yield %>
        </body>
    </html>
    {%endhighlight%}

Dentro del `body` podemos ver una llamada evaluada (en erb, todo lo puesto dentro `<%=%>` es código de ruby cuyo resultado saldrá en la página, mientras que lo puesto entre `<%%>` es código de ruby que se evaluará, pero no pondrá en el documento) de la función `yield`: aquí es donde el html de las otras `views` se agregará.

* Poner register allá
* Ver cómo cucumber pasa
* Hacer prueba funcional
* Ponerlo allá
* Pasarlo a layout
* fin
