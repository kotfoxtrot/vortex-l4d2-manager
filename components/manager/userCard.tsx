'use client'
import { PrivilegeSet, PrivilegeStatus, PrivilegeType, User } from "@/lib/types";
import PrivilegeStatusCard from "../privilege/privilegeStatus";
import { Button, DatePicker, Divider, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { faCheck, faCross, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import PrivilegePicker from "../privilege/privilegePicker";
import { parseAbsolute, now } from "@internationalized/date";
import { getCookie } from "cookies-next";
import { getAllPrivileges, getPrivilegeSet, setPrivilege, setWelcomePhrase as apiSetWelcomePhrase, setCustomPrefix as apiSetCustomPrefix } from "@/lib/api";

export default function UserCard({user, startPrivileges, startPrivilegeSet} : {user : User, startPrivileges : PrivilegeStatus[], startPrivilegeSet: PrivilegeSet | null})
{
    const [privileges, setPrivileges] : [PrivilegeStatus[], any] = useState(startPrivileges);
    const [privilegeSet, setPrivilegeSet] : [PrivilegeSet | null, any] = useState(startPrivilegeSet);

    const [welcomePhrase, setWelcomePhrase] : [string, any] = useState(privilegeSet?.welcomePhrase || '');
    const [isWPLoading, setIsWPLoading] : [boolean, any] = useState(false);
    const [customPrefix, setCustomPrefix] : [string, any] = useState(privilegeSet?.customPrefix || '');
    const [isCPLoading, setIsCPLoading] : [boolean, any] = useState(false);

    useEffect(() => {
        setPrivileges(startPrivileges);
        setPrivilegeSet(startPrivilegeSet);
        setWelcomePhrase(startPrivilegeSet?.welcomePhrase || '');
        setCustomPrefix(startPrivilegeSet?.customPrefix || '');
    }, [startPrivilegeSet, startPrivileges])


    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

    let tempPrivilege : PrivilegeType;
    let tempDate : Date = new Date(Date.now());

    const reloadPrivileges = () =>{
        getAllPrivileges(user.steamId).then((ps) => setPrivileges(ps || []));
        getPrivilegeSet(user.steamId).then((ps) => {
            setPrivilegeSet(ps);
            setWelcomePhrase(ps?.welcomePhrase || '');
            setCustomPrefix(ps?.customPrefix || '');
        });
    }

    const abortChanges = () => onClose();
    const applyChanges = () => {
        tempDate.setHours(tempDate.getHours() + 3);
        onClose();
        const token = getCookie('vortex-api-token');
        if (token)
        {
            setPrivilege(user.steamId, tempPrivilege.id, tempDate.toISOString().slice(0, 19).replace('T', ' '), token);
            reloadPrivileges();
        }
        else console.error('Token is not found in cookies!');
    };

    return(
        <div className="gap-3 flex flex-col">
            <div>
                <h2 className="text-2xl">Редактор пользователя</h2>
                <div className="flex flex-col">
                    <span>ID: {user.id}</span>
                    <span>STEAM ID: {user.steamId}</span>
                </div>
            </div>
            <div className="flex flex-col space-y-4">
            <div className={"flex flex-row mt-8 mx-12 md:m-0 " + (privileges.find(p => p.privilege.id == 10) ? "" : "hidden")}>
                <Input
                    label="Приветственная фраза"
                    value={welcomePhrase}
                    onValueChange={setWelcomePhrase}
                    classNames={{
                        label: "text-lg",
                        input: "text-lg hover:bg-transparent",
                        innerWrapper:"hover:bg-transparent",
                        inputWrapper:"rounded-l-xl rounded-r-none h-14"
                    }}
                />
                <div className="overflow-hidden rounded-r-xl flex flex-row items-center h-14 bg-[#3F3F46] justify-between">    
                    <Button
                        className="rounded-none w-14 h-14"
                        isIconOnly
                        onClick={() => setWelcomePhrase(privilegeSet?.welcomePhrase || '')}
                        isLoading={isWPLoading}
                    >
                        <FontAwesomeIcon icon={faXmark} size="xl"/>
                    </Button>     
                    <Divider orientation="vertical"/>
                    <Button
                        className="rounded-none w-14 h-14"
                        isIconOnly
                        isDisabled={welcomePhrase.length == 0}
                        isLoading={isWPLoading}
                        onClick={() => {
                            setIsWPLoading(true);
                            apiSetWelcomePhrase(user.steamId, welcomePhrase, getCookie('vortex-api-token') || '')
                                .then((wp) => {setWelcomePhrase(wp); setIsWPLoading(false)});
                        }}
                    >
                        <FontAwesomeIcon icon={faCheck} size="xl"/>
                    </Button>
                </div>
            </div>
            <div className={"flex flex-row mt-8 mx-12 md:m-0 " + (privileges.find(p => p.privilege.id == 9) ? "" : "hidden")}>
                    <Input
                        label="Префикс в чате"
                        value={customPrefix}
                        onValueChange={setCustomPrefix}
                        classNames={{
                            label: "text-lg",
                            input: "text-lg hover:bg-transparent",
                            innerWrapper:"hover:bg-transparent",
                            inputWrapper:"rounded-l-xl rounded-r-none h-14"
                        }}
                    />
                    <div className="overflow-hidden rounded-r-xl flex flex-row items-center h-14 bg-[#3F3F46] justify-between">    
                        <Button
                            className="rounded-none w-14 h-14"
                            isIconOnly
                            onClick={() => setCustomPrefix(privilegeSet?.customPrefix || '')}
                            isLoading={isCPLoading}
                        >
                            <FontAwesomeIcon icon={faXmark} size="xl"/>
                        </Button>     
                        <Divider orientation="vertical"/>
                        <Button
                            className="rounded-none w-14 h-14"
                            isIconOnly
                            isDisabled={customPrefix.length == 0}
                            isLoading={isCPLoading}
                            onClick={() => {
                                setIsCPLoading(true);
                                apiSetCustomPrefix(user.steamId, customPrefix, getCookie('vortex-api-token') || '')
                                    .then((cp) => {setCustomPrefix(cp); setIsCPLoading(false)});
                            }}
                        >
                            <FontAwesomeIcon icon={faCheck} size="xl"/>
                        </Button>
                    </div>
            </div>
            </div>
            <div className="flex flex-col space-y-4">
                <h3 className="text-xl">Привелегии:</h3>
                <div className="flex flex-col gap-4">
                {
                    privileges.map((p) => <PrivilegeStatusCard key={p.id} startPrivilegeStatus={p} onDelete={() => reloadPrivileges()}/>)
                }
                <Button onClick={onOpen}><FontAwesomeIcon icon={faPlus} size="xl"/></Button>
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                    <ModalHeader>Редактор привелегии</ModalHeader>
                    <ModalBody>
                    <PrivilegePicker startValue={null} onSelect={(p : any) => tempPrivilege = p}/>
                    <DatePicker 
                        label="Активна до"
                        hideTimeZone
                        hourCycle={24}
                        onChange={(zonedDate) => tempDate = zonedDate.toDate()}
                        defaultValue={now('Europe/Moscow')}
                    />    
                    <div className="flex flex-row justify-left gap-4">
                        <Button onClick={applyChanges}>Подтвердить</Button>
                        <Button onClick={abortChanges}>Отмена</Button>
                    </div>
                    </ModalBody>
                    </ModalContent>
                </Modal>
        </div>
    )
}