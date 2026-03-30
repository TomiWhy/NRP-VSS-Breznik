"use client";

import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const bgs = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
    };

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl pointer-events-auto
                transition-all duration-300 transform
                ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
                ${bgs[type]}
            `}
        >
            {icons[type]}
            <p className="text-sm font-bold text-slate-900 dark:text-white">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
            </button>
        </div>
    );
}
