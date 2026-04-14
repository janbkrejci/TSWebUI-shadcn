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
    useCustomValue: (value: string) => string
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
