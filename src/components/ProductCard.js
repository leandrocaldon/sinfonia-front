import React from 'react';

export default function ProductCard({ product, onEdit, onDelete, isAdmin }) {
  return (
    <div 
      className="border-none rounded-2xl p-5 m-4 w-[300px] bg-white shadow-lg shadow-[#e2c9a0] transition-all duration-200 flex flex-col items-center relative min-h-[370px] hover:translate-y-[-6px] hover:scale-[1.03]"
    >
      {product.image && 
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-40 object-cover rounded-xl mb-3 bg-gray-100" 
        />
      }
      <h3 className="m-0 mb-2 font-bold text-2xl text-[#7b3f00] font-serif">{product.name}</h3>
      <p className="min-h-[50px] text-gray-700 text-sm mb-4 text-center">{product.description}</p>
      <span className="font-semibold text-[#3d2200] text-lg mb-2">${product.price}</span>
      {isAdmin && (
        <div className="mt-3.5 flex gap-2">
          <button 
            onClick={() => onEdit(product)} 
            className="bg-[#ffe2b3] text-[#7b3f00] border-none rounded-md py-1.5 px-3.5 cursor-pointer font-semibold hover:bg-[#ffd28a]"
          >
            Editar
          </button>
          <button 
            onClick={() => onDelete(product._id)} 
            className="bg-[#ffbdbd] text-[#a10000] border-none rounded-md py-1.5 px-3.5 cursor-pointer font-semibold hover:bg-[#ffa5a5]"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
