"use client"

import { useTsLocale } from "@/components/ts-web-ui/locale"
import { WidgetAttribute, WidgetDemoWrapper } from "@/components/ts-web-ui/widget-demo"

export default function SliderWidgetDemo() {
  const locale = useTsLocale()
  const d = locale.strings.demo

  const attributes: WidgetAttribute[] = [
    { name: "label", label: d.attrLabel, type: "string", defaultValue: d.sliderDefaultLabel },
    { name: "hint", label: d.attrHint, type: "string", defaultValue: d.sliderDefaultHint },
    { name: "min", label: d.attrMin, type: "number", defaultValue: 0 },
    { name: "max", label: d.attrMax, type: "number", defaultValue: 100 },
    {
      name: "step",
      label: d.attrStep,
      type: "number",
      defaultValue: 1,
      hint: d.attrStepHint,
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
      title={d.widgetSliderTitle}
      description={d.widgetSliderDescription}
      widgetType="slider"
      attributes={attributes}
      defaultFieldValue={50}
    />
  )
}
