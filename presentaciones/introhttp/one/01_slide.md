!SLIDE 
# Introducción a HTTP #

!SLIDE bullets incremental
# El protocolo consiste en #

* Un cliente, que hace solicitudes
* Una manera de encontrar un servidor (via TCP)
* Un servidor, que responde con documentos

!SLIDE smbullets
# El cliente (user agent) #

* Hace una solicitud con:
* Acción(verbo) + Dirección + protocolo: `GET \ HTTP/1.1`
* Encabezados
* Línea en blanco + mensaje opcional
* Ejemplo con browser + ejemplo con curl + ejemplo con python

!SLIDE smbullets
# El servidor#

* Determina si puede responder con un documento o **Pasar control a un programa**
* Responde con un documento con ciertos datos y cuerpo
* Entre los datos:
* Tipo de contenido (Content-Type), suele ser `HTML`, pero hay más
* Código de estado (200: OK, 302, redirección, 404: no encontrado, 500, error, etc.)
* Explorar la app de sinatra (explicar sintaxis de ruby)

!SLIDE smbullets
#¿Qué está involucrado en webapps?#

* Lado del cliente:
* Estructurar con html
* Estilar con css
* Javascript: comportamiento dinámico
* Interpretar json o xml
* Ejemplo de pág html

!SLIDE smbullets
#¿Qué está involucrado en webapps?#
* Poder ser encontrado:
* Disponer de un nombre de dominio
* Tener una dirección pública
* Y que esa dirección se refiera a un(os) servidor(es)

!SLIDE smbullets
#¿Qué está involucrado en webapps?#

* Lado del servidor:
* Servicio de archivos estáticos
* Generación dinámica de documentos
* Persistencia en bases de datos


