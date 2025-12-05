export interface ParsedReportSection {
  title: string;
  content: string;
}

export interface ParsedReport {
  sections: ParsedReportSection[];
  patientInfo?: {
    name?: string;
    age?: string;
    id?: string;
  };
  consultationInfo?: {
    reason?: string;
    dateTime?: string;
  };
}

/**
 * Parse report content from plain text to structured sections
 */
export const parseReportContent = (content: string): ParsedReport => {
  const sections: ParsedReportSection[] = [];
  const lines = content.split('\n');
  
  let currentSection: ParsedReportSection | null = null;
  let patientInfo: ParsedReport['patientInfo'] = {};
  let consultationInfo: ParsedReport['consultationInfo'] = {};

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines and separator lines
    if (!trimmedLine || trimmedLine === '==================') {
      return;
    }

    // Check if this is a section header (all caps ending with :)
    if (/^[A-ZÁÉÍÓÚÑ\s]+:$/.test(trimmedLine)) {
      // Save previous section if exists
      if (currentSection && currentSection.content.trim()) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: trimmedLine.replace(':', ''),
        content: ''
      };
    } else if (currentSection) {
      // Add to current section
      currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine;
    } else {
      // Content before any section header
      if (sections.length === 0) {
        sections.push({
          title: 'Resumen',
          content: trimmedLine
        });
      }
    }

    // Extract patient info
    if (trimmedLine.startsWith('- Nombre:')) {
      patientInfo.name = trimmedLine.replace('- Nombre:', '').trim();
    }
    if (trimmedLine.startsWith('- Edad:')) {
      patientInfo.age = trimmedLine.replace('- Edad:', '').trim();
    }
    if (trimmedLine.startsWith('- ID:')) {
      patientInfo.id = trimmedLine.replace('- ID:', '').trim();
    }
    if (trimmedLine.startsWith('- Motivo:')) {
      consultationInfo.reason = trimmedLine.replace('- Motivo:', '').trim();
    }
    if (trimmedLine.startsWith('- Fecha y Hora:')) {
      consultationInfo.dateTime = trimmedLine.replace('- Fecha y Hora:', '').trim();
    }
  });

  // Add last section
  if (currentSection !== null && currentSection.content.trim()) {
    sections.push(currentSection);
  }

  return {
    sections,
    patientInfo: Object.keys(patientInfo).length > 0 ? patientInfo : undefined,
    consultationInfo: Object.keys(consultationInfo).length > 0 ? consultationInfo : undefined
  };
};
