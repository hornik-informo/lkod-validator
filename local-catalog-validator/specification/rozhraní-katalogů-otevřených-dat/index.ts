import HighValueDatasetJsonSchema from "./2024-05-28/datová-sada-hvd.json";
import DatasetJsonSchema from "./2024-05-28/datová-sada.json";
import DatasetSeriesJsonSchema from "./2024-05-28/datová-série.json";
import Catalog from "./2024-05-28/katalog.json";

export const OpenDataCatalogs20250428 = [
  HighValueDatasetJsonSchema,
  DatasetJsonSchema,
  DatasetSeriesJsonSchema,
  Catalog
];

export const HVD_JSON_SCHEMA_ID = HighValueDatasetJsonSchema["$id"];

export const DATASET_JSON_SCHEMA_ID = DatasetJsonSchema["$id"];

export const SERIES_JSON_SCHEMA_ID = DatasetSeriesJsonSchema["$id"];

export const CATALOG_JSON_SCHEMA_ID = Catalog["$id"];
