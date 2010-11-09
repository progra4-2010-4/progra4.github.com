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
{%highlight console%}    
   You can implement step definitions for undefined steps with these snippets:

    Dado /^que los siguientes usuarios existen:$/ do |table|
      # table is a Cucumber::Ast::Table
      pending # express the regexp above with the code you wish you had
    end

    Dado /^que estoy autenticado como "([^"]*)"$/ do |arg1|
      pending # express the regexp above with the code you wish you had
      end
{%endhighlight%}

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

{%highlight console%}
uninitialized constant User (NameError)
features/autenticar.feature:8:in `Dado que los siguientes usuarios existen:'

Failing Scenarios:
cucumber features/autenticar.feature:13 # Scenario: Un usuario no autenticado entra

3 scenarios (1 failed, 2 skipped)
22 steps (1 failed, 21 skipped)
{%endhighlight%}

El mensaje de error dice que no encuentra una constante llamada `User`. Eso significa que no existe una clase llamada `User`, y eso es más que claro: no hemos comenzado a desarrollar esa parte.

El progreso hasta este punto se puede encontrar en el [historial de github](https://github.com/lfborjas/coderumble/commit/4b2f9f39b5b95eeb401d2d29bc25ff8a16cd286d). 

###Paso 2: implementar la funcionalidad de usuarios

Como describimos en los escenarios, vamos a necesitar crear un **modelo** que represente la información de los usuarios, **controladores** que se encarguen de solicitudes relacionadas a éstos y **vistas** que construyan documentos html que el cliente pueda ver para llevar a cabo las acciones que las **rutas** intrepretarán.  Usualmente, esto implicaría [generar](http://guides.rubyonrails.org/command_line.html#rails-generate) modelos y controladores, y escribir la lógica de manipulación de información. Sin embargo, dado que esta tarea es tan común, nos valdremos de un [plugin](http://guides.rubyonrails.org/plugins.html) que hace justo eso.

El plugin en cuestión es [devise](https://github.com/plataformatec/devise), como *todo gem del que nuestro proyecto vaya a depender*, el [primer paso](https://github.com/lfborjas/coderumble/commit/2096a8c5dc4f8eaaa7c87011e001decf14381d42) es instalarlo agregándolo al Gemfile y luego ejecutando `sudo bundle install`.

Luego, nos toca generar el modelo que representará a usuarios, como fue decidido en la redacción de la característica, lo llamaremos `User` y, en lugar de un generador normal (`model`), lo generaremos con devise: para ello **antes habrá que instalar devise, y, luego, generar el modelo en sí**:

{%highlight console%}
$ rails g devise:install
$ rails g devise User username:string
{%endhighlight%}

Notemos que no agregamos el email y password: esos dos serán agregados por devise. 

Cuando creamos nuestro modelo, además del modelo en sí (el archivo  `app/models/user.rb`), se creó un archivo de [pruebas unitarias](http://guides.rubyonrails.org/testing.html#unit-testing-your-models) y una [migración](http://guides.rubyonrails.org/migrations.html). En el *ORM* por defecto de rails, la lógica de manipulación de la información y la estructura están separadas: la primera está en una sub-clase de `ActiveRecord` (en la carpeta `app/models`), y la segunda, en una migración (en la carpeta `db/migrate`) que actualizará la estructura de la base de datos.

Dado que la estructura y la lógica del modelo están separadas -todos los datos miembros (o propiedades, columnas, etc.) están en las migraciones, mientras que la lógica está en la clase en sí- a veces se vuelve tedioso cambiar entre modelos y migraciones para saber a qué se tiene acceso, mas existe una herramienta útil para estar al tanto de qué columnas tiene un modelo en la base de datos y es [annotate-models](https://github.com/ctran/annotate_models), que se instala con `gem install annotate-models` y se ejecuta desde la raíz del proyecto en rails con `annotate`. Esto agregará comentarios con una descripción de la estructura de la base de datos a los modelos.

Ahora bien, el siguiente paso, después de hacer un modelo es definir cuál será su comportamiento deseado. Mucho de ese comportamiento -que tenga un email único, un password seguro, etc.- **ya está [probado](https://github.com/plataformatec/devise/tree/master/test/models/) en devise**. Pero hay que recordar que agregamos un campo: `username`. Este campo también debería ser único y no debería poder estar vacío. Para definir este comportamiento deseado, creamos **pruebas unitarias**. En este caso, editaremos el archivo `test/unit/user_test.rb`:

    {%highlight ruby%}
    require 'test_helper'

    class UserTest < ActiveSupport::TestCase

      test "a user is created with username, email and password" do
        u = User.new :username => "foobar",
                     :email    => "bar@foo.com",
                     :password => "barfoo"

        assert u.save
      end

      test "a username can't be empty" do
        u = User.new :username => "",
                     :email    => "foo@bar.com",
                     :password => "barfoo"

        assert !u.save
        assert_equal 1, u.errors.size
        assert u.errors[:username].any?
      end

      test "a username must be unique" do
        uname = "johndoe"
        u1 = User.new :username=>uname, :email=>"mail@net.com", :password=>"bazbar"

        assert u1.save

        u2 = User.new :username=>uname, :email=>"net@mail.com", :password=>"supersecret"

        assert !u2.save
        assert_equal 1, u2.errors.size
        assert u2.errors[:username].any?

      end
    end
    {%endhighlight%}

Para cada uno de los **casos posibles** en la creación de usuarios redactaremos una prueba. Rails nos provee del método `test` que recibe como parámetro el nombre de la prueba y contiene un bloque donde pondremos el cuerpo de la prueba. En una prueba, la finalidad es utilizar [aserciones](http://guides.rubyonrails.org/testing.html#assertions-available) que determinan si una condición se cumple. En la primera prueba, por ejemplo, decimos que se asegure que el método `save` de una nueva instancia de usuario retorne un valor verdadero. En rails, el método `save` devuelve un valor de verdad que representa si un registro se logró guardar. En la segunda prueba, tratamos de crear un usuario sin nombre de usuario, así que usamos una aserción para ver que **no** se guarde (de ahí el uso de la negación, con el operador `!`). Pero no sólo nos quedamos ahí, también nos aseguramos que el guardado haya causado un solo error (la aserción `assert_equal`) y que ese error sea en el nombre de usuario. Así tenemos la certeza de que si un usuario recién creado no se guarda, es porque no le pusimos `username`, y no por otra cosa.

Si tratamos de ejecutar esta prueba (con `rake test:units`, para sólo ejecutar las pruebas de unidad), pasará lo siguiente:

{%highlight console%}
$ rake test:units
You have 1 pending migrations:
20101108232642 DeviseCreateUsers
Run "rake db:migrate" to update your database then try again.
{%endhighlight%}

Lo que está pasando ahí es que **siempre que cambiemos la estructura de la base de datos en migraciones, debemos ejecutarlas para que la verdadera base de datos esté actualizada**. Eso lo hacemos con `rake db:migrate`

Ahora bien, el modelo de desarrollo que uno sigue cuando implementa componentes concretos (modelos, vistas y controladores) es el [ciclo red/green/refactor](http://railstutorial.org/chapters/static-pages#sec:TDD). Eso significa que uno escribe pruebas que **fallarán**, y luego hace que el código las haga funcionar.

Si volvemos a correr las pruebas, veremos algo como lo siguiente:

<pre style="color: red;">
ActiveRecord::RecordNotUnique: SQLite3::ConstraintException: column email is not unique:
</pre>

¡Ese error no tiene nada que ver con nuestras pruebas! En realidad, tiene que ver con otra cosa que pasa tras las escenas al ejecutar pruebas: el cargado de *fixtures*: datos de prueba que están disponibles para cualquier prueba. Éstos se encuentran en `test/fixtures`. Resulta que al crear el modelo con devise, se crearon datos de prueba para usuarios, **pero estaban vacíos**:

{%highlight yaml%}
one: {}
# column: value
#
two: {}
#  column: value
{%endhighlight%}

Cambiémoslo por datos de verdad:

{%highlight yaml%}
one: 
  email: some@user.com
  username: someuser

two: 
  emails: user@domain.com
  username: johngalt

{%endhighlight%}

Corregido esto, si volvemos a ejecutar la prueba, veremos nuestro primer *rojo* útil:

<pre style="color: red;">
1) Failure:
test_a_username_can't_be_empty(UserTest) [/test/unit/user_test.rb:18]:
false is not true.

2) Failure:
test_a_username_must_be_unique(UserTest) [/test/unit/user_test.rb:31]:
false is not true.

3 tests, 4 assertions, 2 failures, 0 errors
</pre>

Eso quiere decir que los usuarios, que **no** se deberían poder estar guardando en la base de datos cuando el nombre de usuario está vacío o es repetido ¡Sí lo están haciendo!

Es hora de corregir eso, editaremos el archivo  `app/models/user.rb`  para que se vea así:

    {%highlight ruby%}
    class User < ActiveRecord::Base
      # Include default devise modules. Others available are:
      # :token_authenticatable, :confirmable, :lockable and :timeoutable
      devise :database_authenticatable, :registerable,
             :recoverable, :rememberable, :trackable, :validatable

      # Setup accessible (or protected) attributes for your model
      attr_accessible :email, :password, :password_confirmation, :remember_me, :username

      validates_presence_of :username
      validates_uniqueness_of :username
    end

    {%endhighlight%}

Hay unas cuantas cosas importantes que notar aquí:

1. `attr_accessible`: es una manera de decir: "estos atributos pueden ser escritos mediante [asignación en masa](http://jboxer.com/2010/01/the-importance-of-attr_accessible-in-ruby-on-rails/)", lo cual significa que se pueden usar como parte del hash de parámetros de métodos como `new`.
2. `validates_presence_of` y `validates_uniqueness_of` son [validaciones](http://guides.rubyonrails.org/active_record_validations_callbacks.html) que **no** permiten que un registro se guarde a menos que sus condiciones se cumplan. En este caso, que no sea vacío y que sea único, justo lo que buscábamos.

Si volvemos a ejecutar las pruebas de unidad (con `rake test:units`):

<pre style="color:green;">
3 tests, 8 assertions, 0 failures, 0 errors
</pre>

¡Éxito! El modelo de usuarios está listo.

Durante este paso hicimos varios commits. Están disponibles desde [aquí](https://github.com/lfborjas/coderumble/commit/10ea1ee8e3bd158efd3355c52d629e54707a543f) hasta [acá](https://github.com/lfborjas/coderumble/commit/0fb9d6f3b4d3663fa83266a1dcc21eca74ca4bcd) en el historial de github.

###Paso 3: hacer visible la funcionalidad de usuarios

Acabamos de hacer cambios bastante serios: no solo generó devise un nuevo modelo listo para autenticación, sino que agregó nuevas rutas, como vemos tras una rápida ejecución de `rake routes`:

    {%highlight console%}
    $rake routes
          new_user_session GET    /users/sign_in(.:format)       {:controller=>"devise/sessions", :action=>"new"}
              user_session POST   /users/sign_in(.:format)       {:controller=>"devise/sessions", :action=>"create"}
      destroy_user_session GET    /users/sign_out(.:format)      {:controller=>"devise/sessions", :action=>"destroy"}
             user_password POST   /users/password(.:format)      {:controller=>"devise/passwords", :action=>"create"}
         new_user_password GET    /users/password/new(.:format)  {:controller=>"devise/passwords", :action=>"new"}
        edit_user_password GET    /users/password/edit(.:format) {:controller=>"devise/passwords", :action=>"edit"}
             user_password PUT    /users/password(.:format)      {:controller=>"devise/passwords", :action=>"update"}
         user_registration POST   /users(.:format)               {:controller=>"devise/registrations", :action=>"create"}
     new_user_registration GET    /users/sign_up(.:format)       {:controller=>"devise/registrations", :action=>"new"}
    edit_user_registration GET    /users/edit(.:format)          {:controller=>"devise/registrations", :action=>"edit"}
         user_registration PUT    /users(.:format)               {:controller=>"devise/registrations", :action=>"update"}
         user_registration DELETE /users(.:format)               {:controller=>"devise/registrations", :action=>"destroy"}
                      root        /(.:format)                    {:controller=>"static", :action=>"index"}

    {%endhighlight%}

Es importante notar que las rutas `new_user_session` y `new_user_registration` apuntan a controladores propios de devise que sirven para hacer *login* y *sign up*, respectivamente. Así que ¿ya estarán listos nuestros escenarios?

Correr `rake cucumber` resulta en:

<pre style="color: red;">
(::) failed steps (::)

Can't find mapping from "la página de registro" to a path.
Now, go and add a mapping in ~/coderumble/features/support/paths.rb (RuntimeError)
./features/support/paths.rb:29:in `path_to'
./features/step_definitions/web_steps.rb:24:in `/^(?:|I )go to (.+)$/'
features/autenticar.feature:21:in `Cuando voy a la página de registro'

