import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LinkIcon from "@mui/icons-material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Pagination from "@mui/material/Pagination";

import { Report, ContentType } from "../validator-service";
import { IssuesList } from "./issues-list";

export function LocalCatalogReport({
  report,
}: {
  report: Report.LocalCatalogReport;
}) {
  return (
    <>
      <SummarySection state={report.summary} />
      <CatalogsSection catalogs={report.catalogs} />
      <ResourcesSection resources={report.datasets} />
    </>
  );
}

function SummarySection({ state }: { state: Report.Summary }) {
  const { t } = useTranslation();

  return (
    <>
      <dl>
        <dt>{t("ui.content-type")}</dt>
        <dd>{t(contentTypeToHumanLabel(state.contentType))}</dd>
        <dt>{t("ui.catalog-url")}</dt>
        {state.catalogs.map(catalog => (
          <dd key={catalog.iri}>
            {catalog.iri}
            &nbsp;
            <a href={catalog.iri} target="_blank" rel="noopener noreferrer">
              <OpenInNewIcon />
            </a>
          </dd>
        ))}
        <dt>{t("ui.catalog-title")}</dt>
        {state.catalogs.map(catalog => (
          <dd key={catalog.iri}>{catalog.czechTitle}</dd>
        ))}
      </dl>
      <IssuesList issues={state.issues} />
      <dl>
        <dt>{t("ui.number-of-resources-with-error")}</dt>
        <dd>{state.resourcesWithError.length}</dd>
        <dt>{t("ui.number-of-datasets")}</dt>
        <dd>{state.allFoundDatasets.length}</dd>
        <dt>{t("ui.number-of-datasets-with-warning")}</dt>
        <dd>{state.datasetsWithOnlyWarning.length}</dd>
        <dt>{t("ui.number-of-datasets-with-error")}</dt>
        <dd>{state.datasetsWithError.length}</dd>
        <dt>{t("ui.number-of-hvd")}</dt>
        <dd>{state.highValueDatasets.length}</dd>
      </dl>
    </>
  );
}

function contentTypeToHumanLabel(contentType: ContentType | null): string {
  switch (contentType) {
    case ContentType.JSONLD:
      return "ui.content-type-JSONLD";
    case ContentType.SPARQL:
      return "ui.content-type-SPARQL";
    case ContentType.TURTLE:
      return "ui.content-type-TURTLE";
    case null:
      return "ui.content-type-unknown";
  }
}

function CatalogsSection(props: { catalogs: Report.Catalog[] }) {
  return null;
}

const PAGE_SIZE = 25;

function ResourcesSection({
  resources,
}: {
  resources: Report.DatasetReference[];
}) {
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [content, setContent] = useState<React.ReactElement[]>([]);
  const [requiredLevel, setRequiredevel] = useState(() =>
    selectInitialFilterLevel(resources),
  );
  const [showDetails, setShowDetails] = useState(() =>
    Report.isLeftHigherOrEqual(requiredLevel, Report.Level.WARNING),
  );

  useEffect(() => {
    // Collect all content we can render, we need it so we know
    // what to do with the pagination.
    const nextContent: React.ReactElement[] = [];
    for (const resource of resources) {
      if (filterByLevel(resource, requiredLevel)) {
        nextContent.push(
          <ResourceSection
            key={"resource:" + resource.accessUrl}
            resource={resource}
          />,
        );
      }
      for (const dataset of resource.datasets) {
        // We show all on INFO level, otherwise we witer only those
        // with an issue a certain level.
        // Thus only INFO level shows ALL.
        if (requiredLevel === Report.Level.INFO) {
          nextContent.push(
            <DatasetSection
              key={"dataset:" + resource.accessUrl + ":" + dataset.iri}
              dataset={dataset}
            />,
          );
        } else if (filterByLevel(dataset, requiredLevel)) {
          nextContent.push(
            <DatasetSection
              key={"dataset:" + resource.accessUrl + ":" + dataset.iri}
              dataset={dataset}
            />,
          );
        }
      }
    }
    // Update pagination.
    setCount(Math.ceil(nextContent.length / PAGE_SIZE));

    // Update rendered content.
    setContent(nextContent.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
  }, [resources, requiredLevel, page]);

  let contentToRender: React.ReactElement | null = null;
  if (showDetails) {
    if (content.length === 0) {
      contentToRender = <Box sx={{ m: 2 }}>{t("ui.no-search-results")}</Box>;
    } else {
      contentToRender = (
        <>
          <List>{content}</List>
          <Pagination
            count={count}
            variant="outlined"
            shape="rounded"
            size="large"
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </>
      );
    }
  }

  return (
    <React.Fragment>
      <Toolbox
        value={requiredLevel}
        onChange={setRequiredevel}
        show={showDetails}
        setShow={setShowDetails}
      />
      {contentToRender}
    </React.Fragment>
  );
}

type ToolboxProps = {
  value: Report.Level;
  onChange: (value: Report.Level) => void;
  show: boolean;
  setShow: (value: boolean) => void;
};

function Toolbox(props: ToolboxProps) {
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button variant="outlined" onClick={() => props.setShow(!props.show)}>
        {props.show ? t("ui.hide-details") : t("ui.show-details")}
      </Button>
      {props.show ? (
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel variant="standard" htmlFor="filter-selector">
            {t("ui.level-filter")}
          </InputLabel>
          <NativeSelect
            inputProps={{ id: "filter-selector" }}
            value={props.value}
            onChange={event =>
              props.onChange(event.target.value as Report.Level)
            }
          >
            <option value={Report.Level.INFO}>{t("ui.info")}</option>
            <option value={Report.Level.WARNING}>{t("ui.warning")}</option>
            <option value={Report.Level.ERROR}>{t("ui.error")}</option>
            <option value={Report.Level.CRITICAL}>{t("ui.critical")}</option>
          </NativeSelect>
        </FormControl>
      ) : null}
    </div>
  );
}

