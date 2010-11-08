---
layout: post
title: "Desarrollo de afuera hacia adentro en rails parte 3: autenticación de usuarios"
---

Esta vez vamos a agregar identificación y autenticación de usuarios al [proyecto](https://github.com/lfborjas/coderumble/commits/master) que empezamos en las dos partes anteriores. Como se recordará, la última vez hicimos un escenario que casi nos llevará a esto: una persona entra por primera vez a la página raíz de la aplicación y ve enlaces a una página de registro y otra de login. Si bien probamos *casi* todo en este escenario, aún no tenemos nada de registro y login. En esta parte corregiremos eso, utilizando [devise](https://github.com/plataformatec/devise). Al final de esta parte publicaremos por primera vez la aplicación a [heroku](http://heroku.com/).

###Paso 1: describir los escenarios

Primero, describiremos un par de escenarios más: cuando un usuario se registra, y cuando un usuario registrado y autenticado ingresa a la página raíz. 

Antes de describir los escenarios, cabe notar que las características en cucumber se pueden escribir en [varios lenguajes naturales](https://github.com/aslakhellesoy/cucumber/wiki/Spoken-languages), y para ver las equivalencias entre el original en inglés y las traducciones, sólo es necesario ejecutar `cucumber --i18n LENGUAJE` (`cucumber --i18n es`, por ejemplo, nos mostraría las equivalencias en español).

En cucumber uno puede describir [antecedentes](https://github.com/aslakhellesoy/cucumber/wiki/Background) para una característica: datos que deberían pre-existir antes de *cada escenario*. Como para el escenario donde entramos como un usuario ya existente, vamos a describir un par de antecedentes para nuestra característica:

    {%highlight cucumber%}
       Antecedentes:
        Dado que los siguientes usuarios existen:
            | username | email           | password    |
            | jgalt    | galt@domain.com | foobarbaz   |
            | ragnard  | ragnar@net.com  | supersecret |
    {%endhighlight%}

Esos antecedentes sencillamente dicen que cada escenario debería contar con que esos usuarios existan. Que tengan nombre de usuario, correo y contraseña es una decisión arbitraria, parte del diseño.

Con estos antecedentes listos, podemos definir dos escenarios:

    {%highlight cucumber%} 
    Escenario: Un usuario autenticado entra
        Dado que estoy autenticado como jgalt
        Cuando voy a la página raíz
        Entonces debería ver "jgalt"
        Y debería ver "Logout"
        Pero no debería ver "Register"
        Y no debería ver "Login"
        Y mostrame la página

    Escenario: Un usuario se registra
        Dado que no estoy autenticado
        Cuando voy a la página de registro
        Y completo "Username" con "lfborjas"
        Y completo "Email" con "self@lfborjas.com"
        Y completo "Password" con "supersecretstuff"
        Y completo "Password confirmation" con "supersecretstuff"
        Y apreto "Sign up"
        Entonces debería ver "signed up successfully"
    {%endhighlight%}

El primer escenario asume que ya existe un usuario llamado "jgalt", y asume bien, pues lo establecimos en los antecedentes. Nótese que usamos la cláusula "Pero" en vez de "Y", ambas son equivalentes como maneras de agregar pasos a una de las tres etapas de un escenario (las cuales son *Dado*, *Cuando*, *Entonces*). También estamos usando un paso especial: `mostrame la página`: con esta orden, cucumber guardará la página y nos la mostrará en un browser, para que veamos cómo terminó la prueba, este comando es útil para escenarios donde no sabemos por qué cucumber no los acepta.

El segundo escenario es cuando un usuario se registra. Como se ve, el escenario asume que en la página habrá, por ejemplo, un lugar donde poner el nombre de usuario, pero no especifíca *cómo* se hará esto (no dice si es un text input, un textarea ni nada similar), sólo dice el **qué**. 

Si ejecutamos `rake cucumber`, veremos lo siguiente

    {%highlight console%}
    $ rake cucumber
    Using the default profile...
    UU----U--------UU------

    3 scenarios (3 undefined)
    22 steps (18 skipped, 4 undefined)
    0m0.388s
    {%endhighlight%}
<pre style="color: #BFA030;">
    You can implement step definitions for undefined steps with these snippets:

    Dado /^que los siguientes usuarios existen:$/ do |table|
      # table is a Cucumber::Ast::Table
      pending # express the regexp above with the code you wish you had
    end

    Dado /^que estoy autenticado como "([^"]*)"$/ do |arg1|
      pending # express the regexp above with the code you wish you had
      end
</pre>

Como vimos la vez pasada, eso significa que nuestra primera tarea es definir esos dos pasos que cucumber no conoce: "Dado que los siguientes usuarios existen..." y "Dado que estoy autenticado como...". Para definirlos, editaremos el archivo `features/step_definitions/autenticar.steps`:

    {%highlight ruby%}
    Dado /^que los siguientes usuarios existen:$/ do |table|
      table.hashes.each do |info|
        #la primera vez sería {:username=>"jgalt", :email=>"galt@domain.com", :password=>"foobarbaz"}
        User.new(info).save!
      end
    end

    Dado /^que estoy autenticado como "([^"]*)"$/ do |username|
      usuario = User.find_by_username username
      Entonces %{voy a login}
      Y %{completo "Email" con "#{usuario.email}"}
      Y %{completo "Password" con "#{usuario.password}"}
      Y %{apreto "Sign in"}
    end

    {%endhighlight%}

