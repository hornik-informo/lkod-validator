import React from "react";
import { useTranslation } from "react-i18next";
import List from "@mui/material/List";
import Box from "@mui/material/Box";

import {
  CatalogSummary,
  DatasetSummary,
  EntrypointSummary,
} from "./summary-service";
import { Level, Message } from "../../validator";
import { MessageListItem } from "./message-list-item";

export const Summary = ({
  entrypoint,
  catalog,
  datasets,
  completed,
}: {
  entrypoint: EntrypointSummary;
  catalog: CatalogSummary;
  datasets: DatasetSummary[];
  completed: boolean;
}) => {
  const failToLoadEntrypoint =
    entrypoint.level === Level.CRITICAL && datasets.length === 0 && completed;
  if (failToLoadEntrypoint) {
    return (
      <>
        <EntrypointWithFailedLoad entrypoint={entrypoint} />
      </>
    );
  }

  return (
    <>
      <CatalogSection entrypoint={entrypoint} catalog={catalog} />
      <DatasetsSection datasets={datasets} />
    </>
  );
};

function EntrypointWithFailedLoad({
  entrypoint,
}: {
  entrypoint: EntrypointSummary;
}) {
  const { t } = useTranslation();
  return (
    <Box sx={{ my: "1rem" }}>
      <dl>
        <DefinitionList
          title={t("summary.content-type")}
          values={formatContentType(t, entrypoint.contentType)}
        />
      </dl>
      <WarningMessageList messages={entrypoint.messages} />
      <br />
      {t("summary.validation-failed-critical")}
    </Box>
  );
}

/**
 * Render definition list with given title.
 */
function DefinitionList({
  title,
  values,
}: {
  title: string;
  values: any | any[];
}) {
  if (values === null || values === undefined) {
    return null;
  }
  if (!Array.isArray(values)) {
    values = [values];
  }
  if (values.length === 0) {
    return null;
  }
  return (
    <>
      <dt>{title}</dt>
      {values.map(item => (
        <dd key={item}> {item} </dd>
      ))}
    </>
  );
}

/**
 * Format content type to be displayed to user.
 */
function formatContentType(t, contentType: undefined | string) {
  return contentType === undefined ? undefined : t("summary.content-type-" + contentType);
}

/**
 * List of messages with level at leas warning.
 */
function WarningMessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return null;
  }
  return (
    <List component="div" disablePadding>
      {messages
        .filter(item => item.level >= Level.WARNING)
        .map((message, index) => (
          <MessageListItem key={index} message={message} />
        ))}
    </List>
  );
}

function CatalogSection({
  entrypoint,
  catalog,
}: {
  entrypoint: EntrypointSummary;
  catalog: CatalogSummary;
}) {
  const { t } = useTranslation();
  return (
    <Box sx={{ my: "1rem" }}>
      <dl>
        <DefinitionList
          title={t("summary.content-type")}
          values={formatContentType(t, entrypoint.contentType)}
        />
        <DefinitionList
          title={t("summary.catalog-url")}
          values={catalog.urls}
        />
        <DefinitionList
          title={t("summary.catalog-title")}
          values={catalog.titles}
        />
      </dl>
      <WarningMessageList messages={entrypoint.messages} />
      <WarningMessageList messages={catalog.messages} />
    </Box>
  );
}

function DatasetsSection({ datasets }: { datasets: DatasetSummary[] }) {
  const { t } = useTranslation();
  if (datasets.length === 0) {
    return null;
  }
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
    <>
      <dl>
        <dt>{t("summary.datasets-count")}</dt>
        <dd> {datasets.length}</dd>
        <dt>{t("summary.datasets-with-warning-without-error")}</dt>
        <dd>{datasetsWithWarning.length}</dd>
        <dt>{t("summary.datasets-with-error")}</dt>
        <dd>{datasetsWithError.length}</dd>
      </dl>
    </>
  );
}
