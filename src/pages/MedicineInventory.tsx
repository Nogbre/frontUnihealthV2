import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, Package, AlertTriangle } from 'lucide-react';
import { medicinesService, Medicine } from '../services/medicines.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const MedicineInventory = () => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, normal: 0, low: 0, depleted: 0 });
    const [lowStockMedicines, setLowStockMedicines] = useState<Medicine[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Filter medicines based on search term
        if (searchTerm) {
            const filtered = medicines.filter(m =>
                m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMedicines(filtered);
        } else {
            setFilteredMedicines(medicines);
        }
    }, [searchTerm, medicines]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [meds, statsData, lowStock] = await Promise.all([
                medicinesService.getAll(),
                medicinesService.getStats(),
                medicinesService.getLowStock()
            ]);

            setMedicines(meds);
            setFilteredMedicines(meds);
            setStats(statsData as any);
            setLowStockMedicines(lowStock);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            normal: { bg: 'bg-green-500', text: 'Stock Normal' },
            low: { bg: 'bg-yellow-500', text: 'Nivel Bajo' },
            depleted: { bg: 'bg-pink-600', text: 'Agotado' },
            expiring: { bg: 'bg-orange-500', text: 'Por Vencer' }
        };
        const badge = badges[status as keyof typeof badges] || badges.normal;
        return (
            <span className={`${badge.bg} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                {badge.text}
            </span>
        );
    };

    const getStockPercentage = (quantity: number, minQuantity: number) => {
        return Math.min((quantity / minQuantity) * 100, 100);
    };

    const getStockBarColor = (status: string) => {
        const colors = {
            normal: 'bg-green-500',
            low: 'bg-red-500',
            depleted: 'bg-gray-300',
            expiring: 'bg-red-500'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-300';
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
                <h1 className="text-3xl font-bold text-gray-900">Inventario de Medicamentos</h1>
                <p className="text-gray-500 mt-2">Gestiona el stock de medicamentos y suministros del kiosco</p>
            </div>

            {/* Low Stock Alert */}
            {lowStockMedicines.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
                            <div>
                                <h3 className="font-semibold text-yellow-900 mb-2">
                                    {lowStockMedicines.length} medicamento(s) con nivel bajo
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {lowStockMedicines.map((med) => (
                                        <span key={med.id} className="bg-white border border-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                            {med.name}: {med.quantity} {med.unit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium whitespace-nowrap">
                            Generar Orden de Compra
                        </button>
                    </div>
                </div>
            )}

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar medicamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                </div>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Filter size={20} />
                    Filtrar
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 font-medium">
                    <Plus size={20} />
                    Agregar Medicamento
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download size={20} />
                    Exportar
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <Package className="mx-auto text-blue-600 mb-2" size={32} />
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stats.total}</div>
                    <p className="text-sm text-gray-600">Total Medicamentos</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{stats.normal}</div>
                    <p className="text-sm text-gray-600">Stock Normal</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.low}</div>
                    <p className="text-sm text-gray-600">Nivel Bajo</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">{stats.depleted}</div>
                    <p className="text-sm text-gray-600">Agotados</p>
                </div>
            </div>

            {/* Medicines Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Listado de Medicamentos</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Medicamento
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vencimiento
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ubicación
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMedicines.map((medicine) => (
                                <tr key={medicine.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{medicine.name}</div>
                                            <div className="text-sm text-gray-500">{medicine.genericName}</div>
                                            <div className="text-sm text-gray-500">{medicine.presentation}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{medicine.category}</td>
                                    <td className="px-6 py-4">
                                        <div className={`text-sm font-medium ${medicine.status === 'depleted' ? 'text-red-600' : 'text-gray-900'}`}>
                                            {medicine.quantity} {medicine.unit}
                                        </div>
                                        <div className="text-xs text-gray-500">Mín: {medicine.minQuantity}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-32">
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${getStockBarColor(medicine.status)}`}
                                                    style={{ width: `${getStockPercentage(medicine.quantity, medicine.minQuantity)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(medicine.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {format(new Date(medicine.expirationDate), 'dd MMM yyyy', { locale: es })}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{medicine.location}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                                Editar
                                            </button>
                                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                                Usar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MedicineInventory;
