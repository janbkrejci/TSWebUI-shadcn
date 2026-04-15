export interface TsLocaleStrings {
  table: {
    search: string
    columns: string
    viewColumns: string
    searchColumns: string
    clearAllFilters: string
    export: string
    import: string
    newRecord: string
    noRecords: string
    rowsPerPage: string
    pageOf: (page: number, total: number) => string
    rowsSelected: (selected: number, total: number) => string
    selectAll: string
    selectRow: string
    openMenu: string
    actions: string
    unselectAll: string
    selected: (count: number) => string
    bulkActions: string
    moveLeft: string
    moveRight: string
    toggleSelectionView: string
    showAllRows: string
    showSelectedOnly: string
    showUnselectedOnly: string
    all: string
    yes: string
    no: string
    copyToClipboard: string
    importResults: string
    added: string
    updated: string
    rejected: string
    skipped: string
    saveRejectedRows: string
    close: string
    importNoData: string
    importFailedMissing: (label: string) => string
    missingRequiredColumns: string
    missingColumns: string
    first: string
    previous: string
    next: string
    last: string
    exportFiltered: (count: number) => string
    exportSelected: (count: number) => string
  }
  form: {
    download: string
    remove: string
    time: string
    done: string
    tabHasErrors: string
    close: string
    fileUpload: string
    dropFiles: string
    dropFile: string
    required: string
    unsupportedWidget: string
    fieldNotFound: (field: string) => string
    showPassword: string
    hidePassword: string
    selectPlaceholder: string
    searchPlaceholder: string
    notFound: string
    customValueAdd: (value: string) => string
    clear: string
    today: string
    addFiles: string
    addFile: string
    selectEntity: (entity: string) => string
    chooseFromList: string
  }
  window: {
    centerOnScreen: string
    fitToContent: string
  }
  sidebar: {
    closeMenu: string
    openMenu: string
    expandMenu: string
    collapseMenu: string
  }
  formEditor: {
    noTabs: string
    withTabs: string
    resetForm: string
    importJsonConfig: string
    import: string
    components: string
    formLayout: string
    buttons: string
    properties: string
    formPreview: string
    interactivePreview: string
    eventLog: string
    addColumn: string
    deleteRow: string
    insertColumnBefore: string
    position: string
    label: string
    action: string
    actionPlaceholder: string
    variant: string
    confirmationDialog: string
    title: string
    message: string
    fieldId: string
    placeholder: string
    hint: string
    required: string
    disabled: string
    enterAction: string
    enterActionPlaceholder: string
    escapeAction: string
    escapeActionPlaceholder: string
    hidden: string
    autoFocus: string
    hideLabel: string
    excludeFromSubmit: string
    min: string
    max: string
    step: string
    rowCount: string
    notFoundMessage: string
    notFoundPlaceholder: string
    dateFormat: string
    fileUploadTitle: string
    acceptPlaceholder: string
    innerLabel: string
    innerLabelPlaceholder: string
    allowMultiple: string
    content: string
    visualStyle: string
    actionName: string
    actionNamePlaceholder: string
    buttonVariant: string
    targetEntity: string
    targetEntityPlaceholder: string
    selectionMode: string
    showCreateButton: string
    // Additional UI strings
    undo: string
    redo: string
    export: string
    preview: string
    importDescription: string
    cancel: string
    invalidJsonError: string
    copyToClipboard: string
    downloadAsFile: string
    addRow: string
    addButtonLabel: string
    iconLucideName: string
    dragFieldHere: string
    dragAdding: string
    dragMovingRow: string
    dragMovingField: string
    dragButton: string
    dragRow: string
    selectFieldOrButton: string
    delete: string
    buttonLabel: string
    positionLeft: string
    positionCenter: string
    positionRight: string
    variantDefault: string
    variantPrimary: string
    variantPrimaryBlue: string
    variantSecondary: string
    variantSuccessGreen: string
    variantWarningAmber: string
    variantDangerRed: string
    variantOutline: string
    variantGhost: string
    variantLink: string
    variantDestructive: string
    variantInformation: string
    variantSuccess: string
    variantWarning: string
    variantStandard: string
    variantProcess: string
    confirmEnabled: string
    confirmButtonsJson: string
    states: string
    readOnly: string
    selectAllOnFocus: string
    numericSettings: string
    roundTo: string
    options: string
    allowCustom: string
    processStyle: string
    optionsJson: string
    optionsFormatHint: string
    dateSettings: string
    dateFnsHint: string
    accept: string
    clearLog: string
    noEvents: string
    relationshipSettings: string
    valueField: string
    displayFields: string
    mockOptions: string
    selectionSingle: string
    selectionMultiple: string
    tableConfiguration: string
    columnsJson: string
    fieldIdRequired: string
    fieldIdInvalid: string
    fieldIdNotUnique: string
    fieldIdRenameFailed: string
    // Field type labels for the component palette
    fieldTypeLabels: {
      text: string
      textarea: string
      password: string
      number: string
      select: string
      multiselect: string
      combobox: string
      radio: string
      checkbox: string
      switch: string
      buttonGroup: string
      date: string
      datetime: string
      slider: string
      file: string
      relationship: string
      separator: string
      infobox: string
      markdown: string
      button: string
      table: string
    }
    // Field group labels for the component palette sidebar
    fieldGroupLabels: {
      text: string
      selection: string
      date: string
      others: string
      layout: string
      complex: string
    }
  }
}

export interface TsLocaleFormatting {
  /** BCP 47 locale tag for number/date formatting, e.g. "en-US", "cs-CZ" */
  locale: string
  /** IANA timezone, e.g. "Europe/Prague", "America/New_York" */
  timezone?: string
}

export interface TsLocale {
  strings: TsLocaleStrings
  formatting: TsLocaleFormatting
}