Can't find mapping from "login" to a path.
Now, go and add a mapping in ~/coderumble/features/support/paths.rb (RuntimeError)
./features/support/paths.rb:29:in `path_to'
./features/step_definitions/web_steps.rb:24:in `/^(?:|I )go to (.+)$/'
features/autenticar.feature:30:in `Dado que estoy autenticado como "jgalt"'

Failing Scenarios:
cucumber features/autenticar.feature:19 # Scenario: Un usuario se registra
cucumber features/autenticar.feature:29 # Scenario: Un usuario autenticado entra

3 scenarios (2 failed, 1 passed)
22 steps (2 failed, 12 skipped, 8 passed)

</pre>


Esos errores significan que cucumber aún no sabe a qué nos referimos cuando decimos "la página de registro" o "login". Como la última vez, editamos el archivo `features/support/paths.rb`:

{%highlight ruby%}
module NavigationHelpers
#.
#.
#.
when /login/
      new_user_session_path
    when /la página de registro/
      new_user_registration_path
#.
#.
#.
{%endhighlight%}

Volver a ejecutar `rake cucumber` resultará en:

<pre style="color: red;">
(::) failed steps (::)

cannot fill in, no text field, text area or password field with id, name, or label 'Username' found 
./features/step_definitions/web_steps.rb:41
./features/step_definitions/web_steps.rb:14:in `with_scope'
./features/step_definitions/web_steps.rb:40:in `/^(?:|I )fill in "([^"]*)" with "([^"]*)"(?: within "([^"]*)")?$/'
features/autenticar.feature:22:in `Y completo "Username" con "lfborjas"'

