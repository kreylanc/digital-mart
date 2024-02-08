"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PaymentStatusProp = {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
};
const PaymentStatus = ({ orderEmail, orderId, isPaid }: PaymentStatusProp) => {
  // initialize router
  const router = useRouter();

  // call the end point for polling
  const { data, isLoading } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 1000), // query every 1 sec if isPaid is not true
    }
  );

  // if the order is paid
  useEffect(() => {
    if (data?.isPaid) router.refresh();
  }, [data?.isPaid, router]);
  return (
    <div className="mt-16 grid sm:grid-cols-2 gap-4 text-sm text-slate-600">
      <div>
        <p className="font-medium text-primary">Shipping To</p>
        <p>{orderEmail}</p>
      </div>
      <div>
        <p className="font-medium text-primary">Order Status</p>
        <p>{isPaid ? "Payment successful" : "Payment pending"}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
