import { APIURL, BACKEND_API } from "../../config/config";
import { NextApiRequest, NextApiResponse } from "next";
import { Products } from "../../config/backendRoutes";
import { QueryBuilder } from "../../helpers/queryBuilder";

const FetchAllProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const response = await fetch(
      `${BACKEND_API}${Products}${QueryBuilder(req.query)}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({ message: data.message });
    }

    return res.json({
      message: data.message,
      data: data.data,
    });
  } else {
    res.status(400).send({ message: `${req.method} is not Allowed` });
  }
};

export default FetchAllProducts;
