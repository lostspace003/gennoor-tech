declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[]
    filename?: string
    image?: { type?: string; quality?: number }
    html2canvas?: Record<string, any>
    jsPDF?: { unit?: string; format?: string | number[]; orientation?: string }
    pagebreak?: { mode?: string | string[]; before?: string[]; after?: string[]; avoid?: string[] }
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance
    from(element: HTMLElement | string): Html2PdfInstance
    save(): Promise<void>
    outputPdf(type?: string): Promise<any>
    then(fn: (val: any) => void): Html2PdfInstance
  }

  function html2pdf(): Html2PdfInstance
  export default html2pdf
}
