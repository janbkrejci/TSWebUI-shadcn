"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function NumberWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: d.numberDefaultLabel },
    { name: "placeholder", label: d.attrPlaceholder, type: "string", defaultValue: "0" },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: "" },
    {
      name: "roundTo",
      label: d.attrDecimalPlaces,
      type: "number",
      defaultValue: 2,
      hint: d.attrDecimalPlacesHint,
    },
    {
      name: "step",
      label: d.attrStep,
      type: "number",
      defaultValue: 1,
      hint: d.attrStepHint,
    },
    {
      name: "selectAllOnFocus",
      label: d.attrSelectAllOnFocus,
      type: "boolean",
      defaultValue: true,
      hint: d.attrSelectAllOnFocusHint,
    },
    {
      name: "enterAction",
      label: d.attrEnterAction,
      type: "select",
      defaultValue: "",
      options: [
        { label: d.optNone, value: "" },
        { label: d.optFocusNext, value: "focus:next" },
        { label: d.optSubmit, value: "submit" },
      ],
      hint: d.attrEnterActionHint,
    },
    {
      name: "escapeAction",
      label: d.attrEscapeAction,
      type: "select",
      defaultValue: "clear",
      options: [
        { label: d.optClearField, value: "clear" },
        { label: d.optFocusNext, value: "focus:next" },
      ],
      hint: d.attrEscapeActionHint,
    },
    {
      name: "error",
      label: d.attrError,
      type: "string",
      defaultValue: "",
      hint: d.attrErrorHint,
    },
    { name: "required", label: d.attrRequired, type: "boolean", defaultValue: false },
    { name: "disabled", label: d.attrDisabled, type: "boolean", defaultValue: false },
    { name: "readonly", label: d.attrReadOnly, type: "boolean", defaultValue: false },
    { name: "hidden", label: d.attrHidden, type: "boolean", defaultValue: false },
  ]

  return (
    <WidgetDemoWrapper
      title={d.widgetNumberTitle}
      description={d.widgetNumberDescription}
      widgetType="number"
      attributes={attributes}
      defaultFieldValue={1234.56}
    />
  )
}
