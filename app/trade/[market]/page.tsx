"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { OrderTable } from "@/app/components/OrderTable";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { BASE_URL } from "@/app/utils/httpClient";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export interface Order {
  price: number;
  quantity: number;
  orderId: string;
  filled: number;
  side: "buy" | "sell";
  userId: string;
}

export default function Page() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const market = segments[segments.length - 1];
  const [balance, setBalance] = useState("");
  const [inr, setInr] = useState("");
  const [openOrders, setOpenOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await axios.get(`${BASE_URL}/order/balance`, {
          params: {
            userId: "1",
            market: "TATA_INR",
          },
        });
        setOpenOrders(response.data.openOrders);
        setBalance(response.data.balance);
        setInr(response.data.inr);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
    fetchBalance();
    setInterval(() => {
      fetchBalance();
    }, 1000 * 10);
  }, []);

  return (
    <div className="flex flex-col font-mono lg:flex-row w-full h-full">
      <div className="flex flex-col lg:w-3/4 h-full">
        {/* MarketBar at the top */}
        <div className="w-full">
          <MarketBar market={market as string} />
        </div>

        <div className="flex flex-col lg:flex-row w-full h-full">
          {/* Left half for TradeView */}
          <div className="lg:w-2/3 flex flex-col">
            <TradeView market={market as string} />
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-neutral-800" />

          {/* Right half split between Depth and SwapUI */}
          <div className="lg:w-1/3 flex flex-col lg:flex-row h-full">
            <div
              className="flex-1 p-1 overflow-auto no-scrollbar"
              style={{ maxHeight: "75vh" }}
            >
              <Depth market={market as string} />
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-neutral-800" />
          </div>
        </div>
        <div>
          <OrderTable openOrders={openOrders} />
        </div>
      </div>

      {/* SwapUI at the bottom on mobile, right on larger screens */}
      <div className="lg:w-1/4 overflow-auto lg:order-none order-last">
        <SwapUI market={market as string} balance={balance} inr={inr} />
      </div>
    </div>
  );
}