false is not true. (Test::Unit::AssertionFailedError)
/usr/lib/ruby/1.8/test/unit/assertions.rb:48:in `assert_block'
/usr/lib/ruby/1.8/test/unit/assertions.rb:500:in `_wrap_assertion'
/usr/lib/ruby/1.8/test/unit/assertions.rb:46:in `assert_block'
/usr/lib/ruby/1.8/test/unit/assertions.rb:63:in `assert'
/usr/lib/ruby/1.8/test/unit/assertions.rb:495:in `_wrap_assertion'
/usr/lib/ruby/1.8/test/unit/assertions.rb:61:in `assert'
./features/step_definitions/web_steps.rb:112
./features/step_definitions/web_steps.rb:14:in `with_scope'
./features/step_definitions/web_steps.rb:108:in `/^(?:|I )should see "([^"]*)"(?: within "([^"]*)")?$/'
features/autenticar.feature:32:in `Entonces debería ver "jgalt"'

Failing Scenarios:
cucumber features/autenticar.feature:19 # Scenario: Un usuario se registra
cucumber features/autenticar.feature:29 # Scenario: Un usuario autenticado entra

3 scenarios (2 failed, 1 passed)
22 steps (2 failed, 9 skipped, 11 passed)
0m1.124s

</pre>

¿Qué está pasando? Hay dos problemas:

1. En el escenario de registro no está encontrando el campo donde ingresar un nombre de usuario.
2. Después de que un usuario autenticado entra a la página, no está viendo su nombre de usuario.

Corramos el servidor (con `rails server`) para ver qué está pasando en esa página de registro:

![register fail](http://farm2.static.flickr.com/1234/5159711325_422fdf4135.jpg)

Como se puede ver, en esta vista **autogenerada** por devise, *no está el campo de username* ¿Por qué? Porque nosotros lo creamos por aparte al generar el modelo: no está predefinido en devise, de modo que no está en ninguna de sus vistas. ¿La solución? Agregar el campo a la vista, ¿no? Ok. ¿Dónde está la vista?...

Si revisamos nuestra aplicación así como está [en este momento](https://github.com/lfborjas/coderumble/tree/7a4e25058f83a6055d4573f07e30416da1df89b0/app/views) *Ni siquiera hay una carpeta de vistas para devise*. Entonces, ¿cómo le hacemos? Bueno, para situaciones como esta los autores de devise nos proveen de otro generador:

{%highlight console%}
$ rails g devise:views
{%endhighlight%}

Después de ejecutar ese comando [se clonaron todas las vistas que usa devise a nuestro proyecto](https://github.com/lfborjas/coderumble/commit/13eee020228ad8fb5cc20db2d0bc86b24b0fdc53), lo cual significa que podemos buscar una vista que sea la de registro, y cambiarla. 

Si ejecutamos `rake routes` veremos, entre otras cosas, lo siguiente:

    new_user_registration GET    /users/sign_up(.:format)       {:controller=>"devise/registrations", :action=>"new"}

La ruta de registro está relacionada al método `new` dentro del controlador `registrations` de los controladores de `devise`. Ahora bien, por convención, una vista tiene el mismo nombre que el método que la utiliza, si revisamos la carpeta de vistas que devise nos acaba de regalar, vemos que en efecto existe el archivo `app/views/devise/registrations/new.html.erb`:

    {%highlight erb%}
        <h2>Sign up</h2>

        <%= form_for(resource, :as => resource_name, :url => registration_path(resource_name)) do |f| %>
          <%= devise_error_messages! %>

          <p><%= f.label :email %><br />
          <%= f.text_field :email %></p>

          <p><%= f.label :password %><br />
          <%= f.password_field :password %></p>

          <p><%= f.label :password_confirmation %><br />
          <%= f.password_field :password_confirmation %></p>

          <p><%= f.submit "Sign up" %></p>
        <% end %>

        <%= render :partial => "devise/shared/links" %>

    {%endhighlight%}

Como se puede ver, parece ser un form normal, pero en vez de html puro nos encontramos con una plantilla en erb y varios métodos de [soporte de formularios](http://guides.rubyonrails.org/form_helpers.html). Como podemos ver, se está creando un formulario que se asocia a un recurso (el cual es, en este caso, una instancia del modelo `User`), y se crean entradas para cada uno de los campos editables de éste. Pues bien, es hora de agregar el que dice cucumber que falta: el de nombre de usuario:


{%highlight erb%}
    <h2>Sign up</h2>

    <%= form_for(resource, :as => resource_name, :url => registration_path(resource_name)) do |f| %>
      <%= devise_error_messages! %>

      <p><%= f.label :username %><br />
      <%= f.text_field :username %></p>

      <p><%= f.label :email %><br />
      <%= f.text_field :email %></p>

      <p><%= f.label :password %><br />
      <%= f.password_field :password %></p>

      <p><%= f.label :password_confirmation %><br />
      <%= f.password_field :password_confirmation %></p>

      <p><%= f.submit "Sign up" %></p>
    <% end %>

    <%= render :partial => "devise/shared/links" %>

{%endhighlight%}

Ahora con el segundo problema: luego de autenticarse, está esperando ver el nombre de usuario. Pero ¿tenemos eso en el layout? (que es la vista donde pusimos los links de registro y login). Si revisamos el proyecto tal como está en [este momento](https://github.com/lfborjas/coderumble/blob/300828829f5694252c1e50c121ad96e1747fe296/app/views/layouts/application.html.erb) vemos que no está. Es más, el layout actualmente va a mostrar esos enlaces **siempre, porque no sabe distinguir entre usuarios autenticados y no autenticados** (¿por qué?). Afortunadamente, devise nos provee de [métodos de soporte](http://guides.rubyonrails.org/layouts_and_rendering.html) (que son métodos a los cuales los **controladores y vistas** pueden acceder globalmente), estos métodos son  `user_signed_in?`, que determina si hay un usuario autenticado y `current_user`, que devuelve la instancia del modelo autenticado actual (la cual *puede ser ninguna, si no está autenticado*). Con eso en mente, y con la necesidad de mostrar el nombre de usuario a los usuarios autenticados, cambiamos el layout:

{%highlight erb%}
<!DOCTYPE html>
    <html>
    <head>
      <title>Coderumble</title>
      <%= stylesheet_link_tag :all %>
      <%= javascript_include_tag :defaults %>
      <%= csrf_meta_tag %>
    </head>
    <body>
      <header>
      <h1><%=link_to "CodeRumble", root_path%></h1>
      <nav>
        <%unless user_signed_in?%>
            <%=link_to "Login", new_user_session_path%>
            <%=link_to "Register", new_user_registration_path%>
          <%else%>
            <%=current_user.username%>
            <%= link_to "Logout", destroy_user_session_path %>
        <%end%>  
        </nav>
      </header>
      <%= yield %>

    </body>
    </html>
{%endhighlight%}

Como se puede ver, introdujimos una condición: a menos que haya un usuario autenticado, mostramos los enlaces de login y registro. Si no (y eso significa que *sí* hay un usuario autenticado), entonces muestra el nombre de usuario y un enlace para salir. Nótese que cambiamos el uso de rutas literales, y ahora estamos usando los **nombres de ruta** que aparecen al ejecutar `rake routes`, esto nos libra de la responsabilidad de tener que estar cambiando las rutas literales en toda las vistas si algún día decidimos cambiarlas, porque los nombres no cambiarán. 

Si volvemos a correr `rake cucumber`:

<pre style="color: red;">
(::) failed steps (::)

false is not true. (Test::Unit::AssertionFailedError)
/usr/lib/ruby/1.8/test/unit/assertions.rb:48:in `assert_block'
/usr/lib/ruby/1.8/test/unit/assertions.rb:500:in `_wrap_assertion'
/usr/lib/ruby/1.8/test/unit/assertions.rb:46:in `assert_block'
/usr/lib/ruby/1.8/test/unit/assertions.rb:63:in `assert'
/usr/lib/ruby/1.8/test/unit/assertions.rb:495:in `_wrap_assertion'
/usr/lib/ruby/1.8/test/unit/assertions.rb:61:in `assert'
./features/step_definitions/web_steps.rb:112
./features/step_definitions/web_steps.rb:14:in `with_scope'
./features/step_definitions/web_steps.rb:108:in `/^(?:|I )should see "([^"]*)"(?: within "([^"]*)")?$/'
features/autenticar.feature:27:in `Entonces debería ver "signed up successfully"'

false is not true. (Test::Unit::AssertionFailedError)
/usr/lib/ruby/1.8/test/unit/assertions.rb:48:in `assert_block'
/usr/lib/ruby/1.8/test/unit/assertions.rb:500:in `_wrap_assertion'
/usr/lib/ruby/1.8/test/unit/assertions.rb:46:in `assert_block'
/usr/lib/ruby/1.8/test/unit/assertions.rb:63:in `assert'
/usr/lib/ruby/1.8/test/unit/assertions.rb:495:in `_wrap_assertion'
/usr/lib/ruby/1.8/test/unit/assertions.rb:61:in `assert'
./features/step_definitions/web_steps.rb:112
./features/step_definitions/web_steps.rb:14:in `with_scope'
./features/step_definitions/web_steps.rb:108:in `/^(?:|I )should see "([^"]*)"(?: within "([^"]*)")?$/'
features/autenticar.feature:32:in `Entonces debería ver "jgalt"'

Failing Scenarios:
cucumber features/autenticar.feature:19 # Scenario: Un usuario se registra
cucumber features/autenticar.feature:29 # Scenario: Un usuario autenticado entra
</pre>

¿Qué es eso de "signed up successfully"? Es el mensaje que el usuario debería ver después de registrarse. En rails, cuando la respuesta a una solicitud debería causar que un mensaje aparezca en la **siguiente solicitud**, uno se vale de un objeto llamado *[flash](http://guides.rubyonrails.org/action_controller_overview.html#the-flash)*. Como se puede ver en la documentación, hay dos tipos de flash:   `:error` y `:notice`. Estos mensajes siempre deberían estar visibles, si existen, así que los agregamos al layout:

{%highlight erb%}
    <!DOCTYPE html>
    <html>
    <head>
      <title>Coderumble</title>
      <%= stylesheet_link_tag :all %>
      <%= javascript_include_tag :defaults %>
      <%= csrf_meta_tag %>
    </head>
    <body>
      <header>
      <h1><%=link_to "CodeRumble", root_path%></h1>
      <nav>
        <%unless user_signed_in?%>
            <%=link_to "Login", new_user_session_path%>
            <%=link_to "Register", new_user_registration_path%>
          <%else%>
            <%=current_user.username%>
            <%= link_to "Logout", destroy_user_session_path %>
        <%end%>
        </nav>
      </header>
      <p class="notice"><%= flash[:notice] %></p>
      <p class="error"><%= flash[:error] %></p>
      <%= yield %>

    </body>
    </html>

{%endhighlight%}


Ok, todo debería pasar, ¿no?

Si corremos cucumber (con `rake cucumber`) una vez más:

<pre style="color: red;">
features/autenticar.feature:32:in `Entonces debería ver "jgalt"'

Failing Scenarios:
cucumber features/autenticar.feature:29 # Scenario: Un usuario autenticado entra
</pre>

¿Cómo es eso? ¿*Sigue* fallando la autenticación? ¡Pero si le pusimos el password en la definición de paso! En estos casos, en lugar de empezar a cambiar todo hasta que funcione, recurrimos a la [consola de rails](http://guides.rubyonrails.org/command_line.html#rails-console):

{%highlight console%}
$ rails console
> Loading development environment (Rails 3.0.1)
> irb(main):002:0> User.new(:email=>"jgalt@domain.net", :username=>"jgalt", :password=>"foobarbaz").save
=> true
> irb(main):003:0> User.first.password
=> nil
{%endhighlight%}

¿Cómo es eso? El usuario se guardó, porque la consola devolvió `true`, pero cuando queremos acceder al `password`, se nos devuelve `nil`. Resulta que devise [almacena los passwords de forma cifrada]() de forma que **no son accesibles directamente**. ¿Cómo arreglamos esto?, sólo cambiamos nuestro escenario: en vez de usar `user.password`, escribimos la contraseña literalmetne, según lo declaramos en los antecedentes:

{%highlight ruby%}
    Dado /^que estoy autenticado como "([^"]*)"$/ do |username|
      usuario = User.find_by_username username
      Entonces %{voy a login}
      Y %{completo "Email" con "#{usuario.email}"}
      Y %{completo "Password" con "foobarbaz"}
      Y %{apreto "Sign in"}
    end
{%endhighlight%}

Por último, corremos los escenarios y todo salió bien:

<pre style="color: green;">

    Using the default profile...
    ......................Sorry, you need to install launchy to open pages: `gem install launchy`
    .

    3 scenarios (3 passed)
    22 steps (22 passed)
    0m1.303s
    Loaded suite /usr/bin/rake
    Started

    Finished in 0.000233 seconds.

    0 tests, 0 assertions, 0 failures, 0 errors

</pre>

Excepto por un mínimo detalle: aquél paso que decía "mostrame la página" no funciona, a menos que instalemos un gem llamado `launchy`. Si lo agregamos al `Gemfile`, corremos `bundle install` y volvemos a correr los escenarios, todo saldrá igual, **pero**, al final, una nueva ventana del browser se abrirá con esto:

![WOW](http://farm5.static.flickr.com/4112/5160611708_2ab3379b49.jpg)

El estado final de esta parte lo podemos encontrar [acá en github](https://github.com/lfborjas/coderumble/commit/6b1eca9bfe5422cf979a9ab39d363a777f584333).

