import { useTranslation } from "react-i18next";

import { IntroductionSection } from "./introduction-section";
import { InputSection } from "./input-section";
import { StatusSection } from "./status-section";
import { ReportSection } from "./report-section";

import { useValidatorServiceType } from "./validator-service";

export function LocalCatalogValidatorView() {
  const { t } = useTranslation();
  const validationService = useValidatorServiceType();

  return (
    <>
      <h1>{t("ui.title")}</h1>
      <IntroductionSection />
      <InputSection
        disabled={validationService.working}
        onStartValidation={(url: string) => validationService.validate(url)}
      />
      <StatusSection
        working={validationService.working}
        message={validationService.statusMessage}
        args={validationService.statusArgs}
      />
      {validationService.report === null ? null : (
        <ReportSection report={validationService.report} />
      )}
    </>
  );
}
