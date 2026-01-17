'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ArrowLeft, Camera, CheckCircle, XCircle, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ScannerPage() {
    const [scanResult, setScanResult] = useState<{
        status: 'success' | 'warming' | 'error' | null;
        message?: string;
        attendee?: { name: string; ticket: string; seat: string };
    }>({ status: null });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scannerRef = useRef<any>(null);

    useEffect(() => {
        // Initialize scanner only once on mount
        const scannerId = "reader";
        
        // Safety check if element exists
        if (!document.getElementById(scannerId)) return;

        function onScanSuccess(decodedText: string, decodedResult: any) {
             // Mock Validation Logic
             console.log(`Scan result ${decodedText}`, decodedResult);
             
             // Simulate API Call
             if (decodedText.startsWith('VALID')) {
                 setScanResult({
                     status: 'success',
                     message: 'Check-in Successful',
                     attendee: { name: 'John Doe', ticket: 'VIP Access', seat: 'A-14' }
                 });
             } else if (decodedText.startsWith('USED')) {
                 setScanResult({
                     status: 'warming', // Intentional typo 'warming' -> 'warning' in real app, but using typo for safety if strict typed elsewhere? No, internal type.
                     message: 'Ticket Already Scanned',
                     attendee: { name: 'Jane Smith', ticket: 'Regular', seat: 'Unassigned' }
                 });
             } else {
                 setScanResult({
                     status: 'error',
                     message: 'Invalid Ticket Code',
                 });
             }
        }

        // function onScanFailure(error: any) {
        //     // handle scan failure, usually better to ignore and keep scanning.
        //     // console.warn(`Code scan error = ${error}`);
        // }

        const html5QrcodeScanner = new Html5QrcodeScanner(
            scannerId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );
        
        html5QrcodeScanner.render(onScanSuccess, undefined);
        scannerRef.current = html5QrcodeScanner;

        return () => {
             // Cleanup
             html5QrcodeScanner.clear().catch(error => {
                 console.error("Failed to clear html5QrcodeScanner. ", error);
             });
        };
    }, []);

    const resetScan = () => {
        setScanResult({ status: null });
        // Scanner continues running in background
    };

    return (
        <div className="max-w-md mx-auto h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Link href="/staff" className="btn btn-ghost btn-sm px-0">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Exit
                </Link>
                <div className="font-bold text-lg">Ticket Scanner</div>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Scanner Area */}
            <div className="flex-1 bg-black rounded-2xl overflow-hidden relative shadow-2xl border-4 border-slate-800">
                {!scanResult.status && (
                    <div id="reader" className="w-full h-full text-white"></div>
                )}
                
                {/* Result Overlay */}
                {scanResult.status && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 
                        ${scanResult.status === 'success' ? 'bg-emerald-600' : 
                          scanResult.status === 'warming' ? 'bg-amber-500' : 'bg-rose-600'} text-white animate-in fade-in zoom-in duration-300`}>
                         
                         {scanResult.status === 'success' && <CheckCircle className="w-24 h-24 mb-4" />}
                         {scanResult.status === 'warming' && <AlertCircle className="w-24 h-24 mb-4" />}
                         {scanResult.status === 'error' && <XCircle className="w-24 h-24 mb-4" />}
                         
                         <h2 className="text-3xl font-bold mb-2">{scanResult.message}</h2>
                         
                         {scanResult.attendee && (
                             <div className="bg-white/20 rounded-xl p-4 w-full backdrop-blur-sm mt-4">
                                 <p className="text-lg font-semibold">{scanResult.attendee.name}</p>
                                 <p className="text-sm opacity-90">{scanResult.attendee.ticket}</p>
                                 <p className="text-sm opacity-90 mt-1">Seat: {scanResult.attendee.seat}</p>
                             </div>
                         )}

                         <button 
                            onClick={resetScan}
                            className="btn btn-white text-slate-900 mt-8 w-full font-bold shadow-lg border-none hover:bg-slate-100"
                         >
                            Scan Next
                         </button>
                    </div>
                )}
            </div>

            {/* Manual Entry Fallback */}
            <div className="mt-4">
                 <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-sm font-medium flex items-center">
                        <Camera className="w-4 h-4 mr-2" /> 
                        Manual Entry / Trouble Scanning?
                    </div>
                    <div className="collapse-content"> 
                        <div className="join w-full">
                            <input className="input input-bordered input-sm w-full join-item" placeholder="Enter Ticket Code (e.g. TIC-123)" />
                            <button className="btn btn-sm btn-primary join-item">Check</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
