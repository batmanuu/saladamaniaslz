import { useState } from 'react';
import { ChevronLeft, ShoppingBag, MapPin, Store, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NEIGHBORHOODS, RESTAURANT_COORDS, calculateDistance, calculateEstimates } from '../../utils/delivery';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems, updateQty, removeItem, cartTotal, placeOrder, inventory } = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [deliveryType, setDeliveryType] = useState('entrega'); // 'entrega', 'retirada'
    const [paymentMethod, setPaymentMethod] = useState(''); // 'pix', 'cartao', 'dinheiro'
    const [partner, setPartner] = useState(null); // '99', 'uber', null

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [waitingRideConfirmation, setWaitingRideConfirmation] = useState(false);
    const [estimates, setEstimates] = useState(null);

    const deliveryFee = deliveryType === 'entrega' ? 0 : 0; // Configurable later
    const total = cartTotal + deliveryFee;

    const handleNeighborhoodChange = (e) => {
        const neighborhoodName = e.target.value;
        setSelectedNeighborhood(neighborhoodName);
        setPartner(null); // Reset partner when changing neighborhood

        if (neighborhoodName) {
            const neighborhood = NEIGHBORHOODS.find(n => n.name === neighborhoodName);
            if (neighborhood) {
                const distance = calculateDistance(
                    RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng,
                    neighborhood.lat, neighborhood.lng
                );
                const calcEstimates = calculateEstimates(distance);
                setEstimates({ ...calcEstimates, destinationCoords: neighborhood });
            }
        } else {
            setEstimates(null);
        }
    };

    const handleCheckout = () => {
        if (!paymentMethod) {
            alert('Por favor, selecione uma forma de pagamento.');
            return;
        }

        if (deliveryType === 'entrega') {
            if (!selectedNeighborhood) {
                alert('Por favor, selecione seu bairro.');
                return;
            }
            if (!partner) {
                alert('Por favor, selecione a plataforma para entrega (Uber ou 99).');
                return;
            }
            // Intercept to show ride confirmation screen
            setWaitingRideConfirmation(true);
            return;
        }

        finalizeOrder();
    };

    const finalizeOrder = () => {
        const orderData = {
            deliveryType,
            paymentMethod,
            customer: { nome, telefone, endereco: selectedNeighborhood }, // Storing neighborhood as the address
            deliveryFee,
            partner
        };

        placeOrder(orderData);
        setOrderPlaced(true);
        setWaitingRideConfirmation(false);
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
                    <Check size={40} />
                </div>
                <h2 className="text-2xl font-extrabold text-text-main mb-2">Pedido Confirmado! 🎉</h2>
                <p className="text-text-muted mb-8">
                    Seu pedido foi recebido pela loja e já está sendo preparado.
                </p>
                <Link to="/" className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                    Voltar ao Início
                </Link>
            </div>
        );
    }

    if (waitingRideConfirmation) {
        // Build Deep Links
        const startLat = RESTAURANT_COORDS.lat;
        const startLng = RESTAURANT_COORDS.lng;
        const endLat = estimates?.destinationCoords?.lat || 0;
        const endLng = estimates?.destinationCoords?.lng || 0;

        // https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction
        const uberUrl = `uber://?action=setPickup&pickup[latitude]=${startLat}&pickup[longitude]=${startLng}&dropoff[latitude]=${endLat}&dropoff[longitude]=${endLng}`;

        // 99 App deeplink format (fallback to generic or web if needed)
        // Adjusting to common known scheme or generic web URL for 99
        const ninenineUrl = `taxis99://`;

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
                    <MapPin size={40} />
                </div>
                <h2 className="text-2xl font-extrabold text-text-main mb-2">Solicitar Corrida</h2>
                <p className="text-text-muted mb-8 text-sm">
                    Quase lá! Para que o pedido entre em preparo, você precisa solicitar a corrida no app escolhido.
                </p>

                <div className="space-y-4 w-full max-w-sm mb-8">
                    {partner === 'uber' && (
                        <a href={uberUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-black text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
                            Abrir Uber
                        </a>
                    )}
                    {partner === '99' && (
                        <a href={ninenineUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#FFD100] text-black py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
                            Abrir 99
                        </a>
                    )}
                </div>

                <div className="space-y-3 w-full max-w-sm">
                    <button onClick={finalizeOrder} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                        Já solicitei a corrida
                    </button>
                    <button onClick={() => setWaitingRideConfirmation(false)} className="w-full bg-card text-text-main py-4 rounded-2xl font-bold active:scale-95 transition-transform">
                        Voltar e editar pedido
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="pb-32 bg-background min-h-screen">
            {/* Header */}
            <header className="flex items-center gap-4 px-6 py-4 bg-background sticky top-0 z-20">
                <button onClick={() => navigate(-1)} className="text-primary p-2 -ml-2 hover:bg-primary-light/10 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-primary font-bold text-2xl italic flex-1 text-center pr-8 tracking-tight" style={{ fontFamily: 'cursive' }}>
                    Salada Mania
                </h1>
            </header>

            <div className="px-5 mt-4 space-y-6">

                {/* Cart Item Card */}
                <div className="bg-card rounded-[2rem] p-6 shadow-soft relative transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary">
                            <ShoppingBag size={20} />
                        </div>
                        <h2 className="font-extrabold text-lg text-text-main">Meu Carrinho</h2>
                    </div>

                    <div className="space-y-6">
                        {cartItems.map(item => {
                            const parsedCreme = item.creme || item.name.split(' - ')[1];
                            const currentStock = inventory?.find(i => i.creme === parsedCreme && i.size === item.size)?.stock || 0;
                            const isMaxQty = currentStock === 0;

                            return (
                                <div key={item.id} className="flex gap-4 items-start relative">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="absolute -top-2 -right-2 bg-red-100 text-red-500 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                                    >
                                        ✕
                                    </button>
                                    <img
                                        src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=200&auto=format&fit=crop"
                                        alt="Salada"
                                        className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-slate-100"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm text-text-main leading-tight mb-1">{item.name}</h3>
                                        <p className="text-[11px] text-text-muted mb-3">Adicionais: {item.add}</p>

                                        <div className="flex items-center justify-between">
                                            <p className="font-extrabold text-primary">R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</p>
                                            <div className="flex items-center gap-3 bg-background-alt px-3 py-1.5 rounded-2xl">
                                                <button
                                                    onClick={() => updateQty(item.id, -1)}
                                                    className="text-primary font-bold px-1 active:scale-95 text-lg leading-none"
                                                >
                                                    -
                                                </button>
                                                <span className="font-bold text-sm text-text-main w-3 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => !isMaxQty && updateQty(item.id, 1)}
                                                    disabled={isMaxQty}
                                                    className={cn("font-bold px-1 text-lg leading-none transition-colors",
                                                        isMaxQty ? "text-gray-300 cursor-not-allowed" : "text-primary active:scale-95"
                                                    )}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {cartItems.length === 0 && (
                            <p className="text-center text-text-muted text-sm py-4">Seu carrinho está vazio.</p>
                        )}
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Link to="/" className="text-primary text-sm font-bold bg-primary/10 px-4 py-2 rounded-full inline-block">
                            + Adicionar mais itens
                        </Link>
                    </div>

                    <hr className="border-t-2 border-dashed border-background-alt my-6" />

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-muted">Subtotal</span>
                            <span className="text-text-muted">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-muted">Taxa de entrega</span>
                            <span className={cn("font-semibold px-2 py-0.5 rounded-md text-[11px]", deliveryType === 'entrega' ? "bg-primary/10 text-primary" : "bg-success/10 text-success")}>
                                {deliveryType === 'entrega' ? 'Calculada no App parceiro' : 'Grátis'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="font-extrabold text-lg text-text-main">Total</span>
                            <span className="font-extrabold text-lg text-text-main">R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Toggle */}
                <div className="flex bg-card p-1.5 rounded-[2rem] shadow-soft mb-8 transition-colors duration-300">
                    <button
                        onClick={() => setDeliveryType('entrega')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.5rem] font-bold text-sm transition-all",
                            deliveryType === 'entrega' ? "bg-primary text-white shadow-md shadow-primary/30" : "text-text-muted hover:bg-background-alt"
                        )}
                    >
                        <MapPin size={18} /> Entrega
                    </button>
                    <button
                        onClick={() => setDeliveryType('retirada')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.5rem] font-bold text-sm transition-all",
                            deliveryType === 'retirada' ? "bg-primary text-white shadow-md shadow-primary/30" : "text-text-muted hover:bg-background-alt"
                        )}
                    >
                        <Store size={18} /> Retirada
                    </button>
                </div>

                {/* Form */}
                <div>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                            {/* <User size={16} /> */} {/* User icon was not imported, removed for now */}
                        </div>
                        <h3 className="font-extrabold text-lg text-text-main">Informações de {deliveryType === 'entrega' ? 'Entrega' : 'Retirada'}</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <label className="absolute -top-2.5 left-4 bg-background px-2 text-[10px] font-bold text-primary tracking-wide">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                placeholder="Como quer ser chamado?"
                                className="w-full bg-card border-none rounded-2xl px-5 py-4 text-sm font-medium text-text-main shadow-soft placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-300"
                            />
                        </div>

                        <div className="relative">
                            <label className="absolute -top-2.5 left-4 bg-background px-2 text-[10px] font-bold text-primary tracking-wide">
                                Número de Telefone
                            </label>
                            <input
                                type="tel"
                                value={telefone}
                                onChange={e => setTelefone(e.target.value)}
                                placeholder="(98) 99146-5154"
                                className="w-full bg-card border-none rounded-2xl px-5 py-4 text-sm font-medium text-text-main shadow-soft placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-300"
                            />
                        </div>

                        {deliveryType === 'entrega' && (
                            <div className="relative">
                                <label className="absolute -top-2.5 left-4 bg-background px-2 text-[10px] font-bold text-primary tracking-wide">
                                    Bairro de Entrega
                                </label>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                    <ChevronLeft size={16} className="-rotate-90" />
                                </div>
                                <select
                                    value={selectedNeighborhood}
                                    onChange={handleNeighborhoodChange}
                                    className="w-full bg-card border-none rounded-2xl px-5 py-4 text-sm font-medium text-text-main shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-colors duration-300"
                                >
                                    <option value="" disabled>Selecione o seu bairro...</option>
                                    {NEIGHBORHOODS.map(n => (
                                        <option key={n.name} value={n.name}>{n.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pickup Info / Store GPS */}
                {deliveryType === 'retirada' && (
                    <div className="bg-primary-light/10 border border-primary-light/20 rounded-3xl p-5 shadow-soft">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="text-primary-light" size={20} />
                            <h3 className="font-extrabold text-sm text-text-main">Nosso Endereço</h3>
                        </div>
                        <p className="text-xs text-text-muted mb-4 font-medium leading-relaxed">
                            Rua das Frutas, 123 - Centro <br />
                            São Luís, MA - 65000-000 <br />
                            (Próximo a praça principal)
                        </p>
                        <a
                            href="https://maps.google.com/?q=São+Luís,MA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-card text-primary text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 border border-primary/10 inline-flex items-center gap-1"
                        >
                            📍 Ver no Google Maps
                        </a>
                    </div>
                )}

                {/* Payment Methods */}
                <div>
                    <h3 className="font-extrabold text-lg text-text-main mb-4 px-2">Forma de Pagamento</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setPaymentMethod('pix')}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 duration-300",
                                paymentMethod === 'pix' ? "border-primary bg-primary/5 shadow-sm" : "border-transparent bg-card shadow-soft"
                            )}
                        >
                            <span className="text-2xl">⚡</span>
                            <span className="text-xs font-bold text-text-main">Pix</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('cartao')}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 duration-300",
                                paymentMethod === 'cartao' ? "border-primary bg-primary/5 shadow-sm" : "border-transparent bg-card shadow-soft"
                            )}
                        >
                            <span className="text-2xl">💳</span>
                            <span className="text-xs font-bold text-text-main">Cartão</span>
                        </button>
                        {deliveryType === 'retirada' && (
                            <button
                                onClick={() => setPaymentMethod('dinheiro')}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 col-span-2 duration-300",
                                    paymentMethod === 'dinheiro' ? "border-primary bg-primary/5 shadow-sm" : "border-transparent bg-card shadow-soft"
                                )}
                            >
                                <span className="text-2xl">💵</span>
                                <span className="text-xs font-bold text-text-main">Dinheiro em Espécie (Apenas Retirada)</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Platform Estimates for Delivery */}
                {deliveryType === 'entrega' && estimates && (
                    <div className="mt-8">
                        <h3 className="font-extrabold text-lg text-text-main mb-4 px-2 flex items-center justify-between">
                            <span>Plataforma de Entrega</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <button
                                onClick={() => setPartner('uber')}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 duration-300",
                                    partner === 'uber' ? "border-black bg-black/5 shadow-sm" : "border-transparent bg-card shadow-soft"
                                )}
                            >
                                <span className="font-extrabold text-lg text-black">Uber Moto</span>
                                <div className="text-center">
                                    <span className="text-xs text-text-muted block mb-1">Estimativa:</span>
                                    <span className="text-sm font-bold text-text-main">
                                        R$ {estimates.uber.min.toFixed(2).replace('.', ',')} - R$ {estimates.uber.max.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </button>
                            <button
                                onClick={() => setPartner('99')}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 duration-300",
                                    partner === '99' ? "border-black bg-[#FFD100]/20 shadow-sm" : "border-transparent bg-card shadow-soft"
                                )}
                            >
                                <span className="font-extrabold text-lg flex items-center gap-1.5 text-text-main">
                                    <span className="bg-[#FFD100] text-black px-1.5 py-0.5 rounded-lg leading-none">99</span>
                                    Moto
                                </span>
                                <div className="text-center">
                                    <span className="text-xs text-text-muted block mb-1">Estimativa:</span>
                                    <span className="text-sm font-bold text-text-main">
                                        R$ {estimates['99'].min.toFixed(2).replace('.', ',')} - R$ {estimates['99'].max.toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </button>
                        </div>
                        <div className="px-2">
                            <p className="text-[10px] text-text-muted font-medium bg-red-500/10 text-red-600 p-2 rounded-lg text-center">
                                ⚠️ Valor final pode variar conforme demanda da plataforma. Prometemos apenas a estimativa.
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background via-background/90 to-transparent z-50">
                <button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/40 active:scale-[0.98] transition-all filter hover:brightness-110 flex items-center justify-center"
                >
                    Finalizar Pedido <span className="ml-1 opacity-80 mt-1">›</span>
                </button>
            </div>

        </div>
    );
}
