'use client'
import Script from 'next/script'

export function WhatsappButton() {
  return (
    <Script 
      src="https://cdn.waplus.io/waplus-crm/settings/ossembed.js"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-ignore
        CreateWhatsappBtn({
          enabled: true,
          chatButtonSetting: {
            backgroundColor: "#16BE45",
            ctaText: "Message Us",
            borderRadius: "8",
            marginLeft: "20",
            marginBottom: "20",
            marginRight: "20",
            position: "right",
            textColor: "#ffffff",
            phoneNumber: "0557440522",
            messageText: "Salam !",
            trackClick: true
          }
        });
      }}
    />
  )
}
