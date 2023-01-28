import cookie from "cookie";
import { APIURL, FRONTEND_API } from "../../config/config";
import { NextApiRequest, NextApiResponse } from "next";
import { Products } from "../../config/backendRoutes";

export interface IUploadProduct {
  productName: string;
  price: number;
  imageUrl: string;
  description: string;
}

const UploadProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!req.headers.cookie?.length)
      return res.status(401).json({ message: "Unauthorized" });

    const { access_token } = cookie.parse(req.headers.cookie);

    const { price, imageUrl, productName, description }: IUploadProduct =
      req.body;

    const { update, productId } = req.query;
    console.log(
      `${FRONTEND_API}${Products}/${
        update == "true" ? `${productId}/update` : "add"
      }`
    );

    const request = await fetch(
      `${FRONTEND_API}${Products}/${
        update == "true" ? `${productId}/update` : "add"
      }`,
      {
        method: update == "true" ? "PUT" : "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          price,
          imageUrl,
          name: productName,
          description,
        }),
      }
    );

    const data = await request.json();

    console.log(data);

    if (request.ok) {
      return res.json({ message: data.message, product: data.product });
    }

    // console.log(data)
    return res.status(400).json({ message: data.message });
  } else {
    res.status(400).send(`${req.method} is not Allowed`);
  }
};

export default UploadProduct;
