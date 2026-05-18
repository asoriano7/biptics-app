// pages/privacidad/index.tsx o app/privacidad/page.tsx
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
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#FFFFFF", fontFamily: "Arial, sans-serif" }}>
              ⚡ BIPTICS
            </span>
            <span style={{ color: "#00B4D8", fontSize: 16 }}>
              Smart EV Charging Colombia
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>

        {/* Title */}
        <div style={{ marginBottom: 40, borderBottom: "2px solid #00B4D8", paddingBottom: 24 }}>
          <h1 style={{
            fontSize: 32, fontWeight: 700, color: "#1E3A5F",
            fontFamily: "Arial, sans-serif", marginBottom: 8
          }}>
            Política de Privacidad y Tratamiento de Datos Personales
          </h1>
          <p style={{ color: "#64748B", fontSize: 14 }}>
            Última actualización: {lastUpdate}
          </p>
        </div>

        {/* Intro */}
        <div style={{
          backgroundColor: "#E8F4FD", borderLeft: "4px solid #00B4D8",
          padding: 20, borderRadius: 8, marginBottom: 40
        }}>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            En <strong>Biptics</strong> (en adelante "la Empresa", "nosotros") nos comprometemos a proteger 
            la privacidad y los datos personales de nuestros usuarios. La presente Política de Privacidad 
            cumple con la <strong>Ley 1581 de 2012</strong> (Habeas Data), el <strong>Decreto 1377 de 2013</strong> 
            de la República de Colombia, y los requisitos de la <strong>Política de Datos de Meta Platforms</strong> 
            para el uso de WhatsApp Business API.
          </p>
        </div>

        {/* Sections */}
        {[
          {
            num: "1",
            title: "Identidad y Datos del Responsable del Tratamiento",
            content: (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                {[
                  ["Razón social", "Biptics"],
                  ["Actividad", "Comercialización e instalación de cargadores residenciales para vehículos eléctricos"],
                  ["Ciudad", "Bogotá D.C., Colombia"],
                  ["Cobertura actual", "Bogotá D.C."],
                  ["Correo de contacto", "privacidad@biptics.com"],
                  ["WhatsApp", "+57 314 3974123"],
                  ["Web", "https://biptics-app.vercel.app"],
                ].map(([k, v], i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1E3A5F", width: "35%", border: "1px solid #E2E8F0" }}>{k}</td>
                    <td style={{ padding: "10px 14px", border: "1px solid #E2E8F0" }}>{v}</td>
                  </tr>
                ))}
              </table>
            )
          },
          {
            num: "2",
            title: "Datos Personales que Recopilamos",
            content: (
              <>
                <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
                  Recopilamos los siguientes datos personales cuando el usuario interactúa con nuestros canales digitales:
                </p>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1E3A5F" }}>
                      {["Dato", "Canal de recopilación", "Finalidad"].map((h, i) => (
                        <th key={i} style={{ padding: "10px 14px", color: "#FFFFFF", textAlign: "left", border: "1px solid #E2E8F0" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Número de teléfono WhatsApp", "WhatsApp Business API", "Identificar al usuario y responder sus consultas"],
                      ["Contenido de los mensajes", "WhatsApp Business API / App Biptics", "Prestar el servicio de soporte técnico y cotizaciones"],
                      ["Modelo del vehículo eléctrico", "Conversación con BIPA", "Recomendar el wallbox correcto para el vehículo"],
                      ["Dirección de instalación", "Conversación con BIPA", "Asignar técnico y agendar visita de diagnóstico"],
                      ["Correo electrónico", "Registro en la App Biptics", "Autenticación y comunicaciones del servicio"],
                      ["Nombre completo", "Registro en la App Biptics", "Identificación del titular y emisión de facturas"],
                      ["Historial de conversaciones", "n8n + Supabase", "Continuidad del servicio y mejora del agente IA"],
                    ].map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: "10px 14px", border: "1px solid #E2E8F0" }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )
          },
          {
            num: "3",
            title: "Finalidades del Tratamiento de Datos",
            content: (
              <ul style={{ lineHeight: 2, paddingLeft: 24 }}>
                {[
                  "Atender consultas, cotizaciones y solicitudes de instalación de wallboxes mediante el agente de inteligencia artificial BIPA.",
                  "Agendar visitas de diagnóstico e instalación con el equipo técnico de Biptics.",
                  "Prestar soporte técnico remoto y presencial sobre cargadores para vehículos eléctricos.",
                  "Emitir facturas electrónicas ante la DIAN por los servicios y productos adquiridos.",
                  "Enviar confirmaciones, recordatorios y actualizaciones del estado de las órdenes de trabajo.",
                  "Mejorar continuamente el agente BIPA mediante el análisis anónimo de patrones de consultas.",
                  "Cumplir con obligaciones legales y regulatorias aplicables en Colombia.",
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )
          },
          {
            num: "4",
            title: "Terceros que Procesan sus Datos",
            content: (
              <>
                <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
                  Para prestar nuestros servicios utilizamos las siguientes plataformas tecnológicas que procesan datos personales en calidad de encargados del tratamiento:
                </p>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1E3A5F" }}>
                      {["Plataforma", "Función", "Ubicación de servidores"].map((h, i) => (
                        <th key={i} style={{ padding: "10px 14px", color: "#FFFFFF", textAlign: "left", border: "1px solid #E2E8F0" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Meta Platforms (WhatsApp)", "Canal de comunicación con clientes", "Estados Unidos"],
                      ["Google (Gemini AI)", "Motor de inteligencia artificial del agente BIPA", "Estados Unidos"],
                      ["Supabase (AWS)", "Base de datos y almacenamiento del historial", "Estados Unidos (us-east-1)"],
                      ["Vercel", "Hospedaje de la aplicación web", "Estados Unidos"],
                      ["n8n / Railway", "Orquestación de los agentes de IA", "Estados Unidos"],
                    ].map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: "10px 14px", border: "1px solid #E2E8F0" }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ lineHeight: 1.8, marginTop: 16, fontSize: 14, color: "#64748B" }}>
                  Todos los terceros listados cuentan con políticas de privacidad y medidas de seguridad certificadas. 
                  El uso de estos servicios implica una transferencia internacional de datos conforme al artículo 26 
                  de la Ley 1581 de 2012.
                </p>
              </>
            )
          },
          {
            num: "5",
            title: "Derechos del Titular — Habeas Data (Ley 1581 de 2012)",
            content: (
              <>
                <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
                  Como titular de sus datos personales, usted tiene los siguientes derechos:
                </p>
                <ul style={{ lineHeight: 2, paddingLeft: 24 }}>
                  {[
                    "Conocer, actualizar y rectificar sus datos personales en cualquier momento.",
                    "Solicitar prueba de la autorización otorgada para el tratamiento de sus datos.",
                    "Ser informado sobre el uso que se ha dado a sus datos personales.",
                    "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la Ley 1581 de 2012.",
                    "Revocar la autorización y/o solicitar la supresión de sus datos cuando no se respeten los principios, derechos y garantías constitucionales.",
                    "Acceder gratuitamente a sus datos personales que hayan sido objeto de tratamiento.",
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div style={{
                  backgroundColor: "#E8F8EE", borderLeft: "4px solid #00C853",
                  padding: 16, borderRadius: 8, marginTop: 16
                }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Para ejercer sus derechos escríbanos a: privacidad@biptics.com
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: 14 }}>
                    Responderemos su solicitud en un plazo máximo de 10 días hábiles conforme a la ley colombiana.
                  </p>
                </div>
              </>
            )
          },
          {
            num: "6",
            title: "Uso de WhatsApp Business API",
            content: (
              <>
                <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
                  Biptics utiliza WhatsApp Business API de Meta Platforms para atender a sus clientes mediante 
                  el agente de inteligencia artificial BIPA. Al comunicarse con Biptics por WhatsApp, el usuario acepta:
                </p>
                <ul style={{ lineHeight: 2, paddingLeft: 24 }}>
                  {[
                    "Que sus mensajes serán procesados por el agente BIPA con tecnología de IA de Google (Gemini).",
                    "Que el historial de conversación será almacenado en Supabase para continuidad del servicio.",
                    "Que Meta Platforms procesa los mensajes conforme a sus Condiciones del Servicio de WhatsApp Business.",
                    "Que Biptics no utilizará sus datos para enviar publicidad no solicitada.",
                    "Que puede solicitar la eliminación de su historial en cualquier momento escribiendo a privacidad@biptics.com.",
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )
          },
          {
            num: "7",
            title: "Seguridad de los Datos",
            content: (
              <p style={{ lineHeight: 1.8 }}>
                Biptics implementa medidas de seguridad técnicas y organizativas para proteger sus datos personales, incluyendo:
                cifrado en tránsito (HTTPS/TLS), Row Level Security (RLS) en la base de datos Supabase,
                autenticación con Google OAuth, variables de entorno para credenciales sensibles,
                y acceso restringido a los datos únicamente al personal autorizado de Biptics.
                No obstante, ningún sistema de seguridad es infalible. En caso de una brecha de seguridad 
                que afecte sus datos, Biptics notificará a los titulares afectados en un plazo máximo de 72 horas.
              </p>
            )
          },
          {
            num: "8",
            title: "Retención y Eliminación de Datos",
            content: (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                <thead>
                  <tr style={{ backgroundColor: "#1E3A5F" }}>
                    {["Tipo de dato", "Período de retención", "Criterio"].map((h, i) => (
                      <th key={i} style={{ padding: "10px 14px", color: "#FFFFFF", textAlign: "left", border: "1px solid #E2E8F0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Historial de conversaciones WhatsApp", "2 años", "Continuidad del servicio de soporte"],
                    ["Datos de instalación y OT", "5 años", "Garantía del servicio y obligaciones legales"],
                    ["Facturas electrónicas", "10 años", "Obligación tributaria DIAN"],
                    ["Datos de registro en la app", "Mientras la cuenta esté activa", "Prestación del servicio"],
                  ].map((row, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: "10px 14px", border: "1px solid #E2E8F0" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          },
          {
            num: "9",
            title: "Cambios en esta Política",
            content: (
              <p style={{ lineHeight: 1.8 }}>
                Biptics se reserva el derecho de modificar esta Política de Privacidad en cualquier momento. 
                Cualquier cambio será notificado a los usuarios a través de la aplicación web o por WhatsApp 
                con al menos 10 días de anticipación. El uso continuado de los servicios de Biptics tras 
                la notificación de cambios constituye la aceptación de la nueva política.
              </p>
            )
          },
          {
            num: "10",
            title: "Contacto y Quejas",
            content: (
              <>
                <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
                  Para consultas, solicitudes o quejas relacionadas con el tratamiento de sus datos personales:
                </p>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                  {[
                    ["Correo electrónico", "privacidad@biptics.com"],
                    ["WhatsApp", "+57 314 3974123"],
                    ["Web", "https://biptics-app.vercel.app"],
                    ["Horario de atención", "Lunes a viernes 8am - 6pm (Colombia)"],
                    ["Entidad de control", "Superintendencia de Industria y Comercio — www.sic.gov.co"],
                  ].map(([k, v], i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1E3A5F", width: "35%", border: "1px solid #E2E8F0" }}>{k}</td>
                      <td style={{ padding: "10px 14px", border: "1px solid #E2E8F0" }}>{v}</td>
                    </tr>
                  ))}
                </table>
              </>
            )
          },
        ].map((section, i) => (
          <section key={i} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontSize: 20, fontWeight: 700, color: "#1E3A5F",
              fontFamily: "Arial, sans-serif", marginBottom: 16,
              paddingBottom: 8, borderBottom: "1px solid #E2E8F0"
            }}>
              {section.num}. {section.title}
            </h2>
            {section.content}
          </section>
        ))}

        {/* Footer legal */}
        <div style={{
          backgroundColor: "#1E3A5F", color: "#FFFFFF",
          padding: 24, borderRadius: 8, marginTop: 40, textAlign: "center"
        }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8 }}>
            Esta Política de Privacidad fue elaborada en cumplimiento de la Ley 1581 de 2012, 
            el Decreto 1377 de 2013 y las políticas de Meta Platforms para WhatsApp Business API.
          </p>
          <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#00B4D8" }}>
            © 2026 Biptics — Smart EV Charging Colombia. Todos los derechos reservados.
          </p>
        </div>

      </main>
    </div>
  );
}
