# Administrador-de-Eventos
Proyecto para la administración de eventos
# Instalación de Ng Bootstrap
ng add @ng-bootstrap/ng-bootstrap
# Instalación de Material
ng add @angular/material


# para el backend si no funcion algun put agregar esto al web config
<system.webServer>
  <modules>
    <remove name="WebDAVModule" />
  </modules>
  <handlers>
    <remove name="WebDAV" />
  </handlers>
</system.webServer>