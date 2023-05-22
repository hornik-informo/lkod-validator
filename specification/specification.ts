import { ValidationReporter } from "../validator";

export { ValidationReporter } from "../validator";

export type SparqlAskExecutor = (query: string) => Promise<boolean>;

export type SparqlSelectExecutor = (query: string) => Promise<object[]>;

export type CatalogSparqlValidator = ({
  ask: SparqlAskExecutor,
  select: SparqlSelectExecutor,
  reporter: ValidationReporter,
}) => Promise<void>;

export type DatasetSparqlValidator = ({
  dataset: string,
  ask: SparqlAskExecutor,
  select: SparqlSelectExecutor,
  reporter: ValidationReporter,
}) => Promise<void>;
