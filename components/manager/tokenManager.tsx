'use client'
import { Input, Button, Tooltip, Divider } from "@nextui-org/react";
import { checkToken } from "@/lib/api";
import { useState } from "react";
import { setCookie, getCookie, hasCookie } from "cookies-next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLock } from "@fortawesome/free-solid-svg-icons";
import { calculateOverrideValues } from "next/dist/server/font-utils";

export default function TokenManager({cachedToken, callback} : {cachedToken : string, callback?: any})
{
    const [token, setToken] : [string, any] = useState(cachedToken);
    const [isLoading, setIsLoading] : [boolean, any] = useState(false);
    const [isValid, setIsValid] : [boolean, any] = useState(true);


    const innerTokenCheck = () =>{
        setIsLoading(true);
        checkToken(token).then((result) => {
            setIsValid(result);
            if(result)
            {
                setCookie('vortex-api-token', token, {sameSite: 'none', secure:true});
                callback();
            }
            setIsLoading(false);
        });
    }

    return(
        <div className="flex flex-row mt-8 mx-12 md:m-0">
            <Input
                label="Токен доступа"
                value={token}
                onValueChange={setToken}
                isInvalid={!isValid}
                errorMessage="Неверный токен!"
                classNames={{
                    label: "text-lg",
                    input: "text-lg hover:bg-transparent",
                    innerWrapper:"hover:bg-transparent",
                    inputWrapper:"rounded-l-xl rounded-r-none h-14"
                }}
            />
            <div className="overflow-hidden rounded-r-xl flex flex-row items-center h-14 bg-[#3F3F46] justify-between">
                <Tooltip content="Подтвердить" closeDelay={200} placement="bottom">    
                    <Button
                        className="rounded-none w-14 h-14"
                        isIconOnly
                        isDisabled={token.length == 0}
                        isLoading={isLoading}
                        onClick={innerTokenCheck}
                    >
                        <FontAwesomeIcon icon={faCheck} size="xl"/>
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
}