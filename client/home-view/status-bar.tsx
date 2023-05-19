import React from "react";
import {useTranslation} from "react-i18next";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";


export const StatusBar = ({working, message, args}: {
  working: boolean,
  message: string,
  args: object | undefined,
}) => {
  const {t} = useTranslation();
  return (
    <>
      <LoaderIndicator show={working}/>
      <br/>
      {t(message, args)}
    </>
  )
};

function LoaderIndicator({show}: { show: boolean }) {
  return (
    <Fade in={show} style={{transitionDelay: show ? "300ms" : "0ms"}}>
      <LinearProgress/>
    </Fade>
  );
}
