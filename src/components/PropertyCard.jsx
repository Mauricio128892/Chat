import React from 'react';

const PropertyCard = ({ property }) => (
  <div className="bg-zinc-800 rounded-lg shadow-lg p-4 m-2 flex flex-col items-start w-full border border-gray-700">
    <h3 className="text-xl font-bold text-amber-400 capitalize">{property.tipo} en {property.zona}</h3>
    <p className="text-2xl font-extrabold text-gray-100 mt-2">${property.precio.toLocaleString('es-MX')}</p>
    <p className="text-sm text-gray-400 italic mt-1">{property.descripcion}</p>
  </div>
);

export default PropertyCard;
