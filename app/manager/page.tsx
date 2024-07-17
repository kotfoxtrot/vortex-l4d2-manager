'use client'
import TokenManager from "@/components/manager/tokenManager";
import UserManager from "@/components/manager/userManager";
import {Spinner } from "@nextui-org/react";
import { getCookie, hasCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function ManagerPage() {

    const [hasToken, setHasToken] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setHasToken(hasCookie('vortex-api-token'));
        setIsLoading(false);
    }, [])

    return (
        <main className="flex items-center justify-center px-24 py-12">
            {
                hasToken ?
                <UserManager/>
                :
                (
                    isLoading ?
                    <Spinner/> : <TokenManager cachedToken={getCookie('vortex-api-token') || ''} callback={() => setHasToken(hasCookie('vortex-api-token'))}/>
                )
            }
        </main>
    );
    
}
