import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('sm_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('sm_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const defaultInventory = [
        { id: 'Ninho-300ml', creme: 'Ninho', size: '300ml', stock: 10 },
        { id: 'Ninho-400ml', creme: 'Ninho', size: '400ml', stock: 15 },
        { id: 'Ninho-500ml', creme: 'Ninho', size: '500ml', stock: 5 },
        { id: 'Maracujá-300ml', creme: 'Maracujá', size: '300ml', stock: 10 },
        { id: 'Maracujá-400ml', creme: 'Maracujá', size: '400ml', stock: 15 },
        { id: 'Maracujá-500ml', creme: 'Maracujá', size: '500ml', stock: 5 },
        { id: 'Iogurte Natural-300ml', creme: 'Iogurte Natural', size: '300ml', stock: 10 },
        { id: 'Iogurte Natural-400ml', creme: 'Iogurte Natural', size: '400ml', stock: 15 },
        { id: 'Iogurte Natural-500ml', creme: 'Iogurte Natural', size: '500ml', stock: 5 },
    ];

    const defaultAdicionais = [
        { name: 'Granola', price: 0, available: true },
        { name: 'Amendoim', price: 0, available: true },
        { name: 'Aveia', price: 0, available: true },
        { name: 'Doce de Leite', price: 0, tag: 'GRÁTIS HOJE! \ud83c\udf81', available: true }
    ];

    const [adicionais, setAdicionais] = useState(() => {
        const saved = localStorage.getItem('sm_adicionais');
        return saved ? JSON.parse(saved) : defaultAdicionais;
    });

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('sm_inventory');
        return saved ? JSON.parse(saved) : defaultInventory;
    });

    // Store Status State (On/Off)
    const [isStoreOpen, setIsStoreOpen] = useState(() => {
        const saved = localStorage.getItem('sm_store_status');
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('sm_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('sm_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('sm_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('sm_store_status', JSON.stringify(isStoreOpen));
    }, [isStoreOpen]);

    useEffect(() => {
        localStorage.setItem('sm_adicionais', JSON.stringify(adicionais));
    }, [adicionais]);

    // Handle cross-tab synchronization
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'sm_cart') {
                setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'sm_orders') {
                setOrders(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'sm_inventory') {
                setInventory(e.newValue ? JSON.parse(e.newValue) : defaultInventory);
            }
            if (e.key === 'sm_store_status') {
                setIsStoreOpen(e.newValue ? JSON.parse(e.newValue) : true);
            }
            if (e.key === 'sm_adicionais') {
                setAdicionais(e.newValue ? JSON.parse(e.newValue) : defaultAdicionais);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addToCart = (item) => {
        setCartItems(prev => {
            const existingItem = prev.find(
                i => i.name === item.name && i.size === item.size && i.add === item.add
            );

            if (existingItem) {
                return prev.map(i =>
                    i.id === existingItem.id
                        ? { ...i, qty: i.qty + 1 }
                        : i
                );
            }

            return [...prev, { ...item, id: Date.now() }];
        });

        // Deduct inventory when adding to cart
        setInventory(prev => {
            const parsedCreme = item.creme || item.name.split(' - ')[1];
            const invId = `${parsedCreme}-${item.size}`;
            return prev.map(inv => inv.id === invId ? { ...inv, stock: Math.max(0, inv.stock - 1) } : inv);
        });
    };

    const updateQty = (id, delta) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const newQty = Math.max(1, item.qty + delta);
        const actualDelta = newQty - item.qty;

        if (actualDelta !== 0) {
            setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));

            // Adjust inventory (if delta is +1, stock goes down -1. If delta returns -1, stock goes up +1)
            setInventory(prev => {
                const parsedCreme = item.creme || item.name.split(' - ')[1];
                const invId = `${parsedCreme}-${item.size}`;
                return prev.map(inv => inv.id === invId ? { ...inv, stock: Math.max(0, inv.stock - actualDelta) } : inv);
            });
        }
    };

    const removeItem = (id) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        setCartItems(prev => prev.filter(i => i.id !== id));

        // Restore inventory when removing from cart
        setInventory(prev => {
            const parsedCreme = item.creme || item.name.split(' - ')[1];
            const invId = `${parsedCreme}-${item.size}`;
            return prev.map(inv => inv.id === invId ? { ...inv, stock: inv.stock + item.qty } : inv);
        });
    };

    const clearCart = () => {
        // Restore all inventory when manually clearing the cart
        setInventory(prev => {
            let newInventory = [...prev];
            cartItems.forEach(item => {
                const parsedCreme = item.creme || item.name.split(' - ')[1];
                const invId = `${parsedCreme}-${item.size}`;
                const targetIndex = newInventory.findIndex(i => i.id === invId);
                if (targetIndex !== -1) {
                    newInventory[targetIndex] = {
                        ...newInventory[targetIndex],
                        stock: newInventory[targetIndex].stock + item.qty
                    };
                }
            });
            return newInventory;
        });
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const placeOrder = (orderData) => {
        const newOrder = {
            id: `#${Math.floor(Math.random() * 10000)}`,
            status: 'Pendente',
            date: new Date().toISOString(),
            items: [...cartItems],
            total: cartTotal + (orderData.deliveryFee || 0),
            ...orderData
        };
        console.log("SM_ORDER_LOG: Placing order ", newOrder);
        setOrders(prev => [newOrder, ...prev]);

        // Inventory is already reserved when added to cart, so we DO NOT restore it.
        // We just clear the cart state.
        setCartItems([]);
        return newOrder;
    };

    const updateInventoryStock = (id, delta) => {
        setInventory(prev => prev.map(inv =>
            inv.id === id ? { ...inv, stock: Math.max(0, inv.stock + delta) } : inv
        ));
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const toggleStoreStatus = () => {
        setIsStoreOpen(prev => !prev);
    };

    const toggleAdicionalAvailability = (name) => {
        setAdicionais(prev => prev.map(a =>
            a.name === name ? { ...a, available: !a.available } : a
        ));
    };

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, updateQty, removeItem, clearCart, cartTotal, cartCount,
            orders, placeOrder, updateOrderStatus,
            inventory, updateInventoryStock,
            isStoreOpen, toggleStoreStatus,
            adicionais, toggleAdicionalAvailability
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
