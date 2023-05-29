import React from "react";
import { useTranslation } from "react-i18next";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export const StatusBar = ({
  working,
  message,
  args,
}: {
  working: boolean;
  message: string;
  args: object | undefined;
}) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ my: 2 }}>
      <LoaderIndicator show={working} />
      {message.length === 0 ? <br /> : t(message, args)}
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
