const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

async function modifyPdf(pdfPath, modifications) {
    // Charger le document PDF
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
    modifications.forEach(mod => {
      const page = pdfDoc.getPages()[mod.pageIndex];
  
      if (mod.type === 'text') {
        page.drawText(mod.text, {
          x: mod.x,
          y: mod.y,
          size: mod.size || 12,
          color: rgb(0, 0, 0),
        });
      } else if (mod.type === 'check') {
        const size = mod.size || 10;
        page.drawLine({
          start: { x: mod.x, y: mod.y },
          end: { x: mod.x + size, y: mod.y + size },
          color: rgb(0, 0, 0),
          thickness: 1,
        });
        
        page.drawLine({
          start: { x: mod.x, y: mod.y + size },
          end: { x: mod.x + size, y: mod.y },
          color: rgb(0, 0, 0),
          thickness: 1,
        });
      }
    });
  
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('modified_pdf.pdf', pdfBytes);
}
  
const modifications = [
    { type: 'check', pageIndex: 3, x: 139, y: 125, size: 10 },
    { type: 'check', pageIndex: 3, x: 139, y: 100, size: 10 }, // Cocher une case à la page 4
    { type: 'text', pageIndex: 2, x: 150, y: 200, text: 'Exemple de texte', size: 12 }, // Ajouter du texte à la page 3
    // Ajouter d'autres modifications ici
];
  
modifyPdf('doc.pdf', modifications);
