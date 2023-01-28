import { APIURL, FRONTEND_API } from "../../config/config";
import { NextApiRequest, NextApiResponse } from "next";
import { SignUpBody } from "../../context/AuthContext";
import { RegisterUser } from "../../config/backendRoutes";

const signUp = async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    if (!req.body) return res.status(401).send({});

    const { email, password, name: fullName, role }: SignUpBody = req.body;

    const request = await fetch(`${FRONTEND_API}${RegisterUser}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password, name: fullName, role }),
    });

    const data = await request.json();

    if (!request.ok)
      return res.status(request.status).send({ message: data.message });

    res.send({});
  } else {
    res.status(400).send(`${req.method} is not allowed`);
  }
};

export default signUp;
