import axios from "axios";
export namespace PayStackService {
  export const getAccessCode = async (
    email: string,
    amount: number,
    currency: string
  ) => {
    try {
      const secretKey = process.env.PAYSTACK_SECRET_KEY; // Get secret key from environment variables
      if (!secretKey) {
        throw new Error("PAYSTACK_SECRET_KEY is not defined in the .env file");
      }
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount,
          currency,
        },
        {
          headers: {
            Authorization: `Bearer ${secretKey}`, 
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data); // Handle the response data
      return response.data; // Optionally return the data
    } catch (error) {
      console.error("Error initializing transaction:", error);
      throw error; // Re-throw the error to be caught by the caller, if needed
    }
  };
}
