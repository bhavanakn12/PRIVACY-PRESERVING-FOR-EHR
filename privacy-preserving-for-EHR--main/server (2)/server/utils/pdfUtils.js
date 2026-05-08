const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

// Exports a PDF as a stream to be piped directly to a response/download
function createDischargeSummaryPDF(data) {
  const doc = new PDFDocument();
  doc.fontSize(18).text('Discharge Summary', { align: 'center' });

  doc.moveDown();
  doc.fontSize(12).text(`Patient: ${data.maskedName} (${data.pronoun})`);
  doc.text(`Room No: ${data.roomNumber || 'N/A'}`);  
  doc.text(`Admission: ${data.admitDate ? new Date(data.admitDate).toLocaleDateString() : 'N/A'}`);
  doc.text(`Discharge: ${data.dischargeDate ? new Date(data.dischargeDate).toLocaleDateString() : 'N/A'}`);
  doc.moveDown().fontSize(12).text('Summary:').font('Times-Roman');
  doc.moveDown().text(data.summaryText, { align: 'left' });

  doc.end();
  return doc;
}

module.exports = { createDischargeSummaryPDF };
