// Coloca este archivo en: src/app/privacidad/page.tsx

export default function PoliticaPrivacidad() {
  const lastUpdate = "17 de mayo de 2026";

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      backgroundColor: "#F8FAFC",
      minHeight: "100vh",
      color: "#1E293B"
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#1E3A5F",
        padding: "24px 0",
        borderBottom: "4px solid #00B4D8"
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF", fontFamily: "Arial, sans-serif" }}>
            ⚡ BIPTICS
          </span>
          <span style={{ color: "#00B4D8", fontSize: 15, marginLeft: 12 }}>
            Smart EV Charging Colombia
          </span>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Title */}
        <div style={{ marginBottom: 32, borderBottom: "2px solid #00B4D8", paddingBottom: 20 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: "#1E3A5F",
            fontFamily: "Arial, sans-serif", marginBottom: 8
          }}>
            Política de Privacidad y Tratamiento de Datos Personales
          </h1>
          <p style={{ color: "#64748B", fontSize: 14, margin: 0 }}>
            Última actualización: {lastUpdate}
          </p>
        </div>

        {/* Intro */}
        <div style={{
          backgroundColor: "#E8F4FD", borderLeft: "4px solid #00B4D8",
          padding: 18, borderRadius: 8, marginBottom: 36, lineHeight: 1.8
        }}>
          <p style={{ margin: 0 }}>
            En <strong>Biptics</strong> respetamos su privacidad. Esta política explica qué datos recopilamos, 
            para qué los usamos y cuáles son sus derechos. Cumplimos con la{" "}
            <strong>Ley 1581 de 2012 (Habeas Data)</strong> y las políticas de{" "}
            <strong>Meta Platforms</strong> para WhatsApp Business.
          </p>
        </div>

        {/* Sections */}
        {[
          {
            num: "1",
            title: "¿Quiénes somos?",
            content: (
              <p style={{ lineHeight: 1.8 }}>
                <strong>Biptics</strong> es una empresa colombiana con sede en Bogotá D.C., 
                especializada en la venta e instalación de cargadores residenciales para vehículos eléctricos 
                y soporte técnico 24/7. Contáctenos en:{" "}
                <strong>privacidad@biptics.com</strong> o al{" "}
                <strong>+57 314 3974123</strong>.
              </p>
            )
          },
          {
            num: "2",
            title: "¿Qué datos recopilamos?",
            content: (
              <ul style={{ lineHeight: 2.2, paddingLeft: 24 }}>
                {[
                  "Número de teléfono y mensajes de WhatsApp para atender su consulta.",
                  "Modelo de su vehículo eléctrico para recomendarle el equipo correcto.",
                  "Dirección de instalación para asignar un técnico y agendar la visita.",
                  "Correo electrónico y nombre si se registra en nuestra aplicación.",
                ].map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )
          },
          {
            num: "3",
            title: "¿Para qué usamos sus datos?",
            content: (
              <ul style={{ lineHeight: 2.2, paddingLeft: 24 }}>
                {[
                  "Atender sus consultas y cotizaciones a través de nuestro asistente BIPA.",
                  "Agendar visitas de diagnóstico e instalación de wallboxes.",
                  "Prestar soporte técnico remoto y presencial.",
                  "Emitir facturas electrónicas por los servicios adquiridos.",
                  "Enviar confirmaciones y recordatorios de sus citas.",
                  "Cumplir con obligaciones legales en Colombia.",
                ].map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )
          },
          {
            num: "4",
            title: "¿Compartimos sus datos con terceros?",
            content: (
              <p style={{ lineHeight: 1.8 }}>
                Biptics utiliza servicios tecnológicos de terceros para operar. Algunos de estos servicios 
                pueden procesar datos en servidores fuera de Colombia, siempre bajo estándares de seguridad 
                certificados internacionalmente. <strong>No vendemos ni compartimos sus datos 
                con fines publicitarios.</strong>
              </p>
            )
          },
          {
            num: "5",
            title: "Sus derechos — Habeas Data",
            content: (
              <>
                <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
                  Conforme a la Ley 1581 de 2012, usted tiene derecho a:
                </p>
                <ul style={{ lineHeight: 2.2, paddingLeft: 24 }}>
                  {[
                    "Conocer, actualizar y rectificar sus datos personales.",
                    "Solicitar la eliminación de sus datos cuando no sean necesarios.",
                    "Revocar la autorización para el tratamiento de sus datos.",
                    "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).",
                  ].map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <div style={{
                  backgroundColor: "#E8F8EE", borderLeft: "4px solid #00C853",
                  padding: 14, borderRadius: 8, marginTop: 16
                }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Escriba a privacidad@biptics.com — respondemos en máximo 10 días hábiles.
                  </p>
                </div>
              </>
            )
          },
          {
            num: "6",
            title: "Seguridad",
            content: (
              <p style={{ lineHeight: 1.8 }}>
                Protegemos sus datos con cifrado en tránsito, acceso restringido al personal autorizado 
                y medidas de seguridad en nuestra base de datos. En caso de una brecha de seguridad, 
                notificaremos a los afectados en un plazo máximo de 72 horas.
              </p>
            )
          },
          {
            num: "7",
            title: "Cambios en esta política",
            content: (
              <p style={{ lineHeight: 1.8 }}>
                Podemos actualizar esta política en cualquier momento. Le notificaremos por WhatsApp 
                o en nuestra aplicación con al menos 10 días de anticipación. El uso continuado de 
                nuestros servicios implica la aceptación de los cambios.
              </p>
            )
          },
        ].map((section, i) => (
          <section key={i} style={{ marginBottom: 36 }}>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: "#1E3A5F",
              fontFamily: "Arial, sans-serif", marginBottom: 12,
              paddingBottom: 8, borderBottom: "1px solid #E2E8F0"
            }}>
              {section.num}. {section.title}
            </h2>
            {section.content}
          </section>
        ))}

        {/* Footer */}
        <div style={{
          backgroundColor: "#1E3A5F", color: "#FFFFFF",
          padding: 20, borderRadius: 8, marginTop: 40, textAlign: "center"
        }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8 }}>
            Política elaborada en cumplimiento de la Ley 1581 de 2012 y las políticas de Meta Platforms.
          </p>
          <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#00B4D8" }}>
            © 2026 Biptics — Smart EV Charging Colombia
          </p>
        </div>

      </main>
    </div>
  );
}
