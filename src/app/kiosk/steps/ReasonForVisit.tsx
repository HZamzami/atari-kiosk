import { useLanguage } from "@/context/LanguageContext";
import React, { useEffect } from "react";

import { chiefComplaints } from "@/lib/constants";

import {
  SelectAccordion,
  SelectAccordionContent,
  SelectAccordionItem,
  SelectAccordionTrigger,
} from "@/components/ui/select-accordion";
import { Input } from "../../../components/ui/input";
import {
  CustomRadioGroup,
  CustomRadioGroupItem,
} from "../../../components/ui/custom-radio-group";

interface ReasonForVisitProps {
  reason: string;
  handleReasonChange: (
    value: string | React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function ReasonForVisit({
  reason,
  handleReasonChange,
}: ReasonForVisitProps) {
  const { t, locale } = useLanguage();
  const isRTL = locale === "ar";
  useEffect(() => {
    console.log(reason);
  }, [reason]);
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 overflow-hidden">
      <h1 className="text-4xl font-bold">
        {t("chief_complaint_title")}
      </h1>
      <div className="w-[80%]">
        <SelectAccordion type="single" collapsible>
          {chiefComplaints.map((complaint) => (
            <SelectAccordionItem
              value={t(complaint.title)}
              key={complaint.title}
              className="shadow-sm mb-3"
            >
              <SelectAccordionTrigger className="px-3 sm:px-5">
                <div className="flex gap-5 font-normal">
                  <complaint.icon strokeWidth={1.5}></complaint.icon>
                  {t(complaint.title)}
                </div>
              </SelectAccordionTrigger>
              <SelectAccordionContent>
                <div className="ms-6 mt-[10px] border-s-2 border-[#0077B6]">
                  {complaint.title == "other" ? (
                    <Input
                      type="text"
                      value={reason}
                      onChange={(e) =>
                        handleReasonChange(e.target.value)
                      }
                      placeholder={t("other_placeholder")}
                      className="ms-6 mt-2  w-full rounded-lg border border-gray-300"
                    />
                  ) : (
                    <CustomRadioGroup
                      value={reason}
                      onValueChange={handleReasonChange}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {complaint.complaints.map((complaint) => (
                        <CustomRadioGroupItem
                          dir={isRTL ? "rtl" : "ltr"}
                          key={complaint}
                          className="ms-6"
                          label={t(complaint)}
                          value={complaint}
                        ></CustomRadioGroupItem>
                      ))}
                    </CustomRadioGroup>
                  )}
                </div>
              </SelectAccordionContent>
            </SelectAccordionItem>
          ))}
        </SelectAccordion>
      </div>
    </div>
  );
}
