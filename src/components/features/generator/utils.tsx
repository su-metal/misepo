import React from 'react';
import { Platform } from '../../../types';
import {
    InstagramIcon,
    XIcon,
    GoogleMapsIcon
} from '../../Icons';

// --- Footer Helper Functions ---
export function insertInstagramFooter(text: string, footer: string): string {
    if (!footer) return text;
    const cleanFooter = footer.trim();
    const cleanOriginal = text.trim();
    if (cleanOriginal.includes(cleanFooter)) return text;
    return `${cleanOriginal}\n\n${cleanFooter}`;
}

export function removeInstagramFooter(text: string, footer: string): string {
    if (!footer) return text;
    const cleanFooter = footer.trim();
    // Escape for regex
    const escapedFooter = cleanFooter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`\\n\\n${escapedFooter}$`), "").trim();
}

export function getPlatformIcon(p: Platform) {
    switch (p) {
        case Platform.Instagram: return React.createElement(InstagramIcon, { className: "w-4 h-4" });
        case Platform.X: return React.createElement(XIcon, { className: "w-4 h-4" });
        case Platform.GoogleMaps: return React.createElement(GoogleMapsIcon, { className: "w-4 h-4" });
        default: return null;
    }
}

export function clampPresetName(name: string, maxWidth = 40): string {
    if (!name) return "";
    if (typeof document === "undefined") return name.slice(0, 10);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return name.slice(0, 10);

    context.font = "14px bold Inter";
    let current = "";
    for (let char of name) {
        if (context.measureText(current + char).width > maxWidth) {
            return current + "...";
        }
        current += char;
    }
    return name;
}

export function enforcePresetNameValue(value: string, maxWidth = 20): string {
    if (!value) return "";
    if (typeof document === "undefined") return value.slice(0, 10);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return value.slice(0, 10);

    context.font = "14px bold Inter";
    let current = "";
    for (let char of value) {
        if (context.measureText(current + char).width > maxWidth) break;
        current += char;
    }
    return current;
}
