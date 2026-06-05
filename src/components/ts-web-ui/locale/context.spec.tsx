import { fireEvent, render, screen } from "@testing-library/react"
import { cs, en, TsLocaleProvider, useTsLocale, useTsLocaleSetter } from "./index"

function LocaleProbe({
  override,
  onSwitch,
}: {
  override?: typeof cs | "cs" | "en"
  onSwitch?: string
}) {
  const locale = useTsLocale(override)
  const { localeName, setLocaleName } = useTsLocaleSetter()

  return (
    <div>
      <div data-testid="locale-name">{localeName}</div>
      <div data-testid="search-label">{locale.strings.table.search}</div>
      <div data-testid="page-of">{locale.strings.table.pageOf(2, 5)}</div>
      <div data-testid="form-required">{locale.strings.form.required}</div>
      {onSwitch ? (
        <button type="button" onClick={() => setLocaleName(onSwitch)}>
          switch
        </button>
      ) : null}
    </div>
  )
}

describe("ts-web-ui locale context", () => {
  it("uses english defaults without a provider", () => {
    render(<LocaleProbe />)

    expect(screen.getByTestId("locale-name")).toHaveTextContent("en")
    expect(screen.getByTestId("search-label")).toHaveTextContent(en.strings.table.search)
    expect(screen.getByTestId("page-of")).toHaveTextContent("Page 2 of 5")
    expect(screen.getByTestId("form-required")).toHaveTextContent(en.strings.form.required)
  })

  it("uses configured czech locale and allows switching via setter", () => {
    render(
      <TsLocaleProvider locale="cs">
        <LocaleProbe onSwitch="en" />
      </TsLocaleProvider>
    )

    expect(screen.getByTestId("locale-name")).toHaveTextContent("cs")
    expect(screen.getByTestId("search-label")).toHaveTextContent(cs.strings.table.search)
    expect(screen.getByTestId("page-of")).toHaveTextContent("Stránka 2 z 5")

    fireEvent.click(screen.getByRole("button", { name: "switch" }))

    expect(screen.getByTestId("locale-name")).toHaveTextContent("en")
    expect(screen.getByTestId("search-label")).toHaveTextContent(en.strings.table.search)
  })

  it("falls back to english for unknown locale names", () => {
    render(
      <TsLocaleProvider locale="unknown">
        <LocaleProbe />
      </TsLocaleProvider>
    )

    expect(screen.getByTestId("locale-name")).toHaveTextContent("en")
    expect(screen.getByTestId("search-label")).toHaveTextContent(en.strings.table.search)
  })

  it("supports custom locale objects and per-hook overrides", () => {
    const customLocale = {
      ...en,
      strings: {
        ...en.strings,
        table: {
          ...en.strings.table,
          search: "Custom search",
        },
      },
    }

    render(
      <TsLocaleProvider locale={customLocale}>
        <LocaleProbe override="cs" />
      </TsLocaleProvider>
    )

    expect(screen.getByTestId("locale-name")).toHaveTextContent("custom")
    expect(screen.getByTestId("search-label")).toHaveTextContent(cs.strings.table.search)
    expect(screen.getByTestId("form-required")).toHaveTextContent(cs.strings.form.required)
  })
})