/**
 * When there is ERROR or CRITICAL return ERROR.
 * Else return highest log level.
 *
 * @returns Initial log level.
 */
function selectInitialFilterLevel(
  references: Report.DatasetReference[],
): Report.Level {
  let result: Report.Level = Report.Level.INFO;
  for (const reference of references) {
    result = reference.issues
      .map(issue => issue.level)
      .reduce(Report.higherLevel, result);
    for (const dataset of reference.datasets) {
      result = dataset.issues
        .map(issue => issue.level)
        .reduce(Report.higherLevel, result);
    }
    if (result === Report.Level.ERROR || result === Report.Level.CRITICAL) {
      // There is no need to search any further.
      return Report.Level.ERROR;
    }
  }
  console.log("selectInitialFilterLevel", { result });
  return result;
}

function filterByLevel(
  { issues }: { issues: Report.Issue[] },
  level: Report.Level,
): boolean {
  for (const issue of issues) {
    if (Report.isLeftHigherOrEqual(issue.level, level)) {
      return true;
    }
  }
  return false;
}

function ResourceSection({
  resource,
}: {
  resource: Report.DatasetReference;
}): React.ReactElement {
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);

  return (
    <>
      <ListItem>
        <ListItemIcon>
          <LinkIcon sx={{ color: selectLevelColor(resource.issues, "blue") }} />
        </ListItemIcon>
        <ListItemText
          primary={t("ui.referenced-resources")}
          secondary={resource.accessUrl}
        />
        <Box sx={{ mr: "1rem" }}>
          <a
            href={resource.accessUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenInNewIcon />
          </a>
        </Box>
        <Box onClick={() => setOpen(!open)}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <IssuesList issues={resource.issues} />
      </Collapse>
    </>
  );
}

function selectLevelColor(
  issues: Report.Issue[],
  defaultColor: string,
): string {
  let includesWarning = false;
  for (const issue of issues) {
    switch (issue.level) {
      case Report.Level.CRITICAL:
      case Report.Level.ERROR:
        return "red";
      case Report.Level.WARNING:
        includesWarning = true;
        break;
    }
  }
  if (includesWarning) {
    return "yellow";
  }
  return defaultColor;
}

function DatasetSection({
  dataset,
}: {
  dataset: Report.Dataset;
}): React.ReactElement {
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);

  return (
    <>
      <ListItem>
        <ListItemIcon>
          <FolderIcon
            sx={{ color: selectLevelColor(dataset.issues, "green") }}
          />
        </ListItemIcon>
        <ListItemText primary={t("ui.dataset")} secondary={dataset.iri} />
        <Box sx={{ mr: "1rem" }}>
          <a href={dataset.accessUrl} target="_blank" rel="noopener noreferrer">
            <OpenInNewIcon />
          </a>
        </Box>
        {dataset.issues.length === 0 ? null : (
          <Box onClick={() => setOpen(!open)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
        )}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <IssuesList issues={dataset.issues} />
      </Collapse>
    </>
  );
}
