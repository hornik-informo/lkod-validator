export default `
@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <https://example.org/> .

# This does not work in Zazuko, works in SHACL Play! though... 🤷🏻‍♂️
ex:ExistenceKatalogu
  a sh:NodeShape ;
  sh:description "Existuje katalog"@cs ;
	sh:targetNode dcat:Catalog ;
    sh:property [
      sh:path [ sh:inversePath rdf:type ];
      sh:minCount 1;
    ] .

ex:PovinnéAtributyKatalogu
  a sh:NodeShape ;
	sh:targetClass dcat:Catalog ;
	sh:property [
    sh:path dcterms:title ;
    sh:kind sh:Literal ;
		sh:datatype rdf:langString ;
    sh:minCount 1;
    sh:uniqueLang true;
    sh:message "Katalog musí mít název v češtině"@cs
  ] ;
	sh:property [
    sh:path dcterms:description ;
    sh:kind sh:Literal ;
    sh:datatype rdf:langString ;
    sh:minCount 1;
    sh:uniqueLang true;
    sh:message "Katalog musí mít popis v češtině"@cs
  ] ;
  sh:property [
    sh:path dcat:dataset ;
    sh:kind sh:IRI ;
    sh:minCount 1;
    sh:message "Katalog musí mít datovou sadu"@cs
  ] ;
  sh:property [
    sh:path dcterms:publisher ;
    sh:kind sh:IRI ;
    sh:minCount 1;
    sh:maxCount 1;
    sh:message "Katalog musí mít poskytovatele"@cs
  ] .`;
