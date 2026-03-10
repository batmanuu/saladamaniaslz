import { useState } from 'react';
import { Store, TrendingUp, ShoppingBag, Edit2, ChevronRight, Home, LayoutList, Settings, MoreHorizontal, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { orders, updateOrderStatus, inventory, updateInventoryStock, isStoreOpen, toggleStoreStatus, adicionais, toggleAdicionalAvailability } = useCart();
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderIds(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const cremesList = ['Ninho', 'Maracujá', 'Iogurte Natural'];
    const cremeIcons = { 'Ninho': '🍦', 'Maracujá': '🍋', 'Iogurte Natural': '🥛' };
    const cremeBgs = {
        'Ninho': 'bg-orange-100 text-orange-500',
        'Maracujá': 'bg-yellow-100 text-yellow-500',
        'Iogurte Natural': 'bg-blue-100 text-blue-500'
    };

    return (
        <div className="admin-theme pb-24 bg-background min-h-screen">

            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 bg-white shadow-soft sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-light/10 p-2 rounded-xl text-primary">
                        <Store size={22} />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-text-main text-lg leading-tight">Salada Mania SLZ</h1>
                        <p className="text-[10px] text-text-muted">Painel do Vendedor</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isStoreOpen} onChange={toggleStoreStatus} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                    </label>
                    <span className={cn("text-xs font-bold", isStoreOpen ? "text-success" : "text-text-muted")}>
                        {isStoreOpen ? 'Aberto' : 'Fechado'}
                    </span>
                </div>
            </header>

            <div className="px-5 mt-6 space-y-8">

                {/* Resumo */}
                <section>
                    <h2 className="text-[11px] font-extrabold text-text-muted tracking-widest uppercase mb-3">Resumo de Hoje</h2>
                    <div className="flex gap-4">
                        <div className="bg-white p-5 rounded-3xl shadow-soft flex-1 border border-primary/5">
                            <div className="flex items-center gap-2 text-primary-light mb-2">
                                <TrendingUp size={16} />
                                <span className="text-[10px] font-bold">Faturamento</span>
                            </div>
                            <p className="font-extrabold text-2xl text-text-main">
                                R$ {orders.reduce((acc, o) => acc + o.total, 0).toFixed(2).replace('.', ',')}
                            </p>
                            <p className="text-[10px] text-success font-bold mt-1">Hoje</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl shadow-soft flex-1 border border-primary/5">
                            <div className="flex items-center gap-2 text-primary-light mb-2">
                                <ShoppingBag size={16} />
                                <span className="text-[10px] font-bold">Pedidos</span>
                            </div>
                            <p className="font-extrabold text-2xl text-text-main">{orders.length}</p>
                            <p className="text-[10px] text-success font-bold mt-1">{orders.filter(o => o.status !== 'Finalizado').length} pendentes</p>
                        </div>
                    </div>
                </section>

                {/* Estoque */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[11px] font-extrabold text-text-muted tracking-widest uppercase">Estoque / Copos</h2>
                        <button className="flex items-center gap-1 text-[11px] font-bold text-primary-light">
                            <Edit2 size={12} /> Editar
                        </button>
                    </div>
                    <div className="bg-white rounded-[2rem] p-4 shadow-soft space-y-1">

                        {cremesList.map(creme => (
                            <div key={creme} className="py-3 border-b border-background-alt last:border-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={cn("p-2.5 rounded-xl", cremeBgs[creme])}>
                                        <span className="text-xl">{cremeIcons[creme]}</span>
                                    </div>
                                    <h3 className="font-extrabold text-sm text-text-main leading-tight">{creme}</h3>
                                </div>
                                <div className="pl-14 space-y-2">
                                    {['300ml', '400ml', '500ml'].map(size => {
                                        const item = inventory?.find(i => i.creme === creme && i.size === size);
                                        if (!item) return null;
                                        return (
                                            <div key={item.id} className="flex items-center justify-between">
                                                <p className="text-xs text-text-muted font-bold">Copo {size}</p>
                                                <div className="flex items-center gap-2 bg-background-alt px-2 py-1 rounded-xl">
                                                    <button
                                                        onClick={() => updateInventoryStock(item.id, -1)}
                                                        className="text-text-muted p-0.5 hover:text-primary transition-colors active:scale-95"
                                                    >
                                                        <div className="w-2.5 h-0.5 bg-current rounded-full"></div>
                                                    </button>
                                                    <span className={cn("font-extrabold text-sm w-4 text-center", item.stock <= 5 ? "text-primary" : "text-text-main")}>
                                                        {item.stock}
                                                    </span>
                                                    <button
                                                        onClick={() => updateInventoryStock(item.id, 1)}
                                                        className="text-primary-light p-0.5 font-bold hover:text-primary transition-colors active:scale-95"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                    </div>
                </section>

                {/* Adicionais */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[11px] font-extrabold text-text-muted tracking-widest uppercase">Gerenciar Adicionais</h2>
                    </div>
                    <div className="bg-white rounded-[2rem] p-4 shadow-soft space-y-3">
                        {adicionais.map((adicional) => (
                            <div key={adicional.name} className="flex items-center justify-between py-2 border-b border-background-alt last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-background-alt p-2 rounded-xl text-primary-light">
                                        <Settings size={18} />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-sm text-text-main leading-tight">{adicional.name}</p>
                                        <p className="text-[10px] text-text-muted font-bold">
                                            Status: <span className={cn(adicional.available ? "text-success" : "text-text-muted")}>
                                                {adicional.available ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={adicional.available} onChange={() => toggleAdicionalAvailability(adicional.name)} />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pedidos Recentes */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[11px] font-extrabold text-text-muted tracking-widest uppercase">Pedidos Recentes</h2>
                    </div>
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="text-center py-8 text-text-muted bg-white rounded-2xl border border-dashed border-gray-300">
                                Nenhum pedido recebido ainda hoje.
                            </div>
                        ) : (
                            orders.map((order) => {
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
                                    <div key={order.id} className={cn("bg-white rounded-3xl p-5 shadow-soft border border-background-alt border-l-4", borderClass, order.status === 'Finalizado' ? "opacity-75" : "")}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-extrabold text-text-main text-base">{order.id} - {order.customer?.nome || 'Cliente não identificado'}</h3>
                                                <p className="text-[10px] text-text-muted mt-1 font-bold">
                                                    {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.deliveryType} • {order.paymentMethod}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={cn("text-[9px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wide border outline-none cursor-pointer", bgClass)}
                                                >
                                                    <option value="Pendente">Pendente</option>
                                                    <option value="Preparando">Preparando</option>
                                                    <option value="Pronto para Retirada">Pronto / Retirada</option>
                                                    <option value="Saiu para Entrega">Saiu para Entrega</option>
                                                    <option value="Finalizado">Finalizado</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="bg-background-alt p-3 rounded-xl mb-3">
                                            <p className="text-xs text-text-main font-medium leading-relaxed">
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
                                            <div className="mt-4 pt-4 border-t border-background-alt space-y-3">
                                                <div>
                                                    <h4 className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider mb-2">Itens do Pedido</h4>
                                                    <div className="space-y-2">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="bg-white p-3 rounded-xl border border-primary/5 shadow-sm">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="font-bold text-xs text-text-main">{item.qty}x {item.name}</span>
                                                                    <span className="font-bold text-xs text-primary-light">R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
                                                                </div>
                                                                {item.add && item.add !== 'Nenhum' ? (
                                                                    <div className="mt-2">
                                                                        <p className="text-[10px] font-bold text-text-muted mb-1">Adicionais:</p>
                                                                        <ul className="space-y-1">
                                                                            {item.add.split(', ').map((opt, optIdx) => (
                                                                                <li key={optIdx} className="text-[10px] text-text-main flex justify-between bg-background-alt px-2 py-1 rounded-md">
                                                                                    <span>• {opt}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-[10px] text-text-muted mt-1 italic">Sem adicionais extras</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {order.customer && (
                                                    <div>
                                                        <h4 className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider mb-2">Dados do Cliente</h4>
                                                        <div className="bg-white p-3 rounded-xl border border-primary/5 shadow-sm space-y-1">
                                                            <p className="text-[11px] text-text-main"><span className="font-bold text-text-muted">Nome:</span> {order.customer.nome}</p>
                                                            <p className="text-[11px] text-text-main"><span className="font-bold text-text-muted">WhatsApp:</span> {order.customer.telefone}</p>
                                                            {order.deliveryType === 'Entrega' && (
                                                                <div className="mt-2 pt-2 border-t border-background-alt">
                                                                    <p className="text-[11px] text-text-main"><span className="font-bold text-text-muted">Endereço:</span> {order.customer.endereco}, {order.customer.numero}</p>
                                                                    <p className="text-[11px] text-text-main"><span className="font-bold text-text-muted">Bairro:</span> {order.customer.bairro}</p>
                                                                    {order.customer.complemento && (
                                                                        <p className="text-[11px] text-text-main"><span className="font-bold text-text-muted">Comp:</span> {order.customer.complemento}</p>
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
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-background-alt z-50 px-6 py-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between">
                    <button className="flex flex-col items-center gap-1 text-primary">
                        <Home size={20} className="fill-current" />
                        <span className="text-[9px] font-bold">Início</span>
                    </button>
                    <button onClick={() => navigate('/admin/vendas')} className="flex flex-col items-center gap-1 text-text-muted hover:text-primary transition-colors">
                        <LayoutList size={20} />
                        <span className="text-[9px] font-semibold">Vendas</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-text-muted hover:text-primary transition-colors">
                        <ShoppingBag size={20} />
                        <span className="text-[9px] font-semibold">Produtos</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-text-muted hover:text-primary transition-colors">
                        <Settings size={20} />
                        <span className="text-[9px] font-semibold">Config</span>
                    </button>
                </div>
            </div>

        </div>
    );
}
