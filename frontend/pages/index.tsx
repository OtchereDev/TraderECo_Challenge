import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import { FRONTEND_API } from "../config/config";
import { toast } from "react-toastify";
import ProductCard from "../components/products/productCard";
import { IProduct } from "../types/products";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import { QueryBuilder } from "../helpers/queryBuilder";
import { frontendProductRoute } from "../config/frontendRoutes";

export interface IData {
  totalCount: number;
  page: number;
  pageSize: number;
  products: IProduct[];
}

interface IHome {
  message: string;
  data: IData;
}

const Home: NextPage<IHome> = ({ message, data: _data }) => {
  useEffect(() => {
    toast.info(message);
  }, []);

  const [data, setData] = useState<IData>(_data);

  const router = useRouter();
  const query = router.query;

  const [page, setPage] = useState(
    query?.page?.length && !isNaN(parseInt(query?.page as string))
      ? parseInt(query?.page as string)
      : 1
  );

  const [search, setSearch] = useState(
    query?.search?.length ? parseInt(query?.search as string) : ""
  );

  const handleSearch = async (phrase: string) => {
    setPage(1);
    setSearch(phrase);
    await handleRouting("1", phrase);
  };

  const handleRouting = async (customPage?: string, customSearch?: string) => {
    const filterObject = {
      page: customPage ?? page,
      search: customSearch ?? search,
    };

    const query = QueryBuilder(filterObject);

    router.push(`${query}`, undefined, {
      shallow: true,
    });
  };

  const handlePageClick = async ({ selected }: { selected: number }) => {
    await handleRouting((selected + 1)?.toString());
  };

  const fetchProducts = async () => {
    const queryString = QueryBuilder(query);

    const request = await fetch(`${frontendProductRoute}${queryString}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    if (request.ok) {
      const data = await request.json();
      setData(data.data);
    }
  };

  useEffect(() => {
    if (Object.keys(query)?.length > 0) {
      fetchProducts();
    }
  }, [query]);

  return (
    <>
      <Layout title="Home Page" headerText="Shop">
        <div className="bg-white">
          <div className="max-w-2xl mx-auto py-5 px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {data.products?.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  setProduts={setData}
                />
              ))}
            </div>

            {data.totalCount <= 0 && <p className="text-center">No products</p>}
          </div>
          <div className="mx-auto w-4/12 mt-10">
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={Math.ceil(data.totalCount / data.totalCount)}
              previousLabel="< previous"
              renderOnZeroPageCount={() => null}
              containerClassName="flex items-center  justify-between w-full mt-5"
              activeClassName=" !text-blue-500 "
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const request = await fetch(`${FRONTEND_API}/product`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await request.json();

  console.log(data);

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
      data: data.data,
    },
  };
};

export default Home;
