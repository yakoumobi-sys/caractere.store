'use client';

import { useState } from 'react';
import Image from 'next/image';
import { collectionProducts, themes } from '@/data/collection-products';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  theme: string;
}

interface OrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// Modal de Commande
const OrderModal = ({ product, isOpen, onClose }: OrderModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const handleOrder = async () => {
    if (!name || !phone || !city) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (!product) return;

    const totalPrice = product.price * quantity;
    const message = `
👕 *NOUVELLE COMMANDE - The Collection*

*Produit:* ${product.name}
*Quantité:* ${quantity}
*Prix unitaire:* ${product.price.toLocaleString('fr-DZ')} DA
*Total:* ${totalPrice.toLocaleString('fr-DZ')} DA

*Client:*
Nom: ${name}
Téléphone: ${phone}
Ville: ${city}

_Message automatique depuis The Collection_
    `;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/213XXX?text=${encodedMessage}`, '_blank');

    // Reset form
    setName('');
    setPhone('');
    setCity('');
    setQuantity(1);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-black">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="border-b pb-3">
          <p className="text-lg font-semibold text-red-600">
            {product.price.toLocaleString('fr-DZ')} DA
          </p>
        </div>

        {/* Quantité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantité
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
            >
              −
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="bg-gray-50 p-3 rounded text-center">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-black">
            {(product.price * quantity).toLocaleString('fr-DZ')} DA
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="tel"
            placeholder="Téléphone (WhatsApp)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="text"
            placeholder="Ville"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleOrder}
            className="flex-1 px-4 py-2 bg-black text-white rounded font-medium hover:bg-gray-800"
          >
            Commander via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant Produit
const ProductCard = ({
  product,
  onOrder,
}: {
  product: Product;
  onOrder: (product: Product) => void;
}) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg bg-gray-100 h-64">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="font-medium text-black text-sm md:text-base">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-black">
            {product.price.toLocaleString('fr-DZ')} DA
          </span>
        </div>
        <button
          onClick={() => onOrder(product)}
          className="w-full mt-3 px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 transition"
        >
          Commander
        </button>
      </div>
    </div>
  );
};

// Section Thème
const ThemeSection = ({
  themeKey,
  themeName,
  products,
  onOrder,
}: {
  themeKey: string;
  themeName: string;
  products: Product[];
  onOrder: (product: Product) => void;
}) => {
  const themeData =
    collectionProducts[themeKey as keyof typeof collectionProducts];

  return (
    <section className="mb-16 md:mb-20">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
          {themeName}
        </h2>
        <p className="text-gray-600 max-w-2xl">{themeData.description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOrder={onOrder}
          />
        ))}
      </div>
    </section>
  );
};

// Page Principale
export default function CollectionPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="mb-16 md:mb-20 py-12 md:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
            The Collection
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Découvrez notre sélection de prints exclusifs, classés par thème.
            Chaque design raconte une histoire. Commandez directement depuis ici.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        {themes.map((theme) => (
          <ThemeSection
            key={theme.key}
            themeKey={theme.key}
            themeName={theme.label}
            products={
              collectionProducts[theme.key as keyof typeof collectionProducts]
                .products
            }
            onOrder={handleOrder}
          />
        ))}
      </div>

      {/* Modal */}
      <OrderModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
