import React, { useState } from 'react';
import { 
  ShoppingBag, Star, ShieldCheck, Plus, Minus, Trash2, CheckCircle2, 
  CreditCard, Banknote, Truck, Sparkles, Filter, Search, ChevronRight,
  Shield, PackageCheck, AlertCircle, Info
} from 'lucide-react';
import { Product, CartItem, Order } from '../types';
import { SELF_DEFENSE_PRODUCTS, KARACHI_DISTRICTS } from '../data/karachiData';

interface MarketplaceScreenProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onPlaceOrder: (order: Order) => void;
  orders: Order[];
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onPlaceOrder,
  orders
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'store' | 'cart' | 'orders' | 'inventory'>('store');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Checkout State
  const [customerName, setCustomerName] = useState<string>('Mariam Khan');
  const [customerPhone, setCustomerPhone] = useState<string>('0300-8241920');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('House 42-B, Street 18, Phase 5, DHA, Karachi');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(KARACHI_DISTRICTS[0]);
  const [selectedCourier, setSelectedCourier] = useState<'TCS Express' | 'Leopards Courier' | 'Call Courier Karachi'>('TCS Express');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'visa' | 'mastercard' | 'jazzcash' | 'easypaisa'>('cod');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 1094');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvc, setCardCvc] = useState<string>('882');
  const [orderPlacedModal, setOrderPlacedModal] = useState<Order | null>(null);

  const categories = ['All', 'Sprays', 'Alarms & Sirens', 'Stun & Impact', 'Covert & Wearables', 'Home & Vehicle Safety'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.pricePKR * item.quantity), 0);
  const shippingFee = cartSubtotal > 0 ? 250 : 0; // Flat courier rate across Karachi
  const cartTotal = cartSubtotal + shippingFee;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `ORD-KHI-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      subtotalPKR: cartSubtotal,
      shippingFeePKR: shippingFee,
      totalPKR: cartTotal,
      customerName,
      phone: customerPhone,
      deliveryAddress,
      district: selectedDistrict,
      courier: selectedCourier,
      paymentMethod,
      status: 'processing',
      createdAt: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      trackingNumber: `TCS-KH-${Math.floor(100000 + Math.random() * 900000)}`
    };

    onPlaceOrder(newOrder);
    setOrderPlacedModal(newOrder);
    setActiveTab('orders');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 px-4 pt-3 space-y-4">
      {/* Marketplace Navigation Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'store' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Self-Defense Store</span>
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 relative ${
            activeTab === 'cart' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Cart ({totalCartCount})</span>
          {totalCartCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5" />
          <span>Orders ({orders.length})</span>
        </button>
      </div>

      {activeTab === 'store' && (
        <>
          {/* Header & Verification Promise */}
          <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>100% LEGAL SELF DEFENSE GEAR IN PAKISTAN</span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">Karachi Women’s Safety Mart</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Tested pepper sprays, non-lethal disablers, 130dB sirens, and discreet safety wearables. Dispatched directly with Karachi courier partners.
            </p>
          </div>

          {/* Search & Categories */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search sprays, strobe alarms, rings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-9 pr-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Horizontal Categories Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-3.5 shadow-xl flex flex-col justify-between transition group"
              >
                <div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-slate-950">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {prod.isFeatured && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                        BESTSELLER
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {prod.stockCount} in stock
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="font-bold text-slate-200">{prod.rating}</span>
                    <span className="text-[10px] text-slate-400">({prod.reviewCount} reviews)</span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-white font-display">
                      PKR {prod.pricePKR.toLocaleString()}
                    </div>
                    {prod.originalPricePKR && (
                      <span className="text-[10px] text-slate-500 line-through">
                        PKR {prod.originalPricePKR.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onAddToCart(prod)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Cart & Checkout View */}
      {activeTab === 'cart' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
            <span className="text-xs text-slate-400">{cart.length} unique items</span>
          </div>

          {cart.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-semibold">Your self-defense cart is empty</p>
              <p className="text-xs text-slate-500">Explore Karachi-verified safety products and gear up.</p>
              <button
                onClick={() => setActiveTab('store')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-cyan-400 font-semibold">
                        PKR {item.product.pricePKR.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Karachi Delivery & Payment
                </h3>

                {/* Customer Details */}
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Phone Number (For Courier OTP / Call)</label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Karachi District</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
                    >
                      {KARACHI_DISTRICTS.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Complete Street Address</label>
                    <textarea
                      rows={2}
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3rd Party Courier Partner */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Third-Party Courier Agency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['TCS Express', 'Leopards Courier', 'Call Courier Karachi'] as const).map((courier) => (
                      <button
                        key={courier}
                        type="button"
                        onClick={() => setSelectedCourier(courier)}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition ${
                          selectedCourier === courier
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5 mx-auto mb-1" />
                        <span className="truncate block">{courier}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Options: Visa, Mastercard, Cash on Delivery */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                        paymentMethod === 'cod'
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('visa')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                        paymentMethod === 'visa'
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Visa Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mastercard')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                        paymentMethod === 'mastercard'
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Mastercard</span>
                    </button>
                  </div>

                  {(paymentMethod === 'visa' || paymentMethod === 'mastercard') && (
                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full py-1.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full py-1.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">CVC</label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full py-1.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing Summary */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Items Subtotal:</span>
                    <span>PKR {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Karachi Flat Delivery ({selectedCourier}):</span>
                    <span>PKR {shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                    <span>Total Amount:</span>
                    <span className="text-base font-black text-cyan-400 font-display">
                      PKR {cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Place Order (PKR {cartTotal.toLocaleString()})</span>
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Orders History View */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Your Orders & Deliveries</h2>
            <span className="text-xs text-slate-400">{orders.length} orders</span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
              <PackageCheck className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-semibold">No orders yet</p>
              <p className="text-xs text-slate-500">Orders placed will show live courier tracking here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{order.id}</span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.2 rounded font-mono border border-cyan-800">
                          {order.courier}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Placed on {order.createdAt}</p>
                    </div>

                    <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/40">
                      Dispatched
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                    <p className="text-[10px] text-slate-400">Tracking Number:</p>
                    <p className="font-mono text-cyan-400 font-bold">{order.trackingNumber}</p>
                    <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                      Destination: {order.deliveryAddress} ({order.district})
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Payment: <b className="text-slate-200 uppercase">{order.paymentMethod}</b></span>
                    <span className="text-sm font-black text-white font-display">
                      PKR {order.totalPKR.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Order Confirmed Modal */}
      {orderPlacedModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white">Order Confirmed!</h3>
            <p className="text-xs text-slate-300">
              Your self-defense equipment has been dispatched via <b className="text-emerald-400">{orderPlacedModal.courier}</b>.
            </p>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300">
              Tracking: {orderPlacedModal.trackingNumber}
            </div>

            <button
              onClick={() => setOrderPlacedModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
