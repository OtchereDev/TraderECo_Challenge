import React, { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import Image from "next/image";
import { toast } from "react-toastify";
import { APIURL, FRONTEND_API } from "../../config/config";
import { useRouter } from "next/router";
import { useAppSelector } from "../../store";
import { IProduct } from "../../types/products";
import { GetServerSideProps } from "next";

interface IData {
  message: string;
  product: IProduct;
}

const Index: React.FC<IData> = ({ product }) => {
  const [productName, setProductName] = useState(product?.name || "");
  const [price, setPrice] = useState<number | string>(product?.price || 0);
  const [description, setDescription] = useState(product?.description || "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");

  const { role } = useAppSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { productId } = router.query;

  const handleSubmit = async () => {
    if (productName.trim().length <= 0)
      return toast.error("Product name cannot be empty");
    if (!price || price <= 0)
      return toast.error("Price cannot empty or cannot be 0 or less ");
    if (imageUrl.trim().length <= 0)
      return toast.error("Product Image cannot be empty");
    if (description.trim().length <= 0)
      return toast.error("Product Image cannot be empty");

    setIsLoading(() => true);

    const request = await fetch(
      `/api/upload${
        productId?.length ? "?update=true&productId=" + productId : ""
      }`,
      {
        method: "POST",
        body: JSON.stringify({
          productName,
          description: description,
          imageUrl: imageUrl,
          price: price?.toString(),
        }),
        headers: {
          "content-type": "application/json",
        },
      }
    );

    try {
      const response = await request.json();

      console.log({ response });

      if (request.ok) {
        toast.success(response.message);
        router.push("/");
      } else {
        toast.error("There was an unexpected error");
      }
    } catch (error) {
      toast.error("There was an unexpected error");
    }

    setIsLoading(() => false);
  };

  useEffect(() => {
    if (role !== "admin") {
      toast.warning("You dont have the permission to be here");
      router.push("/");
    }
  }, [role]);

  return (
    <Layout title="Upload A Product" headerText="Upload A Product">
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              onChange={(e) => setProductName(() => e.target.value)}
              value={productName}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300  rounded-md py-2 px-2"
            />
          </div>

          <div className="col-span-6 sm:col-span-3 mt-6">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(() => e.target.valueAsNumber)}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm border border-gray-300 md:w-1/2 w-full   rounded-md py-2 px-2"
              min={1}
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Cover photo
            </label>
            <input
              type="text"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              onChange={(e) => setImageUrl(() => e.target.value)}
              value={imageUrl}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300  rounded-md py-2 px-2"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              onChange={(e) => setDescription(() => e.target.value)}
              value={description}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border border-gray-300  rounded-md py-2 px-2"
            ></textarea>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              onClick={() => handleSubmit()}
              disabled={isLoading}
            >
              {productId?.length ? "Update" : "Save"} product
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const request = await fetch(
    `${FRONTEND_API}/product/${(query as any).productId}`,
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
