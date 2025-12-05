import jsPDF from 'jspdf';
import { Report } from '../services/reports.service';
import { parseReportContent } from './reportParser';

/**
 * Generate a professional medical report PDF
 */
export const generateMedicalReportPDF = (report: Report) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // ========== HEADER ==========
  // Logo and institution name
  doc.setFillColor(37, 99, 235); // Primary blue
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('❤️ UNIHealth', margin, 20);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión Médica', margin, 28);
  
  // Contact info (right aligned)
  doc.setFontSize(8);
  const contactInfo = [
    'Tel: (555) 123-4567',
    'www.unihealth.com'
  ];
  contactInfo.forEach((info, index) => {
    doc.text(info, pageWidth - margin, 18 + (index * 5), { align: 'right' });
  });

  yPosition = 45;
  doc.setTextColor(0, 0, 0);

  // ========== DOCUMENT TITLE ==========
  const reportTypeLabels: Record<string, string> = {
    emergency: 'REPORTE DE EMERGENCIA',
    consultation: 'REPORTE DE CONSULTA MÉDICA',
    followup: 'REPORTE DE SEGUIMIENTO'
  };
  
  doc.setFillColor(240, 244, 248);
  doc.rect(margin, yPosition, contentWidth, 15, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(reportTypeLabels[report.type] || 'REPORTE MÉDICO', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  yPosition += 25;
  doc.setTextColor(0, 0, 0);

  // ========== PATIENT INFORMATION BOX ==========
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, contentWidth, 30);
  
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition, contentWidth, 8, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DEL PACIENTE', margin + 3, yPosition + 5);
  
  yPosition += 12;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre: ${report.patientName}`, margin + 3, yPosition);
  yPosition += 6;
  doc.text(`Fecha: ${new Date(report.date).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })} • ${report.time}`, margin + 3, yPosition);
  
  yPosition += 12;

  // ========== METADATA ==========
  checkNewPage(15);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Estado: ${report.status === 'completed' ? 'Completado' : 'Borrador'}`, margin, yPosition);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, pageWidth - margin, yPosition, { align: 'right' });
  doc.text(`Médico: ${report.createdBy}`, margin, yPosition + 5);
  
  yPosition += 15;
  doc.setTextColor(0, 0, 0);

  // ========== REPORT CONTENT ==========
  if (report.content) {
    const parsed = parseReportContent(report.content);
    
    parsed.sections.forEach((section, index) => {
      checkNewPage(25);
      
      // Section header
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, yPosition, contentWidth, 8, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition + 8, pageWidth - margin, yPosition + 8);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text(section.title, margin + 2, yPosition + 5);
      
      yPosition += 12;
      doc.setTextColor(0, 0, 0);
      
      // Section content
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const contentLines = doc.splitTextToSize(section.content, contentWidth - 6);
      
      contentLines.forEach((line: string) => {
        checkNewPage(8);
        doc.text(line, margin + 3, yPosition);
        yPosition += 5;
      });
      
      yPosition += 5;
    });
  }

  // ========== SIGNATURE SECTION ==========
  checkNewPage(40);
  yPosition = Math.max(yPosition, pageHeight - 60);
  
  doc.setDrawColor(200, 200, 200);
  doc.line(margin + 60, yPosition + 20, pageWidth - margin - 60, yPosition + 20);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Firma del Médico', pageWidth / 2, yPosition + 25, { align: 'center' });
  doc.text(report.createdBy, pageWidth / 2, yPosition + 30, { align: 'center' });

  // ========== FOOTER ==========
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      'Este es un documento médico confidencial',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `reporte-${report.patientName.replace(/\s+/g, '-')}-${report.date}.pdf`;
  doc.save(fileName);
};
