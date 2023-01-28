import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/layouts/Layout";
import { FRONTEND_API } from "../../config/config";
import { IProduct } from "../../types/products";

interface IData {
  message: string;
  product: IProduct;
}

const Product: React.FC<IData> = ({ message, product }) => {
  useEffect(() => {
    toast.info(message);
  }, []);

  console.log({ product });

  return (
    <Layout title="Product Page" headerText="Detail">
      <div className="w-10/12 mx-auto mt-10 mb-10">
        <p className="text-2xl font-medium mb-5">{product.name}</p>
        <div className=" flex gap-8">
          <div className="w-4/12 h-40">
            <img className="w-full  rounded-md" src={product?.imageUrl} />
          </div>
          <div>
            <p>{product?.description}</p>
            <p className="mt-4 text-xl">$ {product?.price}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  console.log((params as any).productId);

  const request = await fetch(
    `${FRONTEND_API}/product/${(params as any).productId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );

  const data = await request.json();

  if (!request.ok)
    return {
      props: {
        message: data.message,
        status: "error",
      },
    };
  return {
    props: {
      message: data.message,
      status: "success",
      product: data.product,
    },
  };
};

export default Product;
