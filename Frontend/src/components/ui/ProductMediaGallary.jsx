import React, { useState } from "react";

const ProductMediaGallary = ({ title, images }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    return (
        <div>
            {/* Main image Preview */}
            <div className='bg-white rounded-2xl border border-zinc-200'>
                <div className='aspect-square bg-zinc-100 rounded-xl overflow-hidden'>
                    <img
                        src={images[selectedImageIndex ?? 0].url}
                        alt={title}
                        className='w-full h-full object-cover'
                    />
                </div>
            </div>
            {/* Other images preview to select */}
            <div className='mt-4 grid grid-cols-4 gap-2'>
                {images?.length > 1 &&
                    images.map((img, index) => (
                        <div
                            key={index}
                            className={`aspect-square bg-zinc-100 rounded-lg overflow-hidden cursor-pointer ${
                                selectedImageIndex === index
                                    ? "border-2 border-slate-500"
                                    : ""
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                        >
                            <img
                                src={img.url}
                                alt={`${title} ${index + 1}`}
                                className={`w-full h-full object-cover`}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ProductMediaGallary;
