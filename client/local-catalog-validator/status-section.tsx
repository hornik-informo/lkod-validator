import React from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";

import LinearProgress from "@mui/material/LinearProgress";

type StatusSectionProps = {
  working: boolean;

  message: string;

  args: object | undefined;
};

/**
 * Provide user with an overview of the validation process.
 */
export const StatusSection = (props: StatusSectionProps) => {
  const { t } = useTranslation();

  // When we have no message we render a line break to prevent
  // UI shift.
  let content: React.ReactNode;
  if (props.message.length === 0) {
    content = <br />;
  } else {
    content = t(props.message, props.args as any) as string;
  }

  return (
    <Box sx={{ my: 2 }}>
      <LoaderIndicator show={props.working} />
      <div>{content}</div>
    </Box>
  );
};

function LoaderIndicator({ show }: { show: boolean }) {
  if (show) {
    return <LinearProgress sx={{ my: 1 }} />;
  } else {
    return <hr />;
  }
}
