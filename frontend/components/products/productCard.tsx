import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IProduct } from "../../types/products";
import { useAppSelector } from "../../store";
import { useRouter } from "next/router";
import { IData } from "../../pages";

interface IProductCard {
  product: IProduct;
  setProduts: Dispatch<SetStateAction<IData>>;
}

const ProductCard: React.FC<IProductCard> = ({ product, setProduts }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { role } = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const handleDetail = async () => {
    router.push(`/product/${product._id}`);
  };

  const handleUpdate = async () => {
    router.push(`/upload?productId=${product._id}`);
  };

  const handleDelete = async () => {
    const request = await fetch(
      `/api/delete-product?productId=${product._id}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    console.log(request.ok, request.status);

    if (request.ok) {
      setProduts((data) => ({
        ...data,
        products: data.products.filter(
          (_product) => _product._id != product._id
        ),
      }));
    } else {
      const data = await request.json();
      toast.warning(data?.message);
    }
  };
  return (
    <div>
      <div className="relative">
        <div className="relative w-full h-72 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={"product image"}
            layout="fill"
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div className="relative mt-4">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        </div>
        <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <p className="relative text-lg font-semibold text-white">
            ${product.price}
          </p>
        </div>
      </div>
      <div className="mt-6">
        {role == "admin" && (
          <button
            onClick={() => handleUpdate()}
            disabled={isLoading}
            className="relative w-full flex bg-gray-100 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            Update product
            <span className="sr-only">{product.name}</span>
          </button>
        )}
        <button
          onClick={() => handleDetail()}
          disabled={isLoading}
          className="relative w-full mt-3 flex bg-gray-100 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-200"
        >
          Detail
          <span className="sr-only">{product.name}</span>
        </button>
        {role == "admin" && (
          <button
            onClick={() => handleDelete()}
            disabled={isLoading}
            className="relative w-full flex mt-2 bg-red-400 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-100 hover:bg-red-200"
          >
            Delete product
            <span className="sr-only">{product.name}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
