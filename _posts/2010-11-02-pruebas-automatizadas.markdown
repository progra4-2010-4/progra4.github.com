---
layout: post
title: Desarrollo orientado a pruebas en Ruby on Rails 
---
## TDD

La técnica de desarrollo orientado por pruebas (TDD por sus siglas en inglés) dice que deberías empezar haciendo pruebas antes de hacer el código. Y ruby on rails tiene muchas [facilidades para ello](http://guides.rubyonrails.org/testing.html). 

Existen tres tipos fundamentales de pruebas: 

1. De **unidad**: sirven para probar los elementos fundamentales de una aplicación: clases y funciones. En el caso de RoR: *modelos*.
2. **Funcionales**: para probar paquetes de funcionalidad. En RoR: **controladores**.
3. **De integración**: para probar interacciones entre elementos. En RoR: **interacción entre controladores**

Durante el desarrollo de la clase profundizaremos más en cómo agarrar la costumbre del desarrollo orientado a pruebas e iremos ampliando este artículo.

## Herramientas para TDD

Como es mencionado en el [tutorial de RoR](http://railstutorial.org/chapters/static-pages#sec:TDD), es útil valerse de herramientas que hagan más sencillo el proceso de prueba continua. A diferencia de ese tutorial, que usa [rspec](http://rspec.info/), nosotros usaremos el framework por defecto de RoR: [Test::Unit](http://ruby-doc.org/stdlib/libdoc/test/unit/rdoc/classes/Test/Unit.html).

### Autotest

Para instalar autotest, nos basaremos en [esta guía](http://ph7spot.com/musings/getting-started-with-autotest). Básicamente, lo que tenemos que hacer es instalar las utilidades nativas del sistema necesarias (si usamos linux con gnome, **si estás usando linux con kde, podés saltarte las últimas dos líneas**):

    sudo gem install autotest redgreen
    sudo apt-get install libnotify-bin
    sudo apt-get install xosd-bin

Creamos un archivo en la carpeta raíz (~) llamado `.autotest` y a éste le agregamos:

    require 'redgreen/autotest'
    require "test_notifier/runner/autotest"
    

Y en nuestro `Gemfile` agregamos:

    group :development do
        gem 'autotest-rails-pure', '4.1.0'
        gem 'test_notifier'
    end

Y listo. Ahora sólo ejecutamos `autotest` en la **raíz de nuestro proyecto en rails** y cada vez que cambiemos un archivo al cual esté asociada una prueba, esta se correrá y se mostrará el resultado en pantalla.
