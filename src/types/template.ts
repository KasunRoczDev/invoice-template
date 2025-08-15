export interface TemplateElement {
  id: string
  type: "text" | "image" | "field" | "horizontalRule" | "verticalRule"
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  dataBinding?: string
  styles?: {
    fontSize?: string
    fontWeight?: string
    color?: string
    textAlign?: string
    [key: string]: any
  }
}

export interface TemplateData {
  businessDetails: {
    logo: string
    businessLocationName: string
    locationAddressCity: string
    contactNumber: string
  }
  waybillDetails: {
    waybillNumber: string
    waybillBarcode: string
  }
  senderDetails: {
    customerName: string
    address: string
    city: string
    contactNumber: string
  }
  receiverDetails: {
    customerName: string
    address: string
    city: string
    contactNumber: string
  }
  orderDetails: {
    orderNumber: string
    barcode: string
    orderDate: string
    totalCODAmount: string
  }
  productDetails: {
    sku: string
    productName: string
    quantity: number
    totalItemsInCount: number
    totalQuantityInCount: number
  }
}