En la primera definición de pasos, cucumber nos provee de un [hash](http://ruby-doc.org/core/classes/Hash.html) por cada fila en la tabla. Iteramos por cada una de esas filas y creamos nuevos usuarios, asumiendo que existe un modelo llamado `User` y que éste tiene un método inicializador (`new`) que recibe un hash. Lo que aquí asumimos es que se usará un modelo de [ActiveRecord](http://guides.rubyonrails.org/active_record_validations_callbacks.html) para representar los datos relativos a un usuario, este detalle apunta ya al paso de implementación, así que es en este momento que ese tipo de decisiones se pueden ir tomando. En el segundo escenario, seguimos asumiendo que existe la clase `User` y que ésta es una sub-clase de `ActiveRecord`, por lo que podemos usar el [método dinámicamente generado](http://guides.rubyonrails.org/active_record_querying.html) `find_by_username` para encontrar al usuario con el nombre de usuario que cucumber pasa adentro de la definición del paso. Nótese que usamos acciones de cucumber dentro de esta definición para simular el hecho que ese usuario vaya a una página de login hipotética y se autentique.

Una nueva ejecución de `rake cucumber` resulta en:
<pre style="color: red;">
    FF---------------------

    (::) failed steps (::)

    uninitialized constant User (NameError)
    ./features/step_definitions/autenticar_steps.rb:10
    ./features/step_definitions/autenticar_steps.rb:8:in `each'
    ./features/step_definitions/autenticar_steps.rb:8:in `/^que los siguientes usuarios existen:$/'
    features/autenticar.feature:8:in `Dado que los siguientes usuarios existen:'

    Failing Scenarios:
    cucumber features/autenticar.feature:13 # Scenario: Un usuario no autenticado entra

    3 scenarios (1 failed, 2 skipped)
    22 steps (1 failed, 21 skipped)

</pre>

El mensaje de error dice que no encuentra una constante llamada `User`. Eso significa que no existe una clase llamada `User`, y eso es más que claro: no hemos comenzado a desarrollar esa parte.

El progreso hasta este punto se puede encontrar en el [historial de github](https://github.com/lfborjas/coderumble/commit/4b2f9f39b5b95eeb401d2d29bc25ff8a16cd286d). 

###Paso 2: implementar la funcionalidad de usuarios

Como describimos en los escenarios, vamos a necesitar crear un **modelo** que represente la información de los usuarios, **controladores** que se encarguen de solicitudes relacionadas a éstos y **vistas** que construyan documentos html que el cliente pueda ver para llevar a cabo las acciones que las **rutas** intrepretarán.  Usualmente, esto implicaría [generar](http://guides.rubyonrails.org/command_line.html#rails-generate) modelos y controladores, y escribir la lógica de manipulación de información. Sin embargo, dado que esta tarea es tan común, nos valdremos de un [plugin](http://guides.rubyonrails.org/plugins.html) que hace justo eso.

El plugin en cuestión es [devise](https://github.com/plataformatec/devise), como *todo gem del que nuestro proyecto vaya a depender*, el [primer paso](https://github.com/lfborjas/coderumble/commit/2096a8c5dc4f8eaaa7c87011e001decf14381d42) es instalarlo agregándolo al Gemfile y luego ejecutando `sudo bundle install`.

Luego, nos toca generar el modelo que representará a usuarios, como fue decidido en la redacción de la característica, lo llamaremos `User`:

{%highlight console%}
$ rails g model User username:string
{%endhighlight%}

Notemos que no agregamos el email y password: esos dos serán agregados por devise. 

Cuando creamos nuestro modelo, además del modelo en sí (el archivo  `app/models/user.rb`), se creó un archivo de [pruebas unitarias](http://guides.rubyonrails.org/testing.html#unit-testing-your-models) y una [migración](http://guides.rubyonrails.org/migrations.html). En el *ORM* por defecto de rails, la lógica de manipulación de la información y la estructura están separadas: la primera está en una sub-clase de `ActiveRecord` (en la carpeta `app/models`), y la segunda, en una migración (en la carpeta `db/migrate`). 

* Describir modelo: por qué hay que poner `attr_accessible`
* Pruebas unitarias: el nombre de usuario debería ser único
* fixtures
* Agregar devise
* cambios a las pruebas funcionales: Devise::TestHelpers
* rails g devise:views
* agregar eso a las views
* rake db:migrate
* paths en cucumber
* hardcodear el password en el escenario
* launchy para poder ver páginas




