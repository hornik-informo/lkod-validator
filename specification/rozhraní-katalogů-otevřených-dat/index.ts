import CatalogJsonSchema from "./2021-01-11/catalog.schema.json";
import CatalogShacl from "./2021-01-11/catalog.shacl";
import Catalog01Sparql from "./2021-01-11/catalog-01.sparql";
import Catalog02Sparql from "./2021-01-11/catalog-02.sparql";
import Catalog03Sparql from "./2021-01-11/catalog-03.sparql";
import Catalog04Sparql from "./2021-01-11/catalog-04.sparql";
import Catalog05Sparql from "./2021-01-11/catalog-05.sparql";
import Catalog06Sparql from "./2021-01-11/catalog-06.sparql";
import DatasetJsonSchema from "./2021-01-11/dataset.schema.json";
import Dataset01Sparql from "./2021-01-11/dataset-01.sparql";
import Dataset02Sparql from "./2021-01-11/dataset-02.sparql";

export const v20210111 = {
  "Catalog": {
    "SPARQL": {
      "ASK": [
        Catalog01Sparql,
        Catalog02Sparql,
        Catalog03Sparql,
        Catalog04Sparql,
        Catalog05Sparql,
        Catalog06Sparql,
      ]
    },
    "SHACL": [
      CatalogShacl,
    ],
    "JSON_SCHEMA": CatalogJsonSchema
  },
  "Dataset": {
    "SPARQL": {
      "ASK": [
        Dataset01Sparql,
      ],
      "SELECT": [
        Dataset02Sparql
      ]
    },
    "SHACL": [],
    "JSON_SCHEMA": DatasetJsonSchema
  }
};
