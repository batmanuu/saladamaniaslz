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

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('sm_inventory');
        return saved ? JSON.parse(saved) : defaultInventory;
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
    };

    const updateQty = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, qty: Math.max(1, item.qty + delta) };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

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

        // Reduce inventory
        setInventory(prev => {
            let newInventory = [...prev];
            cartItems.forEach(item => {
                // item.name is like "Salada 400ml - Maracujá"
                // Extracting creme might be tricky if not explicit, but we can do a robust split
                // or assume we pass `creme` in Home.jsx. Let's assume `item.creme` exists, or fallback to parsing
                const parsedCreme = item.creme || item.name.split(' - ')[1];
                const parsedSize = item.size;
                const invId = `${parsedCreme}-${parsedSize}`;

                const targetIndex = newInventory.findIndex(i => i.id === invId);
                if (targetIndex !== -1) {
                    newInventory[targetIndex] = {
                        ...newInventory[targetIndex],
                        stock: Math.max(0, newInventory[targetIndex].stock - item.qty) // prevent negative
                    };
                }
            });
            return newInventory;
        });

        clearCart();
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

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, updateQty, removeItem, clearCart, cartTotal, cartCount,
            orders, placeOrder, updateOrderStatus,
            inventory, updateInventoryStock
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
