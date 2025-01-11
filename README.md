
# AppContratos

  

## Descripción

AppContratos es una aplicación diseñada para gestionar contratos de manera eficiente. Permite a los usuarios crear, editar y almacenar contratos, así como realizar un seguimiento de su estado y fechas importantes.

  

## Características

  

-  **Gestión de contratos**: Crear, editar y anular contratos.

-  **Seguimiento de estado**: Monitorear el estado de los contratos (En Proceso, Por Entregar, Entregado).

- **Gestión de Comprobantes**: Crear y eliminar comprobantes por contrato (Boleta o Factura).

- **Envío de correo**: Envío de Contrato y comprobante por correo a cliente.

-  **Gestión de Clientes**: Crear y editar información de clientes.

- **Gestión de Plantillas**: Crear, editar y deshabilitar plantillas.

- **Gestión de Vendedores**: Crear, editar y deshabilitar vendedores.

  

## Instalación

### Pre requisitos

1. Java 11 o superior
2. Variables de entorno:
	- **FOLDER_ID_COMPROBANTES**: ID Google de la carpeta donde se guardarán los comprobantes.
	- **FOLDER_ID_CONTRATOS**: ID Google de la carpeta donde se guardarán los contratos
	- **FRONT_END_RESTABLECER_PASSWORD_URL**: URL de la página para reestablecer contraseña (Se utiliza para el envío de correos de restablecimiento de contraseña). Ejm: http://localhost:4200/restablecer/
	- **JWT_SECRET_KEY**: Clave secreta para JWT
	- **USERNAME_EMAIL**: Email que se usará para enviar correos. Ejm: test@gmail.com
	- **PASSWORD_EMAIL**: Contraseña de aplicacion de la cuenta de correo. Puedes hacerlo desde el siguiente [enlace](https://myaccount.google.com/apppasswords). Ejm: **aaaa bbbb cccc dddd**
	- **DOCUMENT_TEMPLATE_CONTRACT_PATH**: Ruta del documento Word que se usará como plantilla de los contratos.
	- **GOOGLE_CREDENTIALS_PATH**: Ruta de las credenciales de Google generadas en la Consola de Google.
	- **HOST_BD**: Servidor de la base de datos. Ejm: localhost
	- **PORT_BD**: Puerto del servidor de la base de datos. Ejm: 3306
	- **NAME_BD**: Nombre de la base de datos. Ejm: contratosdb
	- **USER_BD**: Usuario para la base de datos.
	- **PASSWORD_BD**: Contraseña para la base de datos
	
3. Clona el repositorio:

```bash

git clone https://github.com/jcabrera9409/appcontratos.git

```

### Pasos para iniciar el Backend
 

1. Navega al directorio del proyecto:

```bash

cd appcontratos

```

3. Instala las dependencias:

```bash

mvn install

```

4. Inicia el backend:

```bash

mvn spring-boot:run

```

### Pasos para iniciar el Frontend
 

1. Navega al directorio del proyecto:

```bash

cd appcontratos-frontal

```

3. Instala las dependencias:

```bash

npm install

```

4. Inicia el backend:

```bash

ng serve

```
  

## Uso

  

1. Inicia sesión en la aplicación. Por defecto se crea el vendedor **admin@admin.com** con contraseña **12345678**

2. Navega a la sección de contratos.

3. Crea un nuevo contrato o selecciona uno existente para editar.

4. Guarda los cambios y realiza un seguimiento del estado del contrato.

  

## Contacto

  

Para cualquier consulta o sugerencia, puedes contactarnos a través de [jobecavi9409@gmail.com](mailto:jobecavi9409@gmail.com).