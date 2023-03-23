import {ValidationReporter} from "../../../validator";

const create = (dataset: string) => `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX time: <http://www.w3.org/2006/time#>
PREFIX schema: <http://schema.org/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dqv: <http://www.w3.org/ns/dqv#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>

PREFIX pu: <https://data.gov.cz/slovník/podmínky-užití/>

SELECT ?datová_sada ?výsledek
WHERE {
  {
    SELECT ?datová_sada (MAX(?splňuje) AS ?výsledek)
    WHERE {
      {
        SELECT DISTINCT ?datová_sada ?splňuje
        WHERE {
          ?datová_sada a dcat:Dataset .
          BIND(false AS ?splňuje)
        }
      }
      UNION
      {
        SELECT DISTINCT ?datová_sada ?splňuje
        WHERE {
          ?datová_sada a dcat:Dataset ; 
             dcterms:title ?název ;
             dcterms:description ?popis ;
             dcat:keyword ?klíčové_slvo ;
             dcterms:publisher ?poskytovatel .

          FILTER (EXISTS {
              ?datová_sada dcat:theme ?téma .
              FILTER(STRSTARTS(STR(?téma), "http://publications.europa.eu/resource/authority/data-theme/"))
            })

          FILTER (EXISTS {
              ?datová_sada dcterms:accrualPeriodicity ?periodicita .
              FILTER(STRSTARTS(STR(?periodicita), "http://publications.europa.eu/resource/authority/frequency/"))
            })

          FILTER (EXISTS {
              #https://github.com/openlink/virtuoso-opensource/issues/942
              ?datová_sada dcterms:spatial ?uzemní_pokrytí .
              FILTER(STRSTARTS(STR(?uzemní_pokrytí), "https://linked.cuzk.cz/resource/ruian/"))
            })

          FILTER(
            # je to zastřešující datová sada - nemá distribuce, ale má části
            (
              EXISTS {
                [] dcterms:isPartOf ?datová_sada .
              }
              &&
              NOT EXISTS {
                ?datová_sada dcat:distribution [] .
              }
            )
            ||
            # je to soubor ke stažení
            EXISTS {
              ?datová_sada dcat:distribution ?distribuce .

              ?distribuce a dcat:Distribution ;
                           dcat:accessURL ?přístupovéURL ;
                           dcat:downloadURL ?URLkeStažení ;
                           pu:specifikace ?podmínky .

              ?podmínky a pu:Specifikace ;
                           pu:autorské-dílo [] ;
                           pu:databáze-jako-autorské-dílo [] ;
                           pu:databáze-chráněná-zvláštními-právy [] ;
                           pu:osobní-údaje [] .

              FILTER (EXISTS {
                  ?distribuce dcat:mediaType ?mediaType .
                  FILTER(STRSTARTS(STR(?mediaType), "http://www.iana.org/assignments/media-types/"))
                })

              FILTER (EXISTS {
                  ?distribuce dcterms:format ?format .
                  FILTER(STRSTARTS(STR(?format), "http://publications.europa.eu/resource/authority/file-type/"))
                })
            }
            ||
            # je to datová služba
            EXISTS {
              ?datová_sada dcat:distribution ?distribuce .

              ?distribuce a dcat:Distribution ;
                           dcat:accessURL ?přístupovéURL ;
                           dcat:accessService ?datová_služba ;
                           pu:specifikace ?podmínky .

              ?podmínky a pu:Specifikace ;
                           pu:autorské-dílo [] ;
                           pu:databáze-jako-autorské-dílo [] ;
                           pu:databáze-chráněná-zvláštními-právy [] ;
                           pu:osobní-údaje [] .

              ?datová_služba a dcat:DataService ;
                           dcterms:title ?název_služby ;
                           dcat:endpointURL ?urlEndpointu .
            }
          )
          BIND(true AS ?splňuje)
        }
      }
    }
    GROUP BY ?datová_sada
  }
}`;

const handle = (reporter: ValidationReporter, bindings: object[]) => {
  for (let binding of bindings) {
    const dataset = binding["datová_sada"].value;
    const passed = binding["výsledek"].value;
    reporter.beginDatasetValidation(dataset);
    if (passed === "1") {
      reporter.info("SPARQL", `Datová sada má všechny povinné atributy.`);
    } else {
      reporter.info("SPARQL", `Datová sada nemá všechny povinné atributy.`);
    }
    reporter.endResourceValidation();
  }
};

export default {
  create,
  handle
};
