import { useState, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useCart } from '../../context/CartContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function ClientHome() {
    const navigate = useNavigate();
    const { addToCart, cartTotal, cartCount, inventory, isStoreOpen, adicionais } = useCart();

    const [selectedCreme, setSelectedCreme] = useState('Maracujá');
    const [selectedSize, setSelectedSize] = useState('400ml');
    const [selectedAdicionais, setSelectedAdicionais] = useState(['Granola', 'Doce de Leite']);

    // Drag to scroll functionality
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const startDragging = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    const onDragging = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // O multiplicador '2' é a velocidade do scroll
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const cremes = [
        { id: 'maracuja', name: 'Maracujá', icon: '🍋', bg: 'bg-yellow-100 text-yellow-600' },
        { id: 'ninho', name: 'Ninho', icon: '🥛', bg: 'bg-blue-50 text-blue-500' },
        { id: 'iogurte', name: 'Iogurte Natural', icon: '🍃', bg: 'bg-green-50 text-green-500' }
    ];

    const heroSlides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1000&auto=format&fit=crop",
            badge: "O favorito de São Luís! 📍",
            title: "Creme de Ninho",
            subtitle: "Frutas selecionadas."
        },
        {
            id: 2,
            image: "src/assets/maracuja.jpeg",
            badge: "Novidade! ✨",
            title: "Creme de Maracujá",
            subtitle: "Sabor inconfundível para o seu dia."
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
            badge: "Refrescante 🍃",
            title: "Iogurte Natural",
            subtitle: "Leve e refrescante."
        }
    ];

    const sizes = [
        { id: '300ml', volume: '300ml', desc: 'O tamanho ideal para um lanche', price: 12 },
        { id: '400ml', volume: '400ml', desc: 'O mais pedido de hoje! 🔥', price: 14 },
        { id: '500ml', volume: '500ml', desc: 'Para quem ama salada de frutas', price: 16 }
    ];

    const toggleAdicional = (name) => {
        if (selectedAdicionais.includes(name)) {
            setSelectedAdicionais(selectedAdicionais.filter(a => a !== name));
        } else {
            setSelectedAdicionais([...selectedAdicionais, name]);
        }
    };

    const currentPrice = sizes.find(s => s.id === selectedSize)?.price || 0;

    const handleAddToCart = () => {
        const item = {
            name: `Salada ${selectedSize} - ${selectedCreme}`,
            add: selectedAdicionais.length > 0 ? selectedAdicionais.join(', ') : 'Nenhum',
            price: currentPrice,
            qty: 1,
            size: selectedSize
        };
        addToCart(item);

        // Reset selections to default after adding so user can add another one easily
        setSelectedCreme('Maracujá');
        setSelectedSize('400ml');
        setSelectedAdicionais(['Granola', 'Doce de Leite']);
    };

    const currentStock = inventory?.find(i => i.creme === selectedCreme && i.size === selectedSize)?.stock || 0;
    const isReadyToAdd = currentStock > 0 && isStoreOpen;

    return (
        <div className="pb-32 bg-background min-h-screen">
            <Header />

            {/* Hero */}
            <div className="px-4 mt-2">
                <div className="relative rounded-3xl overflow-hidden h-64 bg-slate-800 shadow-soft">
                    <div
                        ref={sliderRef}
                        onMouseDown={startDragging}
                        onMouseUp={stopDragging}
                        onMouseLeave={stopDragging}
                        onMouseMove={onDragging}
                        className={cn(
                            "flex overflow-x-auto snap-x snap-mandatory h-full [&::-webkit-scrollbar]:hidden w-full relative",
                            isDragging ? "cursor-grabbing snap-none" : "cursor-grab"
                        )}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {heroSlides.map((slide) => (
                            <div key={slide.id} className="min-w-full h-full relative snap-center flex-shrink-0">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    draggable="false"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
                                <div className="absolute top-4 left-4 bg-primary-light/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none z-10">
                                    {slide.badge}
                                </div>
                                <div className="absolute inset-x-4 bottom-8 text-white pointer-events-none z-10">
                                    <h2 className="text-3xl font-extrabold mb-1 drop-shadow-md">{slide.title}</h2>
                                    <p className="text-sm font-medium text-white/90 drop-shadow-md">{slide.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Card */}
                <div className="glass-card -mt-6 mx-4 relative z-10 rounded-2xl p-4 flex items-center justify-between shadow-soft border border-white/50 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center relative",
                            isStoreOpen ? "bg-primary-light/20 text-primary-light" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        )}>
                            <span className={cn("absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-card",
                                isStoreOpen ? "bg-success" : "bg-gray-400"
                            )}></span>
                            {isStoreOpen ? '🛵' : '💤'}
                        </div>
                        <div>
                            <p className="font-bold text-sm">
                                {isStoreOpen ? 'Delivery Tá ON!' : 'Loja Fechada'}
                            </p>
                            <p className="text-xs text-text-muted">
                                {isStoreOpen ? 'A partir das 15h' : 'Voltamos em breve'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-primary-light">Retirada</p>
                        <p className="text-xs text-text-muted">Desde as 13h</p>
                    </div>
                </div>
            </div>

            <div className="px-5 mt-8 space-y-8">

                {/* Cremes */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-lg font-extrabold text-text-main">1. Escolha o Creme</h3>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">Obrigatório</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {cremes.map(creme => (
                            <button
                                key={creme.name}
                                onClick={() => setSelectedCreme(creme.name)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300",
                                    selectedCreme === creme.name
                                        ? "border-primary-light bg-primary-light/10 shadow-sm"
                                        : "border-transparent bg-card shadow-soft hover:border-primary-light/50"
                                )}
                            >
                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2", creme.bg)}>
                                    {creme.icon}
                                </div>
                                <span className="text-[11px] font-bold text-center leading-tight">{creme.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sizes */}
                <section>
                    <h3 className="text-lg font-extrabold text-text-main mb-4">2. Tamanho do Copo</h3>
                    <div className="space-y-3">
                        {sizes.map(size => {
                            const thisStock = inventory?.find(i => i.creme === selectedCreme && i.size === size.id)?.stock || 0;
                            const isOutOfStock = thisStock === 0;

                            return (
                                <button
                                    key={size.id}
                                    onClick={() => !isOutOfStock && setSelectedSize(size.id)}
                                    disabled={isOutOfStock}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 text-left",
                                        isOutOfStock ? "opacity-50 cursor-not-allowed bg-background-alt border-transparent shadow-none" :
                                            selectedSize === size.id
                                                ? "border-primary-light bg-primary-light/10 shadow-sm"
                                                : "border-transparent bg-card shadow-soft hover:border-primary-light/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            isOutOfStock ? "bg-gray-200 text-gray-400" :
                                                selectedSize === size.id ? "bg-primary-light text-white" : "bg-primary-light/10 text-primary-light"
                                        )}>
                                            🥛
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">
                                                {size.volume}
                                                {isOutOfStock && <span className="ml-2 bg-red-100 text-red-500 text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Esgotado</span>}
                                            </p>
                                            <p className="text-[11px] text-text-muted">{size.desc}</p>
                                        </div>
                                    </div>
                                    <p className={cn("font-bold", isOutOfStock ? "text-gray-400" : "text-primary-light")}>
                                        R$ {size.price.toFixed(2).replace('.', ',')}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Adicionais */}
                <section>
                    <h3 className="text-lg font-extrabold text-text-main mb-4">3. Adicionais</h3>
                    <div className="flex flex-wrap gap-2">
                        {adicionais.filter(a => a.available).map(adicional => {
                            const isSelected = selectedAdicionais.includes(adicional.name);
                            return (
                                <button
                                    key={adicional.name}
                                    onClick={() => toggleAdicional(adicional.name)}
                                    className={cn(
                                        "px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-300 flex items-center gap-2",
                                        isSelected
                                            ? "border-primary-light bg-primary-light/10 text-primary-light"
                                            : "border-transparent bg-card text-text-main shadow-soft hover:border-primary-light/50"
                                    )}
                                >
                                    {adicional.name}
                                    {adicional.tag && (
                                        <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider ml-1">
                                            {adicional.tag.toUpperCase()}
                                        </span>
                                    )}
                                    {adicional.price > 0 && !adicional.tag && (
                                        <span className="text-primary-light ml-1">+R${adicional.price}</span>
                                    )}
                                    {adicional.price === 0 && !adicional.tag && (
                                        <span className="text-primary-light ml-1">+R$0</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <button
                    onClick={handleAddToCart}
                    disabled={!isReadyToAdd}
                    className={cn(
                        "w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform flex items-center justify-center gap-2",
                        isReadyToAdd ? "bg-primary text-white shadow-primary/30 active:scale-95" : "bg-gray-300 text-gray-500 shadow-none cursor-not-allowed"
                    )}
                >
                    <ShoppingBag size={20} />
                    {isReadyToAdd ? `Adicionar no Carrinho (R$ ${currentPrice.toFixed(2).replace('.', ',')})` : 'Indisponível'}
                </button>


            </div>

            {/* Floating Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-50 transition-colors duration-300">
                <div className="bg-card p-2 pr-2 pl-4 rounded-[2rem] shadow-[0_-10px_40px_-15px_rgba(236,72,153,0.3)] border border-primary-light/10 flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary-light/10 flex items-center justify-center text-primary-light relative">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] text-text-muted tracking-wide">Total do Carrinho</p>
                            <p className="font-extrabold text-lg leading-tight">R$ {cartTotal.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                    {cartCount > 0 ? (
                        <Link to="/cart" className="bg-primary-light text-white px-6 py-4 rounded-3xl font-bold shadow-md shadow-primary-light/30 active:scale-95 transition-transform">
                            Ver Pedido
                        </Link>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={!isReadyToAdd}
                            className={cn("px-6 py-4 rounded-3xl font-bold shadow-md transition-transform", isReadyToAdd ? "bg-primary text-white shadow-primary/30 active:scale-95" : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none")}
                        >
                            Adicionar
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}
