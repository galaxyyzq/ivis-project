# ivis-project

## Local Development (from d3's wiki) https://github.com/d3/d3/wiki#local-development
Browsers enforce strict security permissions to prevent you from reading files out of the local file system. To develop locally, you must run a local web server rather than using file://…. Node’s http-server is recommended. 

To install:

``
npm install -g http-server
``

To run:

`` 
http-server & 
``

This will start the server on http://localhost:8080 from the current working directory.

## D3 intellisense/autocomplete
Included ``@types/d3`` in the ``package.json`` file. This will give you autocompletion of d3 code (at lest in Visual Studio Code)

To install:
``npm install``
in project foleder