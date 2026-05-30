"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function DateTimeWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: "Appointment" },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: "" },
    {
      name: "dateFormat",
      label: d.attrDateFormat,
      type: "string",
      defaultValue: "d.M.yyyy HH:mm",
      hint: d.attrDateFormatHint,
    },
    {
      name: "disableFuture",
      label: "Disallow future dates",
      type: "boolean",
      defaultValue: false,
      hint: "Disable selecting any date after today (today stays selectable)",
    },
    {
      name: "maxDate",
      label: "Max date (ISO)",
      type: "string",
      defaultValue: "",
      hint: "Latest selectable date, e.g. 2026-12-31; later dates are disabled",
    },
    {
      name: "minDate",
      label: "Min date (ISO)",
      type: "string",
      defaultValue: "",
      hint: "Earliest selectable date, e.g. 2000-01-01; earlier dates are disabled",
    },
    {
      name: "selectAllOnFocus",
      label: d.attrSelectAllOnFocus,
      type: "boolean",
      defaultValue: true,
      hint: d.attrSelectAllOnFocusHint,
    },
    {
      name: "error",
      label: d.attrError,
      type: "string",
      defaultValue: "",
      hint: d.attrErrorHint,
    },
    {
      name: "enterAction",
      label: d.attrEnterAction,
      type: "string",
      defaultValue: "",
      hint: d.attrEnterActionHint,
    },
    {
      name: "escapeAction",
      label: d.attrEscapeAction,
      type: "string",
      defaultValue: "",
      hint: d.attrEscapeActionHint,
    },
    {
      name: "locale",
      label: d.attrLocale,
      type: "string",
      defaultValue: "cs",
      hint: d.attrLocaleHint,
    },
    {
      name: "showTodayButton",
      label: d.attrShowToday,
      type: "boolean",
      defaultValue: true,
    },
    {
      name: "showClearButton",
      label: d.attrShowClear,
      type: "boolean",
      defaultValue: true,
    },
    {
      name: "todayButtonText",
      label: d.attrTodayButtonText,
      type: "string",
      defaultValue: "Today",
    },
    {
      name: "clearButtonText",
      label: d.attrClearButtonText,
      type: "string",
      defaultValue: "Clear",
    },
    { name: "required", label: d.attrRequired, type: "boolean", defaultValue: false },
    { name: "disabled", label: d.attrDisabled, type: "boolean", defaultValue: false },
    { name: "readonly", label: d.attrReadOnly, type: "boolean", defaultValue: false },
    { name: "hidden", label: d.attrHidden, type: "boolean", defaultValue: false },
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetDatetimeTitle}
      description={d.widgetDatetimeDescription}
      widgetType="datetime"
      attributes={attributes}
      defaultFieldValue={new Date().toISOString()}
    />
  )
}
