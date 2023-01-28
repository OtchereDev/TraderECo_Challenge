import { APIURL, BACKEND_API } from "../../config/config";
import { NextApiRequest, NextApiResponse } from "next";
import { Products } from "../../config/backendRoutes";
import cookie from "cookie";

const DeleteProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!req.headers.cookie?.length)
      return res.status(401).json({ message: "Unauthorized" });

    const { access_token } = cookie.parse(req.headers.cookie);

    const { productId } = req.query;
    const response = await fetch(
      `${BACKEND_API}${Products}/${productId}/delete`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return res.status(400).json({ message: data.message });
    }

    return res.json({
      message: "Product successfully deleted",
    });
  } else {
    res.status(400).send({ message: `${req.method} is not Allowed` });
  }
};

export default DeleteProduct;
