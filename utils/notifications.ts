export async function notifyOfferAcceptedEmail(params: {
  to: string;
  customerName?: string | null;
  requestId: string;
  route?: string;
  price?: number;
  companyName?: string;
}) {
  const { to, customerName, requestId, route, price, companyName } = params;

  const subject = `Oferta ta a fost acceptată`;
  const text = `Bună${companyName ? `, ${companyName}` : ""}!

O ofertă de mutare ți-a fost acceptată${customerName ? ` de ${customerName}` : ""}.

Detalii sumare:
- Cerere: ${requestId}
- Rută: ${route ?? "n/a"}
- Preț: ${typeof price === "number" ? `${price} lei` : "n/a"}

Te rugăm să contactezi clientul din panoul tău pentru a confirma detaliile.`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111">
      <h2>Oferta ta a fost acceptată</h2>
      <p>Bună${companyName ? `, <strong>${companyName}</strong>` : ""}!</p>
      <p>O ofertă de mutare ți-a fost acceptată${customerName ? ` de <strong>${customerName}</strong>` : ""}.</p>
      <ul>
        <li><strong>Cerere:</strong> ${requestId}</li>
        <li><strong>Rută:</strong> ${route ?? "n/a"}</li>
        <li><strong>Preț:</strong> ${typeof price === "number" ? `${price} lei` : "n/a"}</li>
      </ul>
      <p>Accesează panoul companiei pentru a confirma detaliile și a stabili următorii pași.</p>
    </div>
  `;

  try {
    await fetch("/api/notifyOfferAccepted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, text, html }),
    });
  } catch (err) {
    // Don't break UX if email fails
    console.error("notifyOfferAcceptedEmail failed", err);
  }
}
