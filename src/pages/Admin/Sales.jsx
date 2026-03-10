import { useState, useMemo } from 'react';
import { ShoppingBag, ChevronLeft, Calendar as CalendarIcon, Home, LayoutList, Settings, TrendingUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function AdminSales() {
    const navigate = useNavigate();
    const { orders } = useCart();

    // Default to today (YYYY-MM-DD local format)
    const today = new Date().toLocaleDateString('en-CA');
    const [selectedDate, setSelectedDate] = useState(today);
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderIds(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    // Filter orders by selected date
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const orderDate = new Date(order.date).toLocaleDateString('en-CA');
            return orderDate === selectedDate;
        });
    }, [orders, selectedDate]);

    // Calculate totals for the selected date
    const totalRevenue = filteredOrders.reduce((acc, order) => {
        // Option to exclude 'Pendente' or 'Cancelado' records if required later
        return acc + order.total;
    }, 0);

    const totalOrders = filteredOrders.length;

    // Helper functions for easy display of dates in BR format
    const formatBRDate = (isoString) => {
        const [year, month, day] = isoString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="admin-theme pb-24 bg-background min-h-screen">

            {/* Header */}
            <header className="flex items-center gap-4 px-5 py-4 bg-white shadow-soft sticky top-0 z-20">
                <button onClick={() => navigate('/admin')} className="text-primary p-2 -ml-2 hover:bg-primary-light/10 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="bg-primary-light/10 p-2 rounded-xl text-primary">
                        <LayoutList size={22} />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-slate-800 text-lg leading-tight">Vendas</h1>
                        <p className="text-[10px] text-slate-500">Relatórios Diários</p>
                    </div>
                </div>
            </header>

            <div className="px-5 mt-6 space-y-8">

                {/* Filtro de Data */}
                <section>
                    <div className="bg-white p-4 rounded-3xl shadow-soft flex items-center justify-between border border-primary/5">
                        <div className="flex items-center gap-2">
                            <CalendarIcon size={18} className="text-primary" />
                            <span className="text-sm font-bold text-slate-800">Filtrar por Dia:</span>
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl focus:ring-primary focus:border-primary block px-3 py-2 outline-none font-semibold text-center"
                        />
                    </div>
                </section>

                {/* Resumo do Dia */}
                <section>
                    <h2 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase mb-3 text-center">
                        Desempenho em {selectedDate === today ? 'Hoje' : formatBRDate(selectedDate)}
                    </h2>
                    <div className="flex gap-4">
                        <div className="bg-white p-5 rounded-3xl shadow-soft flex-1 border border-primary/5 text-center">
                            <div className="flex justify-center items-center gap-2 text-primary-light mb-2">
                                <TrendingUp size={16} />
                                <span className="text-[10px] font-bold">Faturamento Total</span>
                            </div>
                            <p className="font-extrabold text-2xl text-slate-800">
                                R$ {totalRevenue.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl shadow-soft flex-1 border border-primary/5 text-center">
                            <div className="flex justify-center items-center gap-2 text-primary-light mb-2">
                                <ShoppingBag size={16} />
                                <span className="text-[10px] font-bold">Qtd de Pedidos</span>
                            </div>
                            <p className="font-extrabold text-2xl text-slate-800">{totalOrders}</p>
                        </div>
                    </div>
                </section>

                {/* Lista de Pedidos Filtrados */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase">
                            Pedidos do Dia
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                                Nenhum pedido encontrado para o dia {formatBRDate(selectedDate)}.
                            </div>
                        ) : (
                            filteredOrders.map((order) => {
                                let borderClass = "border-l-primary";
                                let bgClass = "bg-primary/20 text-primary";
                                if (order.status === 'Preparando') {
                                    borderClass = "border-l-accent";
                                    bgClass = "bg-accent/20 text-accent-dark";
                                } else if (order.status === 'Saiu para Entrega' || order.status === 'Pronto para Retirada') {
                                    borderClass = "border-l-blue-400";
                                    bgClass = "bg-blue-100 text-blue-600";
                                } else if (order.status === 'Finalizado') {
                                    borderClass = "border-l-success";
                                    bgClass = "bg-success/20 text-success";
                                }

                                const isExpanded = expandedOrderIds.includes(order.id);

                                return (
                                    <div key={order.id} className={cn("bg-white rounded-3xl p-5 shadow-soft border border-slate-100 border-l-4", borderClass, order.status === 'Finalizado' ? "opacity-75" : "")}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-extrabold text-slate-800 text-base">{order.id} - {order.customer?.nome || 'Cliente não identificado'}</h3>
                                                <p className="text-[10px] text-slate-500 mt-1 font-bold">
                                                    {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.deliveryType} • {order.paymentMethod}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={cn("text-[9px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wide", bgClass)}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-xl mb-3">
                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                                {order.items.map(item => `${item.qty}x ${item.name}`).join(', ')}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="font-extrabold text-primary-light text-base">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                                            <button
                                                onClick={() => toggleOrderDetails(order.id)}
                                                className="bg-white text-primary border border-primary/20 hover:bg-primary-light/5 transition-colors font-bold text-[11px] px-4 py-2 rounded-xl shadow-sm"
                                            >
                                                {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                                            </button>
                                        </div>

                                        {/* Detalhes Expandidos */}
                                        {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                                <div>
                                                    <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Itens do Pedido</h4>
                                                    <div className="space-y-2">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="bg-white p-3 rounded-xl border border-primary/5 shadow-sm">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="font-bold text-xs text-slate-800">{item.qty}x {item.name}</span>
                                                                    <span className="font-bold text-xs text-primary-light">R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
                                                                </div>
                                                                {item.add && item.add !== 'Nenhum' ? (
                                                                    <div className="mt-2">
                                                                        <p className="text-[10px] font-bold text-slate-500 mb-1">Adicionais:</p>
                                                                        <ul className="space-y-1">
                                                                            {item.add.split(', ').map((opt, optIdx) => (
                                                                                <li key={optIdx} className="text-[10px] text-slate-800 flex justify-between bg-slate-50 px-2 py-1 rounded-md">
                                                                                    <span>• {opt}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-[10px] text-slate-500 mt-1 italic">Sem adicionais extras</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {order.customer && (
                                                    <div>
                                                        <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Dados do Cliente</h4>
                                                        <div className="bg-white p-3 rounded-xl border border-primary/5 shadow-sm space-y-1">
                                                            <p className="text-[11px] text-slate-800"><span className="font-bold text-slate-500">Nome:</span> {order.customer.nome}</p>
                                                            <p className="text-[11px] text-slate-800"><span className="font-bold text-slate-500">WhatsApp:</span> {order.customer.telefone}</p>
                                                            {order.deliveryType === 'Entrega' && (
                                                                <div className="mt-2 pt-2 border-t border-slate-100">
                                                                    <p className="text-[11px] text-slate-800"><span className="font-bold text-slate-500">Endereço:</span> {order.customer.endereco}, {order.customer.numero}</p>
                                                                    <p className="text-[11px] text-slate-800"><span className="font-bold text-slate-500">Bairro:</span> {order.customer.bairro}</p>
                                                                    {order.customer.complemento && (
                                                                        <p className="text-[11px] text-slate-800"><span className="font-bold text-slate-500">Comp:</span> {order.customer.complemento}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 z-50 px-6 py-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate('/admin')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
                        <Home size={20} />
                        <span className="text-[9px] font-semibold">Início</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-primary">
                        <LayoutList size={20} className="fill-current" />
                        <span className="text-[9px] font-bold">Vendas</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
                        <ShoppingBag size={20} />
                        <span className="text-[9px] font-semibold">Produtos</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
                        <Settings size={20} />
                        <span className="text-[9px] font-semibold">Config</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
