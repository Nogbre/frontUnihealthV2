import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Stethoscope, ClipboardList, Calendar, Download, Eye, Edit, FileText, Plus, X, User, Clock, FileCheck } from 'lucide-react';
import { reportsService, Report } from '../services/reports.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateMedicalReportPDF } from '../utils/pdfGenerator';
import { parseReportContent } from '../utils/reportParser';

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'emergency' | 'consultation' | 'drafts'>('all');
    const [stats, setStats] = useState({ total: 0, completed: 0, drafts: 0, emergency: 0, consultation: 0, followup: 0 });
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterReports();
    }, [activeTab, reports]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reportsData, statsData] = await Promise.all([
                reportsService.getAll(),
                reportsService.getStats()
            ]);

            setReports(reportsData);
            setStats(statsData as any);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterReports = () => {
        let filtered = reports;

        switch (activeTab) {
            case 'emergency':
                filtered = reports.filter(r => r.type === 'emergency');
                break;
            case 'consultation':
                filtered = reports.filter(r => r.type === 'consultation');
                break;
            case 'drafts':
                filtered = reports.filter(r => r.status === 'draft');
                break;
            default:
                filtered = reports;
        }

        setFilteredReports(filtered);
    };

    const getTypeIcon = (type: string) => {
        const icons = {
            emergency: <AlertTriangle className="text-red-600" size={20} />,
            consultation: <Stethoscope className="text-blue-600" size={20} />,
            followup: <ClipboardList className="text-green-600" size={20} />
        };
        return icons[type as keyof typeof icons];
    };

    const getTypeLabel = (type: string) => {
        const labels = {
            emergency: 'Emergencia',
            consultation: 'Consulta',
            followup: 'Seguimiento'
        };
        return labels[type as keyof typeof labels];
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            completed: { bg: 'bg-green-500', text: 'Completo' },
            draft: { bg: 'bg-orange-500', text: 'Borrador' }
        };
        const badge = badges[status as keyof typeof badges];
        return (
            <span className={`${badge.bg} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                {badge.text}
            </span>
        );
    };

    const handleViewReport = async (reportId: number) => {
        try {
            const report = await reportsService.getById(reportId);
            if (report) {
                setSelectedReport(report);
                setShowViewModal(true);
            }
        } catch (error) {
            console.error('Error loading report:', error);
            alert('Error al cargar el reporte');
        }
    };

    const handleDownloadPDF = (report: Report) => {
        try {
            generateMedicalReportPDF(report);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error al generar el PDF. Por favor intenta de nuevo.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Reportes</h1>
                <p className="text-gray-500 mt-2">Crea y gestiona reportes de emergencias, consultas y seguimientos</p>
            </div>

            {/* Report Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Emergency Report */}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-600" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reporte de Emergencia</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Documentar respuesta a alerta de emergencia
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/reports/emergency/create')}
                        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Crear Reporte
                    </button>
                </div>

                {/* Consultation Report */}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reporte de Consulta</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Documentar consulta o atención programada
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/reports/consultation/create')}
                        className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Crear Reporte
                    </button>
                </div>

                {/* Follow-up Report */}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ClipboardList className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reporte de Seguimiento</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Documentar evolución de tratamiento
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/reports/followup/create')}
                        className="w-full px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Crear Reporte
                    </button>
                </div>
            </div>

            {/* Recent Reports Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Reportes Recientes</h2>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                            <Calendar size={18} />
                            Filtrar por Fecha
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                            <Download size={18} />
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex px-6">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Todos los Reportes
                        </button>
                        <button
                            onClick={() => setActiveTab('emergency')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'emergency'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Reportes de Emergencia
                        </button>
                        <button
                            onClick={() => setActiveTab('consultation')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'consultation'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Reportes de Consulta
                        </button>
                        <button
                            onClick={() => setActiveTab('drafts')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'drafts'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Borradores
                            {stats.drafts > 0 && (
                                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {stats.drafts}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo de Reporte
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Paciente
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha y Hora
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(report.type)}
                                            <span className="text-sm font-medium text-gray-900">
                                                {getTypeLabel(report.type)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{report.patientName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {format(new Date(`${report.date}T${report.time}`), "dd MMM yyyy • HH:mm", { locale: es })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(report.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleViewReport(report.id)}
                                                className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
                                            >
                                                <Eye size={16} />
                                                Ver
                                            </button>
                                            {report.status === 'draft' && (
                                                <button className="text-gray-600 hover:text-gray-700 flex items-center gap-1 text-sm">
                                                    <Edit size={16} />
                                                    Editar
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDownloadPDF(report)}
                                                className="text-gray-600 hover:text-gray-700 flex items-center gap-1 text-sm"
                                            >
                                                <FileText size={16} />
                                                PDF
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Report Modal */}
            {showViewModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header - Medical Institution Style */}
                        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-5 rounded-t-2xl">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-2xl">❤️</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">UNIHealth</h2>
                                        <p className="text-primary-100 text-sm">Sistema de Gestión Médica</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            {/* Report Type Badge */}
                            <div className="mt-4 flex items-center gap-3">
                                {getTypeIcon(selectedReport.type)}
                                <div>
                                    <h3 className="text-xl font-semibold">{getTypeLabel(selectedReport.type)}</h3>
                                    <p className="text-primary-100 text-sm flex items-center gap-2 mt-1">
                                        <Clock size={14} />
                                        {format(new Date(`${selectedReport.date}T${selectedReport.time}`), "EEEE, d 'de' MMMM 'de' yyyy • HH:mm", { locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="px-6 py-6 space-y-6">
                            {/* Patient Information Card */}
                            <div className="border-l-4 border-primary-600 bg-primary-50 rounded-r-lg p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="text-primary-600" size={20} />
                                    <h4 className="font-bold text-primary-900 uppercase text-sm tracking-wide">Información del Paciente</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-primary-700 uppercase tracking-wide mb-1">Nombre Completo</p>
                                        <p className="text-base font-semibold text-gray-900">{selectedReport.patientName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-primary-700 uppercase tracking-wide mb-1">Estado del Reporte</p>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedReport.status)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Report Content - Parsed Sections */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileCheck className="text-gray-600" size={20} />
                                    <h4 className="font-bold text-gray-900 uppercase text-sm tracking-wide">Contenido Clínico</h4>
                                </div>
                                
                                {selectedReport.content ? (
                                    (() => {
                                        const parsed = parseReportContent(selectedReport.content);
                                        return (
                                            <div className="space-y-4">
                                                {parsed.sections.map((section, index) => (
                                                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <h5 className="font-semibold text-primary-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                                                            {section.title}
                                                        </h5>
                                                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                            {section.content}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                        <p className="text-yellow-800 text-sm">No hay contenido disponible para este reporte</p>
                                    </div>
                                )}
                            </div>

                            {/* Medical Professional Signature */}
                            <div className="border-t-2 border-gray-200 pt-4 mt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Médico Responsable</p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">{selectedReport.createdBy}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Documento Generado</p>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {format(new Date(), "dd/MM/yyyy • HH:mm", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Medical Confidentiality Notice */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs text-blue-800 text-center">
                                    🔒 Este documento contiene información médica confidencial protegida por la ley de privacidad del paciente
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-100 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => handleDownloadPDF(selectedReport)}
                                className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                                <Download size={18} />
                                Descargar PDF Profesional
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
