import { useTranslation } from "react-i18next";

import {
  CatalogSummary,
  DatasetSummary,
  EntrypointSummary,
} from "./summary-service";
import { Level } from "../../validator";
import { MessageListItem } from "./message-list-item";
import List from "@mui/material/List";
import React from "react";

export const Summary = ({
  catalog,
  datasets,
  entrypoint,
}: {
  catalog: CatalogSummary;
  datasets: DatasetSummary[];
  entrypoint: EntrypointSummary;
}) => {
  if (entrypoint.level === Level.CRITICAL && datasets.length === 0) {
    // There is no need to render anything.
    return <EntrypointCritical entrypoint={entrypoint} />;
  }
  //
  let entrypointContent;
  if (entrypoint.level >= Level.ERROR) {
    entrypointContent = <EntrypointError entrypoint={entrypoint} />;
  } else {
    entrypointContent = <EntrypointSection entrypoint={entrypoint} />;
  }
  //
  let catalogContent = <CatalogSection catalog={catalog} />;
  //
  let datasetsContent = null;
  if (datasets.length > 0) {
    datasetsContent = <DatasetsSection datasets={datasets} />;
  }
  return (
    <>
      {entrypointContent}
      <br />
      {catalogContent}
      <br />
      {datasetsContent}
    </>
  );
};

/**
 * Rendered when there is a critical level message and no catalog or dataset.
 * This happens when we fail to detect or load the content.
 */
function EntrypointCritical({ entrypoint }: { entrypoint: EntrypointSummary }) {
  const { t } = useTranslation();
  return (
    <>
      <div>Nepodařilo se stáhnout vstupní bod.</div>
      <List component="div" disablePadding>
        {entrypoint.messages
          .filter(item => item.level >= Level.WARNING)
          .map((message, index) => (
            <MessageListItem key={index} message={message} />
          ))}
      </List>
    </>
  );
}

function EntrypointError({ entrypoint }: { entrypoint: EntrypointSummary }) {
  const { t } = useTranslation();
  return (
    <>
      <div>
        Povedlo se načíst vstupní bod jako {entrypoint.contentType}, ale při
        jeho zpracování došlo k chybě.
      </div>
      <List component="div" disablePadding>
        {entrypoint.messages
          .filter(item => item.level >= Level.WARNING)
          .map((message, index) => (
            <MessageListItem key={index} message={message} />
          ))}
      </List>
    </>
  );
}

function EntrypointSection({ entrypoint }: { entrypoint: EntrypointSummary }) {
  const { t } = useTranslation();
  return <div>Povedlo se načíst obsah jako: {entrypoint.contentType}.</div>;
}

function CatalogSection({ catalog }: { catalog: CatalogSummary }) {
  const { t } = useTranslation();
  if (!catalog.contentLoaded) {
    return <>Nepodařilo se načíst záznam katalogu.</>;
  }
  return (
    <div>
      Očekávané URL: '{catalog.expectedUrl}
      <br />
      Nalezené URL: '{catalog.urls}'<br />
      Název: '{catalog.titles}'<br />
      <List component="div" disablePadding>
        {catalog.messages
          .filter(item => item.level >= Level.WARNING)
          .map((message, index) => (
            <MessageListItem key={index} message={message} />
          ))}
      </List>
    </div>
  );
}

function DatasetsSection({ datasets }: { datasets: DatasetSummary[] }) {
  const { t } = useTranslation();
  let validDatasets = [];
  let datasetsWithWarning = [];
  let datasetsWithError = [];
  for (const dataset of datasets) {
    if (dataset.level === Level.INFO) {
      validDatasets.push(dataset);
    } else if (dataset.level === Level.WARNING) {
      datasetsWithWarning.push(dataset);
    } else if (dataset.level > Level.WARNING) {
      datasetsWithError.push(dataset);
    }
  }
  return (
    <div>
      Nalezeno {datasets.length} datových sad.
      <br />Z toho má {datasetsWithWarning.length} s varováním a{" "}
      {datasetsWithError.length} s chybou.
    </div>
  );
}
