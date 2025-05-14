import axios from "axios";
import { PayStackTypes } from "./paystack.types";
export namespace PayStackService {
  const createClient = () => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY; // Get secret key from environment variables
    if (!secretKey) {
      throw new Error("PAYSTACK_SECRET_KEY is not defined in the .env file");
    }
    return axios.create({
      baseURL: "https://api.paystack.co",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });
  };
  export const verifyTransaction = async (reference: string) => {
    try {
      const client = createClient();
      const response = await client.get(`/transaction/verify/${reference}`);
      console.log(response.data); // Handle the response data
      return response.data; // Optionally return the data
    } catch (error) {
      console.error("Error verifying transaction:", error);
      throw error; // Re-throw the error to be caught by the caller, if needed
    }
  };
  export const getAccessCodeForOnceOffPayment = async (
    email: string,
    amount: number,
    currency: string
  ) => {
    try {
      const client = createClient();
      const response = await client.post("/transaction/initialize", {
        email,
        amount,
        currency,
      });
      console.log(response.data); // Handle the response data
      return response.data; // Optionally return the data
    } catch (error) {
      console.error("Error initializing transaction:", error);
      throw error; // Re-throw the error to be caught by the caller, if needed
    }
  };
  export const getAccessCodeForSubscription = async (
    email: string,
    planCode: string
  ) => {
    try {
      const client = createClient();
      const response = await client.post("/transaction/initialize", {
        customer: email,
        plan: planCode,
      });
      console.log(response.data); // Handle the response data
      return response.data; // Optionally return the data
    } catch (error) {
      console.error("Error initializing transaction:", error);
      throw error; // Re-throw the error to be caught by the caller, if needed
    }
  };

  export const createSusbcriptionPlan = async (
    username: string,
    amount: number
  ): Promise<PayStackTypes.CreatePlanResponse> => {
    const data = {
      name: `@${username}'s subscription plan`,
      amount: amount,
      interval: "monthly",
      currency: "ZAR",
    };
    const client = createClient();
    try {
      const response = await client.post("/plan", data);
      console.log("Subscription plan created:", response.data);
      return response.data as PayStackTypes.CreatePlanResponse;
    } catch (error) {
      console.error("Error creating subscription plan:", error);
      throw error;
    }
  };

  export const getSubscriptionPlan = async (id: string) => {
    const client = createClient();
    try {
      const response = await client.get(`/plan/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting subscription plan:", error);
      throw error;
    }
  };
}
