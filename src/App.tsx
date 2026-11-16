/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Coordinates, UserProfile, SOSAlert, GuardBooking, 
  Product, CartItem, Order, NearbyDistressSignal, SecurityAuthority 
} from './types';
import { 
  KARACHI_CENTER, SELF_DEFENSE_PRODUCTS, SAMPLE_NEARBY_DISTRESS, SECURITY_AUTHORITIES 
} from './data/karachiData';
import { MobileFrame } from './components/MobileFrame';
import { SOSScreen } from './components/SOSScreen';
import { GuardianBookingScreen } from './components/GuardianBookingScreen';
import { MarketplaceScreen } from './components/MarketplaceScreen';
import { NearbyDistressScreen } from './components/NearbyDistressScreen';
import { CnicVerificationModal } from './components/CnicVerificationModal';
import { AuthorityAnalysisModal } from './components/AuthorityAnalysisModal';
import { WidgetSimulator } from './components/WidgetSimulator';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'sos' | 'guardians' | 'marketplace' | 'distress' | 'profile'>('sos');

  // User Profile with CNIC Verification
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tahaffuz_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'usr-khi-9921',
      fullName: 'Mariam Tariq',
      phone: '0300-8241920',
      cnicNumber: '42201-8392014-2',
      gender: 'female',
      isVerified: true,
      verificationDate: '2026-08-20',
      emergencyPin: '1234',
      emergencyContacts: [
        { id: 'c1', name: 'Mother (Home)', relationship: 'Mother', phone: '0300-9876543', notifyOnSOS: true },
        { id: 'c2', name: 'Sister Ayesha', relationship: 'Sister', phone: '0321-5554321', notifyOnSOS: true }
      ]
    };
  });

  // Current User Geolocation (with Karachi fallback)
  const [userLocation, setUserLocation] = useState<Coordinates>(KARACHI_CENTER);

  // Active Emergency SOS State
  const [activeSOS, setActiveSOS] = useState<SOSAlert | null>(() => {
    const saved = localStorage.getItem('tahaffuz_active_sos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Active Rent-a-Guardian Booking
  const [activeBooking, setActiveBooking] = useState<GuardBooking | null>(() => {
    const saved = localStorage.getItem('tahaffuz_active_booking');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Marketplace Products & Cart
  const [products] = useState<Product[]>(SELF_DEFENSE_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tahaffuz_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { product: SELF_DEFENSE_PRODUCTS[0], quantity: 1 },
      { product: SELF_DEFENSE_PRODUCTS[1], quantity: 1 }
    ];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tahaffuz_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ORD-KHI-491028',
        items: [{ product: SELF_DEFENSE_PRODUCTS[0], quantity: 1 }],
        subtotalPKR: 2850,
        shippingFeePKR: 250,
        totalPKR: 3100,
        customerName: 'Mariam Tariq',
        phone: '0300-8241920',
        deliveryAddress: 'House 42-B, Street 18, Phase 5, DHA, Karachi',
        district: 'Karachi South (Clifton, DHA)',
        courier: 'TCS Express',
        paymentMethod: 'cod',
        status: 'dispatched',
        createdAt: '22 Aug 2026',
        trackingNumber: 'TCS-KH-829104'
      }
    ];
  });

  // Nearby 100m Distress Signal Simulation
  const [activeDistress, setActiveDistress] = useState<NearbyDistressSignal | null>(SAMPLE_NEARBY_DISTRESS);
  const [isRespondingToDistress, setIsRespondingToDistress] = useState<boolean>(false);

  // Modals
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [showAuthorityModal, setShowAuthorityModal] = useState<boolean>(false);
  const [selectedAuthorityForModal, setSelectedAuthorityForModal] = useState<SecurityAuthority | null>(null);
  const [showWidgetModal, setShowWidgetModal] = useState<boolean>(false);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('tahaffuz_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (activeSOS) {
      localStorage.setItem('tahaffuz_active_sos', JSON.stringify(activeSOS));
    } else {
      localStorage.removeItem('tahaffuz_active_sos');
    }
  }, [activeSOS]);

  useEffect(() => {
    if (activeBooking) {
      localStorage.setItem('tahaffuz_active_booking', JSON.stringify(activeBooking));
    } else {
      localStorage.removeItem('tahaffuz_active_booking');
    }
  }, [activeBooking]);

  useEffect(() => {
    localStorage.setItem('tahaffuz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tahaffuz_orders', JSON.stringify(orders));
  }, [orders]);

  // Real Geolocation Hook
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // If in Karachi / Pakistan region or general preview
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
            address: 'Khayaban-e-Shahbaz, DHA Phase 6, Karachi',
            district: 'Karachi South',
            landmark: 'Near 26th Commercial Street, Karachi'
          });
        },
        (err) => {
          console.log('Using high-accuracy Karachi location coordinates:', err.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // SOS Triggers
  const handleTriggerSOS = (isCovert: boolean = false) => {
    const newSOS: SOSAlert = {
      id: `SOS-${Date.now().toString().slice(-6)}`,
      userId: userProfile.id,
      userName: userProfile.fullName,
      userPhone: userProfile.phone,
      userCnic: userProfile.cnicNumber,
      timestamp: Date.now(),
      location: userLocation,
      status: 'active',
      audioDurationSeconds: 0,
      dispatchedAuthorities: [
        'Madadgar 15', 
        'Women Protection Cell 1094', 
        'CPLC 1102', 
        'Sindh Safe City (SSCA)'
      ],
      responderCount: 4,
      isCovert: isCovert
    };

    setActiveSOS(newSOS);
    setActiveTab('sos');
  };

  const handleCancelSOS = (pin: string): boolean => {
    if (pin === userProfile.emergencyPin || pin === '1234') {
      setActiveSOS(null);
      return true;
    }
    return false;
  };

  // Guardian Bookings
  const handleBookGuard = (booking: GuardBooking) => {
    setActiveBooking(booking);
    setActiveTab('guardians');
  };

  const handleCancelBooking = (bookingId: string) => {
    setActiveBooking(null);
  };

  // Marketplace Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handlePlaceOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
  };

  // Nearby Distress Handlers
  const handleSimulateNewDistress = () => {
    setActiveDistress({
      id: `sos-live-${Date.now()}`,
      victimName: 'Amina S. (Verified CNIC)',
      distanceMeters: Math.floor(45 + Math.random() * 45),
      direction: 'North-East (68m away - near Zamzama Boulevard)',
      location: {
        lat: userLocation.lat + 0.0006,
        lng: userLocation.lng + 0.0005,
        address: 'Zamzama Commercial Lane 3, Clifton, Karachi',
        landmark: 'Near Zamzama Park & Cafe',
        district: 'Karachi South'
      },
      timestamp: Date.now(),
      urgencyLevel: 'CRITICAL',
      status: 'ACTIVE_DISTRESS',
      respondersOnWay: 2,
      audioBroadcastActive: true
    });
    setIsRespondingToDistress(false);
  };

  const handleRespondToDistress = (distressId: string) => {
    setIsRespondingToDistress(true);
  };

  const handleOpenAuthorityDetails = (auth: SecurityAuthority) => {
    setSelectedAuthorityForModal(auth);
    setShowAuthorityModal(true);
  };

  return (
    <MobileFrame
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      activeSOS={activeSOS}
      activeDistress={activeDistress}
      onOpenWidgetSimulator={() => setShowWidgetModal(true)}
      onOpenAuthorityMatrix={() => setShowAuthorityModal(true)}
      onOpenVerification={() => setShowVerificationModal(true)}
      userProfile={userProfile}
    >
      {/* 1. SOS HELP SCREEN */}
      {activeTab === 'sos' && (
        <SOSScreen
          userProfile={userProfile}
          userLocation={userLocation}
          activeSOS={activeSOS}
          onTriggerSOS={handleTriggerSOS}
          onCancelSOS={handleCancelSOS}
          onOpenAuthorityDetails={handleOpenAuthorityDetails}
          onOpenVerification={() => setShowVerificationModal(true)}
        />
      )}

      {/* 2. RENT-A-GUARDIAN SCREEN */}
      {activeTab === 'guardians' && (
        <GuardianBookingScreen
          userLocation={userLocation}
          activeBooking={activeBooking}
          onBookGuard={handleBookGuard}
          onCancelBooking={handleCancelBooking}
          onTriggerSOS={handleTriggerSOS}
        />
      )}

      {/* 3. 100M NEARBY RADAR SCREEN */}
      {activeTab === 'distress' && (
        <NearbyDistressScreen
          userLocation={userLocation}
          activeDistress={activeDistress}
          onSimulateNewDistress={handleSimulateNewDistress}
          onRespondToDistress={handleRespondToDistress}
          isResponding={isRespondingToDistress}
        />
      )}

      {/* 4. SELF-DEFENSE MARKETPLACE SCREEN */}
      {activeTab === 'marketplace' && (
        <MarketplaceScreen
          products={products}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onPlaceOrder={handlePlaceOrder}
          orders={orders}
        />
      )}

      {/* CNIC VERIFICATION MODAL */}
      {showVerificationModal && (
        <CnicVerificationModal
          userProfile={userProfile}
          onSaveProfile={setUserProfile}
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      {/* KARACHI PUBLIC SECURITY LANDSCAPE & COLLABORATION MATRIX */}
      {showAuthorityModal && (
        <AuthorityAnalysisModal
          selectedAuthority={selectedAuthorityForModal}
          onClose={() => {
            setShowAuthorityModal(false);
            setSelectedAuthorityForModal(null);
          }}
        />
      )}

      {/* MOBILE OS WIDGET SIMULATOR (iOS Lock Screen, iOS Home 2x2/4x2, Android Material) */}
      {showWidgetModal && (
        <WidgetSimulator
          userLocation={userLocation}
          activeSOS={activeSOS}
          onTriggerSOS={handleTriggerSOS}
          onClose={() => setShowWidgetModal(false)}
        />
      )}
    </MobileFrame>
  );
}
