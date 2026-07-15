'use client'
import Link from 'next/link';
import {useRouter} from 'next/navigation';


export default function OrderSuccessPage() {
 const router = useRouter();
  const orderDetails = {
    number: 'BLOOM-84920',
    date: 'July 15, 2026',
    email: 'you@example.com',
    paymentMethod: 'Cash on Delivery (COD)',
    total: 108.52
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans antialiased flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
        
        {/* Success Icon Accent */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 mb-6">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Order Confirmed!</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Thank you for shopping with BloomShop. Your order has been successfully placed and is now being processed.
        </p>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl p-6 my-8 text-left space-y-3.5 border border-slate-100">
          <div className="flex justify-between text-xs tracking-wide uppercase font-medium text-slate-400">
            <span>Order Summary</span>
          </div>
          <hr className="border-slate-200/60" />
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Order Number</span>
            <span className="font-semibold text-slate-800">{orderDetails.number}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Date</span>
            <span className="text-slate-800">{orderDetails.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Payment Method</span>
            <span className="text-slate-800">{orderDetails.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Confirmation Email</span>
            <span className="text-slate-800 truncate max-w-[180px] sm:max-w-xs">{orderDetails.email}</span>
          </div>
          <hr className="border-slate-200/60" />
          <div className="flex justify-between text-base font-semibold text-slate-900 pt-1">
            <span>Total Amount</span>
            <span className="text-emerald-600">${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
          href={'/orders'}
            
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Track Your Order
          </Link>
          <Link
          href={"/"}
            type="button"
            className="w-full py-3 px-4 bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-xl text-sm transition-all"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}